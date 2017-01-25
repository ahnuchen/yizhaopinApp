"use strict";

let params = {
  user: {
    token: {
      expires: 2000 * 60 * 1000 //单位为毫秒
    }
  },
  salt: 'yizhaopin',
  db: {
    host: '127.0.0.1',
    dialect:'mysql',
    port:'3306',
    user: 'root',
    password: 'root',
    database: 'yizhaopin',
    charset: 'UTF8_GENERAL_CI',
    timezone: '+08:00',
  },
  adminKey:'10086'
};

module.exports = params;
