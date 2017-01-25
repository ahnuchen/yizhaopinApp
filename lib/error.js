/**
 * Created by chenchangyu on 2017/1/11.
 */
module.exports = {
  informationLoss: {
    code: 1,
    message: '缺少请求参数!'
  },
  invalidParams: {
    code: 2,
    message: '参数不合法!'
  },
  userNotFound: {
    code: 3,
    message: '找不到该用户!'
  },
  userExist: {
    code: 4,
    message: '用户已存在!'
  },
  recordNotFound: {
    code: 5,
    message: '找不到该记录!'
  },
  userNotLogin: {
    code: 6,
    message: '用户未登录!'
  },
  errorLoginInfo: {
    code: 7,
    message: '账户名或者密码错误!'
  },
  databaseError: {
    code: 8,
    message: '操作数据库出错!'
  },
  noPower: {
    code: 9,
    message: '没有操作权限!'
  },
  pictureFail: {
    code: 10,
    message: '图片上传失败!'
  },
  errorPassword: {
    code: 11,
    message: '密码错误!'
  }
};
