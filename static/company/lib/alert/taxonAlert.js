/**
 * Created by ccy on 2016/10/13.
 */
(function () {
    function Widget() {
        this.boundingBox = null;
        this.loadingAnimate = null;
        /* var viewHeight = $(window).height();
         var h = viewHeight - 60 + "px";
         $(".window_mask").css('height', h);*/
    }

    Widget.prototype = {
        on: function (type, handler) {
            if (typeof this.handlers[type] === 'undefined') {
                this.handlers[type] = [];
            }
            this.handlers[type].push(handler);
            return this;
        },
        fire: function (type, data) {
            if (this.handlers[type] instanceof Array) {
                var handlers = this.handlers[type];
                for (var i = 0, len = handlers.length; i < len; i++) {
                    handlers[i](data);
                }
            }
        },
        off:function (type) {
            if(this.handlers[type]){
                delete this.handlers[type];
            }
        },

        render: function (container) {
            this.renderUI();
            this.handlers = {};
            this.bindUI();
            this.syncUI();
            $(container || document.body).append(this.boundingBox);
        },

        destroy: function () {
            this.destructor();
            this.boundingBox.off();
            this.boundingBox.remove();
            $('.window_boundingBox').remove();
            $('.window_mask').remove();
        },

        renderUI: function () {
        },

        bindUI: function () {
        },

        syncUI: function () {
        },

        destructor: function () {
        }
    }
    function Window() {
        this.cfg = {
            width: 530,
            height: 240,
            title: '系统消息',
            content: '',
            hasCloseBtn: true,
            hasMask: true,
            isDraggable: true,
            dragHandle: null,
            skinClassName: null,
            text4AlertBtn: '确定',
            text4ConfirmBtn: '确定',
            text4CancelBtn: '取消',
            text4PromptBtn: '确定',
            isPromptInputPassword: false,
            defaultValue4PromptInput: '',
            maxlength4PromptInput: 10,
            handler4PromptBtn: null,
            handler4AlertBtn: null,
            handler4CloseBtn: null,
            handler4ConfirmBtn: null,
            handler4CancelBtn: null

        };
    }

    Window.prototype = $.extend({}, new Widget(), {

        renderUI: function () {
            var footerContent = '';
            switch (this.cfg.winType) {
                case 'alert':
                    footerContent = '<input type="button" value="' + this.cfg.text4AlertBtn + '" class="window_alertBtn">';
                    break;
                case 'confirm':
                    footerContent = '<input type="button" value="' + this.cfg.text4ConfirmBtn + '" class="window_confirmBtn">' +
                        '<input type="button" value="' + this.cfg.text4CancelBtn + '" class="window_cancelBtn">';
                    break;
                case 'prompt':
                    this.cfg.content += '<p class="window_promptInputWrapper"><input type="' + (this.cfg.isPromptInputPassword ? "password" : "text") + '" value="' + this.cfg.defaultValue4PromptInput + '" maxlength="' + this.cfg.maxlength4PromptInput + '" class="window_promptInput"></p>';
                    footerContent = '<input type="button" value="' + this.cfg.text4PromptBtn + '" class="window_promptBtn"><input type="button" value="' + this.cfg.text4CancelBtn + '"  class="window_cancelBtn">';
                    break;
            }

            this.boundingBox = $(
                '<div class="window_boundingBox">' +
                '<div class="window_body">' + this.cfg.content + '</div>' +
                '</div>'
            );

            if (this.cfg.winType !== 'common') {
                this.boundingBox.prepend('<div class="window_header">' + this.cfg.title + '</div>');
                this.boundingBox.append('<div class="window_footer">' + footerContent + '</div>');
            }

            this._promptInput = this.boundingBox.find('.window_promptInput');

            if (this.cfg.hasMask) {
                this._mask = $('<div class="window_mask"></div>');
                //this._mask.css("height",window.innerHeight+document.body.scrollHeight);//设置屏幕高度（视窗高度+对象滚动高度）
                this._mask.css("height", document.body.scrollHeight);//设置屏幕高度（对象滚动高度）
                if ($('body').find('.window_mask').length===0){
                    this._mask.appendTo('body');
                }
            }
            if (this.cfg.hasCloseBtn) {
                var closeBtn = $('<span class="window_closeBtn">×</span>');
                this.boundingBox.append(closeBtn);
            }
            this.boundingBox.appendTo(document.body);
        },

        bindUI: function () {
            var that = this;

            if (this.cfg.handler4AlertBtn) {
                this.on('alert', this.cfg.handler4AlertBtn);
            }

            if (this.cfg.handler4CloseBtn) {
                this.on('close', this.cfg.handler4CloseBtn);
            }

            if (this.cfg.handler4PromptBtn) {
                this.on('prompt', this.cfg.handler4PromptBtn);
            }
            this.boundingBox.undelegate('.window_alertBtn', 'click').delegate('.window_alertBtn', 'click', function () {
                that.fire('alert');
                that.destroy();
            }).undelegate('.window_closeBtn', 'click').delegate('.window_closeBtn', 'click', function () {
                that.fire('close');
                that.destroy();
            }).undelegate('.window_confirmBtn', 'click').delegate('.window_confirmBtn', 'click', function () {
                that.fire('confirm');
                that.destroy();
            }).undelegate('.window_cancelBtn', 'click').delegate('.window_cancelBtn', 'click', function () {
                that.fire('cancel');
                that.destroy();
            }).undelegate('.window_promptBtn', 'click').delegate('.window_promptBtn', 'click', function () {
                that.fire('prompt', that._promptInput.val());
                that.destroy();
            });

        },

        syncUI: function () {
            this.boundingBox.css({
                width: this.cfg.width + 'px',
                height: this.cfg.height + 'px',
                left: (this.cfg.x || (window.innerWidth - this.cfg.width) / 2) + 'px',
                top: (this.cfg.y || (window.innerHeight - this.cfg.height) / 2) + 'px'
            });
            if (this.cfg.skinClassName) {
                this.boundingBox.addClass(this.cfg.skinClassName);
            }
        },

        destructor: function () {
            this._mask && this._mask.remove();
        },

        alert: function (cfg) {
            if (typeof cfg == "string") {
                $.extend(this.cfg, {
                    content: cfg,
                    hasCloseBtn: true,
                    hasMask: true
                }, {winType: 'alert'});
            } else {
                $.extend(this.cfg, cfg, {winType: 'alert'});
            }
            this.render();
            return this;
        },

        confirm: function (cfg) {
            if (typeof cfg == "string") {
                $.extend(this.cfg,
                    {
                        content: cfg,
                        hasCloseBtn: true,
                        hasMask: true
                    },
                    {winType: 'confirm'});
            } else {
                $.extend(this.cfg, cfg, {winType: 'confirm'});
            }
            this.render();
            return this;
        },

        prompt: function (cfg) {
            $.extend(this.cfg, cfg, {winType: 'prompt'});
            this.render();
            this._promptInput.focus();
            return this;
        },

        common: function (cfg) {
            $.extend(this.cfg, cfg, {winType: 'common'});
            this.render();
            return this;
        },
        loading:function (dom) {
            this.loadingAnimate = $('<div class="sk-fading-circle">\
                <div class="sk-circle1 sk-circle"></div>\
                <div class="sk-circle2 sk-circle"></div>\
                <div class="sk-circle3 sk-circle"></div>\
                <div class="sk-circle4 sk-circle"></div>\
                <div class="sk-circle5 sk-circle"></div>\
                <div class="sk-circle6 sk-circle"></div>\
                <div class="sk-circle7 sk-circle"></div>\
                <div class="sk-circle8 sk-circle"></div>\
                <div class="sk-circle9 sk-circle"></div>\
                <div class="sk-circle10 sk-circle"></div>\
                <div class="sk-circle11 sk-circle"></div>\
                <div class="sk-circle12 sk-circle"></div>\
                </div>');
            $(dom).find('div,ul').hide();
            $(dom).append(this.loadingAnimate);
            this.loadingAnimate.css({
                'margin-left':$(dom).width()*0.5+'px',
                'margin-top':$(dom).height()*0.5+'px'
            })
        },
        loaded:function (dom) {
            this.loadingAnimate && this.loadingAnimate.remove();
            $(dom).find('div,ul').show();
        },
        parseQuery : function(query){
            query = query.split('?')[1];
            var reg = /([^=&\s]+)[=\s]*([^=&\s]*)/g;
            var obj = {};
            while(reg.exec(query)){
                obj[RegExp.$1] = RegExp.$2;
            }
            return obj;
        }
    });
    var taxon = new Window();
    "function" === typeof define ? define(function() {
        return taxon;
    }) : "undefined" != typeof exports ? module.exports = taxon : window.taxon = taxon;
})();
