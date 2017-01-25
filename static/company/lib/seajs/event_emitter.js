/**
 * @description seajs事件通知系统
 * @author 吴亚
 * @createTime 2016/9/14
 *
 * $on: 注册监听事件，参数name（事件名称），cb（监听的回调函数）
 * $emit: 发送事件，参数name（事件名称），data（发送的数据）
 */
define(function (require, exports, module) {
    function EventEmitter() {
        var self = this;
        if (!self.hasOwnProperty('events')) {
            Object.defineProperty(self, 'events', {
                value: {},
                writable: false
            });
        }
        if (!self.hasOwnProperty('$on')) {
            Object.defineProperty(self, '$on', {
                value: function (name, cb) {
                    if (typeof name == 'string' && typeof cb == 'function') {
                        if (!self.events.hasOwnProperty(name)) {
                            Object.defineProperty(self.events, name, {
                                value: [],
                                writable: false
                            });
                        }
                        if (self.events[name].indexOf(cb) < 0) {
                            self.events[name].push(cb);
                        }
                    }
                },
                writable: false
            });
        }
        if (!self.hasOwnProperty('$emit')) {
            Object.defineProperty(self, '$emit', {
                value: function (name, data) {
                    if (typeof name == 'string' && self.events.hasOwnProperty(name)) {
                        self.events[name].forEach(function (func) {
                            if (typeof func == 'function') {
                                func(data);
                            }
                        });
                    }
                },
                writable: false
            });
        }
        if (!self.hasOwnProperty('$off')) {
            Object.defineProperty(self, '$off', {
                value: function (name, callback) {
                    if (!(name || callback)) {
                        Object.defineProperty(self, 'events', {
                            value: {},
                            writable: false
                        });
                    }
                    var list = events[name];
                    if (list) {
                        if (callback) {
                            for (var i = list.length - 1; i >= 0; i--) {
                                if (list[i] === callback) {
                                    list.splice(i, 1)
                                }
                            }
                        }
                        else {
                            delete events[name]
                        }
                    }
                },
                writable: false
            });
        }

    }
    module.exports = new EventEmitter();
});
