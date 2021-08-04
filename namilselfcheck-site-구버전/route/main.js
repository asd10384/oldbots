
require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database');
const qdb = require('quick.db');
const log = require('../log');
const func = require('../func');
const autoselfchecktimer = require('../autoselfcheck');
const go = require('./go');

const webpush = require('web-push');

// http -> https
router.all('*', async (req, res, next) => {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol;
  if (protocol == 'https' || req.hostname == 'localhost') {
    next();
  } else {
    res.redirect(`https://${req.hostname}${req.url}`);
  }
});

// 메인 시작
router.get('/', async (req, res) => {
  return go(req, res, {
    code: 200,
    index: `index`,
    title: `메인`,
    check: true,
    nologin: true
  });
});
// 메인 끝

// web push start
webpush.setVapidDetails(`mailto:${process.env.EMAIL}`, process.env.PUBLICKEY, process.env.PRIVATEKEY);
var checkg = qdb.get(`db.autoself.timer`);
if (!checkg) {
  qdb.set(`db.autoself.timer`, true);
  autoselfchecktimer.timer(webpush);
}

router.post('/subscribe(/:check)?', async (req, res) => {
  webpush.setVapidDetails(`mailto:${process.env.EMAIL}`, process.env.PUBLICKEY, process.env.PRIVATEKEY);
  var checkg = qdb.get(`db.autoself.timer`);
  if (!checkg) {
    qdb.set(`db.autoself.timer`, true);
    autoselfchecktimer.timer(webpush);
  }
  const subscription = req.body;
  res.status(201).json({});
  if (req.params.check && req.params.check === 'check') {
    var date = func.now_date_addtime(new Date());
    return webpush.sendNotification(subscription, JSON.stringify({
      title: `테스트님 자동 자가진단 성공`,
      body: `시간: ${func.az(date.hour, 2)}시 ${func.az(date.min, 2)}분 ${func.az(date.sec, 2)}초`,
      icon: `/image/icon.png`,
      badge: `/image/badge.png`,
      vibrate: [200, 100, 200, 100, 200, 100, 200],
      url: `${process.env.DOMAIN}`
    })).catch(err => log.log(err));
  }
  if (req.params.check && req.params.check === 'setdb') {
    const User = db.module.user();
    const token = req.cookies['token'];
    var decode = await jwt.decode(token);
    if (!decode || !decode.id) return;

    var user = User.findOne({ id: decode.id });
    if (!user) return;
    user.then(async (db1) => {
      var udb = db.object.user;
      udb = db1;
      udb.notice = subscription;
      udb.save().catch((err) => log.log(err));
    });
    return webpush.sendNotification(subscription, JSON.stringify({
      title: `자동 자가진단 설정완료`,
      body: `앞으로 이 기기로\n자동 자가진단 알림이 갑니다.`,
      icon: `/image/icon.png`,
      badge: `/image/badge.png`,
      vibrate: [200, 100, 200, 100, 200, 100, 200],
      url: `${process.env.DOMAIN}`
    })).catch(err => log.log(err));
  }
});
// web push end



module.exports = router;
