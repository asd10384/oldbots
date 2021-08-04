
const func = require('./func');
const fs = require('fs');

module.exports = {
  log: async (text = '') => {
    const { time, week } = func.now_date_addtime(new Date());
    const data = `\n${time['-_az']} (${week})\n${text}\n`;
    console.log(data);
    fs.appendFileSync(`log.txt`, data, { encoding: 'utf8' });
  },
};
