/**
 * @description 日志文件的配置
 * @author 吴亚
 * @createTime 2016/6/27
 */
"use strict";

let log4js = require('log4js');

log4js.configure({
    appenders: [
        {
            type: 'console'
        },
        {
            type: 'file',
            filename: 'logs/log.log',
            maxLogSize: 1024 * 1024,
            backups: 3,
            category: 'log'
        }
    ]
});

let logger = log4js.getLogger('log');
logger.setLevel('INFO');

module.exports = logger;