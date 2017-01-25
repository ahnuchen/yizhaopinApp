/**
 * Created by chenchangyu on 2016/12/16.
 */
define(function (require, exports, module) {
  var taxon = require('taxon');
  var tools = require('tools');
  var gsxx = require('./gsxx/gsxx');
  var czjl = require('./CZJL/czjl');
  var xgmm = require('./XGMM/xgmm');
  var zwfb = require('./ZWFB/zwfb');
  var zwgl = require('./ZWGL/zwgl');

  var mapModule = {
    'gsxx': gsxx,
    'czjl': czjl,
    'xgmm': xgmm,
    'zwfb': zwfb,
    'zwgl': zwgl
  };

  function init() {
    var tpl = $('.mainContainer');
    bindEvents(tpl);
    mapModule["gsxx"].init(tpl.find('#rightContainer'));
  }

  function bindEvents(tpl) {
    tpl.find('.leftMenu a').unbind('click').click(function (event) {
      $(event.currentTarget).addClass('active').siblings('a').removeClass('active');//active切换
      var myModule = $(event.currentTarget).attr('data-module');//当前菜单
      console.log(myModule);
      mapModule[myModule].init(tpl.find('#rightContainer'));//对应内容初始化
    })
  }

  exports.init = init;
});
