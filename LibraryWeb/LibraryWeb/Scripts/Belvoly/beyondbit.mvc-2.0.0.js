/*!
 * Beyondbit Front-end Framework v2.0.0
 changeset 826 *
 * http://bsdn.beyondbit.com
 *
 * Copyright (c) 2015 xakoy
 * Released under the  license
 */
(function ($) {

    /**
     * 相关 Web 界面的类集合
     * @module Beyondbit.Mvc
     * @submodule Mvc
     */
    var mvc = B.registerNameSpace("Mvc");

    $.extend($.fn, {
        dropDownVir: function () {
            if (!this.length) {
                return null;
            }
            var dropdownvir = $.data(this[0], 'dropdownvir');
            if (dropdownvir) {
                return dropdownvir;
            }
            dropdownvir = new Beyondbit.Mvc.Controls.DropDownVir(this.eq(0));
            $.data(this[0], 'dropdownvir', dropdownvir);

            return dropdownvir;
        },
        initMvcForm: function (jsondata) {
            var $from = this;
            if ($from.length == 0) {
                return false;
            }
            var fromJson = jsondata;
            for (var item in fromJson) {
                var hElements = $from.find("[name=" + item + "]");
                if (hElements.length == 0) {
                    continue;
                }

                var hElement = hElements.eq(0);
                if (hElement.is("div")) {
                    if (hElement.attr("dropdownvir")) {
                        hElement.dropDownVir().val(fromJson[item], true);
                    }

                }
                else if (hElement.is(":radio")) {
                    hElements.filter("[value=" + fromJson[item] + "]").attr("checked", "checked");
                }
                else if (hElement.is(":checkbox")) {
                    hElements.filter("[value=" + fromJson[item] + "]").attr("checked", "true");
                }
                else if (hElement.is(":hidden")) {
                    if (hElement.attr("dropdownvir")) {
                        continue;
                    }
                }
                else if (hElement.is("select") || hElement.is("textarea") || hElement.is(":text")) {
                    hElements.val(fromJson[item]);
                }
            }
            return $from;
        }
    });

    Beyondbit.register("Mvc.Controls", function () {
        return {
            DropDownVir: function (sender) {
                var targetElement = sender;
                var loader = this;
                var onChangeProxy = null;

                targetElement.addClass("dropdownvir").click(function (event) {
                    var element = $(event.target);
                    if ($.browser.msie && $.browser.version == "6.0") {
                        element.addClass("selected").siblings(".selected").removeClass("selected").end().siblings("input").val(element.attr("value"));
                    } else {
                        element.attr("selected", "selected").siblings("[selected]").removeAttr("selected").end().siblings("input").val(element.attr("value"));
                    }
                    if (onChangeProxy) {
                        onChangeProxy.apply(loader);
                    }
                });
                
                this.change = function (callback) {
                    onChangeProxy = callback;
                };

                this.val = function (value, isdefault) {
                    var tInputValue = $("input[dropdownvir]", targetElement);
                    if (!value && value != false) {
                        return tInputValue.val();
                    } else {
                        tInputValue.val(value).siblings("a[value=" + value + "]").trigger("click");
                        if (isdefault == true) {
                            tInputValue.attr("data-ctl-defalutvalue", value);
                        }
                    }
                    return loader;
                };

                this.reset = function () {
                    var tInputValue = $("input[dropdownvir]", targetElement);
                    var tempValue = tInputValue.attr("data-ctl-defalutvalue") || "";
                    loader.val(tempValue);
                    return loader;
                };

            }
        };
    });

    Beyondbit.register("Mvc.Form", function () {
        return {
            initFrom: function (formId, jsondata) {
                var $from = $("#" + formId);
                if ($from.length == 0) {
                    return false;
                }
                $from.initMvcForm(jsondata);
                return $from;
            }
        };
    });

})(jQuery);



(function ($, B) {

    /**
     * 相关 Web 界面的类集合
     * @module Beyondbit.Mvc
     * @submodule Mvc
     */
    var mvc = B.registerNameSpace("Mvc");


    /**
      * 行为对象
      * @class Behavior
      * @constructor
      * @param {String} [behaviorCode] 行业代号,不填，则绑定所有行为
      * @param {jQuery|HTMLElement} [content=body] 查找搜索框的上下文范围
      * 
      */
    mvc.Behavior = Behavior;

    function Behavior(behaviorCode, content) {
        var self = this;
        var behaviorControls = [];
        setControls(getBehaviorControls(behaviorCode, content));

        this.code = behaviorCode;

        function getControls(isDel) {
            if (isDel && isLastBroken && behaviorControls.length > 1) {
                behaviorControls.pop();
            }
            return behaviorControls[behaviorControls.length - 1];
        }

        function setControls(controls) {
            behaviorControls.push(controls);
        }

        /**
         * 过滤控件
         * @method filter
         * @param {String} code 行为代号
         * @chainable
         */
        this.filter = function (code) {
            setControls(getControls().filter("[belvoly-behavior={0}]".bformat(behaviorCode)));
            return this;
        }

        /**
         * 绑定行为
         * @method bind
         * @chainable
         */
        this.bind = function () {
            var controls = getControls().filter(function () {
                var isBehavior = $(this).attr("belvoly-isbehavior");
                return isBehavior == "true" || !isBehavior; 
            });
            behaviorsBind(controls);
            return this;
        }

        /**
         * 返回上一个破坏操作前的动作
         * @method end
         * @chainable
         */
        this.end = function () {
            getControls(true);
            return this;
        }

        function behaviorsBind(controls) {
            controls.each(function () {
                var control = $(this);
                behaviorBind(control, control.attr("belvoly-behavior"));
            })
        }

        function behaviorBind(controls, code) {
            var delegate = null;
            switch (code) {
                case "back":
                    delegate = behaviorBack;
                    break;
                case "close":
                    delegate = behaviorClose;
                    break;
                case "close-window":
                    delegate = behaviorCloseWindow;
                    break;
                case "search-crumb":
                    delegate = behaviorSearchCrumb;
                    break;
                case "delete-item":
                    delegate = behaviorDeleteItem;
                    break;
                default:
            }

            if (delegate) {
                delegate(controls);
            }
        }
    }

    // 获取行为控件
    function getBehaviorControls(behaviorCode, content) {
        if (behaviorCode) {
            return $behaviors = $("[belvoly-behavior={0}]".bformat(behaviorCode), content);
        }
        return $("[belvoly-behavior]", content);
    }

    // == 各种形为绑定

    // 回退
    function behaviorBack(controls) {
        controls.click(function () {
            return B.Url.back();
        });
        controls.attr("belvoly-isbehavior", "true");
    }

    // 关闭
    function behaviorClose(controls) {
        controls.click(function () {
            if (B.IsMobile == true || window.top != window) {
                B.Url.back();
                return;
            }

            window.opener = null;
            window.open('', '_self');
            window.close();

            return B.Url.back();
        });
        controls.attr("belvoly-isbehavior", "true");
    }

    // 关闭窗口
    function behaviorCloseWindow(controls) {
        controls.click(function () {
            var dialog = B.Web.WindowManager.get();
            if (dialog) {
                dialog.close();
            }
        });
        controls.attr("belvoly-isbehavior", "true");
    }

    // 删除一个项目
    function behaviorDeleteItem(controls) {
        controls.click(function () {
            var commonRegional = B.CultureInfo.Current.getCommonRegional();

            var $this = $(this);
            var title = $this.attr("belvoly-behavior-title") || $this.attr("title");
            var onExecuted = $this.attr("belvoly-behavior-onexecuted");
            var type = $this.attr("belvoly-behavior-ajaxtype") || "POST";
            var dataType = $this.attr("belvoly-behavior-ajaxdatatype");
            var isConfirm = $this.attr("belvoly-behavior-isconfirm") || "true";
            if (isConfirm === "true") {
                B.Web.MessageBox.confirm(commonRegional.prompt, commonRegional.confirmToDoSomeThing.bformat(commonRegional.del), function (result) {
                    if (result == true) {
                        deleteAction();
                    }
                })
            }
            else {
                deleteAction();
            }

            function deleteAction() {
                B.ajax({
                    type: type,
                    cache: false,
                    message: {
                        title: title,
                        actionName: commonRegional.del
                    },
                    dataType: dataType,
                    url: $this.attr("href"),
                    data: {},
                    success: function (result) {
                        if (onExecuted && window[onExecuted]) {
                            return window[onExecuted].call($this);
                        } else {
                            $this.parent().parent().remove();
                            return true;
                        }
                    }
                });
            }
            
            return false;
        });
        controls.attr("belvoly-isbehavior", "true");
    }

    // 搜索面包屑
    function behaviorSearchCrumb(controls) {
        controls.each(function () {
            var $search = $(this);
            var targetSelector = $search.attr("belvoly-behavior-target");
            if (!targetSelector) {
                return;
            }
            var $target = $($search.attr("belvoly-behavior-target"));
            if ($target) {
                var $searchCrumbSwitch = $(":hidden[name='search-crumb-switch']", $target).eq(0);
                $(".curb-expand", $search).click(function () {
                    var $curb = $(this);
                    $curb.addClass("hide");
                    $(".curb-compress", $search).removeClass("hide");
                    $target.removeClass("hide").slideDown(1000, function () { });
                    $searchCrumbSwitch.val("1");
                });

                $(".curb-compress", $search).click(function () {
                    var $curb = $(this);
                    $curb.addClass("hide");
                    $(".curb-expand", $search).removeClass("hide");

                    $target.slideUp(1000);
                    $searchCrumbSwitch.val("0");
                });

                if ($searchCrumbSwitch.val() == "1") {
                    $target.show();
                    $(".curb-expand", $search).trigger("click");
                }
            }
            $search.data("belvoly-isbinded", true);
        });
        controls.attr("belvoly-isbehavior", "true");
    }




    $(function () {
        // 页面初始化绑定所有行为控件
        new B.Mvc.Behavior().bind();
    });

})(jQuery, Beyondbit);






(function ($, B) {

	/**
     * 相关 Web 界面的类集合
     * @module Beyondbit.Mvc
     * @submodule Mvc
     */
	var mvc = B.registerNameSpace("Mvc");


	/**
      * 页面类操作集合
      * @class Page
      * 
      */

	var page = B.registerNameSpace("Mvc.Page");

	/**
      * 绑定行为控件的事件
      * @method bindBehavior
      * @param {String} [behaviorCode] 行业代号,不填，则绑定所有行为
      * @param {jQuery|HTMLElement} [content=body] 查找搜索框的上下文范围
      * @example
      *
      *    B.Mvc.Page.bindBehavior();
      *    
      */
	page.bindBehavior = function (behaviorCode, content) {
		var behavior = new Behavior(behaviorCode, content);
		behavior.bind();
	}


})(jQuery, Beyondbit);

