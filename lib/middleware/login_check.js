/**
 * Created by chenchangyu on 2017/1/9.
 */
var error = require('../error');
module.exports = (function (req, res, next) {
  if (!req.session.token) {
    return res.json({
      success: false,
      error: error.userNotLogin
    })
  }
  next();
});
