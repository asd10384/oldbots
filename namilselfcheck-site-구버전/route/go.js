
require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database');
const qdb = require('quick.db');
const log = require('../log');
const func = require('../func');

async function go(req = express.request, res = express.response, set = {
  check: false,
  nologin: false,
  code: 200,
  index: '',
  title: '',
  domain: '',
  data: {}
}) {
  const token = req.cookies['token'] || null;
  jwt.verify(token, process.env.JWT_SECRET, async (err, dec) => {
    if (!dec && set.check && !set.nologin) return res.status(500).send(`
      <script type=text/javascript>
        alert('로그인을 하신 뒤 사용해주세요.');
        window.location='/login';
      </script>
    `);
    if (!dec) set.check = false;
    return res.status(set.code).render(set.index, {
      domain: process.env.DOMAIN,
      url: (!set.domain || set.domain == '') ? process.env.DOMAIN : process.env.DOMAIN + set.domain,
      index: set.index,
      title: (set.title === '') ? `자동자가진단` : `자동자가진단 - ${set.title}`,
      data: set.data,
      login: set.check
    });
  });
}

module.exports = go;