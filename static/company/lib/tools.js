/**
 * Created by deng on 16/9/12.
 * 包含所有与后端的通信方法
 */
define(function (require, exports, module) {
  function Tools() {
    this.apiHost = "http://localhost:8080/api";
    this.Host = "http://localhost:8080";
  }

  /**
   * 新的接口get请求
   * @param url
   * @param success
   * @param error
   */
  Tools.prototype.getJson = function (url, data, success, error) {
    $.ajax({
      type: "get",
      data: data,
      url: this.apiHost + url,
      contentType: "application/x-www-form-urlencoded",
      dataType: 'json',
      success: success,
      error: error
    })
  };

  /**
   * 新的接口post请求
   * @param url
   * @param data
   * @param success
   * @param error
   */
  Tools.prototype.postJson = function (url, data, success, error) {
    $.ajax({
      type: 'post',
      data: data,
      url: this.apiHost + url,
      contentType: "application/x-www-form-urlencoded",
      dataType: "json",
      success: success,
      error: error
    })
  };

  Tools.prototype.getStorage = function (data) {
    return JSON.parse(localStorage.getItem(data));
  };
  Tools.prototype.setStorage = function (item, data) {
    localStorage.setItem(item,JSON.stringify(data));
  };
  module.exports = new Tools();
});
