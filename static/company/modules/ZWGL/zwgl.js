/**
 * Created by chenchangyu on 2016/12/16.
 */
define(function (require, exports) {
  var taxon = require('taxon');
  var tools = require('tools');
  require('./zwgl.css');

  /**
   * @param body 是传过来的tpl.find('#rightContainer')
   */

  function init(body) {
    var tpl = require('./zwgl.html');
    tpl = $(tpl);
    body.html(tpl);
    tpl.fadeIn();
    renderData(tpl);
  }

  function renderData(tpl) {
    tools.getJson('/company/getJobs?token=' + localStorage.getItem('token'), '', function (_res) {
      if (_res.success) {
        var jobsStr = '';
        _res.data.jobs.forEach(function (_job) {
          var areas = _job.Province===_job.City?_job.Province:_job.Province+_job.City;
          var description = (_job.Description.length<10)?_job.Description:_job.Description.substr(0,10)+'...';
          jobsStr += '<tr data-id="'+_job.ID+'">\
            <td>'+_job.Brief+'</td>\
            <td>'+areas+'</td>\
            <td>'+getDegreeById(_job.Degree)+'</td>\
            <td>'+getExperienceById(_job.Experience)+'</td>\
            <td>'+getTypeById(_job.Type)+'</td>\
            <td>'+_job.minSalary+'K-'+_job.maxSalary+'K</td>\
            <td>'+description+'</td>\
            <td>\
            <button type="button"  class="zwgl-detail btn btn-sm btn-info">详情</button>\
            <button type="button" class="zwgl-delete btn btn-sm btn-danger">删除</button>\
            </td>\
            </tr>'
        });
        jobsStr = $(jobsStr);
        tpl.find('tbody').html(jobsStr);
        bindEvents(jobsStr,tpl,_res.data.jobs);
      } else {
        taxon.alert('获取职位失败!'+_res.error.message);
      }

    }, function (_err) {
      taxon.alert('获取职位失败!');
    });
  }
  function bindEvents($jobList,$tpl,jobsData) {
    $jobList.find('.zwgl-delete').click(function (_event) {
      var $tr = $(_event.currentTarget).parents('tr');
      var jobId = $tr.attr('data-id');
      taxon.confirm('你确定要删除该职位吗?').on('confirm',function () {
        tools.postJson('/company/deleteJob',{jobID:jobId,token:localStorage.getItem('token')},function (_res) {
          if(_res.success){
            $tr.remove();
          }else{
            taxon.alert('删除失败!'+_res.error.message);
          }
        })
      })
    });
    $jobList.find('.zwgl-detail').click(function (_event) {
      var $tr  = $(_event.currentTarget).parents('tr');
      var jobId = $tr.attr('data-id'),jobItem;
      console.log(jobsData);
      jobsData.forEach(function (_job) {
        if(_job.ID === parseInt(jobId)){
          jobItem = _job;
          jobItem.Degree = getDegreeById(jobItem.Degree);
          jobItem.Experience = getExperienceById(jobItem.Experience);
          jobItem.Type = getTypeById(jobItem.Type);
          jobItem.Description = jobItem.Description.replace(/\n/g,'<br>');
        }
      });
      $tpl.find('#zwglDetailModel').modal('show');
      for(var item in jobItem){
        if(jobItem.hasOwnProperty(item)){
          $tpl.find('#zwglDetail'+item).html(jobItem[item])
        }
      }
    })
  }
  //@学历 {0:大专,1:本科,2：硕士,3:博士,4:不限}
  function getDegreeById(id) {
    switch(parseInt(id)){
      case 0:
        return '大专';
      case 1:
        return '本科';
      case 2:
        return '硕士';
      case 3:
        return '博士';
      case 4:
        return '不限';
    }
  }
  // @职位类型{1:全职,2:兼职,3:实习}

  function getTypeById(id) {
    switch(parseInt(id)){
      case 1:
        return '全职';
      case 2:
        return '兼职';
      case 3:
        return '实习';
    }
  }
  // @工作经验{1:不限,2:应届毕业生,3:1-3年,4:3-5年,5:5-10年}

  function getExperienceById(id) {
    switch(parseInt(id)){
      case 1:
        return '不限';
      case 2:
        return '应届毕业生';
      case 3:
        return '1-3年';
      case 4:
        return '3-5年';
      case 5:
        return '5-10年'
    }
  }

  exports.init = init;
});
