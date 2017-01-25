/**
 * Created by chenchangyu on 2017/1/10.
 */
var express = require('express');
var router = express.Router();
var session = require('../lib/middleware/session');
var logger = require('../lib/logger');
var orm = require('../lib/create_orm');
var error = require('../lib/error');
var needLogin = require('../lib/middleware/login_check');
var params = require('../config/params');
router
/**
 * 管理员登录
 */
  .post('/signIn', function (req, res) {
    let needInfo = ['Account', 'Password'], addInfo = {};
    needInfo.forEach(function (_data) {
      if (!req.body[_data])throw error.informationLoss;
      addInfo[_data] = req.body[_data];
    });
    orm.Administrator.findOne({
      where: {
        Account: addInfo.Account,
        Password: addInfo.Password,
        Delete: 1
      }
    }).then(function (_admin) {
      if (!_admin) {
        res.json({
          success: false,
          error: error.errorLoginInfo
        })
      } else {
        let token = session.newToken(req, _admin);
        req.session.login = true;
        session.saveSession(req);
        res.json({
          succes: true,
          data: {
            token: token,
            user: _admin
          }
        })
      }
    }).catch(function (_err) {
      res.json({
        success: false,
        error: {
          code: 8,
          message: _err.message
        }
      })
    })
  })
  /**
   * 添加管理员
   */
  .post('/addAdmin', needLogin, function (req, res) {
    if (req.body.adminKey !== params.adminKey) {
      throw error.noPower;
    }
    let needInfo = ['Account', 'Password', 'Type'], addInfo = {};
    needInfo.forEach(function (_data) {
      if (!req.body[_data]) {
        throw error.informationLoss;
      }
      addInfo[_data] = req.body[_data];
    });
    orm.Administrator.findById(req.session.uid).then(function (_admin) {
      if (_admin.Type !== 1) {
        return res.json({
          success: false,
          error: error.noPower
        })
      }
      orm.Administrator.create(addInfo).then(function (_newAdmin) {
        res.json({
          success: true,
          data: {
            admin: _newAdmin
          }
        })
      }).catch(function (_err) {
        res.json({
          success: false,
          error: {
            code: 8,
            message: _err.message
          }
        })
      })
    }).catch(function (_err) {
      res.json({
        success: false,
        error: {
          code: 8,
          message: _err.message
        }
      })
    })
  })
  /**
   * 公司认证
   */
  .post('/verifyCompany', needLogin, function (req, res) {
    if (!req.body.companyID) {
      throw error.informationLoss;
    }
    orm.Company.update({
      Verify: 1
    }, {
      where: {
        ID: req.body.companyID
      }
    })
  })
  /**
   * 删除用户/公司/管理员
   */
  .post('/deleteAccount', needLogin, function (req, res) {
    if (req.body.adminKey !== params.adminKey) {
      throw error.noPower;
    }
    orm.Administrator.findById(req.session.uid).then(function (_admin) {
      if (_admin.Type !== 1) {
        return res.json({
          success: false,
          error: error.noPower
        })
      }
      if (req.body.userID) {
        orm.User.update({
          Delete: 0
        }, {
          where: {
            ID: req.body.userID
          }
        }).then(function (_del) {
          res.json({
            success: true,
            data: _del
          })
        }).catch(function (_err) {
          res.json({
            success: false,
            error: {
              code: 8,
              message: _err.message
            }
          })
        })
      } else if (req.body.companyID) {
        orm.Company.update({
          Delete: 0
        }, {
          where: {
            ID: req.body.companyID
          }
        }).then(function (_del) {
          res.json({
            success: true,
            data: _del
          })
        }).catch(function (_err) {
          res.json({
            success: false,
            error: {
              code: 8,
              message: _err.message
            }
          })
        })
      } else if (req.body.adminID) {
        orm.Administrator.update({
          Delete: 0
        }, {
          where: {
            ID: req.body.adminID
          }
        }).then(function (_del) {
          res.json({
            success: true,
            data: _del
          })
        }).catch(function (_err) {
          res.json({
            success: false,
            error: {
              code: 8,
              message: _err.message
            }
          })
        })
      } else {
        throw error.informationLoss;
      }
    }).catch(function (_err) {
      res.json({
        success: false,
        error: {
          code: 8,
          message: _err.message
        }
      })
    });
  });


module.exports = router;
