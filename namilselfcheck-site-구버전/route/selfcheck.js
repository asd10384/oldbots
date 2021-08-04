
require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database');
const qdb = require('quick.db');
const log = require('../log');
const { hcs, validate } = require('selfcheck');
const func = require('../func');
const autoselfchecktimer = require('../autoselfcheck');
const go = require('./go');

const webpush = require('web-push');

// 자가진단 사이트 시작
router.get('/selfcheck', async (req, res) => {
  const User = db.module.user();
  const token = req.cookies['token'];
  var decode = await jwt.decode(token);
  if (!decode) {
    return go(req, res, {
      code: 200,
      index: `selfcheck`,
      title: `자가진단`,
      domain: '/selfcheck',
      check: true,
      data: {
        name: null,
        onoff: 'OFF',
        time: '07:30'
      }
    });
  }
  var user = User.findOne({ id: decode.id });
  if (!user) {
    return go(req, res, {
      code: 200,
      index: `selfcheck`,
      title: `자가진단`,
      domain: '/selfcheck',
      check: true,
      data: {
        name: null,
        onoff: 'OFF',
        time: '07:30'
      }
    });
  }
  return user.then(async (db1) => {
    var udb = db.object.user;
    udb = db1;
    return go(req, res, {
      code: 200,
      index: `selfcheck`,
      title: `자가진단`,
      domain: '/selfcheck',
      check: true,
      data: {
        name: udb.name,
        onoff: (udb.selfcheck.onoff) ? 'ON' : 'OFF',
        time: udb.selfcheck.time.hour + ':' + udb.selfcheck.time.min
      }
    });
  });
});
router.post('/selfcheck', async (req, res) => {
  const Server = db.module.server();
  const User = db.module.user();
  var { onoff, time } = req.body;
  time = time.split(':');
  const token = req.cookies['token'];
  var decode = await jwt.decode(token);
  var user = User.findOne({ id: decode.id });
  if (!decode.id || !user) return res.status(500).send(`
    <script type=text/javascript>
      alert('로그인을 하신 뒤 사용해주세요.');
      window.location='/login';
    </script>
  `);
  return user.then(async (db1) => {
    var udb = db.object.user;
    udb = db1;
    if (onoff === 'on') {
      await Server.findOneAndDelete({ id: udb.id });
      new Server({
        id: udb.id,
        name: udb.name,
        time: {
          hour: time[0],
          min: time[1]
        }
      }).save();
      udb.selfcheck.onoff = true;
    } else {
      await Server.findOneAndDelete({ id: udb.id });
      udb.selfcheck.onoff = false;
    }
    udb.selfcheck.time.hour = time[0];
    udb.selfcheck.time.min = time[1];
    udb.save().catch((err) => log.log(err));
    log.log(`${udb.name}님 설정완료\n자동 자가진단: ${onoff}${(onoff === 'on') ? `\n시간: ${time[0]}:${time[1]}` : ''}`);
    return res.status(200).send(`
      <script type=text/javascript>
        alert('${udb.name}님 설정 완료\\n자동 자가진단: ${onoff}${(onoff === 'on') ? `\\n시간: ${time[0]}:${time[1]}` : ''}');
        window.location='/';
      </script>
    `);
  });
});
// 자가진단 사이트 끝


module.exports = router;
