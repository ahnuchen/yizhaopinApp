/**
 * Created by chenchangyu on 2017/1/9.
 */
"use strict";

module.exports = (function () {

    let sessions = {};

    let params = require('../../config/params');
    let uuid = require('node-uuid');
    let logger = require('../logger');

    /**
     * @description 删除token
     * @param user
     */
    function removeToken(user) {
        let id = user.ID;

        try{
            for(let i in sessions){
                for (let j in sessions[i]) {
                    if (sessions[i][j].session.uid == id) {
                        delete sessions[i][j];
                    }
                }
            }
        }catch (err){
            logger.info("session的错误是"+err);
        }

        //for (let key in sessions) {
        //    if (key == id) {
        //        delete sessions[key];
        //    }
        //}
    }

    /**
     * @description 生成新的token
     * @param req
     * @param user
     * @returns {string}
     */
    function newToken(req, user) {
        removeToken(user);
        let time = (new Date()).getTime();
        let token = uuid.v4() + '_' + time;
        let loginType = req.body.loginType;
        if (!sessions.hasOwnProperty(loginType)) {
            sessions[loginType] = {};
        }
        logger.info('generate token :' + token);

        let sessionRecord = {
            expired: time + params.user.token.expires,
            // expired: -1, //永不过期
            session: {
                token: token,
                uid: user.ID
            }
        };
        sessions[loginType][token] = sessionRecord;

        req.session = sessionRecord.session;
        return token;
    }

    /**
     * @description 根据token获取session
     * @param token
     * @returns {*}
     */
    function getSession(token) {
        let session = null;
        let type = null;
        for (let i in sessions) {
            if (sessions[i].hasOwnProperty(token)) {
                type = i;
                session = sessions[i][token];
                break;
            }
        }
        if (session) {
            let time = (new Date()).getTime();
            if (session.expired > 0 && session.expired < time) {
                delete sessions[type][token];
                return {};
            }
            session.expired = time + params.user.token.expires;
            return session.session;
        }
        return {};
    }

    /**
     * @description 做token的预处理
     * @param req
     * @param res
     * @param next
     */
    function filter(req, res, next) {
        let token = null;

        if ('token' in req.query) {
            token = req.query.token;
        } else if ('token' in req.cookies) {
            token = req.cookies.token;
        }else if ('token' in req.body){
            token=req.body.token
        }

        if (token) {
            req.session = getSession(token);
        }
        else {
            req.session = {};
        }

        next();
    }

    /**
     * @description 保存session
     * @param req
     * @param res
     * @param next
     */
    function saveSession(req, res, next) {
        let token = null;

        if ('token' in req.query) {
            token = req.query.token;
        } else if ('token' in req.cookies) {
            token = req.cookies.token;
        }else if ('token' in req.body){
            token=req.body.token
        }

        if (token) {
            for (let i in sessions) {
                if (sessions[i].hasOwnProperty(token)) {
                    sessions[i][token].session = req.session;
                    break;
                }
            }
        }
    }

    return {
        filter: filter,
        saveSession: saveSession,
        newToken: newToken
    };

})();
