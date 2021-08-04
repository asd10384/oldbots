
require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database');
const fs = require('fs');
const qdb = require('quick.db');
const log = require('../log');
const func = require('../func');
const go = require('./go');
const { selfcheck_go } = require('../autoselfcheck');

// 시작
// 관리 사이트 시작
router.get('/manage', async (req, res) => {
  const Server = db.module.server();
  const User = db.module.user();
  const pid = req.query.id;
  Server.find().then(async (obj) => {
    var uobj = {};
    var utext = '';
    for (i in obj) {
      var sdb = db.object.server;
      sdb = obj[i];
      if (uobj[Number(`${sdb.time.hour}${sdb.time.min}`)]) {
        uobj[Number(`${sdb.time.hour}${sdb.time.min}`)].push({ name: sdb.name, id: sdb.id });
      } else {
        uobj[Number(`${sdb.time.hour}${sdb.time.min}`)] = [{ name: sdb.name, id: sdb.id }];
      }
    }
    var ulist = Object.keys(uobj).sort();
    for (i of ulist) {
      for (j of uobj[i]) {
        utext += `
          <div class="c">
            <button type="button" class="btn" onclick="javascript=location.href='/manage?id=${j['id']}'">${j['name']} - ${(i < 1000) ? `0` : ``}${parseInt(i / 100)}:${i % 100}</button>
          </div>`;
      }
    }
    if (pid) {
      var altext = '';
      if (pid == 'all') {
        Server.find().then(async (obj) => {
          for (i in obj) {
            var sdb = db.object.server;
            sdb = obj[i];
            await selfcheck_go(sdb, false);
          }
        });
        altext = '전체 수동 자가진단을 실행';
        return go(req, res, {
          code: 200,
          index: `manage`,
          title: `관리`,
          domain: '/manage',
          check: true,
          nologin: true,
          data: {
            admin: true,
            utext: utext,
            altext: altext
          }
        });
      }
      Server.find({ id: pid }).then(async (obj) => {
        for (i in obj) {
          var sdb = db.object.server;
          sdb = obj[i];
          altext += `${sdb.name}님 `;
          await selfcheck_go(sdb, false);
        }
        altext += `수동 자가진단 실행`;
        return go(req, res, {
          code: 200,
          index: `manage`,
          title: `관리`,
          domain: '/manage',
          check: true,
          nologin: true,
          data: {
            admin: true,
            utext: utext,
            altext: altext
          }
        });
      });
      return;
    }
    const token = req.cookies['token'];
    var decode = await jwt.decode(token);
    if (!decode) {
      return go(req, res, {
        code: 200,
        index: `manage`,
        title: `관리`,
        domain: '/manage',
        check: true,
        nologin: true,
        data: {
          admin: (decode) ? decode.admin : false,
          utext: utext,
          altext: ''
        }
      });
    }
    var user = User.findOne({ id: decode.id });
    if (!user) {
      return go(req, res, {
        code: 200,
        index: `manage`,
        title: `관리`,
        domain: '/manage',
        check: true,
        nologin: true,
        data: {
          admin: (decode) ? decode.admin : false,
          utext: utext,
          altext: ''
        }
      });
    }
    return user.then(async (db1) => {
      var udb = db.object.user;
      udb = db1;
      return go(req, res, {
        code: 200,
        index: `manage`,
        title: `관리`,
        domain: '/manage',
        check: true,
        nologin: true,
        data: {
          admin: (decode) ? decode.admin : false,
          utext: utext,
          altext: ''
        }
      });
    });
  });
});
router.post('/manage', async (req, res) => {
  const User = db.module.user();
  var { id, pw } = req.body;

  pw = await bcrypt.hash(pw, process.env.SALT);

  var idcheck = await User.findOne({ id: id });
  if (idcheck) {
    var pwcheck = await User.findOne({ id: id, pw: pw });
    if (pwcheck) {
      var udb = db.object.user;
      udb = pwcheck;
      if (udb.admin) {
        const token = await jwt.sign({
          id: id,
          admin: true,
        }, process.env.JWT_SECRET, {
          expiresIn: '1h'
        });
        res.cookie(`token`, token, { maxAge: 12 * 60 * 60 * 1000 });
        log.log(`관리자 로그인 성공 : ${id}`);
        return res.status(200).send(`
          <script type=text/javascript>
            alert('관리자 로그인 성공');
            window.location='/manage';
          </script>
        `);
      } else {
        return res.status(200).send(`
          <script type=text/javascript>
            alert('관리자만 접속이 가능합니다.');
            window.location='/';
          </script>
        `);
      }
    } else {
      return res.status(500).send(`
        <script type=text/javascript>
          alert('올바르지 않은 비밀번호');
          window.location='/manage';
        </script>
      `);
    }
  }
  return res.status(500).send(`
    <script type=text/javascript>
      alert('아이디를 찾을수 없습니다.');
      window.location='/manage';
    </script>
  `);
});
// 끝

module.exports = router;