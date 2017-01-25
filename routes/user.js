/**
 * Created by chenchangyu on 2017/1/9.
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
 * 普通用户注册
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
    return orm.User.findOne({
      where: {
        Account: addInfo.Account
      }
    }).then(function (_user) {
      if (_user) {
        throw error.userExist;
      } else {
        return orm.User.create(addInfo).then(function (_result) {
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
   * 用户登录
   */
  .post('/signIn', function (req, res) {
    let needInfo = ['Account', 'Password'], addInfo = {};
    needInfo.forEach(function (_data) {
      if (!req.body[_data])throw error.informationLoss;
      addInfo[_data] = req.body[_data];
    });
    orm.User.findOne({
      where: {
        Account: addInfo.Account,
        Password: addInfo.Password,
        Delete: 1
      }
    }).then(function (_user) {
      if (!_user) {
        res.json({
          success: false,
          error: error.errorLoginInfo
        })
      } else {
        let token = session.newToken(req, _user);
        req.session.login = true;
        session.saveSession(req);
        res.json({
          success: true,
          data: {
            token: token,
            user: _user
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
   * 修改密码
   */
  .post('/editPassword', needLogin, function (req, res) {
    let needInfo = ['Account', 'oldPassword', 'newPassword'], addInfo = {};
    needInfo.forEach(function (_data) {
      if (!req.body[_data])throw error.informationLoss;
      addInfo[_data] = req.body[_data];
    });
    orm.User.findOne({
      where: {
        Account: addInfo.Account,
        Password: addInfo.oldPassword
      }
    }).then(function (_user) {
      if (!_user) {
        throw error.errorLoginInfo;
      }
      return _user.update({
        Password: addInfo.newPassword
      }).then(function (_newUser) {
        res.json({
          success: true,
          data: {
            user: _newUser
          }
        })
      }).catch(function (_err) {
        res.json({
          success: false,
          error: {
            code: 8,//数据库错误
            message: _err.message
          }
        })
      })
    }).catch(function (_err) {
      res.json({
        success: false,
        error: {
          code: 8,//数据库错误
          message: _err.message
        }
      })
    })
  })

  /**
   * 填写个人信息
   */
  .post('/personalInformation', needLogin, function (req, res) {
    let needInfo = ['Name', 'Telephone', 'Email', 'Introduction', 'Sex', 'HeadImage'], addInfo = {};
    needInfo.forEach(function (_data) {
      if (!req.body[_data]) {
        throw error.informationLoss;
      }
      addInfo[_data] = req.body[_data];
    });
    orm.User.findById(req.session.uid).then(function (_user) {
      _user.update(addInfo).then(function (_newUser) {
        res.json({
          success: true,
          data: {
            user: _newUser
          }
        })
      }).catch(function (_err) {
        res.json({
          success: false,
          error: {
            code: 8,//数据库错误
            message: _err.message
          }
        })
      })
    }).catch(function (_err) {
      res.json({
        success: false,
        error: {
          code: 8,//数据库错误
          message: _err.message
        }
      })
    })
  })
  /**
   * 个人简历填写修改
   */
  .post('/resume', needLogin, function (req, res) {
    let needInfo = ['HeadImage', 'Name', 'Sex', 'Birthday', 'Degree', 'Experience',
        'Telephone', 'Email', 'LiveCity', 'LiveProvince', 'Brief', 'WorkExperience',
        'EducationExperience', 'ExpectWork', 'ProjectExperience', 'PersonalDescription'],
      addInfo = {};
    needInfo.forEach(function (_data) {
      if (!req.body[_data]) {
        throw error.informationLoss;
      }
      addInfo[_data] = req.body[_data];
    });
    orm.User.findById(req.session.uid).then(function (_user) {
      _user.setResume(null).then(function () {
        _user.createResume(addInfo).then(function (_resume) {
          res.json({
            success: true,
            data: {
              resume: _resume
            }
          })
        }).catch(function (_err) {
          res.json({
            success: false,
            errror: {
              code: 8,
              message: _err.message
            }
          })
        })
      }).catch(function (_err) {
        res.json({
          success: false,
          errror: {
            code: 8,
            message: _err.message
          }
        })
      })
    }).catch(function (_err) {
      res.json({
        success: false,
        errror: {
          code: 8,
          message: _err.message
        }
      })
    })
  })

  /**
   * 投递简历
   */
  .post('/addResume', needLogin, function (req, res) {
    if (!req.body.companyID || !req.body.jobID) {
      throw error.informationLoss;
    }
    orm.JobApply.upsert({
      Process: 1,
      Delete: 1,
      jobID: parseInt(req.body.jobID),
      userID: parseInt(req.session.uid),
      companyID: parseInt(req.body.companyID)
    }, {
      fields: ['Process', 'Delete', 'jobID', 'userID', 'companyID']
    }).then(function (_job) {
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
  })
  /**

   * 收藏职位
   */
  .post('/favoriteJob', needLogin, function (req, res) {
    if (!req.body.jobID) {
      throw error.informationLoss;
    }
    orm.User.findById(req.session.uid).then(function (_user) {
      _user.createFavorite({
        JobID: req.body.jobID
      }).then(function (_fav) {
        res.json({
          success: true,
          data: {
            favorite: _fav
          }
        })
      }).catch(function (_err) {
        res.json({
          success: false,
          errror: {
            code: 8,
            message: _err.message
          }
        })
      })
    }).catch(function (_err) {
      res.json({
        success: false,
        errror: {
          code: 8,
          message: _err.message
        }
      })
    })
  })
  /**
   * 取消收藏职位
   */
  .post('/cancelFavoriteJob', needLogin, function (req, res) {
    if (!req.body.jobID) {
      throw error.informationLoss;
    }
    orm.User.findById(req.session.uid).then(function (_user) {
      _user.removeFavorite({
        where: {
          JobID: req.body.jobID
        }
      }).then(function (_del) {
        res.json({
          success: true,
          data: {
            deletedFavorite: _del
          }
        })
      }).catch(function (_err) {
        res.json({
          success: false,
          errror: {
            code: 8,
            message: _err.message
          }
        })
      })
    }).catch(function (_err) {
      res.json({
        success: false,
        errror: {
          code: 8,
          message: _err.message
        }
      })
    })
  })
  /**
   * 获取收藏的职位
   */
  .post('/getFavorites', needLogin, function (req, res) {
    orm.User.findById(req.session.uid).then(function (_user) {
      _user.getFavorites().then(function (_fav) {
        res.json({
          success: true,
          data: {
            favorites: _fav
          }
        })
      }).catch(function (_err) {
        res.json({
          success: false,
          errror: {
            code: 8,
            message: _err.message
          }
        })
      })
    }).catch(function (_err) {
      res.json({
        success: false,
        errror: {
          code: 8,
          message: _err.message
        }
      })
    })
  })
  /**
   * 用户获取所有投递的简历
   */
  .post('/getSentResume', needLogin, function (req, res) {
    orm.User.findById(req.session.uid, {
      'include': [orm.Job]
    }).then(function (_user) {
      _user.getJobs().then(function (_sentResume) {
        res.json({
          success: true,
          data: {
            resumes: _sentResume
          }
        })
      }).catch(function (_err) {
        res.json({
          success: false,
          errror: {
            code: 8,
            message: _err.message
          }
        })
      })
    }).catch(function (_err) {
      res.json({
        success: false,
        errror: {
          code: 8,
          message: _err.message
        }
      })
    })
  })
  /**
   * 职位列表
   */
  .post('/getAllJobs', function (req, res) {
    let currentPage = req.body.currentPage ? parseInt(req.body.currentPage) : 0;//分页，从0开始
    let countPerPage = req.body.countPerPage ? parseInt(req.body.countPerPage) : 15;
    let findKey = {};
    if (req.body.keyword) {
      findKey.$and = [{
        $or: [{'CompanyName': {$like: "%" + req.body.keyword + "%"}},
          {'Brief': {$like: "%" + req.body.keyword + "%"}}]
      }]
    }
    let couldKey = ['ID', 'Province', 'City', 'Type', 'Experience', 'CompanyStage', 'companyScale'];
    couldKey.forEach(function (_data) {
      if (req.body[_data]) {
        findKey[_data] = req.body[_data];
      }
    });
    if (req.body.maxSalary && req.body.minSalary) {
      findKey.$and.push({
        $or: [{'maxSalary': {'$between': [req.body.minSalary, req.body.maxSalary]}},
          {'minSalary': {'$between': [req.body.minSalary, req.body.maxSalary]}}]
      })
    }
    findKey.Delete = 1;
    orm.Job.findAndCountAll({
      where: findKey,
      'limit': countPerPage,
      'offset': countPerPage * currentPage,
      'order': [['updatedAt', 'DESC']]
    }).then(function (_jobs) {
      res.json({
        success: true,
        data: _jobs
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

module.exports = router;
