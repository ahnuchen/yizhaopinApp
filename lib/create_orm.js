/**
 * @description　自动建表
 */
"use strict";
var Sequelize = require('sequelize');
var logger = require('../lib/logger');
var db = require('../config/params').db;
var uuid = require('node-uuid');

var database = db.database;
var userName = db.user;
var password = db.password;
var orm = {};
var yizhaopin = new Sequelize(database, userName, password, {
  host: db.host,
  port: db.port,
  dialect: db.dialect,
  // logging: false,
  timezone: db.timezone,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  define: {
    charset: 'utf8'
  }
});

yizhaopin.authenticate()
  .then(function (err) {
    logger.info('[orm] connect ' + database + ' user: ' + userName);
    orm.sequelize = yizhaopin;
    orm.Promise = yizhaopin.Promise;
    initOrm();
  })
  .catch(function (err) {
    console.log(err);
    logger.error('[orm] connect error ' + database + ' user: ' + userName);
  });


function initOrm() {
  /**
   * 普通用户表
   * @type {Model}
   */
  orm.User = yizhaopin.define('user', {
    ID: {type: Sequelize.INTEGER(10), primaryKey: true, allowNull: false, autoIncrement: true},
    Account: {type: Sequelize.STRING(20), allowNull: false},
    Password: {type: Sequelize.STRING(50), allowNull: false},
    Name: Sequelize.STRING(200),//姓名
    Province: Sequelize.STRING(20),//省份
    City: Sequelize.STRING(30),//城市
    Telephone: Sequelize.STRING(20),//电话
    Email: Sequelize.STRING(200),//邮箱
    Introduction: Sequelize.STRING(500),//一句话介绍
    Sex: Sequelize.STRING(20),//性别
    HeadImage: Sequelize.STRING(200),//头像
    Delete: {type: Sequelize.INTEGER(1), allowNull: false, defaultValue: 1},//删除字段:{-1:删除，>=1未删除}
  });
  /**
   * 管理员账号
   */
  orm.Administrator = yizhaopin.define('administrator', {
    ID: {type: Sequelize.INTEGER(10), primaryKey: true, allowNull: false, autoIncrement: true},
    Account: {type: Sequelize.STRING(20), allowNull: false},
    Password: {type: Sequelize.STRING(50), allowNull: false},
    Type: Sequelize.INTEGER(10),//@账号类型：1 高级管理员，2 管理员
    Delete: {type: Sequelize.INTEGER(1), allowNull: false, defaultValue: 1},//删除字段:{-1:删除，>=1未删除}
  });
  /**
   * 公司表
   * @type {Model}
   */
  orm.Company = yizhaopin.define('company', {
    ID: {type: Sequelize.INTEGER(10), primaryKey: true, allowNull: false, autoIncrement: true},
    Account: {type: Sequelize.STRING(20), allowNull: false},
    Password: {type: Sequelize.STRING(50), allowNull: false},
    Name: Sequelize.STRING(50),//@公司名称
    Logo: Sequelize.STRING(200),//公司logo图片
    Stage: Sequelize.INTEGER(2),//@公司发展阶段:{1:不需要融资,2:天使轮,3:A轮,4:B轮,5:C轮,6:D轮及以上,7:上市公司}
    Scale: Sequelize.INTEGER(2),//@公司规模: {1:15人一下,2:15-50人,3:50-150人,4:150-500人,5:500-2000人,6:2000人以上}
    Verify: {type: Sequelize.INTEGER(1), allowNull: false, defaultValue: 0},//@审核 {0:未通过,1:已通过,2:已认证}
    Delete: {type: Sequelize.INTEGER(1), allowNull: false, defaultValue: 1},//删除字段:{-1:删除，>=1未删除}
  });
  /**
   * 职位表
   * @type {Model}
   */
  orm.Job = yizhaopin.define('job', {
    ID: {type: Sequelize.INTEGER(10), primaryKey: true, allowNull: false, autoIncrement: true},
    Province: {type: Sequelize.STRING(50), allowNull: false},//工作省份
    City: {type: Sequelize.STRING(50), allowNull: false},//工作城市
    Brief: {type: Sequelize.STRING(50), allowNull: false},//职位简介
    CompanyName: {type: Sequelize.STRING(50), allowNull: false},//@公司名称
    CompanyScale: Sequelize.INTEGER(2),//@公司规模: {1:15人一下,2:15-50人,3:50-150人,4:150-500人,5:500-2000人,6:2000人以上}
    CompanyStage: {type: Sequelize.INTEGER(2), allowNull: false},//@公司发展阶段:{1:不需要融资,2:天使轮,3:A轮,4:B轮,5:C轮,6:D轮及以上,7:上市公司}
    CompanyLogo: {type: Sequelize.STRING(200)},//公司logo图片
    Type: {type: Sequelize.INTEGER(1), allowNull: false},//@职位类型{1:全职,2:兼职,3:实习}
    maxSalary: {type: Sequelize.INTEGER(2), allowNull: false},//@最高薪水 format(10,99):10k-99k
    minSalary: {type: Sequelize.INTEGER(2), allowNull: false},//@最低薪水 format(10,99):10k-99k
    Description: {type: Sequelize.TEXT, allowNull: false},//详细描述
    Degree: {type: Sequelize.INTEGER(1), allowNull: false},//@学历 {0:大专,1:本科,2：硕士,3:博士,4:不限}
    Experience: {type: Sequelize.INTEGER(1), allowNull: false, defaultValue: 1},//@工作经验{1:不限,2:应届毕业生,3:1-3年,4:3-5年,5:5-10年}
    Delete: {type: Sequelize.INTEGER(1), allowNull: false, defaultValue: 1},//删除字段:{-1:删除，>=1未删除}
  }, {
    timestamps: true
  });
  /**
   * 个人简历表
   */
  orm.Resume = yizhaopin.define('resume', {
    ID: {type: Sequelize.INTEGER(10), primaryKey: true, allowNull: false, autoIncrement: true},
    HeadImage: {type: Sequelize.STRING(200), allowNull: false},//头像
    Name: {type: Sequelize.STRING(200), allowNull: false},//姓名
    Sex: {type: Sequelize.STRING(20), allowNull: false},//性别
    Birthday: {type: Sequelize.DATE, allowNull: false},//出生日期
    Degree: {type: Sequelize.INTEGER(1), allowNull: false},//@学历 {0:大专,1:本科,2：硕士,3:博士,4:其他}
    Experience: {type: Sequelize.INTEGER(2), allowNull: false},//工作年限{0:应届毕业生,1-10(n):n年,11：十年以上}
    Telephone: {type: Sequelize.STRING(20), allowNull: false},//电话号码
    Email: {type: Sequelize.STRING(50), allowNull: false},//邮箱
    LiveCity: {type: Sequelize.STRING(20), allowNull: false},//所在城市
    LiveProvince: {type: Sequelize.STRING(20), allowNull: false},//所在省
    Brief: {type: Sequelize.STRING(100), allowNull: false},//一句话介绍
    WorkExperience: {type: Sequelize.TEXT, allowNull: false},//工作经历JSONString[{company:"",position:"",joinTime:"",leaveTime:"",content:""},...]
    EducationExperience: {type: Sequelize.TEXT, allowNull: false},//教育经历:JSONString[{school:"",major:"",endTime:"",degree:""}]
    ExpectWork: {type: Sequelize.TEXT, allowNull: false},//期待工作JSONString:{name:"前端",type:"全职",city:"南京",salary:1,addtion:"补充说明(若有)"}
    ProjectExperience: {type: Sequelize.TEXT, allowNull: true}, //项目经验 JSONString {name:"商城",position:"",startTime:"",endTime:"",description:"",link:""}
    PersonalDescription: Sequelize.TEXT,//个人描述
    Delete: {type: Sequelize.INTEGER(1), allowNull: false, defaultValue: 1},//删除字段:{-1:删除，>=1未删除}
  });
  /**
   * 简历投递表
   */
  orm.JobApply = yizhaopin.define('jobApply', {
    ID: {type: Sequelize.INTEGER(10), primaryKey: true, allowNull: false, autoIncrement: true},
    Process: {type: Sequelize.INTEGER(1), allowNull: false, defaultValue: 0},//简历状态:{1:已投递,2:待沟通,3:面试,4:不合适}
    InterviewDate: Sequelize.DATE,//面试时间(简历面试之后一个月过期)
    InterviewPosition: Sequelize.STRING(200),//面试地点
    companyID:Sequelize.INTEGER(10),
    Delete: {type: Sequelize.INTEGER(1), allowNull: false, defaultValue: 1},//删除字段:{-1:删除，>=1未删除}
  });
  /**
   * 收藏表
   */
  orm.Favorite = yizhaopin.define('favorite', {
    ID: {type: Sequelize.INTEGER(10), primaryKey: true, allowNull: false, autoIncrement: true},
    JobID: Sequelize.INTEGER(10)
  });
  /**
   * 关联表
   */
  //用户<=>简历 一对一
  orm.User.hasOne(orm.Resume);
  orm.Resume.belongsTo(orm.User);
  //公司<=>职位 一对多
  orm.Company.hasMany(orm.Job);
  orm.Job.belongsTo(orm.Company);
  //用户<=>收藏 一对多
  orm.User.hasMany(orm.Favorite);
  orm.Favorite.belongsTo(orm.User);
  //用户<=>公司 多对多
  orm.User.belongsToMany(orm.Job, {'through': orm.JobApply});
  orm.Job.belongsToMany(orm.User, {'through': orm.JobApply});

  /**
   * 自动建表
   */
  orm.User.sync().then(function () {
    return orm.Administrator.sync()
  }).then(function () {
    return orm.Company.sync()
  }).then(function () {
    return orm.Job.sync()
  }).then(function () {
    return orm.Resume.sync()
  }).then(function () {
    return orm.JobApply.sync()
  }).then(function () {
    return orm.Favorite.sync()
  })
}
module.exports = orm;

