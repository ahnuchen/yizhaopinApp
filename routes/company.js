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
router
/**
 * 公司注册
 */
  .post('/signUp', function (req, res) {
    logger.info('--注册--');
    let needInfo = ['Account', 'Password'], addInfo = {};
    needInfo.forEach(function (_data) {
      if (!req.body[_data]) {
        throw error.informationLoss;
      }
      addInfo[_data] = req.body[_data];
    });
    return orm.Company.findOne({
      where: {
        Account: addInfo.Account
      }
    }).then(function (_company) {
      if (_company) {
        throw error.userExist;
      } else {
        return orm.Company.create(addInfo).then(function (_result) {
          res.json({
            success: true,
            data: _result
          })
        }).catch(function (_err) {
          res.json({
            success: false,
            error: {
              code: 8,
              message: _err.message
            }
          })
        });
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
   * 公司登录
   */
  .post('/signIn', function (req, res) {
    let needInfo = ['Account', 'Password'], addInfo = {};
    needInfo.forEach(function (_data) {
      if (!req.body[_data])throw error.informationLoss;
      addInfo[_data] = req.body[_data];
    });
    orm.Company.findOne({
      where: {
        Account: addInfo.Account,
        Password: addInfo.Password,
        Delete: 1
      }
    }).then(function (_company) {
      if (!_company) {
        res.json({
          success: false,
          error: error.errorLoginInfo
        })
      } else {
        let token = session.newToken(req, _company);
        req.session.login = true;
        session.saveSession(req);
        res.json({
          success: true,
          data: {
            token: token,
            user: _company
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
   * 公司发布职位
   */
  .post('/sendJobs', needLogin, function (req, res) {
    let needInfo = ['Province', 'City', 'Degree', 'Brief', 'CompanyName', 'CompanyLogo',
      'Type', 'maxSalary', 'minSalary', 'Description', 'Experience'], addInfo = {};
    needInfo.forEach(function (_data) {
      if (!req.body[_data]) {
        throw error.informationLoss;
      }
      addInfo[_data] = req.body[_data];
    });
    orm.Company.findById(req.session.uid).then(function (_company) {
      addInfo.CompanyStage = _company.Stage;
      addInfo.CompanyScale = _company.Scale;
      _company.createJob(addInfo).then(function (_job) {
        res.json({
          success: true,
          data: {
            job: _job
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
   * 公司删除职位
   */
  .post('/deleteJob', needLogin, function (req, res) {
    if (!req.body.jobID) {
      throw error.informationLoss;
    }
    orm.Job.findById(req.body.jobID).then(function (_job) {
      _job.update({
        companyID: null,
        Delete: 0
      }).then(function (_result) {
        res.json({
          success: true,
          data: {
            result: _result
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
   * 公司获得职位
   */
  .get('/getJobs', needLogin, function (req, res) {
    orm.Company.findById(req.session.uid).then(function (_company) {
      _company.getJobs().then(function (_jobs) {
        res.json({
          success: true,
          data: {
            jobs: _jobs
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
   * 公司获得所有简历
   */
  .post('/getResumes', needLogin, function (req, res) {
    orm.Company.findById(req.session.uid, {
      'include': [orm.Job]
    }).then(function (_company) {
      _company.getJobs({
        'include': [{
          'model': orm.User,
          'attributes': ['Name','Province','Province','City','ID','Telephone','Email','Introduction','Sex','HeadImage']
        }]
      }).then(function (_resumes) {
        res.json({
          success: true,
          resumes: _resumes
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
   * 公司操作简历
   * //@Process:简历状态:{1:已投递,2:待沟通,3:面试,4:不合适}
   */
  .post('/operateResume', needLogin, function (req, res) {
    if (!req.body.userID || !req.body.process) {
      throw error.informationLoss;
    }
    orm.User.findById(req.body.userID)
      .then(function (_user) {
        orm.Company.findById(req.session.uid)
          .then(function (_company) {
            _company.removeUser(_user)
              .then(function () {
                _company.createUser(_user, {
                  Process: req.body.process
                })
                  .then(function (_job) {
                    res.json({
                      success: true,
                      data: {
                        job: _job
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
   * 公司完善信息
   */
  .post('/companyInfo', needLogin, function (req, res) {
    let needInfo = ['Name', 'Logo', 'Stage', 'Scale'], addInfo = {};
    needInfo.forEach(function (_data) {
      if (!req.body[_data]) {
        throw error.informationLoss;
      }
      addInfo[_data] = req.body[_data];
    });
    addInfo['Stage'] = parseInt(addInfo['Stage']);
    addInfo['Scale'] = parseInt(addInfo['Scale']);
    orm.Company.findById(req.session.uid).then(function (_company) {
      _company.update(addInfo).then(function (_newCompany) {
        res.json({
          success: true,
          data: {
            company: _newCompany
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
   * 公司修改密码
   */
  .post('/editPassword', needLogin, function (req, res) {
    if (!req.body.oldPassword || !req.body.newPassword) {
      throw error.informationLoss;
    }
    orm.Company.findById(req.session.uid).then(function (_company) {
      if (req.body.oldPassword !== _company.Password) {
        res.json({
          success: false,
          error: error.errorPassword
        })
      } else {
        _company.update({
          Password: req.body.newPassword
        }).then(function (_result) {
          res.json({
            success: true,
            data: {
              result: _result
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
  });


module.exports = router;
