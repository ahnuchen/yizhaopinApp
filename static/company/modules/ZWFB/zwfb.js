/**
 * Created by chenchangyu on 2016/12/16.
 */
define(function (require, exports) {
  var taxon = require('taxon');
  var areas = require('../../lib/areas.json');
  var tools = require('tools');
  require('./zwfb.css');

  /**
   *needInfo = ['Province', 'City', 'Brief', 'CompanyName', 'CompanyLogo',
   'Type', 'maxSalary', 'minSalary', 'Description', 'Experience']
   * @param body 传过来的 tpl.find('#ringhtContainer');
   */
  function init(body) {
    var tpl = require('./zwfb.html');
    tpl = $(tpl);
    body.html(tpl);
    tpl.fadeIn();
    renderData(tpl);
    bindEvents(tpl,body);
  }

  function renderData(tpl) {
    var provinces = areas.provinces, cities = areas.cities;
    tpl.find('#zwfbProvince').html(function () {
      var provs = '';
      provinces.forEach(function (_prov) {
        provs += '<option data-id="' + _prov.id + '" value="' + _prov.ProvinceName + '">' + _prov.ProvinceName + '</option>'
      });
      return provs;
    }).change(function (e) {
      var provinceId = $(e.currentTarget).find('option:selected').attr('data-id');
      var cits = '';
      cities.forEach(function (_city) {
        if (_city.ProvinceID === parseInt(provinceId)) {
          cits += '<option value="' + _city.CityName + '">' + _city.CityName + '</option>'
        }
      });
      tpl.find('#zwfbCity').html(cits);
    }).trigger('change');

    tpl.find('#zwfbminSalary').html(function () {
      var minSalary = '';
      for (var i = 1; i <= 99; i++) {
        minSalary += '<option value="' + i + '">' + i + 'K</option>';
      }
      return minSalary;
    }).change(function (e) {
      var minSalary = parseInt($(e.currentTarget).val());
      var maxSalas = '';
      for (var i = minSalary; i <= 99; i++) {
        maxSalas += '<option value="' + i + '">' + i + 'K</option>'
      }
      tpl.find('#zwfbmaxSalary').html(maxSalas);
    }).trigger('change');
  }
  function bindEvents(tpl,_body) {
    tpl.find('input,select').change(function () {
      console.log('改变了');
      tpl.find('#zwfbSubmit').attr('disabled', false);
      tpl.find('.error-span').remove();
    });
    tpl.find('#zwfbSubmit').click(function (_event) {
      var needInfo = ['Province','City','Brief','Type','minSalary','maxSalary','Description','Experience','Degree'];
      var subInfo = {};
      var CompanyInfo = tools.getStorage('userInfo');
      if(!CompanyInfo.Name || !CompanyInfo.Logo){
        taxon.alert('请先完善公司信息!');
        return false;
      }
      subInfo.CompanyName = CompanyInfo.Name;
      subInfo.CompanyLogo = CompanyInfo.Logo;
      subInfo.token = localStorage.getItem('token');
      needInfo.forEach(function (_info) {
        subInfo[_info]=tpl.find('#zwfb'+_info).val();
      });
      console.log(subInfo);
      needInfo.forEach(function (_item) {
        if(!subInfo[_item]){
          tpl.find('#zwfb'+_item).after('<span class="error-span">必填！</span>')
        }
      });

      if(tpl.find('.error-span').length<=0){
        tools.postJson('/company/sendJobs',subInfo,function (_res) {
          console.log(_res);
          if(_res.success){
            taxon.alert('提交成功!').on('alert',function () {
              // init(_body);
            });
          }else{
            taxon.alert('提交失败：'+_res.error.message);
          }
        },function (_err) {
          taxon.alert('提交失败!');
        })
      }
    })
  }

  exports.init = init;
});
