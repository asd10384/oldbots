
require('dotenv').config();
const { hcs } = require('selfcheck');
const db = require('./database');
const log = require('./log');
const func = require('./func');

const User = db.module.user();
const Server = db.module.server();

module.exports = {
  timer: async (webpush) => {
    log.log(`자동 자가진단 타이머 실행중`);
    setInterval(async function () {
      Server.find().then(async (obj) => {
        for (i in obj) {
          var sdb = db.object.server;
          sdb = obj[i];
          var { week, hour, min, sec } = func.now_date_addtime(new Date());
          if (week === '토' || week === '일') return;
          if (Number(sdb.time.hour) == hour && Number(sdb.time.min) == min && sec == 0) {
            go(sdb, webpush);
          }
        }
      });
    }, 1000);
  },
  selfcheck_go: go
};

async function go(sdb = db.object.server, webpush) {
  await User.findOne({ name: sdb.name, id: sdb.id }).then(async (db1) => {
    var udb = db.object.user;
    udb = db1;
    const emoj = await hcs({
      name: udb.name,
      birthday: udb.birthday.year + udb.birthday.month + udb.birthday.day,
      area: udb.selfcheck.area,
      school: udb.selfcheck.school,
      password: udb.selfcheck.pw
    }).then(async (value) => {
      return data = {
        msg: {
          success: `성공`,
          data: value.inveYmd
        },
        payload: {
          title: `님 자동 자가진단 성공`,
          body: `시간: ${value.inveYmd}`,
          icon: '/image/icon.png',
          badge: `/image/badge.png`,
          vibrate: [200, 100, 200, 100, 200, 100, 200],
          tag: 'notice',
          url: `${process.env.DOMAIN}`
        }
      };
    }).catch(async (reason) => {
      return data = {
        msg: {
          success: `실패`,
          data: reason
        },
        payload: {
          title: `님 자동 자가진단 실패`,
          body: `자가진단 오류`,
          icon: '/image/icon.png',
          badge: `/image/badge.png`,
          vibrate: [200, 100, 200, 100, 200, 100, 200],
          url: `${process.env.DOMAIN}`
        }
      };
    });
    if (webpush) {
      emoj.payload.title = `${udb.name}${emoj.payload.title}`;
      webpush.sendNotification(udb.notice, JSON.stringify(emoj.payload)).then((val) => {
        log.log(`${udb.name}님 자동자가진단 ${emoj.msg.success} : ${emoj.msg.data}`);
        return log.log(`${udb.name}님 자동자가진단 메세지 : 전송 성공`);
      }).catch((err) => {
        log.log(`${udb.name}님 자동자가진단 ${emoj.msg.success} : ${emoj.msg.data}`);
        return log.log(`${udb.name}님 자동자가진단 메세지 : 전송 실패`);
      });
    }
  });
}
