
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

// 로그 시작
router.get('/log', async (req, res) => {
  const token = req.cookies['token'];
  var decode = await jwt.decode(token);
  var text = '';
  if (decode && decode.admin) {
    text = fs.readFileSync(`log.txt`, { encoding: 'utf8' });
  }
  return go(req, res, {
    code: 200,
    index: `log`,
    title: `로그`,
    domain: '/log',
    check: true,
    nologin: true,
    data: {
      admin: (decode) ? decode.admin : false,
      text: text.replace(/\n/g, '<br/>')
    }
  });
});
router.post('/log', async (req, res) => {
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
            window.location='/log';
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
          window.location='/log';
        </script>
      `);
    }
  }
  return res.status(500).send(`
    <script type=text/javascript>
      alert('아이디를 찾을수 없습니다.');
      window.location='/log';
    </script>
  `);
});
// 로그 끝

module.exports = router;
