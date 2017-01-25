/**
 * Created by chenchangyu on 2016/12/16.
 */
define(function (require, exports) {
  var taxon = require('taxon');
  var tools = require('tools');

  /**
   * @param body是传过来的tpl.find('#rightContainer')
   */

  function init(body) {
    var tpl = require('./czjl.html');
    tpl = $(tpl);
    body.html(tpl);
    tpl.fadeIn();
    renderData(tpl);
  }


  function renderData(tpl) {
    tools.postJson('/company/getResumes', {token: localStorage.getItem('token')}, function (_res) {
      var resumes = [];
      if (_res.success === true) {
        _res.resumes.forEach(function (_resume) {
          if (_resume.users.length !== 0) {
            resumes.push(_resume)
          }
        })
        bindEvents(tpl, resumes)
      } else {
        taxon.alert('获取简历失败！' + _res.error.message)
      }
    })
  }

  function bindEvents(tpl, _resumes) {
    tpl.find('[role="presentation"]').click(function (event) {
      var state = parseInt($(event.currentTarget).attr('data-state'));
      var _id = $(event.currentTarget).find('a').attr('href').slice(1);
      var currentResumes = getResumeByState(state, _resumes);
      tpl.find('#' + _id + ' .list-group').html(function () {
        var resumeList = '';
        currentResumes.forEach(function (_crm) {
          resumeList += '<li class="list-group-item">职位：' + _crm.Brief + '    <small>申请人数:' + _crm.users.length + '</small>\
            <button class="btn btn-success btn-sm pull-right">查看</button>\
            </li>'
        })
        return resumeList;
      })
    })
  }
  function getResumeByState(state, _resumes) {
    var currentStateResumes = [];
    _resumes.forEach(function (_resume) {
      _resume.users.forEach(function (_user) {
        if (_user.jobApply.Process === state) {
          currentStateResumes.push(_resume)
        }
      })
    });
    return currentStateResumes;
  }

  exports.init = init;
});
