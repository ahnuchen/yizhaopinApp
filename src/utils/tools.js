/**
 * Created by chenchangyu on 2017/1/22.
 */
export default {
  setStorage (_id, _json) {
    if (typeof _json === 'string') {
      window.localStorage.setItem(_id, _json)
    } else if (typeof _json === 'object') {
      window.localStorage.setItem(_id, JSON.stringify(_json))
    }
  },
  /**
   * @return string || json
   * @param _id
   */
  getStorage (_id) {
    try {
      return JSON.parse(window.localStorage.getItem(_id))
    } catch (e) {
      return window.localStorage.getItem(_id)
    }
  },
  /**
   * @return formatedDateString
   * @param _date 时间对象
   * @param _fmt 格式
   */
  formatDate (_date, _fmt) {
    let o = {
      'M+': _date.getMonth() + 1, // 月份
      'd+': _date.getDate(), // 日
      'h+': _date.getHours(), // 小时
      'm+': _date.getMinutes(), // 分
      's+': _date.getSeconds(), // 秒
      'q+': Math.floor((_date.getMonth() + 3) / 3), // 季度
      'S': _date.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(_fmt)) _fmt = _fmt.replace(RegExp.$1, (_date.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(_fmt)) _fmt = _fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
    return _fmt
  },
  go (url, $router) {
    if (/^javas/.test(url) || !url) return
    const useRouter = typeof url === 'object' || ($router && typeof url === 'string' && !/http/.test(url))
    if (useRouter) {
      $router.push(url)
    } else {
      window.location.href = url
    }
  },
  getUrl (url, $router) {
    // Make sure the href is right in hash mode
    if ($router && !$router._history && typeof url === 'string' && !/http/.test(url)) {
      return `#!${url}`
    }
    return url && typeof url !== 'object' ? url : 'javascript:void(0);'
  },
  imageHost: 'http://127.0.0.1:8080',
  apiHost: 'http://127.0.0.1:8080/api/user'
}
