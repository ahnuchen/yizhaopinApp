/**
 * Created by chenchangyu on 2017/1/10.
 */
'use strict';
var express = require('express');
var router = express.Router();
var logger = require('../lib/logger');
var orm = require('../lib/create_orm');
var error = require('../lib/error');
var needLogin = require('../lib/middleware/login_check');
var uuid = require('node-uuid');
var path = require('path');
var fs = require('fs');
var busboy = require('connect-busboy');
router
/**
 * @description 上传图片接口
 * 路径/picture/post?token=xxx&&url=xxx
 */
  .post('/', needLogin, function (req, res) {
    logger.info('上传图片');
    if (req.query.explore) {
      let explore = req.query.explore;
      logger.info(explore !== 'user' || explore !== 'company' || explore !== 'admin');
      if (explore !== 'user' && explore !== 'company' && explore !== 'admin') {
        throw error.invalidParams;
      }
    }
    if (req.busboy) {
      req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        let fileName = uuid.v1();
        let extName = path.extname(filename);
        fileName = fileName + extName;
        console.log(fileName);
        console.log(extName);
        let saveTo = '';
        if (req.query.explore) {
          saveTo = path.join(__dirname.replace('routes', 'static/uploadImg/' + req.query.explore), fileName);
        }
        else {
          saveTo = path.join(__dirname.replace('routes', 'static/uploadImg'), fileName);
        }
        console.log(saveTo);
        file.pipe(fs.createWriteStream(saveTo));
        file.on('end', function () {
          console.log(saveTo);
          if (req.query.explore) {
            res.json({
              success: true,
              url: '/static/uploadImg/' + req.query.explore +'/'+ fileName
            });
          } else {
            res.json({
              success: true,
              url: '/static/uploadImg' + fileName
            });
          }
        });
        file.on('error', function (_err) {
          res.json({
            success: false,
            error: _err
          })
        })
      });
      req.busboy.on('error', function (_err) {
        res.json({
          success: false,
          error: _err
        })
      });
      req.pipe(req.busboy);
    } else {
      throw error.pictureFail;
    }
  });
module.exports = router;
