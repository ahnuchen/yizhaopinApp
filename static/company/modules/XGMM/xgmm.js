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
    var tpl = require('./xgmm.html');
    tpl = $(tpl);
    body.html(tpl);
    tpl.fadeIn();
    bindEvents(tpl);
  }

  function bindEvents(tpl) {
    tpl.find('#xgmmSubmit').click(function () {
      var pre = tpl.find('#xgmmPre').val(),newPassword = tpl.find('#xgmmNew').val(),confirmPassword = tpl.find('#xgmmConfirm').val();
      if(!pre || !newPassword || !confirmPassword){
        taxon.alert('信息填写不完整！');
        return false;
      }
      if(newPassword!==confirmPassword){
        taxon.alert('两次密码不一致!请重新确认！');
        return false;
      }
      tools.postJson('/company/editPassword',{newPassword:newPassword,oldPassword:pre,token:localStorage.getItem('token')},function (_res) {
        if(_res.success){
          taxon.alert('修改成功！').on('alert',function () {
            window.location.href = '../index.html';
          })
        }else{
          taxon.alert('修改失败！'+_res.error.message);
        }
      },function (_err) {
        taxon.alert('修改失败！');
        console.log(_err);
      })

    })

  }

  exports.init = init;
});
