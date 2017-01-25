/**
 * Created by chenchangyu on 2016/12/16.
 */
define(function (require, exports) {
  var taxon = require('taxon');
  var tools = require('tools');
  var subInfo = {};
  require('./gsxx.css');
  /**
   * @param body 是传过来的tpl.find('#rightContainer')
   */

  function init(body) {
    var tpl = require('./gsxx.html');
    tpl = $(tpl);
    body.html(tpl);
    tpl.fadeIn();
    renderData(tpl);
    bindEvents(tpl);
  }

  function bindEvents(tpl) {
    tpl.find('input,select').change(function () {
      console.log('改变了');
      tpl.find('#gsxxSubmit').attr('disabled', false);
      tpl.find('.error-span').remove();
    });

    tpl.find('#gsxxLogoInput').unbind('change').bind('change', function (event) {
      tpl.find('#gsxxSubmit').attr('disabled', false);
      tpl.find('.error-span').remove();
      var img = new FormData();
      console.log(event);
      img.append('file', event.currentTarget.files[0]);
      $.ajax({
        type: "POST",
        data: img,
        url: tools.apiHost + '/picture?explore=company&token=' + localStorage.getItem('token'),
        cache: false,
        contentType: false,
        processData: false,
        success: function (_res) {
          console.log(_res);
          if (_res.success) {
            tpl.find('#gsxxLogo').attr('src', tools.Host + _res.url);
            subInfo.Logo = _res.url;
          } else {
            taxon.alert(_res.error.message);
          }
        },
        error: function () {
          taxon.alert('上传失败!');
        }
      })
    });
    tpl.find('#gsxxSubmit').click(function (e) {
      tpl.find('#gsxxSubmit').attr('disabled', true);
      var needInfo = ['Name', 'Scale', 'Stage', 'Logo'];
      needInfo.forEach(function (item) {
        if (item !== 'Logo') {
          subInfo[item] = tpl.find('#gsxx' + item).val();
        }
      });
      needInfo.forEach(function (item) {
        if (!subInfo[item] || subInfo[item] === '0') {
          tpl.find('#gsxx' + item).after('<span class="error-span">必填！</span>');
        }
      });
      if (tpl.find('.error-span').length <= 0) {
        tools.postJson('/company/companyInfo?token=' + localStorage.getItem('token'), subInfo, function (_res) {
          if (_res.success) {
            tools.setStorage('userInfo', _res.data.company);
            taxon.alert('修改成功!');
          } else {
            taxon.alert(_res.error.mesasge);
          }
        })
      }
    })
  }

  function renderData(tpl) {
    var userInfo = tools.getStorage("userInfo");
    var renderinfo = ['Name', 'Scale', 'Stage'];
    renderinfo.forEach(function (item) {
      tpl.find('#gsxx' + item).val(userInfo[item]);
    });
    if (userInfo['Logo']) tpl.find('#gsxxLogo').attr('src', tools.Host + userInfo['Logo']);
  }

  exports.init = init;
});
