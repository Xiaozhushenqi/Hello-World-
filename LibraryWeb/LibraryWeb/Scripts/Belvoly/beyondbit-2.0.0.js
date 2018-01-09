/*!
 * Beyondbit Front-end Framework v2.0.0
 changeset 826 *
 * http://bsdn.beyondbit.com
 *
 * Copyright (c) 2015 xakoy
 * Released under the  license
 */
/**
 * This is module Beyondbit
 * @module Beyondbit
 * @main Beyondbit
 * @class Beyondbit
 * @static
 * @example
 *
 *     // Beyondbit 命名空间<br />
 *     var b = Beyondbit;
 *
 */
var Beyondbit = (function () {
    var that = {};

    /**
      * 注册命名空间到Beyondbit命令空间下，可注册多层
      * @method registerNameSpace
      * @static
      * @param  {string} nameSpace 命名空间字符串，多层使用.隔开
      * @return {object} 返回创建的命令空间对象
      * @example
      *
      *     var web = Beyondbit.registerNameSpace("Web");
      *     var window = Beyondbit.registerNameSpace("Web.Window");
      *    
      */
    that.registerNameSpace = function (nameSpace) {
        var result = that;
        var path = nameSpace.split(".");
        var length = path.length;
        for (var i = 0; i < length; i++) {
            var name = path[i];
            if (result[name] === undefined) {
                result[name] = {};
            }
            result = result[name];
        }
        return result;
    };


    /**
    * 注册一个命名空间对象至Beyondbit中
    * @method register
    * @static
    * @param {String} nameSpace 命名空间字符串，多层使用.隔开
    * @param {function} maker 一个方法委托，执行后，返回一个Json对象 () => {};
    * @example 
    * 
    *     // 注册
    *     Beyondbit.register("Web",function(){
    *        return {
    *           alert:function(){
    *               alert(1);
    *           }
    *        }
    *     });
    * 
    *     // 调用
    *     Beyondbit.Web.alert();
    */
    that.register = function (nameSpace, maker) {
        var path = nameSpace.split(".");
        var curr = that;
        for (var i = 0, len = path.length; i < len; i += 1) {
            if (i == len - 1) {
                if (curr[path[i]] !== undefined) {
                    curr[path[i]] = $.extend({}, curr[path[i]], maker(that));
                    return true;
                }
                curr[path[i]] = maker(that);
                return true;
            }
            if (curr[path[i]] === undefined) {
                curr[path[i]] = {};
            }
            curr = curr[path[i]];
        }
    };

    that.regShort = function (ns, maker) {
        if (that[ns] !== undefined) throw "[" + ns + "] : short : 已经注册";
        that[ns] = maker;
    };

    /**
    * 检测对象是否存在
    * @method isObjectExists
    * @static
    * @param {String} objectString 对象的string字符串
    * @example 
    * 
    *     Beyondbit.isObjectExists("Beyondbit.Portal.toLocationMenu")
    */
    that.isObjectExists = function (objectString) {
        try {
            eval("var tempObjetExists = " + objectString);
            return true;
        } catch (e) { }
        return false;
    };

    /* 代号 */
    that.DESIGNATION = "belvoly";

    var _identity = 1;

   /**
     * 获取自增长标识字段
     * @method getIdentity
     * @returns {Number}
     * 
     */
    that.getIdentity = function () {
        return _identity++;
    };

    return that;
})();

var B = window.B = Beyondbit;
(function ($) {
    /**
      * 扩展类集合
      * @module Extensions
      */

    /**
     * Array扩展
     * @class ArrayEx
     */

    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (object) {
            var index = -1;
            $.each(this, function (i, value) {
                if (value === object) {
                    index = i;
                    return false;
                }
            });
            return index;
        }
    }

    /**
      * 查找数组中的元素的位置
      * @method indexFun
      * @param {Fun} existsFun 验证当前元素是否符合查询规则
      * @example
      *
      *     var array = [
      *         {id:1, name:"luolong" },
      *         {id:2, name:"chujun" },
      *     ];
      *     var index = array.indexFun(function(item){
      *         return item.id == 1;
      *     });
      *     log(index);    
      * 
      *    
      */

    Array.prototype.indexFun = function (existsFun) {
        var index = -1;
        $.each(this, function (i, value) {
            var result = existsFun(value);
            if (result == true) {
                index = i;
                return false;
            }
        });
        return index;
    }
})(jQuery);
(function ($, B) {
    /**
     * This is module Beyondbit
     * @module Beyondbit
     * @main Beyondbit
     * @class Beyondbit
     *
     */

    var ajax = B.registerNameSpace("jQueryEx.Ajax");

    ajax.regional = [];

    ajax.regional[""] = ajax.regional["zh-CN"] = {
        message: {
            title: "系统提示",
            actionName: "操作"
        },
        close: "关闭",
        ok: "确定",
        success: "{0} 成功！",
        loading: "正在{0}中..."
    }

    function getRegional() {
        return ajax.regional[B.CultureInfo.Current.get()];
    }


    /**
      * 包装jQuery.post 方法
      * @method post
      * @param {String} url 参考jQuery文档
      * @param {Json|String} data 参考jQuery文档
      * @param {Fun} callback 参考jQuery文档
      * @param {String} [dataType]
      * @example
      *
      *     B.post("/Homt/Delete/1",{},function(result){
      *         alert(result.Flag);
      *     });
      *    
      */
    B.post = function (url, data, success, dataType) {
        return B.ajax({
            type: "POST",
            url: url,
            data: data,
            success: success,
            dataType: dataType
        });
    }

    /**
      * 包装jQuery.ajax 方法，增加自动Loading和错误效果。
      * @method ajax
      * @param {Json} options 参考jQuery文档
      * @param {String} options.message Ajax时提示对象
      * @param {String} options.message.title Loading和Alert时的标题
      * @param {String} options.message.actionName Loading和Alert时的操作的动作名称，用作提示用
      * @param {Fun} options.success 回调函数,返回Boolean值，返回为True,则提示操作成功提示，其它则无动作.success(result)
      * @param {Fun} options.success.result 回调函数的数据结果，此值和JsonResultMessage对应，即拥有Flag,Message,Data属性。
      * @returns JQR
      * @example
      *
      *      B.ajax({
      *          url: "/Homt/Delete/1",
      *          data: {},
      *          success: function(result){
      *              alert(result.Flag);
      *              return true;
      *          }
      *      });
      *    
      */
    B.ajax = function (options) {

        var message = $.extend(true, getRegional().message, options.message);

        var title = message.title;
        var regulate = options.regulate;

        var beforeSendHandler = options.beforeSend;
        if (beforeSendHandler) {
            options.beforeSend = function (XMLHttpRequest) {
                var flag = beforeSendHandler();
                if (flag == false) {
                    B.Web.MessageBox.loading(false);
                }
                return flag;
            }
        }


        var successHandler = options.success;
        options.success = function (result) {
            B.Web.MessageBox.loading(false);
            if (result.Flag == 0) {
                B.Web.MessageBox.alert(title, result.Message, getRegional().close, "ERROR");
                if (regulate != null)
                {
                    regulate.disabled(false).show();
                }
            } else {
                var flag = successHandler(result);
                if (flag == true) {
                    B.Web.MessageBox.alert(title, getRegional().success.bformat(message.actionName), getRegional().ok, "SUCCESS");
                }
            }
        };

        B.Web.MessageBox.loading(title,getRegional().loading.bformat(message.actionName));
        return $.ajax(options);
    }

})(jQuery, Beyondbit);
(function ($, B) {

    B.regional = [];

    B.regional[""] = B.regional["zh-CN"] = {
        prompt: "提示",
        del: "删除",
        data: "数据",
        someThingSaving: "{0}保存中..",
        confirmToDoSomeThing: "确定要{0}吗？"
    }

    var culture = B.registerNameSpace("CultureInfo");

    culture.Current = new function () {
        var _name = "zh-CN";

       /**
         * 获取当前的语言文化名称
         * @method get
         */
        this.get = function () {
            return _name;
        }

       /**
         * 设置当前的语言文化
         * @method set
         * @param {String} name 语言文化名称
         */
        this.set = function (name) {
            _name = name;
        };

       /**
         * 获取公共的本地资源
         * @method getCommonRegional
         */
        this.getCommonRegional = function () {
            return this.getRegional(B.regional);
        }

        /**
         * 获取当前本地化资源
         * @method getRegional
         * @param {json} regional 所有的语言资源
         */
        this.getRegional = function (regional) {
            return regional[this.get()] || regional[""];
        }
    }

   

})(jQuery, Beyondbit);
(function ($, B) {

    // 选中模式
    var g_SelectMode = {
        // 单选
        SINGLE: "single",
        // 多选
        MULTIPE: "multiple"
    };

    /**
      * 对象选择器命名空间
      * @module Beyondbit.OPicker
	  * @submodule OPicker
      *    
      */
    var opicker = B.registerNameSpace("OPicker");

    opicker.regional = [];

    opicker.regional[""] = opicker.regional["zh-CN"] = {
        service: {
            notAllowRegisterCodeEmpty: "注册Code不能为空",
            repeatRegistered: "重复注册服务标识:{0}",
            useNotRegisteredCode: "使用无注册服务标识:{0}"
        },
        title: "对象选择器",
        notSetObjectCode: "没有填写选择对象Codes",
        defaultNamesLengthNotEqualValuesLength: "默认值的name和value的长度不一致!",
        buttons: {
            ok: "确定",
            clear: "清除",
            cancel: "取消"
        },
        search: {
            title: "搜索",
            placeholder: "输入关键字检索"
        },
        select: {
            selected: "已选择",
            up: "向上",
            down: "向下"
        }
    }

    function getRegional() {
        return opicker.regional[B.CultureInfo.Current.get()];
    }

    /**
     * @class Opicker
     * 
     */

   /**
     * 选择
     * @method select
     * @param {json} options 选项请参考属性值
     * @static
     * @example
     *     
     *     <html>
     *          <div>
     *               <button class="btn" type="button" id="btnSelectUser">
     *                   <i class="fa fa-male"></i>
     *                   选择用户
     *               </button>
     *
     *               <input type="text" name="name" value="" id="txtName" />
     *               <input type="text" name="name" value="" id="txtValue" />
     *           </div>
     *
     *
     *           <div>
     *               <button class="btn" type="button" id="btnSelectUser2">
     *                   <i class="fa fa-male"></i>
     *                   选择用户2
     *               </button>
     *
     *               <input type="text" name="name" value="" id="txtName2" />
     *               <input type="text" name="name" value="" id="txtValue2" />
     *           </div>
     *     </html>
     * 
     *     <script>
     *          $(function () {
     *               $("#btnSelectUser2").click(function () {
     *                   B.OPicker.select({
     *                       title: "<i class='fa fa-male'></i> 选择用户",
     *                       objectCodes: ["orguser"],
     *                       associatedNameControl: $("#txtName2"),
     *                       associatedValueControl: $("#txtValue2")
     *                   });
     *               });
     *
     *
     *               $("#btnSelectUser").click(function () {
     *                   B.OPicker.select({
     *                       title: "<i class='fa fa-male'></i> 选择用户",
     *                       objectCodes: ["orguser", "roleuser"],
     *                       defaultValue: {
     *                           name: $("#txtName").val(),
     *                           value: $("#txtValue").val()
     *                       },
     *                       onSelectedValue: function (data) {
     *                           $("#txtName").val(data.name);
     *                           $("#txtValue").val(data.value);
     *                       }
     *                   });
     *               });
     *           })
     *     </script>
     */
    opicker.select = function (options) {
        new OPicker(options);
    };


    // #region 服务

    // 保存所有注册的services
    var _services = {};

    /**
      * 注册服务
      * @method registerService
      * @static
      * @param {String} code 服务标识，不能注册重复标识，重复抛异常
      * @param {String} name 显示名称
      * @param {String} serviceUrl 服务地址
      * @param {Fun} [dataFilter ] 调用成功后，过滤数据
      * @example
      *
      *    B.OPicker.registerService("user", http://service.beyondbit.com/user/get");
      *    
      */

    opicker.registerService = function (code, title, serviceUrl, dataFilter) {
        var serviceCode = code;
        if (!arguments[0]) {
            throw Error(getRegional().service.notAllowRegisterCodeEmpty);
        }
        var service;
        var firstArgumentType = $.type(arguments[0]);
        if (firstArgumentType === "string") {
            service = {
                code: serviceCode,
                title: title,
                url: serviceUrl
            };
        } else if ($.isFunction(arguments[0])) {
            //TODO: 延迟加载注册功能
        }
        else{    
            service = arguments[0];
            serviceCode = service.code;
        }

        if (_services[serviceCode]) {
            throw Error(getRegional().service.repeatRegistered.bformat(serviceCode));
        }
        
        
        _services[serviceCode] = $.extend(true, {},
            {
                /*
                 * 数据过滤事件
                 * @event dataFilter 
                 * @param {object} 过滤的数据项
                 */
                dataFilter: function (item) {
                    return item;
                },
                /*
                 * 获取静态数据数据源
                 * @event getStaticDataSource
                 */
                getStaticDataSource: function () { return null; },
                getSearchUrl: function (config) {
                    if (this.searchUrl) {
                        return this.getUrl(config, this.searchUrl);
                    }
                },
                /*
                 * 获取服务Url事件
                 * @event getUrl
                 * @param {json} config
                 * @param {string} url[default=this.url] 要包装的Url默认为当前url属性
                 */
                getUrl: function (config, url) {
                    return url || this.url;
                },
                /*
                 * 是否显示图标
                 * @event showIcon
                 * @param {object} 数据项
                 */
                showIcon: function (item) {
                    return true;
                }
            },
            service
         );
    };

    /**
      * 获取一个服务
      * @static
      * @private
      * @method getService
      * @param {String} code 服务标识，标识未注册抛异常
      * @example
      *
      *    B.OPicker.getService("user");
      *    
      */

    opicker.getService = function (code) {
        var service = _services[code];
        if (!service) {
            throw Error(getRegional().service.useNotRegisteredCode.bformat(code));
        }
        return service;
    }

    // #endregion

    function OPicker(options) {
        options = $.extend(true, {
            id: "opicker",
            /**
              * 选择器标题
              * @property title
              * @type String
              * @default "对象选择器"
              */
            title: getRegional().title,
            /**
              * 宽度
              * @property width
              * @type Number
              * @default 600
              */
            width: 600,
            /**
              * 高度
              * @property height
              * @type Number
              * @default 500
              */
            height: 500,
            /**
             * 选择对象Code集合, 目前只注册orguser,roleuser
             * @property objectCodes
             * @type Array(String)
             * @default [];
             * @requires
             */
            objectCodes: [],

            objects: [],
            /**
              * 多选值的分隔符
              * @property splitChar
              * @type {String}
              * @default ","
              */
            splitChar: ",",
            /**
              * 选择模式，单选还是多选. 0为多选, 1为单选
              * @property selectMode
              * @type Number
              * @default 0
              */
            selectMode: 0,
            /**
             * 默认值 .格式{name:"dd,dd1", value:"22,33"};
             * @property defaultValue 
             * @type {json}
             */
            defaultValue: null,
            /**
             * 联动名称控件,提供默认选中文本和选中完成后放置文本的控件
             * @property associatedNameControl
             * @type jQuery
             */
            associatedNameControl: null,
            /**
             * 联动值控件，提供默认选中值和选中完成后放置值的控件
             * @property associatedValueControl
             * @type jQuery
             */
            associatedValueControl: null,
            /**
              * 选择完成事件
              * @event onSelectedValue
              * @param {Array[json]} datas 返回选择的数据对象
              * @param {Json}   datas.data 单一数据对象
              * @param {String} datas.data.name 名称
              * @param {String} datas.data.value 值
              */
            onSelectedValue: null
        }, options);
        options.objects = options.objects || [];
        var objects = options.objects;
        if (options.objectCodes) {
            $.each(options.objectCodes, function (i, code) {
                objects.push({ code: code });
            });
        }

        if (objects.length == 0) {
            throw new Error(getRegional().notSetObjectCode);
        }

        


        var that = this;
        var inner = {
            self: this,
            options: options
        };
        
        inner.names = [];
        inner.values = [];
        
        var defaultName, defaultValue;
        if (options.defaultValue) {
            defaultName = options.defaultValue.name,
            defaultValue = options.defaultValue.value
        }
        else{
            if (options.associatedValueControl) {
                defaultValue = options.associatedValueControl.val();
            }
            if (options.associatedNameControl) {
                defaultName = options.associatedNameControl.val();
            }
        }
        if (defaultValue) {
            inner.names = (defaultName || "").splitRemoveEmptys(options.splitChar);
            inner.values = (defaultValue || "").splitRemoveEmptys(options.splitChar);
            if (inner.names.length != inner.values.length) {
                throw new Error(getRegional().defaultNamesLengthNotEqualValuesLength);
            }
        }
        
        inner.root = init(options, inner);
        inner.selectMode = options.selectMode == 1 ? g_SelectMode.SINGLE : g_SelectMode.MULTIPE;

        var events = {};

        /*
		* 执行事件
		* @method execEvent
		* @param {String} code 事件标识
		* @param {jQueryObject} target 触发事件源
		* @param {Object} [data] 事件数据
		*/
        this.execEvent = function (code, target, data) {
            var event = events[code];
            if (event) {
                event.fire(target, data, inner);
            }
            return true;
        };

        /*
		* 注册事件
		* @method registerEvent
		* @param {String} code 事件标识
		* @param {Fun} target 触发方法
		*/
        this.registerEvent = function (code, handle) {
            var event = events[code];
            if (!event) {
                event = $.Callbacks();
                events[code] = event;
            }
            event.add(handle);
        };


        /*
         * 获取或设置值
         * 
         */
        this.value = function (nodes) {
            if (nodes) {
                var names = $.map(nodes, function (n) { return n.name; })
                var values = $.map(nodes, function (n) { return n.value; })
                var value = {
                    name: names.join(options.splitChar),
                    value: values.join(options.splitChar),
                    names: names,
                    values: values,
                    nodes: nodes
                };
                if (options.associatedNameControl) {
                    options.associatedNameControl.val(value.name);
                }
                if (options.associatedValueControl) {
                    options.associatedValueControl.val(value.value);
                }
                if (options.onSelectedValue) {
                    options.onSelectedValue(value);
                }
            } else {
                var $items = $(".opicker-selector ul li", inner.root);
                var selectNodes = [];
                $items.each(function (index) {
                    var $this = $(this);
                    var node = $.extend(true, {}, $this.data("node"), {});
                    selectNodes.push(node);
                });

                return selectNodes;
            }
        };


        // #region 注册订阅事件

        // 注册订阅事件：删除已选中的项目
        this.registerEvent("removeSelectedItemed", removeSelectedItemed);
        // 注册订阅事件: 删除已选中的项目
        this.registerEvent("removeSelectedIteming", function (target, data, inner) {
            // 清除ztree的选中节点
            var $root = inner.root;
            var $currentTab = $("div.tab-item.current", $root);
            var ztreeObject = $.fn.zTree.getZTreeObj($("ul.ztree", $currentTab).attr("id"));
            checkZTreeNode(ztreeObject, target.data("value"), false, true);
        });

        // 注册事件：移动中已选中的项目
        this.registerEvent("moveSelectedIteming", function (target, command, inner) {
            return true;
        });

        // 注册事件：移动后已经选中的项目
        this.registerEvent("moveSelectedItemed", function (target, command, inner) {

        });

        // 注册事件：清空所有已选中的项目
        this.registerEvent("clearSelectedItem", clearSelectedItem);

        

        // 注册事件：插入一个选中项目
        this.registerEvent("insertItem", function (target, node, inner) {
            var $root = inner.root;
            var $selector = $(".opicker-selector", $root);
            var $ul = $("ul", $selector);
            var $item = renderSelectItem(node);
            $ul.append($item);

            var opicker = inner.self;
            opicker.execEvent("selectedChanged");
        });

        // 注册事件：删除一个选中项目
        this.registerEvent("removeItem", function (target, node, inner) {
            var $root = inner.root;
            var $selector = $(".opicker-selector", $root);
            var $ul = $("ul", $selector);
            $("li[data-value='{value}']".bformat(node), $ul).remove();

            var opicker = inner.self;
            opicker.execEvent("selectedChanged");
        });

        // 注册事件：清空所有选中的项目
        this.registerEvent("clearItem", function (target, data, inner) {
            var opicker = inner.self;
            opicker.execEvent("clearSelectedItem", null, inner);

            opicker.execEvent("selectedChanged");
        });

        // 注册事件：选中元素变更
        this.registerEvent("selectedChanged", function (target, data, inner) {
            var $root = inner.root;
            
            changeSelectedCount($root);
        });


        this.registerEvent("getOPickerValue", function (target, data, inner) {
            var value = that.value();
            that.value(value);
        });


        // #region Tab事件

        /*
         * Tab切换后事件
         * @event tabChanged
         * @param {jQuery} target 当前切换的Tab导航元素
         * @param {null} data 无数据
         */
        this.registerEvent("tabChanged", function (target, data, inner) {
            // 设置当前Ztree选中节点
            var ztree = getCurrentTabZTree(inner.root);
            setZTreeDefaultSelectedNodes(ztree, inner.values, false);
        })

        /*
         * Tab切换前事件
         * @event tabChanged
         * @param {jQuery} target 当前切换的Tab导航元素
         * @param {null} data 无数据
         */
        this.registerEvent("tabChanging", function (target, data, inner) {

        })

        // #endregion

        // #endregion


        bindEvent(inner);
    }


    /*
     * 初始化
     * @method init
     * @param {Json} options 选项
     * @param {Object} inner opicker内部对象
     *    
     */
    function init(options, inner) {
        var opicker = inner.self;
        var html = buildHtml(options);
        var $root = $(html);
        var dialog = B.Web.WindowManager.create({
            id: options.id,
            title: options.title,
            width: options.width,
            height: options.height,
            shadow: true,
            data: {
                inner: inner
            },
            buttons: [{
                text: "<i class='fa fa-check'></i>{0}".bformat(getRegional().buttons.ok),
                events: {
                    click: function () {
                        var dialog = Beyondbit.Web.WindowManager.findByID(options.id);
                        var inner = dialog.Data.inner;
                        var opicker = inner.self;
                        opicker.execEvent("getOPickerValue", null);
                        B.Web.WindowManager.findByID(options.id).hide();
                        return false;
                    }
                }
            }, {
                text: "<i class='fa fa-trash'></i>{0}".bformat(getRegional().buttons.clear),
                events: {
                    click: function () {
                        var dialog = Beyondbit.Web.WindowManager.findByID(options.id);
                        var inner = dialog.Data.inner;
                        var opicker = inner.self;
                        opicker.execEvent("clearSelectedItem", $(this));
                        return false;
                    }
                }
            }, {
                text: "<i class='fa fa-remove'></i>{0}".bformat(getRegional().buttons.cancel),
                events: {
                    click: function () {
                        Beyondbit.Web.WindowManager.findByID(options.id).hide();
                        return false;
                    }
                }
            }]
        });
        dialog.setOptions({
            content: $root,
            title: options.title,
            width: options.width,
            height: options.height
        });
        dialog.Data.inner = inner;
        dialog.show();

        if ($root.find("div.opicker-tree-direction").css("display") == "none") {
            $root.find("div.tab").removeClass("tab-vertical");
        } else {
            $root.find("div.tab").addClass("tab-vertical");
        }

        return $root;
    }

    // #region 绑定事件


    /*
     * 绑定事件
     * @param {Json} inner 内部对象
     * @param {opicker} inner.self opicker对象本身this
     * @param {jQueryObject} inner.root opicker指向的根元素元素
     *    
     */
    function bindEvent(inner) {
        var that = inner.self;
        var $root = inner.root;
        bindSelectedItemEvent($root, inner);
        bindMoveSelectedItemEvent($root, inner);
        bindDefaultItem($root, inner);
        addTab($root, inner);
    }

    /*
     * 绑定默认元素
     */
    function bindDefaultItem($root, inner) {
        var $selector = $(".opicker-selector", $root);
        var $ul = $("ul", $selector);

        $.each(inner.values, function (index, value) {
            var node = {
                name: inner.names[index],
                value: value
            };
            $ul.append(renderSelectItem(node));
        });

        changeSelectedCount($root);
    }


    function bindSelectedItemEvent($root, inner) {
        var opicker = inner.self;
        var $selector = $(".opicker-selector", $root);
        var $ul = $("ul", $selector);
        
        $ul.click(function (event) {
            var $target = $(event.target);
            if ($target.is("i")) {
                /*
                 * 绑定删除元素Item事件
                 */
                var $li = $target.parent();
                var result = opicker.execEvent("removeSelectedIteming", $li);
                if (result == true) {
                    $li.remove();
                }
                var result = opicker.execEvent("removeSelectedItemed", $li);
                return false;
            } else if ($target.is("li")) {
                /*
                 * 绑定选中元素的点击事件
                 */
                var $li = $target;
                var result = opicker.execEvent("clickSelectedItemed", $li);
                if (result == true) {
                    $li.addClass("selected").siblings(".selected").removeClass("selected");
                }
            }

        });
    }

    /*
     * 绑定移动选中元素事件
     */
    function bindMoveSelectedItemEvent($root, inner) {
        var opicker = inner.self;
        var $selector = $(".opicker-selector", $root);
        var controls = $("div.scontrol a[data-control]", $selector);
        var ul = $("ul", $selector);
        controls.click(function () {
            var $this = $(this);
            var $items = $("li", ul);
            var $selected = $items.filter(".selected");
            if ($selected.length == 0) {
                return false;
            }
            var index = $items.index($selected);
            var command = $this.data("control");

            /*
             * event 
             * 移动选中元素
             * @param {String} code = moveSelectedItem
             * @param {target} target = 选中的元素
             * @param {String} data = command[up,down] 向上移动还是向下移动
             */
            var result = opicker.execEvent("moveSelectedIteming", $selected, command);
            if (result != true) {
                return false;
            }
            if (command == "up") {
                if (index == 0) {
                    return false;
                }
                var $prev = $selected.prev();
                var $temp = $selected.detach();
                $prev.before($temp);

            } else if (command == "down") {
                if (index == $items.length - 1) {
                    return false;
                }
                var $next = $selected.next();
                var $temp = $selected.detach();
                $next.after($temp);
            }

            /*
            * event 
            * 已经移动完成选中元素
            * @param {String} code = moveSelectedItemed
            * @param {target} target = 选中的元素
            * @param {String} data = command[up,down] 向上移动还是向下移动
            */
            opicker.execEvent("moveSelectedItemed", $selected, command);
            return false;
        });
    }

    // #endregion
    

    // 添加Tab标签
    function addTab($root, inner) {
        var opicker = inner.self;
        var options = inner.options;
        var objects = options.objects;
        var $tab = $(".tab", $root),
            $tabNav = $(".tab-nav", $tab),
            $tabContent = $(".tab-content", $tab);

        $.each(objects, function (index, object) {
            object.config = object.config || {};
            var code = object.code;
            var service = B.OPicker.getService(code);
            $tabNav.append('<li>{0}</li>'.bformat(object.title || service.title));
            var $tabItem = $('<div class="tab-item"><div class="opicker-dock">'
                + '<ul class="ztree" id="opicker_ztree_{0}_{1}"></ul></div></div>'.bformat(code, B.getIdentity()));

            $tabContent.append($tabItem);
            $tabItem.data("service-object", object);
        });

        $tabNav.find(">li").each(function (index) {
            $(this).click(function () {
                var $tabItem = $tabContent.find(".tab-item").eq(index);
                if ($tabItem.data("service-init") != true) {
                    var serviceObject = $tabItem.data("service-object");
                    var service = B.OPicker.getService(serviceObject.code);
                    bindTabItem($tabItem, service, serviceObject, inner);
                    $tabItem.data("service-init", true);
                }

                // 注册Tab切换前事件
                opicker.execEvent("tabChanging", $this);

                var $this = $(this);
                $this.addClass("current").siblings(".current").removeClass("current");
                $tabItem.addClass("current")
                    .siblings(".current").removeClass("current");

                // 注册Tab切换后事件
                opicker.execEvent("tabChanged", $this);
            });
        }).eq(0).trigger("click");
    }


    function bindTabItem($tabItem, service, serviceObject, inner) {
        var treeSetting = {
            async: {
                enable: true,
                url: service.getUrl.call(service, serviceObject.config),
                param: ["value=code"]
            },
            showIcon: service.showIcon,
            dataFilter: service.dataFilter,
            serviceObject: serviceObject,
            service: service
        };
        var source = treeSetting.service.getStaticDataSource.call(treeSetting.service, treeSetting.serviceObject.config, treeSetting.serviceObject);
        if (!source) {
            treeSetting.isAsync = true;
        } else {
            source = formatSource(source, serviceProcessDataItemFun(treeSetting));
        }

        var setting = getTreeSetting(inner, treeSetting);
        $.fn.zTree.init($("ul.ztree", $tabItem), setting, source);

        bindTabItemQuickSearch($tabItem, service,serviceObject, inner);
    }

    /*
     * 绑定Tab 选择快捷搜索功能和事件
     */
    function bindTabItemQuickSearch($tabItem, service, serviceObject,inner) {
        var searchUrl = service.getSearchUrl(serviceObject.config);
        if (!searchUrl) {
            return;
        }
       
        $tabItem.prepend('<dl class="opicker-quicksearch"><dt>{title}:<dt><dd><input placeholder="{placeholder}" title="{placeholder}" type="text" name="key" /></dd><dd class="opicker-quicksearch-result hide" hidefocus="true"  tabIndex="8889"><ul></ul></dd></dl>'.bformat(getRegional().search));

        $tabItem.css("overflow", "hidden");
        var $quickSearch = $(".opicker-quicksearch", $tabItem);
        var $quickSearchResult = $(".opicker-quicksearch-result", $tabItem);

        $(".opicker-dock", $tabItem).height($tabItem.parent().height() - $quickSearch.outerHeight());
       
        
        $("ul", $quickSearch).click(function (event) {
            var $this = $(this);
            var $target = $(event.target);

            if ($target.is("li")) {
                var $li = $target;
                if (!$li.hasClass("noSelect")) {
                    $li.addClass("selected");
                    var nodedata = convertNodeModel($li.data("data"));
                    selectNodeSaveData.call(inner, nodedata, true);
                }
            }
        });

        var timeoutSearchKey, intervalQuickSearchResult;

        $quickSearchResult.blur(function () {
            quickSearchVisibility(false);
        }).focus(function () {
            quickSearchVisibility(true);
        });

        

        $(":input[name=key]", $quickSearch).focus(function () {
            quickSearchVisibility(true);
        }).blur(function () {
            if (intervalQuickSearchResult) {
                clearInterval(intervalQuickSearchResult);
            }
            intervalQuickSearchResult = setInterval(function () {
                quickSearchVisibility(false);
            }, 300);
        }).on("input propertychange", function () {
            var $this = $(this);
            if (timeoutSearchKey != null) {
                clearTimeout(timeoutSearchKey);
            }
            if ($this.val() - 0 == 0) {
                setQuickSearchResult(null);
                return;
            }

            timeoutSearchKey = setTimeout(function () {
                var key = $this.val();
                startQuickSearch(key);
            }, 300);
        });

        
        var requestIndex = 1, responseIndex = 1;
        function startQuickSearch(key) {
            requestIndex = requestIndex + 1;
            var data = {
                keywords: key,
                requestIndex: requestIndex
            };

            data[B.Tenant.ACCESS_TOKEN_IDENTITY] = B.Tenant.getCurrentAccessToken();

            $.ajax({
                url: searchUrl,
                data: data,
                dataType: "jsonp",
                success: function (result) {
                    if (responseIndex <= result.requestIndex) {
                        setQuickSearchResult(result.data);
                        responseIndex = result.requestIndex;
                    }
                }
            });
        }

        function setQuickSearchResult(data) {
            var html = '';
            if (data && data.length > 0) {
                var data = formatSource(data);
                html = $.map(data, function (item) {
                    var $li = $('<li data-name="{name}" title="{tip}" data-value="{value}">{text}</li>'.bformat(item));
                    $li.data("data", item);
                    return $li;
                });
            }
            $quickSearchResult.find("ul").html(html);
        }

        function quickSearchVisibility(is) {
            if (intervalQuickSearchResult) {
                clearInterval(intervalQuickSearchResult);
            }
            if (is) {
                $quickSearchResult.removeClass("hide").show();
            } else {
                $quickSearchResult.hide();
            }
        }
    }

    /*
     * 构建opicker Html
     */
    function buildHtml(options) {
        var html = ''
		+ '<div class="opicker">'
        + '    <div class="opicker-tree">'
        +'         <div class="opicker-tree-direction"></div>'
        + '        <div class="tab tab-vertical">'
        + '            <ul class="tab-nav"></ul>'
        + '            <div class="tab-content"></div>'
        + '        </div>'
        + '    </div>'
        + '    <div class="opicker-selector">'
        + '        <div class="sbody">'
        + '            <h4>'+ getRegional().select.selected +'：<strong>0</strong></h4>'
        + '            <div class="scontrol">'
        + '                <a href="#" class="btn btn-img" data-control="up" title="'+getRegional().select.up+'">'
        + '                    <i class="fa fa-arrow-circle-up "></i>'
        + '                    <em>' + getRegional().select.up + '</em>'
        + '                </a>'
        + '                <a href="#" class="btn btn-img" data-control="down" title="' + getRegional().select.down + '">'
        + '                    <i class="fa fa-arrow-circle-down"></i>'
        + '                    <em>' + getRegional().select.down + '</em>'
        + '                </a>'
        + '            </div>'
        + '            <ul></ul>'
        + '        </div>'
        + '    </div>'
        + '    <div class="clearfix"></div>'
        + '</div>'
        return html;
    }


    // #region ZTree

    /*
     * 服务处理数据
     */
    function serviceProcessDataItemFun(treeSetting) {
        return function (item) {
            return treeSetting.dataFilter(item, treeSetting.serviceObject.config, treeSetting.serviceObject);
        };
    }

    function serviceShowIcon(treeSetting) {
        return function (treeId, treeNode) {
            return treeSetting.showIcon(treeNode, treeId, treeSetting.serviceObject.config, treeSetting.serviceObject);
        }
    }

    /*
     * 获取zTreeSetting
     */
    function getTreeSetting(inner, treeSetting) {
        var options = inner.options;
        var zTreeObject;
        var selectMode = inner.selectMode;
        var setting = {
            view: {
                showIcon: serviceShowIcon(treeSetting)
            },
            async: {
                enable: true,
                autoParam: ["id", "name", "value"],
                dataFilter: function (treeId, parentNode, childNodes) {
                    if (!childNodes || childNodes.length == 0) {
                        return null;
                    }
                    childNodes = formatSource(childNodes, serviceProcessDataItemFun(treeSetting));
                    setSelectNode(childNodes, inner.values);
                    return childNodes;
                }
            },
            check: {
                enable: true,
                chkboxType: {
                    "Y": "",
                    "N": ""
                }
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                onCheck: function zTreeOnCheck(event, treeId, treeNode) {
                    if (options.selectMode == 2) {
                        recursiveFindParentSaveData.call(inner, treeNode.checked, treeNode);
                    }
                    else {
                        var nodedata = convertNodeModel(treeNode);
                        var checked = treeNode.checked;
                        selectNodeSaveData.call(inner, nodedata, treeNode.checked)
                        if (checked) {
                            if (selectMode == g_SelectMode.SINGLE) {
                                var zTreeObject = $.fn.zTree.getZTreeObj(treeId);
                                zTreeObject.checkNode(treeNode, true, true, false);
                            }
                            addSelectedNode(nodedata);
                        } else {
                            deleteSelectedNode(nodedata);
                        }
                        
                    }
                },
                beforeClick: function (treeId, treeNode, clickFlag) {
                    var zTreeObject = $.fn.zTree.getZTreeObj(treeId);
                    if (treeNode.isParent == true && treeNode.nocheck == true) {
                        zTreeObject.expandNode(treeNode);
                    }
                    else {
                        zTreeObject.checkNode(treeNode, null, true, true);
                    }
                    return false;
                },
                beforeAsync: function (treeId, treeNode) {
                    return !treeNode || treeNode.hasChilds != false;
                },
                onExpand: function (event, treeId, treeNode) {
                    if (options.selectMode == 2) {
                        if (treeNode.checked) {
                            recursiveSetChildsChecked(treeNode, true);
                        }
                    }
                }
            }
        };

        setZTreeAsyncSetting(treeSetting, setting);
        

        if (options.showIcon) {
            setting.view.showIcon = function (treeId, treeNode) {
                return options.showIcon(treeNode);
            }
        }

        return setting;
    }

    /*
     * 设置ZTree的异步设置 
     */
    function setZTreeAsyncSetting(treeSetting, setting) {
        if (treeSetting.isAsync) {

            setting.async.enable = true;
            setting.async.url = treeSetting.async.url;
            setting.async.dataType = "jsonp";
            setting.async.cache = true;

            var otherParam = treeSetting.async.otherParam || [];
            var accessToken = B.Tenant.getCurrentAccessToken();
            if (accessToken) {
                otherParam.push(B.Tenant.ACCESS_TOKEN_IDENTITY);
                otherParam.push(accessToken);
            }

            setting.async.otherParam = otherParam;

            if (treeSetting.async.param) {
                $.each(treeSetting.async.param, function (key, param) {
                    if ($.inArray(param, setting.async.autoParam) == -1) {
                        setting.async.autoParam.push(param);
                    }
                })
            }
        }
    }

    function addSelectedNode(node) {

    }

    function deleteSelectedNode(node) {

    }

    

    /*
	 * @description 选中Node后保存数据
	 * @param node {json} 数据包括name和value属性
	 * @param checked {Boolean} 是选中还是删除
	 */
    function selectNodeSaveData(node, checked) {
        var inner = this;
        var opicker = inner.self;
        var names = inner.names;
        var values = inner.values;
        var ni = names.indexOf(node.name),
            vi = values.indexOf(node.value);
        if (inner.selectMode == g_SelectMode.SINGLE) {
            opicker.execEvent("clearItem", null);
            if (checked) {
                values = [node.value];
                names = [node.name];
                opicker.execEvent("insertItem", null, node);
            } else {
                values = [];
                names = [];
            }
            inner.values = values;
            inner.names = names;
        } else {
            if (checked) {
                if (vi == -1) {
                    values.push(node.value);
                    opicker.execEvent("insertItem", null, node);
                }
                if (ni == -1) { names.push(node.name); }
            } else {
                if (vi != -1) {
                    values.splice(vi, 1);
                    opicker.execEvent("removeItem", null, node);
                }
                if (ni != -1) { names.splice(ni, 1); }
            }
        }
    }


    /*
     * 设置节点集合是否选中
     * @method setSelectNode
     * @param {ztreeNode} nodes 待设置的节点集合
     * @param {Array(String)} values 要设置的Node节点的值集合
     */
    function setSelectNode(nodes, values) {
        if (!nodes) { return; }
        $.each(nodes, function (index, node) {
            var ni = values.indexOf(node.value);
            if (ni > -1) {
                node.checked = true;
            }
        });
    }


    /*
     * 清除当前Tab选中的Ztree节点
     */
    function clearCurrentTabZTree($root) {
        var ztree = getCurrentTabZTree($root);
        ztree.checkAllNodes(false);
    }

    /*
     * 获取当前选中Tab的Ztree
     */
    function getCurrentTabZTree($root) {
        var $currentTab = $("div.tab-item.current", $root);
        return $.fn.zTree.getZTreeObj($("ul.ztree", $currentTab).attr("id"));
    }

    /*
     * 设置ztree 默认选中的节点
     * @method setZTreeDefaultSelectedNodes
     * @param {ztree} ztree 要设置的ztree对象
     * @param {Array(String)} values 要设置的Node节点的值集合
     * @param {Boolean} [trigger=false] 是否触发Ztree事件
     * 
     */
    function setZTreeDefaultSelectedNodes(ztree, value, trigger) {
        trigger = trigger || false;
        ztree.checkAllNodes(false);

        if (!value) { return; }
        $.each(value, function (index, value) {
            checkZTreeNode(ztree, value, true, trigger);
        });
    }

    /*
     * 设置Ztree节点是否选中，根据node.value判断
     * @method checkZTreeNode
     * @param {ztree} ztree 要设置的ztree对象
     * @param {String} value 要设置的Node的值
     * @param {Boolean} checked 是否选中
     * @param {Boolean} [trigger=false] 是否触发Ztree事件
     */
    function checkZTreeNode(ztree, value, checked, trigger) {
        trigger = trigger || false;
        var znode = ztree.getNodeByParam("value", value);
        if (znode) {
            ztree.checkNode(znode, checked, true, trigger);
        }
    }

    /* selectMode=2时逻辑 */
    function recursiveFindParentSaveData(checked, treeNode) {
        if (checked) {
            var parent = treeNode.getParentNode();
            if (parent) {
                var isAllChecked = true;
                $.each(parent.children, function (index, node) {
                    if (node.checked == false) {
                        isAllChecked = false;
                        return false;
                    }
                });
                if (isAllChecked) {
                    setTreeNodeChecked(true, parent, false);
                    recursiveFindParentSaveData(checked, parent);
                } else {
                    setTreeNodeChecked(true, treeNode, true);
                }
            } else {
                setTreeNodeChecked(true, treeNode, true);
            };
        }
        else {
            setTreeNodeChecked(false, treeNode, true);
            recursiveFindParentSaveDataNoChecked(treeNode);
        }
    }
    function recursiveFindParentSaveDataNoChecked(treeNode) {
        var nodedata = convertNodeModel(treeNode);
        zTreeObject.checkNode(treeNode, false, false, false);
        deleteSelectedNode(nodedata);
        selectNodeSaveData(nodedata, false);
        var parent = treeNode.getParentNode();
        if (parent) {
            if (parent.checked == true) {
                $.each(parent.children, function (index, node) {
                    if (node.checked == true) {
                        var nodedata = convertNodeModel(node);
                        addSelectedNode(nodedata);
                        selectNodeSaveData(nodedata, true);
                    }
                });
                recursiveFindParentSaveDataNoChecked(parent);
            }
        }
    }
    function setTreeNodeChecked(checked, treeNode, isRecursive) {
        var nodedata = convertNodeModel(treeNode);
        if (checked) {
            zTreeObject.checkNode(treeNode, true, false, false);
            addSelectedNode(nodedata);
            selectNodeSaveData(nodedata, true);
            if (isRecursive == true) {
                recursiveSetChildsChecked(treeNode, true);
            }
        } else {
            zTreeObject.checkNode(treeNode, false, false, false);
            deleteSelectedNode(nodedata);
            selectNodeSaveData(nodedata, false);
            if (isRecursive == true) {
                recursiveSetChildsChecked(treeNode, false);
            }
        }
    }
    function recursiveSetChildsChecked(treeNode, checked) {
        var zTreeObject = this;
        var childs = treeNode.children;
        if (childs && childs.length > 0) {
            if (checked == true) {
                $.each(childs, function (index, node) {
                    var nodedata = convertNodeModel(node);
                    deleteSelectedNode(nodedata);
                    selectNodeSaveData(nodedata, false);
                    zTreeObject.checkNode(node, true, false, false);
                    recursiveSetChildsChecked(node, checked);
                });
            } else {
                $.each(childs, function (index, node) {
                    var nodedata = convertNodeModel(node);
                    deleteSelectedNode(nodedata);
                    selectNodeSaveData(nodedata, false);
                    zTreeObject.checkNode(node, false, false, false);
                    recursiveSetChildsChecked(node, checked);
                });
            }
        };
    }
    /* END selectMode=2时逻辑 */

    /*
     * 格式化数据源
     * @method formatSource
     * @param {Array(Json)} source 待格式化的数据
     * @param {Fun} [processDataItemFun] 处理数据的方法
     */
    function formatSource(source, processDataItemFun) {
        var zNodes = [];
        if (source) {
            if (processDataItemFun) {
                source = processDataItemFun(source);
            }
            $.each(source, function (index, item) {
                if (processDataItemFun) {
                    item = processDataItemFun(item);
                }
                var zNode = $.extend(true, {}, item, {
                    id: item.id || $.trim(item.value),
                    name: $.trim(item.name),
                    value: $.trim(item.value),
                    text: item.text || item.name,
                    pId: item.parentId,
                    open: item.open,
                    isParent: item.isParent
                });
                zNodes.push(zNode);
                var eachNode = function (item) {
                    if (item.nodes) {
                        $.each(item.nodes, function (index, node) {
                            if (processDataItemFun) {
                                node = processDataItemFun(node);
                            }
                            var znode = $.extend(true, {}, node, {
                                id: node.id || $.trim(node.value),
                                name: $.trim(node.name),
                                value: $.trim(node.value),
                                text: node.text || node.name,
                                pId: item.id,
                                open: item.open,
                                isParent: node.isParent
                            });
                            zNodes.push(znode);
                            eachNode(node);
                        });
                    };
                };
                eachNode(item);
            });
        }
        return zNodes;
    };

    /*
	 * 转换TreeNode为Node实体
	 * @method convertNodeModel
	 * @param {TreeNode} treeNode
	 */
    function convertNodeModel(treeNode) {
        return treeNode;
    };

    // #endregion

   /*
    * 生成一个选中的元素
    * @param {json} node
    * @returns jQuery
    * 
    */
    function renderSelectItem(node) {
        var $item = $('<li data-value="{value}"><i class="fa fa-remove"></i>{name}</li>'.bformat(node));
        $item.data("node", node);

        return $item;
    }

    /*
     * 变更已经选中的个数
     */
    function changeSelectedCount($root) {
        var $selector = $(".opicker-selector", $root);
        var items = $("ul li", $selector);
        $("div.sbody > h4 strong", $selector).html(items.length);
    }


    /*
     * 删除已经选择好的元素事件
     */
    function removeSelectedItemed(target, data, inner) {
        var opicker = inner.self;
        opicker.execEvent("selectedChanged", null);
    }

    /*
     * 清空选择的Item
     */
    function clearSelectedItem(target, data, inner) {
        inner.names = [];
        inner.values = [];

        var opicker = inner.self;
        var $selector = $(".opicker-selector", inner.root);
        var ul = $("ul", $selector);
        ul.html('');

        clearCurrentTabZTree(inner.root);

        opicker.execEvent("selectedChanged", null);
    }

    

})(jQuery, Beyondbit);

(function ($, B) {

    
    var _defaultServiceHost = "http://pdxtbg.pudong.sh/SharedService";
    // _defaultServiceHost = "http://localhost:2109";

    function getEntireServiceUrl(url) {
        if (url.indexOf("http://") == 0) {
            return url;
        }
        return (window.SharedServiceHost || _defaultServiceHost) + url;
    }


    var opicker = B.registerNameSpace("OPicker");

    opicker.regional["zh-CN"].services = {
        orgUser: {
            title: "按部门"
        },
        roleUser: {
            title: "按角色"
        },
        org: {
            title: "部门"
        },
        role: {
            title: "角色"
        },
        source: {
            title: "选择"
        },
        orgDeputy: {
            title: "选择机构代表",
            notConfigHierarchyCode: "没有配置hierarchyCode参数"
        }
    };

    function getRegional() {
        return opicker.regional[B.CultureInfo.Current.get()];
    }

    // #region 注册系统默认提供服务

    /**
     * 按部门选择用户服务
     * @class OrgUserService
     * 
     */
    opicker.registerService({
        code: "orguser",
       /**
         * 标题
         * @property title 
         * @type String
         * @default "按部门"
         */         
        title: getRegional().services.orgUser.title,
        /**
         * 配置
         * @property config
         * @type json
         */
        config: {
            /**
             * 是否显示根元素
             * @property config.isShowRoot
             * @type Boolean
             * @default false
             */
            isShowRoot: false,
            /**
             * 根部门Code
             * @property config.rootOrgCode
             * @type String
             */
            rootOrgCode: null
        },
        searchUrl: getEntireServiceUrl("/api/OrgAndUserQuery"),
        url: getEntireServiceUrl("/api/OrgAndUser"),
        dataFilter: function (item, config) {
            if (config.isShowRoot == true) {
                item.open = true;
            }
            if (item.isParent || (item.nodes != null && item.nodes.length > 0)) {
                item.nocheck = true;
            };
            return item;
        },
        getUrl: function (config, url) {
            var url = new B.Url(url || this.url);

            if (config.rootOrgCode) {
                url.appendKey("rootCode", config.rootOrgCode);
            }
            if (config.isShowRoot == true) {
                url.appendKey("isIncludeRoot", config.isShowRoot);
            }

            return url.toString();
        }
    });

    /**
     * 按角色选择用户服务
     * @class RoleUserService
     * 
     */
    opicker.registerService({
        code: "roleuser",
      /**
        * 标题
        * @property title 
        * @type String
        * @default "按角色"
        */
        title: getRegional().services.roleUser.title,
        /**
         * 配置
         * @property config
         * @type json
         */
        config: {
            /*
             * 是否显示根元素
             * @property config.isShowRoot
             * @type Boolean
             * @default false
             */
            isShowRoot: false,
            /**
             * 指定的角色Code
             * @property config.code
             * @type String
             */
            code: null,
            /**
             * 指定的App Code
             * @property config.appCode
             * @type String
             */
            appCode: null
        },
        url: getEntireServiceUrl("/api/RoleAndUser"),
        dataFilter: function (item, config) {
            if (item.isParent || (item.nodes != null && item.nodes.length > 0)) {
                item.nocheck = true;
            };
            return item;
        },
        getUrl: function (config, url) {
            var url = new B.Url(url || this.url);
            if (config.code) {
                url.appendKey("code", config.code);
            }
            if (config.appCode) {
                url.appendKey("appCode", config.appCode);
            }
            return url.toString();
        }
    });

    /**
     * 选择部门服务
     * @class OrgService
     * 
     */
    opicker.registerService({
        code: "org",
        /**
        * 标题
        * @property title 
        * @type String
        * @default "部门"
        */
        title: getRegional().services.org.title,
        /**
         * 配置
         * @property config
         * @type json
         */
        config: {
            /*
             * 是否显示根元素
             * @property config.isShowRoot
             * @type Boolean
             * @default false
             */
            isShowRoot: false,
            /**
             * 根部门Code
             * @property config.rootOrgCode
             * @type String
             */
            rootOrgCode: null
        },
        url: getEntireServiceUrl("/api/Org"),
        showIcon: function (item) {
            return false;
        },
        dataFilter: function (item, config) {
            if (config.isShowRoot == true) {
                item.open = true;
            }
            return item;
        },
        getUrl: function (config, url) {
            var url = new B.Url(url || this.url);

            if (config.rootOrgCode) {
                url.appendKey("rootCode", config.rootOrgCode);
            }
            if (config.isShowRoot == true) {
                url.appendKey("isIncludeRoot", config.isShowRoot);
            }

            return url.toString();
        }
    });


    /**
     * 选择角色服务
     * @class RoleService
     * 
     */
    opicker.registerService({
        code: "role",
        /**
          * 标题
          * @property title 
          * @type String
          * @default "按角色"
          */
        title: getRegional().services.role.title,
        /**
         * 配置
         * @property config
         * @type json
         */
        config: {
            /**
             * 指定的App Code
             * @property config.appCode
             * @type String
             */
            appCode: null
        },
        url: getEntireServiceUrl("/api/Role"),
        getUrl: function (config, url) {
            var url = new B.Url(url || this.url);

            if (config.appCode) {
                url.appendKey("appCode", config.appCode);
            }

            return url.toString();
        }
    });

  /**
    * 自定义数据源选择服务
    * @class SourceService
    * 
    */
    opicker.registerService({
        code: "source",
        title: getRegional().services.source.title,
      /**
        * 数据源
        * @property source
        * @type Array[Node]
        * @default []
        */
        source: [],
        /*
          * 配置
          * @property config
          * @type json
          */
        config: {
           
        },
        getStaticDataSource: function (config, object) {
            return object.source;
        }
    });

    // #endregion


    // #region 机构代表服务

    opicker.registerService({
        code: "orgdeputy",
        title: getRegional().services.orgDeputy.title,
        url: getEntireServiceUrl("/OrgDeputy/Org"),
        config: {
            hierarchyCode: null
        },
        showIcon: function (item) {
            return false;
        },
        dataFilter: function (item, config) {
            if (config.isShowRoot == true) {
                item.open = true;
            }
            return item;
        },
        getUrl: function (config) {
            var url = new B.Url(this.url);

            if (!config.hierarchyCode) {
                throw Error(getRegional().services.orgDeputy.notConfigHierarchyCode);
            }
            url.appendKey("hierarchyCode", config.hierarchyCode);

            if (config.rootOrgCode) {
                url.appendKey("rootCode", config.rootOrgCode);
            }
            if (config.isShowRoot == true) {
                url.appendKey("isIncludeRoot", config.isShowRoot);
            }

            return url.toString();
        }
    })

    // #endregion

})(jQuery, Beyondbit);
(function ($, B) {

	var tenant = B.registerNameSpace("Tenant");

	tenant.ACCESS_TOKEN_IDENTITY = "AccessToken";

	tenant.getCurrentAccessToken = function () {
		var $ACCESSUSERTOKEN = $("#TENANT_ACCESSTOKEN");
		if ($ACCESSUSERTOKEN.length > 0) {
			return $ACCESSUSERTOKEN.val();
		}
	};

})(jQuery, Beyondbit);
(function ($, B) {
    /**
     * Url相关
     * @module Beyondbit
     * @main Beyondbit
     * @class Url
     * @example
     *
     *
     */

    var Url;

    /**
      * Url实例
      * @class Url
      * @constructor
      * @param {String} [url=window.location.href] url字符串，默认为当前请求URL
      * @example
      *
      *     var url = B.Url();
      *     var urlBeyondbit = B.Url("http://www.beyondbit.com/");
      *    
      */
    Beyondbit.Url = Url = function (url) {

        var url = url || window.location.href;

        /**
          * 获取Url中所有请求的键值对集合
          * @property request
          * @readOnly
          * @type JSON    
          */
        this.request = GetRequest(url);

        /**
          * 获取Url中的键值
          * @method queryString
          * @param {string} key 换取Url中请求的键名
          * @example
          *
          *     var url = new Beyondbit.Url("http://www.baidu.com/?id=1&key=2");
          *     var value = url.queryString("key");
          *    
          */
        this.queryString = function (key) {
            if (!key) {
                return "";
            }
            return this.request[key.toLowerCase()];
        };

       /**
         * 移除一个键值, 返回删除后的Url
         * @method removeKey
         * @param {String} key 要移除的键
         * @returns {String}
         */
        this.removeKey = function (key) {
            if (!key) {
                return "";
            }
            var removeRegex = new RegExp("([?&]){0}=[^&]*".bformat(key), "ig");
            url = url.replace(removeRegex, "$1");
            return url;
        };

        /**
         * 追加一个键值，返回追加完后的URL
         * @method appendKey
         * @param {String} key 增加的键
         * @param {String} value 增加的值
         * @returns {String}
         */
        this.appendKey = function (key, value) {
            if (!key) {
                return url;
            }
            var isHaveQuestion = url.indexOf("?") > -1;
            var partialUrl = "{0}{1}={2}".bformat(isHaveQuestion ? "&" : "?", key, value);
            url = url + partialUrl;
            return url;
        }

        /**
         * 输出Url的string 地址
         */
        this.toString = function () {
            return url;
        }
    };


    /**
      * 获取当前Url对象
      * @property current
      * @static
      * @public
      * @example
      *
      *     var currentUrl = B.Url.current;
      *    
      */
    Url.current = new B.Url();

    /**
      * 返回到上一页
      * @method back
      * @static
      * @public
      * @example
      *
      *     B.Url.back();
      *    
      */
    Url.back = function () {
        window.history.back(-1);
        return false;
    }

   /**
     * 返回到上一页并刷新
     * @method back
     */
    Url.backAndRefresh = function () {
        var referrer = document.referrer;
        if (referrer) {
            window.location.href = referrer;
        } else {
            Url.back();
        }
        return false;
    }

    /**
      * 刷新当前页面
      * @method refresh
      * @static
      * @public
      * @example
      *
      *     B.Url.refresh();
      *    
      */
    Url.refresh = function () {
        window.location.reload();
    }

    /**
      * 跳转页面
      * @method redirect
      * @param {String} url 要跳转的Url
      * @static
      * @public
      * @example
      *
      *     B.Url.redirect("http://www.beyondbit.com");
      *    
      */
    Url.redirect = function (url) {
        
        window.location.href = url;
    }

    /*
     * 获取Request请求键值集合
     * @param {string} url url字符串
     */
    function GetRequest(url) {
        var request = {};
        var index = url.indexOf("?");
        if (index != -1) {
            var str = url.substring(index + 1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                var eqs = strs[i].split("=");
                var key = eqs[0].toLowerCase();
                request[key] = eqs[1] || "";
            }
        }
        return request;
    }


})(jQuery, Beyondbit || {});
(function ($, B) {

    /**
     * 相关 Web 界面的类集合
     * @module Beyondbit.Web
     * @submodule Web
     */
    var web = B.registerNameSpace("Web");

    /**
       * Layout 布局类
       * @class Layout
       * @static
       */

    var layout = B.registerNameSpace("Web.Layout");

    /**
        * 自适应布局
        * @method fix
        * @static
        * @param {String} jElement 自适应元素或容器元素，当options.autoElement元素为空，则当前元素为自适应元素
        * @param {json} [options] 可选项
        * @param {String} [options.autoElement] 自适应元素
        * @param {number} [totalHeight] 总高度 
        * @example
        *
        *     <html>
        *         <div class="layout-fit">
        *           <div class="header">
        *               头部
        *           </div>
        *           <div class="middle layout-fit-item-auto">
        *               自适应
        *           </div>
        *           <div class="footer">
        *               底部
        *           </div>
        *       </div>
        *     </html>
        *
        *     <script>
        *     B.Web.Layout.fit(".layout-fit-item-auto");
        * 
        *     B.Web.Layout.fit(".layout-fit", {
        *         autoElement: ".layout-fit-item-auto"
        *     });
        *     </script>
        * 
        */
    layout.fit = function (jElement, options, height) {
        options = $.extend(true, {
            autoElement: null,
            reserve: 0
        }, options, {});

        var $target = $(jElement);
        var $container;

        var $autoElement;
        if (options.autoElement) {
            $autoElement = $(options.autoElement);
            $container = $target;
        } else {
            $autoElement = $target;
            $container = $target.parent();
        }

        height = height || $container.height();

        var $siblings = $container.children(":visible:not(script)").not($autoElement[0]);

        var boxHeight = $autoElement.outerHeight() - $autoElement.height();

        var totalOuterHeight = 0;
        $siblings.each(function () {
            totalOuterHeight += $(this).outerHeight();
        });

        $autoElement.height(height - totalOuterHeight - boxHeight - options.reserve);
    };

})(jQuery, Beyondbit);
(function ($, B) {
    /**
     * 相关 Web 界面的类集合
     * @module Beyondbit.Web
     * @submodule Web
     */
    var Web = B.registerNameSpace("Web");

    /**
     * Web 各种弹出框效果
     * @class MessageBox
     * @static
     */
    var MessageBox = B.registerNameSpace("Web.MessageBox");

    MessageBox.regional = [];

    MessageBox.regional[""] = MessageBox.regional["zh-CN"] = {
        messages : {
            ok: "确定",
            cancel: "取消",
            yes: "是",
            no: "否",
            close: "关闭"
        },
        sysTips: {
            title: "系统提示",
            loadingContent: "正在加载.."
        }
    }

    function getRegional() {
        return MessageBox.regional[B.CultureInfo.Current.get()];
    }

    MessageBox.Icons = {
        SUCCESS: "fa-check",
        ERROR: "fa-times",
        INFO: "fa-info",
        QUESTION: "fa-question",
        WARNING: "fa-warning",
        LOADING: "fa-spinner fa-spin"
    };


    /**
      * 弹出消息框，等同alert效果
      * @method alert
      * @static
      * @param {String} [title] 标题
      * @param {String} [message] 消息内容
      * @param {String} [btnText] 按钮文字 @default "确定"
      * @param {String} [icon] 提示的Icon图标 @default "info"
      * @param {Fun} [onSuccess] 点击确定后的回调事件
      * @example
      *
      *     Beyondbit.Web.MessageBox.alert("消息");
      * 
      *     Beyondbit.Web.MessageBox.alert("消息标题","消息内容");
      * 
      *     Beyondbit.Web.MessageBox.alert("消息标题","消息内容","按钮文字");
      * 
      *     // 显示不同的图标
      *     Beyondbit.Web.MessageBox.alert("消息标题","消息内容","按钮文字","fa-warning");
      *     
      *     // 最后一个参数是Fun，则都为回调函数
      *     Beyondbit.Web.MessageBox.alert("消息标题","消息内容","按钮文字","fa-warning",function(){
      *         alert("点击确定了");
      *     });
      * 
      *     Beyondbit.Web.MessageBox.alert("消息标题","消息内容","按钮文字",function(){
      *         alert("点击确定了");
      *     });
      * 
      *     Beyondbit.Web.MessageBox.alert("消息标题","消息内容",function(){
      *         alert("点击确定了");
      *     });
      */
    MessageBox.alert =  function (title, message, text, icon, onsuccess) {
        var unqueid = "alert";
        if (arguments.length == 0) {
            return Beyondbit.Web.MessageBox.Manager.findByID(unqueid);
        };
        var _title, _message, _icon, _text;
        var callback;
        var length = arguments.length;
        if (length > 1) {
            if (arguments[length - 1] && $.isFunction(arguments[length - 1])) {
                callback = arguments[length - 1];
                switch (length) {
                    case 2:
                        _message = title;
                        break;
                    case 3:
                        _title = title;
                        _message = message;
                        break;
                    case 4:
                        _title = title;
                        _message = message;
                        _text = text;
                        break;
                    default:
                        _title = title;
                        _message = message;
                        _text = text;
                        _icon = icon;
                        break;
                }
            }
            else {
                _title = title;
                _message = message;
                _icon = icon
                _text = text;
            }
        }
        else {
            _message = title;
        }
        _title = _title || getRegional().sysTips.title;
        _text = _text || getRegional().messages.ok;
        _icon = _icon || Beyondbit.Web.MessageBox.Icons.INFO;

        var className = "";
        $.each(Beyondbit.Web.MessageBox.Icons, function (key,value) {
            if (key == _icon) {
                _icon = value;
                className = "messagebox-" + key.toLowerCase();
            }
        })

        var alertCallback = function () {
            if (callback) {
                callback();
            }
        };

        return Beyondbit.Web.MessageBox.show({
            id: unqueid,
            content: _message,
            title: _title,
            icon: _icon,
            btns: [{
                text: _text,
                callback: alertCallback
            }
            ],
            draggable: true,
            closeBtn: { show: true, callback: alertCallback, defindValue: null },
            className: className
        });
    };

    /**
      * 是、否选择框，返回True/False结果，等同confirm效果
      * @method confirm
      * @static
      * @param {String} [title] 标题
      * @param {String} [message] 消息内容
      * @param {Array} [btnText] 按钮文字 @default " ["确定","取消"]  "
      * @param {String} [icon] 提示的Icon图标 @default " question "
      * @param {Fun} [onSuccess] 点击按钮后的回调事件 
      * @example
      *
      *     Beyondbit.Web.MessageBox.confirm("消息");
      * 
      *     Beyondbit.Web.MessageBox.confirm("消息标题","消息内容");
      * 
      *     Beyondbit.Web.MessageBox.confirm("消息标题","消息内容",["是","否"]);
      * 
      *     // 显示不同的图标
      *     Beyondbit.Web.MessageBox.confirm("消息标题","消息内容",["确定","取消"],"warning");
      *     
      *     // 最后一个参数是Fun，则都为回调函数
      *     Beyondbit.Web.MessageBox.confirm("消息标题","消息内容",["是","否"],"warning",function(result){
      *         if(result==true){
      *            alert("点击了确定");
      *         }else{
      *            alert("点击了取消");
      *         }
      *     });
      * 
      *     Beyondbit.Web.MessageBox.confirm("消息标题","消息内容",["是","否"],function(){
      *         alert("点击了");
      *     });
      * 
      *     Beyondbit.Web.MessageBox.confirm("消息标题","消息内容",function(){
      *         alert("点击了");
      *     });
      */
    MessageBox.confirm = function (title, message, text, icon, onsuccess) {
        var unqueid = "confirm";
        if (arguments.length == 0) {
            return Beyondbit.Web.MessageBox.Manager.findByID(unqueid);
        };
        var _title, _message, _text, _icon;
        var callback;
        var length = arguments.length;
        if (length > 1) {
            if (arguments[length - 1] && $.isFunction(arguments[length - 1])) {
                callback = arguments[length - 1];
                switch (length) {
                    case 2:
                        _message = title;
                        break;
                    case 3:
                        _title = title;
                        _message = message;
                        break;
                    case 4:
                        _title = title;
                        _message = message;
                        _text = text;
                        break;
                    default:
                        _title = title;
                        _message = message;
                        _text = text;
                        _icon = icon;
                        break;
                }
            }
            else {
                _title = title;
                _message = message;
                _text = text;
                _icon = icon;
            }
        }
        else {
            _message = title;
        }
        _text = _text || [getRegional().messages.ok, getRegional().messages.cancel];
        _icon = _icon || Beyondbit.Web.MessageBox.Icons.QUESTION;


        var confirmCallback = function (flag) {
            if (callback) {
                callback(flag);
            }
        }

        return Beyondbit.Web.MessageBox.show({
            id: unqueid,
            content: _message,
            title: _title,
            icon: _icon,
            draggable: true,
            btns: [
                {
                    text: _text[0],
                    callback: confirmCallback,
                    defindValue: true
                },
                {
                    text: _text[1],
                    callback: confirmCallback,
                    defindValue: false
                }
            ],
            closeBtn: { show: true, callback: confirmCallback, defindValue: false }
        });
    };

    /**
      * 显示可提示用户进行输入的对话框，返回用户输入的文本，等同prompt效果
      * @method prompt
      * @static
      * @param {String} [title] 标题
      * @param {String} [text] 提示内容
      * @param {String} [defaultText] 输入框的默认值
      * @param {String} [icon] 提示的Icon图标 @default " info "
      * @param {Fun} [onSuccess] 点击按钮后的回调事件 
      * @example
      * 
      *     Beyondbit.Web.MessageBox.prompt("系统","你的名字？",function(value){
	  *		     Beyondbit.Web.MessageBox.alert("你的名字：" + value);
	  *	    });
	  * 
      */
    MessageBox.prompt = function (title, text, defaultText, icon, onsuccess) {
        var _title, _text, _defaultText, _icon;
        var unqueid = "prompt";
        var length = arguments.length;
        if (length == 0) {
            return Beyondbit.Web.MessageBox.Manager.findByID(unqueid);
        };
        if (length == 1) {
            _text = title;
        }
        else {
            if (arguments[length - 1] && $.isFunction(arguments[length - 1])) {
                onsuccess = arguments[arguments.length - 1];
                switch (length) {
                    case 2:
                        _text = title;
                        break;
                    case 3:
                        _title = title;
                        _text = text;
                        break;
                    case 4:
                        _title = title;
                        _text = text;
                        _defaultText = defaultText;
                        break;
                    default:
                        _title = title;
                        _text = text;
                        _defaultText = defaultText;
                        _icon = icon;
                        break;
                }
            }
            else {
                _title = title;
                _text = text;
                _defaultText = defaultText;
                _icon = icon;
            }
        }

        _defaultText = _defaultText || "";

        var _content = text + '\n<input type="text" name="txtpromptcontent" value="' + _defaultText + '" />';

        _icon = _icon || Beyondbit.Web.MessageBox.Icons.QUESTION;

        return Beyondbit.Web.MessageBox.show({
            id: unqueid,
            title: _title,
            content: _content,
            icon: _icon,
            draggable: true,
            btns: [
                {
                    text: getRegional().messages.ok,
                    callback: function () {
                        if (onsuccess) {
                            return onsuccess(this.rootNode.find(":text[name=txtpromptcontent]").val());
                        }
                        return;
                    },
                    defindValue: ""
                }
            ],
            closeBtn: { show: true, callback: onsuccess, defindValue: "" }
        });
    }


    /**
      * 显示加载效果
      * @method loading
      * @static
      * @param {String|Boolean} [title][isHide] 标题【此值如果为false，则隐藏loading效果】
      * @param {String} [message] 消息内容 @default " 加载中.. "
      * @param {Number} [closeSpeed] 自动关闭隐藏的时间，单位毫秒. 设置此值后，会在closeSpeed毫秒后自动闭关隐藏
      * @param {Fun} [closeFn] 关闭后的回调事件 
      * @example
      *    
      *     // 显示Loading效果
      *     Beyondbit.Web.MessageBox.loading();
      *     
      *     Beyondbit.Web.MessageBox.loading("标题","加载中")   
      *     
      *     // 1S后自动隐藏
      *     Beyondbit.Web.MessageBox.loading("标题","加载中",1000)   
      *     
      *     // 隐藏Loading效果
      *     Beyondbit.Web.MessageBox.loading();
      *    
      */
    MessageBox.loading = function (title, message, closeSpeed, closeFn) {
        var unqueid = "loading";
        var _closeSpeed, _closeFn, _title, _message;
        if ($.isNumeric(title)) {
            // 如果第一个参数为数字，则为关闭时间
            _closeSpeed = title;
            _closeFn = message;
        } else {
            if (title == false) {
                // 关闭Loading窗口
                $("#" + unqueid).hide();
                return true;
            }
            _title = title;
            _message = message;
            _closeSpeed = closeSpeed; _closeFn = closeFn;
        }

        // 显示Loading窗口 
        if (_closeSpeed) {
            setTimeout(function () {
                var closeReturn = true;
                if (_closeFn) {
                    closeReturn = _closeFn();
                }
                if (!(closeReturn == false)) {
                    Beyondbit.Web.MessageBox.loading(false);
                }
            }, _closeSpeed);
        }
        var zindex = B.Web.get_zIndex();
        var html = $("#" + unqueid);
        if (html.length == 0) {
            $("body").append('<div id="loading" class="loading">'
                            +'  <div class="loading-content"></div>'
                            + '</div>');
            html = $("#" + unqueid);
        }

        var textHtml = '';
        var message = _message || getRegional().sysTips.loadingContent;
        $.each(message, function (index) {
            textHtml += "<span>{0}</span>".bformat(message.charAt(index));
        });

        html.css("z-index", zindex).find(">div").html(textHtml);
        html.show();
    };




    function Manager() {
        var stance = this;
        stance.findByID = function (id, context) {
            context = context || window;
            return context.Beyondbit.Web.MessageBox.ManagerHelper.findMessageBox(id);
        };

        stance.create = function (options, context) {
            context = context || window;
            return new context.Beyondbit.Web.MessageBox.init(options);
        };
    };

    MessageBox.Manager = new Manager();


    Beyondbit.register("Web.MessageBox", function () {
        return {
            hide: function (id) {
                id = id || "gloabid";
                var mgb = Beyondbit.Web.MessageBox.Manager.findByID(id);
                if (mgb) {
                    mgb.hide();
                };
                return mgb;
            },
            show: function (options) {
                return Beyondbit.Web.MessageBox.Manager.create(options).show();
            },
            init: function (options) {
                var options = $.extend({
                    id: "gloabid",
                    title: "",          // 标题
                    content: null,      // 内容，如果此不为空，则为文本内容显示，否则为Ifame方式显示
                    btns: null,         // 按钮集合，可系统按钮，或者自定义一个按钮集合，自定方格式为["确定","取消"]
                    icon: null,         // 图标，可系统图标，或者自定义一个图片地址,
                    closeBtn: { show: true, callback: null, defindValue: null },    // 是否显示关闭按钮
                    width: 400,
                    maxHeight: 500,
                    shadow: true,      //是否阴影
                    draggable: false,     //是否拖动
                    className: null 
                }, options);
                var findObj = Beyondbit.Web.MessageBox.Manager.findByID(options.id);
                if (findObj) {
                    findObj._initData.options = options;
                    findObj._init(findObj._initData);
                    return findObj;
                };
                var that = this;
                Beyondbit.Web.MessageBox.ManagerHelper.addMessageBox(options.id, this);


                var id = "messagebox_" + options.id;
                var idShadow = id + "_shadow";

                // 初始化HTML
                var root = $("#" + id);
                if (root.length == 0) {
                    $("body").append(' <div class="shadow" id="' + idShadow + '"></div>'
                            + ' <div class="messagebox" id="' + id + '">'
                            + '     <section class="shead"><h4>&nbsp;</h4></section>'
                            + '     <a href="" class="close" title="'+getRegional().messages.close+'"><i class="fa fa-close"></i></a>'
                            + '     <section class="sbody">'
                            + '         <div class="sicon">'
                            + '             <span class="fa-stack fa-lg">'
                            + '                 <i class="fa fa-stack-2x fa-circle"></i>'
                            + '                 <i class="fa fa-stack-1x fa-info messagebox-icon" data-beforeicon="fa-info"></i>'
                            + '             </span>'
                            + '         </div>'
                            + '         <div class="scontent"></div>'
                            + '     </section>'
                            + '    <section class="sfoot"></section>'
                            + '</div>')
                    root = $("#" + id);
                }

                var rootShadow = $("#" + idShadow);

                that.rootNode = root;
                that._initData = { root: root, rootShadow: rootShadow, options: options };
                // 初始化封装
                that._init = function (initdata) {
                    var sender = this;
                    var options = initdata.options;
                    var root = initdata.root;
                    root.attr("class", "messagebox" + (" " + options.className || ""));
                    
                    var _zindex = Beyondbit.Web.MessageBox.ManagerHelper.get_zIndex();
                    rootShadow.css("z-index", _zindex);
                    root.css("z-index", _zindex);

                    // 是否需要关闭按钮
                    if (options.closeBtn.show) {
                        root.find(" > .close").off("click").click(function () {
                            var closeReturn = true;
                            if (options.closeBtn.callback) { closeReturn = options.closeBtn.callback.call(sender, options.closeBtn.defindValue); }
                            if (!(closeReturn == false)) {
                                sender.hide();
                            }
                            return false;
                        });
                    } else {
                        root.find(" > .close").hide();
                    }

                    // 是否可拖动
                    if (options.draggable && root.draggable && sender.draggableDone != true) {
                        $(" > .shead > h4", root).css({ cursor: "move" });
                        root.draggable({ cursor: "move", handle: "> .shead > h4", containment: "window" });
                        sender.draggableDone = true;
                    }

                    root.find(" > .shead > h4").html(options.title || "&nbsp;");


                    // load icon
                    var $icon = $(".messagebox-icon", root);
                    var beforeIcon = $icon.data("beforeicon");
                    var icon = options.icon || "fa-info";
                    if (beforeIcon !== icon) {
                        $icon.removeClass(beforeIcon).addClass(icon);
                        $icon.data("beforeicon", icon);
                    }

                    $(".scontent", root).html(options.content);

                    // load buttons
                    var $foot = $(".sfoot", root).html("");
                    if (options.btns && options.btns.length > 0) {
                        $foot.show();
                        $.each(options.btns, function (i, v) {
                            var $btn = $('<a href="#" class="btn"><i class="fa {icon}"></i>{text}</a>'
                                    .bformat({
                                        text: v.text,
                                        icon: v.iconclass || v.icon
                                    })
                                ).click(function () {
                                    var closeReturn = true;
                                    if (v.callback) { closeReturn = v.callback.call(sender, v.defindValue); }
                                    if (!(closeReturn == false)) {
                                        sender.hide();
                                    }
                                    return false;
                                });
                            $foot.append($btn);
                        });
                    } else {
                        $foot.hide();
                    };

                    var winWidth = $(window).width();
                    var winHeight = $(window).height() - 20;
                    var maxHeight = Math.min(options.maxHeight, winHeight);
                    var height = root.height();
                    var width = Math.min(options.width, winWidth);
                    if (height > maxHeight) {
                        height = maxHeight;
                        var sbodyHeight = height - $(".shead", root).height() - $(".sfoot", root).height() - 40;
                        $(".sbody", root).height(sbodyHeight);
                    }


                    root.css({
                        width: width + "px",
                        "margin-left": "0",
                        "margin-top": "0",
                        "left": (winWidth - width) / 2 + "px",
                        "top":  (winHeight - height) / 2 + "px"
                        });
                }

                that._init(that._initData);

                that.hide = function () {
                    root.hide(); rootShadow.hide();
                    return that;
                };
                that.show = function () {
                    root.show();
                    // 是否需要遮挡层
                    if (options.shadow) { rootShadow.show(); } else { rootShadow.hide(); }
                    return that;
                }

                that.show();
                return that;
            }
        };
    });

    
    


    Beyondbit.register("Web.MessageBox", function () {
        return {
            ManagerHelper: {
                get_zIndex: function () {
                    return B.Web.get_zIndex();
                },
                _Queue: {},
                addMessageBox: function (key, objModel) {
                    Beyondbit.Web.MessageBox.ManagerHelper._Queue[key] = objModel;
                },
                findMessageBox: function (key) {
                    var helper = Beyondbit.Web.MessageBox.ManagerHelper;
                    for (var item in helper._Queue) {
                        if (item == key) {
                            return helper._Queue[key];
                        }
                    }
                    return null;
                }
            }
        };
    });

})(jQuery, Beyondbit);



(function ($, B) {
    /**
     * 相关 Web 界面的类集合
     * @module Beyondbit.Web
     * @submodule Web
     */
    var web = B.registerNameSpace("Web");



    function WindowManager() {
        /**
          * 根据ID查找一个Window
          * @method findByID
          * @static
          * @param {String} id 标识
          * @param {Object} [context] 查找的上下文环境，如window、parent、top、self
          * @example
          *    
          *     var dialog = Beyondbit.Web.WindowManager.findByID("dialog");
          *    
          */
        this.findByID = function (id, context) {
            context = context || window;
            return context.Beyondbit.Web.WindowManagerHelper.findWindow(id);
        };

        /**
          * 根据ID在父窗口下查找Window
          * @method findForParentByID
          * @param {String} id 标识
          * @static
          * @example
          *    
          *     var dialog = Beyondbit.Web.WindowManager.findForParentByID("dialog");
          *    
          */
        this.findForParentByID = function (id) {
            return this.findByID(id, parent);
        };

        /**
          * 创建一个Window对象
          * @method create
          * @param {json} options Window对象的公开属性
          * @param {Object} [context] 要在哪个上下文环境创建，如window、parent、top、self
          * @param {String} [createMode=once] 创建模式. "once 只创建一次","always 一直创建"
          * @static
          * @example
          *    
          *     // 创建
          *     var dialog = Beyondbit.Web.WindowManager.create({
          *         id:"dialog",
          *         width:500,
          *         height:400,
          *         title:"标题",
          *         url:"http://www.beyondbit.com"
          *     });
          *     // 显示
          *     dialog.show();
          *    
          */
        this.create = function (options, context, createMode) {
            context = context || window;
            createMode = createMode || "once";
            if (createMode == "always") {
                var dialog = this.findByID(options.id, context);
                if (dialog) {
                    dialog.destory();
                }
            }
            return new context.Beyondbit.Web.Window(options);
        };


        /**
          * 获取当前所在Window对象，通常用于在Window窗口下的页面使用
          * @method get
          * @param {IE.window} [context=parent] 当前Window窗口的上下文环境，浏览器对象
          * @static
          * @since 2.0.0
          * @example
          *
          *     var dialog = B.Web.WindowManager.get();
          *     var dialog = B.Web.WindowManager.get(window);
          *    
          */
        /**
          * [重构]根据ID，获取Window对象
          * @method get
          * @param {String} id 用于查找的window对象的id;
          * @param {IE.window} [context=window] 当前Window窗口的上下文环境，浏览器对象
          * @static
          * @since 2.0.0
          * @example
          *
          *     var dialog = B.Web.WindowManager.get("dialogEdit");
          *     var dialog = B.Web.WindowManager.get("dialogEdit",parent);
          *    
          */
        this.get = function (id, context) {
            if (id) {
                if ($.type(id) == "string") {
                    return B.Web.WindowManager.findByID(id, context);
                }
            }
            context = id;
            context = context || parent;
            var url = B.Url.current;
            var id = url.queryString("DialogId");
            return this.findByID(id, context);
        }
    };

    /**
     * Window 管理方法操作集合
     * @class WindowManager
     * @static
     */
    web.WindowManager = new WindowManager();

    /**
     * 弹出窗口
     * @class Window
     * 
     */

    
    web.Window = function(options) {
        var options = $.extend({
            /**
             * 弹出窗口的标识，唯一，如果标识不唯一，则返回之前已经创建过的Window对象
             * @property id
             * @type String
             * @required
             */
            id: "",
            /**
             * 是否需要阴影遮挡层
             * @property shadow
             * @type Boolean
             * @default false
             */
            shadow: false, 		
            /**
             * 是否可拖动，【注意：设置为ture后，需要配合jQuery UI 实现】
             * @property draggable
             * @type Boolean
             * @default true
             */
            draggable: true,
            /**
             * 加载页面时，loading的效果. 可选的值有三种:none[无效果]、away[一直]、normal[只显示一次]
             * @property loading
             * @type String
             * @default "none"
             */
            loading: "normal", 	
            /**
             * 窗口的宽度，单位px，如果宽度大小超过当前浏览器可视窗口，则显示浏览器可视窗口大小
             * @property width
             * @type Number
             * @default 400
             */
            width: 400, 	    
            /**
             * 窗口的高度，单位px，如果高度大小超过当前浏览器可视窗口，则显示浏览器可视窗口大小
             * @property height
             * @type Number
             * @default 100
             */
            height: 100,
            /**
             * 窗口显示的内容，此属性和url属性只能有一个起作用，当url为null时，此属性才有作用
             * @property content
             * @type jQuery
             * @example
             * 
             *     // 显示文本
             *     Beyondbit.Web.WindowManager.create({
             *          id:"dialog",
             *          content:"<div>显示的内容</div>"
             *     })
             * 
             *     <html>
             *          <div id="box">
             *              标题：<input type="text" />
             *          </div>
             *     </html>
             * 
             *     <script>
             *         Beyondbit.Web.WindowManager.create({
             *             id:"dialogMulpex",
             *             content:$("#box").detach();
             *         })
             *     </script>
             */
            content: null, 		// 内容，如果此不为空，则为文本内容显示，否则为Ifame方式显示
            /**
             * 显示的标题
             * @property title
             * @type String
             */
            title: "",
            /**
             * 显示的Url
             * @property url
             * @type String
             * @example
             * 
             *     Beyondbit.Web.WindowManager.create({
             *          id:"dialogUrl",
             *          url:"http://www.beyondbit.com"
             *     })
             */
            url: "", 			// iframe url
            /**
             * 按钮集合
             * @property buttons
             * @type Array
             * @example
             * 
             *     Beyondbit.Web.WindowManager.create({
             *         id:"dialog",
             *         button:[{
             *            text: "保存",
             *            icon: "save",
             *            events:{
             *              click:function(){
             *                 alert("保存了");
             *              }
             *            }
             *         }]
             *     })
             */
            buttons: [],
            data: {},

            requestData: {}, 	
            /**
             * 窗口调用ok([data])方法后，返回resultCode==OK时触发的事件
             * @event onOk 
             * @param {object} [data] 调用window.ok时传递的数据
             */
            onOk: null,
            /**
             * 窗口调用close([data])方法后触发的事件
             * @event onClose 
             * @param {String} resultCode 调用时返回的状态码，调用ok方法，返回"ok",调用cancel返回"cancel"，其它自定义
             * @param {object} [data] 调用window.close时传递的数据
             */
            onClose: null,
            /**
             * 窗口调用cancel([data])方法后，返回resultCode==cancel时触发的事件
             * @event onCancel 
             * @param {object} [data] 调用window.close时传递的数据
             */
            onCancel: null
        }, options);

        this.ID = options.id;
        if (!this.ID || this.ID == "") {
            throw getRegional().notAllowIdIsEmpty;
        }
        var loader = this;
        this.Data = options.data;

        var manager = Beyondbit.Web.WindowManager;
        var tempZjObj = manager.findByID(this.ID);
        if (tempZjObj) {
            return tempZjObj;
        }
        Beyondbit.Web.WindowManagerHelper.addWindow(this.ID, this);

        var helper = Beyondbit.Web.WindowHelper;

        this.ElementID = 'mzj_' + this.ID + '_box';
        var defineProp = { frameUrl: "", rootElement: null, contentMode: "iframe" };

        var tDiv = "";
        tDiv = tDiv + '<div id="' + this.ElementID + '_shadow" class="shadow window-shadow"  style="display:none;"></div>';
        tDiv = tDiv + '<div id="' + this.ElementID + '" class="window" style="display:none;">'
                        + '<div class="window-box">'
                         + '<section class="shead">'
                         + '    <h3>' + options.title + '</h3>'
                         + '</section>'
                         + '<section class="sbody">'
                         + '    <iframe src="#" frameborder="0" scrolling="auto"></iframe>'
                         + '     <section class="scontainer"></section>'
                         + '</section>'
                         + '<section class="sfoot"></section><div class="window-loading loading">'
                         + '		<div class="loading-content">'
                         +           getLoadingText()
                         + '		</div>'
                         + '	</div>'
                         + '<a href="#" class="close btn btn-img" onclick="return false;" title="{0}"><i class="fa fa-times-circle"></i><label>{0}</label></a>'.bformat(getRegional().buttons.close)
                     + '</div>';
        $("body").append(tDiv);

        var rootElement = defineProp.rootElement = $("#" + this.ElementID);
        var rootElementShadow = $("#" + this.ElementID + "_shadow");
        var $windowBox = $("> .window-box", rootElement);

        $("a.close", rootElement).click(function () {
            if (options.onClose) {
                options.onClose("close");
            }
            loader.hide();
        });

        var buttons = options.buttons;
        if (buttons && buttons.length > 0) {
            $windowBox.addClass("window-style-foot");
            var $dialogButtons = $(".sfoot", rootElement);
            $.each(buttons, function (index, button) {
                var $button = $('<a href="#" onclick="return false;" class="btn"><span class="icon icon-' + button.icon + '"></span>' + button.text + '</a>')
                if (button.events) {
                    $.each(button.events, function (key, event) {
                        $button.on(key, event);
                    })
                }
                $dialogButtons.append($button)
            })

        }

        if (options.draggable && rootElement.draggable) {
            $("section.shead > h3", rootElement).css({ cursor: "move" });
            rootElement.draggable({ cursor: "move", handle: "section.shead > h3", containment: "window" });
        }
        this.getOptions = function () {
            return options;
        };
        /**
          * 显示弹出窗口
          * @method show
          * @example
          *    
          *     var dialog = Beyondbit.Web.WindowManager.create({
          *        id:"dialog",
          *        content:"内容"
          *     });
          *     dialog.show();
          *    
          */
        this.show = function () {
            loader.message({ hide: true });
            var zindex = B.Web.get_zIndex(2);
            rootElement.css("z-index", zindex).show(); 
            if (options.loading !== "none") {
                loader.message({ title: getRegional().loading , content: "" });
            }
            if (options.shadow) {
                rootElementShadow.css("z-index", zindex - 1 ).show();
            } else {
            }

            if (defineProp.contentMode == "iframe") {
                rootElement.find("iframe").attr("src", defineProp.frameUrl).css({ "display": "block", "visibility": "visible" }).siblings().hide();
            } else {
                rootElement.find(".scontainer").show().siblings().hide();
                loader.message({ hide: true });
            }
            return loader;
        };
        /**
          * 显示提示信息
          * @method message
          * @chainable
          * @param {json} options 显示的参数
          *     @param {String} options.title 显示消息的标题
          *     @param {String} options.content 显示消息的内容
          *     @param {Boolean} [options.hide] 是否隐藏消息 默认false
          * @return {Window} 返回Window对象本身，链式调用
          * @example
          *     
          *     var dialog = Beyondbit.Web.WindowManager.create({
          *       id:"dialog",
          *       width:600,
          *       height:400
          *     }).show();
          *     
          *     // 显示信息
          *     dialog.message({
          *         title:"提示信息",
          *         content:"提示信息内容"
          *     });
          *     
          *     //隐藏信息
          *     dialog.message({
          *          hide:true
          *     });
          */
        this.message = function (options) {
            var config = $.extend({
                hide: false,
                title: getRegional().loading,
                content: ""
            }, options);
            helper.message(loader, config, defineProp);
            rootElement.show();
            return loader;
        };

        /**
          * 更改窗口的属性选项
          * @method setOptions
          * @chainable
          * @param {json} options 请参考Window的属性
          * @return {Window} 返回Window对象本身，链式调用
          * @example
          *
          *     var dialog = Beyondbit.Web.WindowManager.create({
          *         id:"dialog",
          *         url:"http://www.baidu.com"
          *     });
          *     dialog.setOptions({
          *        url:"http://www.beyondbit.com"
          *     });
          *    
          */
        this.setOptions = function (option) {
            options = $.extend(options, option);
            helper.initWindow(loader, options, defineProp);
            return loader;
        };

        /**
          * 关闭窗口，并触发onClose事件
          * @method close
          * @chainable
          * @param {String} resultCode 关闭结果码
          * @param {Object} [data] 返回的数据
          * @return {Window} 返回Window对象本身，链式调用
          * @example
          *
          *     var dialog = Beyondbit.Web.WindowManager.create({
          *         id:"dialog",
          *         url:"http://www.baidu.com"
          *     });
          * 
          *     dialog.close(
          *         "close"
          *         ,{
          *           name:"luolong",
          *           value:"value1"
          *     });
          *    
          */
        this.close = function (resultCode, data) {
            if (options.onClose) {
                options.onClose.call(this, resultCode, data);
            }
            this.hide();
            return loader;
        };
        /**
          * 关闭窗口，并触发onOk,onClose("ok")事件
          * @method ok
          * @chainable
          * @param {Object} [data] 返回的数据
          * @return {Window} 返回Window对象本身，链式调用
          * @example
          *
          *     var dialog = Beyondbit.Web.WindowManager.create({
          *         id:"dialog",
          *         url:"http://www.baidu.com"
          *     });
          * 
          *     dialog.ok(
          *         {
          *           name:"luolong",
          *           value:"value1"
          *     });
          *    
          */
        this.ok = function (data) {
            var isHandler = false;
            if (options.onOk) {
                isHandler = true;
                options.onOk.call(this, data);
            }
            if (options.onClose) {
                isHandler = true;
                options.onClose.call(this, "ok", data);
            }
            if (!isHandler) {
                this.hide();
            }
            return loader;
        };
        /**
          * 关闭窗口，并触发onCancel,onClose("cancel")事件
          * @method cancel
          * @chainable
          * @param {Object} [data] 返回的数据
          * @return {Window} 返回Window对象本身，链式调用
          * @example
          *
          *     var dialog = Beyondbit.Web.WindowManager.create({
          *         id:"dialog",
          *         url:"http://www.baidu.com"
          *     });
          * 
          *     dialog.cancel(
          *         {
          *           name:"luolong",
          *           value:"value1"
          *     });
          *    
          */
        this.cancel = function (data) {
            var isHandler = false;
            if (options.onCancel) {
                isHandler = true;
                options.onCancel.call(this, data);
            }
            if (options.onClose) {
                isHandler = true;
                options.onClose.call(this, "cancel", data);
            }
            if (!isHandler) {
                this.hide();
            }
            return loader;
        };

        /**
          * 关闭窗口，不触发事件
          * @method hide
          * @chainable
          * @return {Window} 返回Window对象本身，链式调用
          * @example
          *
          *     var dialog = Beyondbit.Web.WindowManager.create({
          *         id:"dialog",
          *         url:"http://www.baidu.com"
          *     });
          * 
          *     dialog.hide();
          *    
          */
        this.hide = function () {
            rootElement.find("iframe").css("visibility", "hidden");
            rootElementShadow.hide();
            setTimeout(function () {
                rootElement.hide();
            }, 50);
            return loader;
        };

       /**
         * 销毁当前窗口
         * @method destory 
         */
        this.destory = function () {
            rootElement.remove();
            rootElementShadow.remove();
            Beyondbit.Web.WindowManagerHelper.removeWindow(this.ID);
        };

        helper.initWindow(loader, options, defineProp);

        return loader;
    }


    web.Window.regional = [];

    web.Window.regional[""] = web.Window.regional["zh-CN"] = {
        notAllowIdIsEmpty: "组件Id不能为空",
        loading: "正在加载..",
        buttons: {
            close: "关闭"
        }
    }

    function getRegional() {
        return web.Window.regional[B.CultureInfo.Current.get()];
    }


    // 获取loading文本
    function getLoadingText() {
        var loading = getRegional().loading;

        var textHtml = "";

        $.each(loading, function (index) {
            textHtml += "<span>{0}</span>".bformat(loading.charAt(index));
        });

        return textHtml;
    }

    Beyondbit.register("Web", function () {
        return {
            WindowHelper: {
                initWindow: function (sender, options, defineProp) {
                    var contentMode = options.content ? "content" : "iframe";
                    var tElement = defineProp.rootElement;

                    var tempTems = options.url.indexOf('?') > -1 ? "&" : "?";
                    var strUrl = options.url + tempTems + "DialogId=" + sender.ID;
                    for (var key in options.requestData) {
                        var item = options.requestData[key];
                        strUrl = strUrl + "&" + key + "=" + encodeURIComponent(item);
                    }
                    defineProp.frameUrl = strUrl;
                    defineProp.contentMode = contentMode;
                    if (contentMode == "iframe") {
                        if ($("iframe", tElement).length > 0) {
                            $("iframe", tElement)[0].onreadystatechange = $("iframe", tElement)[0].onload = function () {
                                if (this.readyState && this.readyState != 'complete') {
                                    if (options.loading == "away") {
                                        //$(".dialog_loader", tElement).show();
                                        Beyondbit.Web.WindowHelper.message(sender, { title: getRegional().loading, content: "" }, defineProp);
                                    }
                                    return;
                                }
                                else {
                                    //$(".dialog_loader", tElement).hide();
                                    Beyondbit.Web.WindowHelper.message(sender, { hide: true }, defineProp);
                                }
                            };
                        }
                    }
                    $("section.scontainer", tElement).html(options.content);
                    $("section.shead h3", tElement).html(options.title);

                    var _height = $(window).height() - 20;
                    if (_height > options.height) {
                        _height = options.height;
                    }
                    var _width = $(window).width() - 20;
                    if (_width > options.width) {
                        _width = options.width;
                    }

                    tElement.css({
                        "width": _width + "px",
                        "height": _height + "px"
                    });

                    if ($.support.boxSizing == false) {
                        // if (IE6/7)
                        tElement.css({
                            "margin-left": "-" + _width / 2 + "px",
                            "margin-top": "-" + _height / 2 + "px"
                        });
                    }

                    var winWidth = $(window).width();
                    var winHeight = $(window).height() - 20;

                    tElement.css({
                        width: _width + "px",
                        "margin-left": "0",
                        "margin-top": "0",
                        "bottom": "auto",
                        "right": "auto",
                        "left": (winWidth - _width) / 2 + "px",
                        "top": (winHeight - _height) / 2 + "px"
                    });


                    var containerHeight = _height - $("section.shead", tElement).height();
                    var $windowBox = $("> .window-box", tElement);
                    var $buttons = $("section.sfoot", tElement);
                    if ($windowBox.hasClass("window-style-foot")) {
                        tElement.find("section.sbody").addClass("dialog_container_layout_nobuttons");
                        containerHeight = containerHeight - $buttons.outerHeight();
                    }

                    tElement.find("section.sbody").height(containerHeight);
                    return sender;
                },
                message: function (sender, config, defineProp) {
                    if (config.hide == true) {
                        $(".window-loading", defineProp.rootElement).hide();
                    } else {
                        var textHtml = '';
                        var message = config.title;
                        $.each(message, function (index) {
                            textHtml += "<span>{0}</span>".bformat(message.charAt(index));
                        });
                        $(".window-loading", defineProp.rootElement).find(".loading-content").html(textHtml);
                        $(".window-loading", defineProp.rootElement).show();
                    }
                }
            },
            WindowManagerHelper: {
                _Queue: {},
                addWindow: function (key, objModel) {
                    Beyondbit.Web.WindowManagerHelper._Queue[key] = objModel;
                },
                findWindow: function (key) {
                    var dialog = Beyondbit.Web.WindowManagerHelper._Queue[key];
                    if (dialog) {
                        return dialog;
                    }
                    return null;
                },
                removeWindow: function (key) {
                    delete Beyondbit.Web.WindowManagerHelper._Queue[key];
                }

            }
        };
    });
})(jQuery,Beyondbit);
(function ($, B) {
    /**
     * 相关 Web 界面的类集合
     * @module Beyondbit.Web
     * @submodule Web
     */
    var Web = B.registerNameSpace("Web");

    var globalZindex = 100;
    /**
      * 获取ZIndex自增标识
      */
    Web.get_zIndex = function (step) {
        globalZindex = globalZindex + (step || 1);
        return globalZindex;
    };

})(jQuery, Beyondbit);
(function () {
    /**
      * 扩展类集合
      * @module Extensions
      */

    /**
     * Date扩展
     * @class DateEx
     */

    /**
      * 对Date的扩展，将 Date 转化为指定格式的String
      * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
      * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
      * 
      * @method bformat
      * @param {String} format 时间格式化字符串，时间Format语法
      * @example
      *     
      *     (new Date()).bformat("yyyy-MM-dd hh:mm:ss.S"); //==> 2014-11-15 08:09:04.423  
      *     (new Date()).bformat("yyyy-M-d h:m:s.S");      //==> 2014-11-15 8:9:4.18 
      */
    Date.prototype.bformat = function (fmt) { //author: meizz 
        var o = {
            "M+": this.getMonth() + 1, //月份 
            "d+": this.getDate(), //日 
            "h+": this.getHours(), //小时 
            "m+": this.getMinutes(), //分 
            "s+": this.getSeconds(), //秒 
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
            "S": this.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
})();
(function ($) {

    var KBCount = 1024;
    var MBCount = KBCount * 1024;
    var GBCount = MBCount * 1024;
    var TBCount = GBCount * 1024;

    $.extend({
        GetAutoSizeString: function GetAutoSizeString(size, roundCount) {
            if (KBCount > size) {

                return Math.round(size, roundCount) + "B";
            }
            else if (MBCount > size) {
                return Math.round(size / KBCount, roundCount) + "KB";
            }
            else if (GBCount > size) {
                return Math.round(size / MBCount, roundCount) + "MB";
            }
            else if (TBCount > size) {
                return Math.round(size / GBCount, roundCount) + "GB";
            }
            else {
                return Math.round(size / TBCount, roundCount) + "TB";
            }
        }
    });
})(jQuery);
(function () {


    /**
      * 扩展类集合
      * @module Extensions
      */

    /**
     * String扩展
     * @class StringEx
     */

    /**
      * 字符串格式化方法
      * @method bformat
      * @param {JSON|any} 参数，可以为JSON，也可以为String
      * @example
      *     
      *     // string 模式
      *     "Hello，{0}！".bformat("luolong");
      *     "Hello，{0}！Welcome to {1}.".bformat("luolong","shanghai");
      *     // json 模式
      *     "Hello，{name}！Welcome to {address}.".bformat({name: "luolong",address: "shanghai"});
      */
    String.prototype.bformat = function (args) {
        var result = this;
        if (arguments.length > 0) {
            if (arguments.length == 1 && typeof (args) == "object") {
                for (var key in args) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key] || "");
                }
            }
            else {
                for (var i = 0; i < arguments.length; i++) {
                    var reg = new RegExp("({[" + i + "]})", "g");
                    var value = arguments[i];
                    result = result.replace(reg, (value == null || value == undefined) ? "" : value);
                }
            }
        }
        return result;
    }

    /**
      * 转换Date字符串为日期类型
      *     解决MvcJsonResut后时间类型字符串转换为"/Date(1415787137527)/"这种格式后，转换JS日期;
      * 
      * @method parseMvcDate
      * @example
      *
      *     var date = "/Date(1415787137527)/".parseToDate();
      *     var date2 = "2014-11-12".parseToDate(); 
      *    
      */
    String.prototype.parseToDate = function () {
        var date = this;
        var index = date.indexOf("/Date");
        if (index == 0) {
            date = date.substring(6, date.length - 2);
            return new Date(date - 0);
        }
        date = date.replace(/-/g, "/");
        return new Date(date);
    }

    /**
	  * 用于把一个字符串分割成字符串数组
	  * @method splitRemoveEmptys
	  * @param {String} separator 字符串或正则表达式，从该参数指定的地方分割 stringObject
	  * @param {Number} [howmany] 该参数可指定返回的数组的最大长度
	  * @param {Boolean} [isRemoveEmptys] 可选。是否删除空字符串
	  * @returns Array
	  */
    String.prototype.splitRemoveEmptys = function (separator, howmany, isRemoveEmptys) {
        var strArray = this.split(separator, howmany || 1000);
        if (isRemoveEmptys != false) {
            isRemoveEmptys = true;
        }
        if (isRemoveEmptys) {
            for (var index in strArray) {
                if (strArray[index] - 0 == 0) {
                    strArray.splice(index, 1);
                }
            }
        }
        return strArray;
    }
})();
(function ($, B) {

    var pager = B.registerNameSpace("jQueryEx.Pager");

    pager.regional = [];

    pager.regional[""] = pager.regional["zh-CN"] = {
        prevText: "上一页",
        nextText: "下一页",
        pageCurrent: "当前页",
        pageTotal: "总页数",
        pageSize: "每页",
        recordTotal: "总数",
        redirect: "跳转至",
        recordUnit: "条"
    }

    function getRegional() {
        return pager.regional[B.CultureInfo.Current.get()];
    }

    var CACHE_KEY = "pager";
    var HttpMethod = { Get: "get", Post: "post" };
    var Alignment = { Left: "left", Center: "center", right: "right" };

    function getDefaultOptions() {
        return {
            align: Alignment.Center,
            pageSize: 15,
            count: 0,
            currentPageIndex: 0,
            type: HttpMethod.Get,
            pageIndexChanging: null,
            linkTo: window.location.href,
            prevText: getRegional().prevText,
            nextText: getRegional().nextText,
            pageIndexParamName: "pageIndex",
            pageSizeParamName: "pageSize",
            pageSizeItems: [10, 15, 20, 50],
            mode: 0,
            prevShowAlways: true,
            nextShowAlways: true,
            addToUrlDomIds: [],
            postForm: $("form:first")
        };
    }

    var util = function () { }

    util.addToUrlParam = function (url, name, value) {
        var str = name + "=" + encodeURIComponent(value);
        var urlArray = url.split("?");
        var urlSegment = urlArray[0];
        var querySegment = (urlArray.length > 1 ? urlArray[1] : "");
        var queryString = [];

        if (querySegment.length > 0) {
            if (querySegment.indexOf(name) == -1)
                return (url + "&" + str);

            queryString = querySegment.split("&");
        }
        else
            return (url + "?" + str);

        var i = 0;
        var buffer = "";

        while (true) {
            if (i >= queryString.length)
                return (urlSegment + "?" + buffer + str);

            var pair = queryString[i];

            if (pair.indexOf(name + "=") != 0 && (pair.length != 0))
                buffer += (pair + "&");

            ++i;
        }
    }

    util.makePagingUrl = function (options, pageIndex, pageSize) {
        var newPagingUrl = options.linkTo;
        var addToUrlDomIds = options.addToUrlDomIds;
        var map = {};
        map[options.pageIndexParamName] = pageIndex;
        map[options.pageSizeParamName] = pageSize;

        for (var i = 0; i < addToUrlDomIds.length; ++i) {
            var domId = addToUrlDomIds[i];
            var element = util.getElementsByIdOrName(domId);

            if (element != null)
                map[domId] = $(element).val();
        }

        for (var name in map)
            newPagingUrl = util.addToUrlParam(newPagingUrl, name, map[name]);

        return newPagingUrl;
    }

    util.getElementsByIdOrName = function (domId) {
        var element = document.getElementById(domId);

        if (element == null)
            return document.getElementsByName(domId);

        return element;
    }

    util.renderPageStatisticsItem = function ($container, className, label, value) {
        $container.append("<li class=\"" + className + "\">" + label + "<strong>" + value + "</strong>&nbsp;</li>");
    }

    util.renderPageNavigationItem = function ($container, className, text) {
        $container.append("【<a class=\"" + className + "\">" + text + "</a>】");
    }

    util.renderPageStatistics = function ($container, currentPageIndex, pageIndex, pageSize, count) {
        util.renderPageStatisticsItem($container, "lab-pagecurrent", getRegional().pageCurrent + ":", currentPageIndex);
        util.renderPageStatisticsItem($container, "lab-pagetotal", getRegional().pageTotal + ":", pageIndex);
        util.renderPageStatisticsItem($container, "lab-pagesize", getRegional().pageSize + ":", pageSize);
        util.renderPageStatisticsItem($container, "lab-recordtotal", getRegional().recordTotal + ":", count);
    }

    util.renderPageNavigation = function ($container, options) {
        var $layout = $("<li>").addClass("control");

        if (options.prevShowAlways)
            util.renderPageNavigationItem($layout, "prev", options.prevText);

        if (options.nextShowAlways)
            util.renderPageNavigationItem($layout, "next", options.nextText);

        $container.append($layout);
    }

    util.renderPageSizeOptions = function ($container, options) {
        var html = "<li class=pagesize>" + getRegional().pageSize + "&nbsp;<select>";
        $.each(options.pageSizeItems, function (i, n) {
            var selected = (n == options.pageSize) ? "selected" : "";
            html += "<option value=" + n + " " + selected + ">" + n + "</option>";
        });
        html += "</select>&nbsp;" + getRegional().recordUnit + "&nbsp;</li>";
        $container.append(html);
    }

    util.renderPageRedirect = function ($container) {
        var $layout = $("<li>").addClass("redirect");
        $layout.append(getRegional().redirect + " <input type=text name=page /> <a href=#>GO</a>");
        $container.append($layout);
    }

    util.calulatePageIndex = function (count, pageSize) {
        return Math.ceil(count / pageSize) - 1;
    }

    /**
     * 扩展jQuery对象集合
     * @module jQuery
     * 
     */

    /**
      * 分页控件
      * @class pager
      *    
      */

    /**
      * 分页控件
      * @method pager
      * @param {json} options 
      *     @param {String} [options.align=center] 对齐方式
      *     @param {Number} options.pageSize 每页显示记录数
      *     @param {Number} options.count 总记录数
      *     @param {Number} options.currentPageIndex 当前第几页
      *     @param {String} [options.type=get] 分页提交方式
      *     @param {Function} [options.pageIndexChanging=null] 分页变化回调函数
      *     @param {String} [options.linkTo=window.location.href] 分页链接
      *     @param {String} [options.prevText=上一页] 上一页显示文字
      *     @param {String} [options.nextText=下一页] 下一页显示文字
      *     @param {String} [options.pageIndexParamName=pageIndex] 当前第几页参数名称
      *     @param {String} [options.pageSizeParamName=pageSize] 每页显示记录数参数名称
      *     @param {Array} [options.pageSizeItems=10、15、20、50] 每页显示记录数项
      *     @param {Number} [options.mode=0] 分页索引偏移量
      *     @param {Boolean} [options.prevShowAlways=true] 始终显示上一页
      *     @param {Boolean} [options.nextShowAlways=true] 始终显示下一页
      *     @param {Object} [options.addToUrlDomIds=] 分页跳转时需要传递的Url参数
      *     @param {jQuery} [options.postForm=$("form:first")] 分页提交时的表单
      * @example
      *    
      *     <html>
      *        <div id="pager"></div>
      *     </html>
      *     
      *     <script>
      *         $("#pager").pager({
      *              count: 300,
      *              currentPageIndex: 1,
      *              pageSize: 15
      *         });
      *     </script>
      *    
      */
    $.fn.pager = function (options) {
        var pager = $.data(this, CACHE_KEY);

        if (pager)
            return pager;

        $.data(this, CACHE_KEY, this);
        var thisPtr = this;
        var $container = $("<ul>");
        var pagingData = $.extend(getDefaultOptions(), options);

        this.setOptions = function (value) {
            pagingData = $.extend(pagingData, value);
            var count = pagingData.count;
            var pageSize = pagingData.pageSize;

            if ((count <= 0) || (pageSize <= 0))
                return;

            var currentPageIndex = pagingData.currentPageIndex;
            var pageIndexOffset = pagingData.mode;
            var pageIndex = util.calulatePageIndex(count, pageSize) + pageIndexOffset;

            if ((currentPageIndex > pageIndex) || (count <= pageSize))
                return;

            pagingData.pageIndex = pageIndex;
            thisPtr.render(pagingData, pageIndex, pageIndexOffset);
        };

        this.render = function (pagingData, pageIndex, pageIndexOffset) {
            var type = pagingData.type.toLowerCase();
            var $form = $(pagingData.postForm).clone();

            if ($form.length == 0)
                type = HttpMethod.Get;

            pagingData.postType = type;
            pagingData.postForm = $form;

            thisPtr.renderChildControls($container, pagingData, pageIndex, pageIndexOffset);
            thisPtr.bindChildControlsEvent($container, pagingData, pageIndex, pageIndexOffset);
        };

        this.renderChildControls = function ($container, pagingData, pageIndex, pageIndexOffset) {
            var count = pagingData.count;
            var pageSize = pagingData.pageSize;
            var currentPageIndex = pagingData.currentPageIndex;

            util.renderPageStatistics($container, currentPageIndex - pageIndexOffset + 1, pageIndex + 1, pageSize, count);
            util.renderPageNavigation($container, pagingData);
            util.renderPageSizeOptions($container, pagingData);
            util.renderPageRedirect($container);
            $(thisPtr).addClass("pagination").empty().append($container);
        };

        this.bindChildControlsEvent = function ($container, pagingData, pageIndex, pageIndexOffset) {
            var currentPageIndex = pagingData.currentPageIndex;
            var type = pagingData.postType;
            var $prevElem = $container.find("a[class='prev']");
            var $nextElem = $container.find("a[class='next']");

            if (type == HttpMethod.Get) {
                $prevElem.each(function (i, n) { thisPtr.doPageCore(currentPageIndex - 1, $(n)); });
                $nextElem.each(function (i, n) { thisPtr.doPageCore(currentPageIndex + 1, $(n)); });
            } else {
                $prevElem.click(function () { thisPtr.doPage(currentPageIndex - 1); });
                $nextElem.click(function () { thisPtr.doPage(currentPageIndex + 1); });
            }

            $container.find("li[class='pagesize'] > select").change(function () {
                pagingData.pageSize = $(this).val();
                thisPtr.doPage(0 + pageIndexOffset);
            });
            $container.find("li[class='redirect'] > a").click(function () {
                var value = $(this).prev().val();

                if (value.length == 0)
                    return;

                thisPtr.doPage(parseInt(value) - 1 + pageIndexOffset);
            });
        };

        this.doPageCore = function (newPageIndex, $linkToElem) {
            var pageSize = pagingData.pageSize;
            var pageIndex = pagingData.pageIndex;
            var pageIndexOffset = pagingData.mode;
            var pageIndexChanging = pagingData.pageIndexChanging;
            var type = pagingData.postType;
            var $form = pagingData.postForm;

            if ($.isFunction(pageIndexChanging)) {
                pageIndexChanging.call(thisPtr, newPageIndex, options);
                return;
            }

            if (newPageIndex - pageIndexOffset < 0)
                return;

            if (newPageIndex + pageIndexOffset > pageIndex)
                return;

            var pagingUrl = util.makePagingUrl(pagingData, newPageIndex, pageSize);

            if (type == HttpMethod.Post) {
                $(document.body).append($form.hide());
                $form.attr({ "method": type, "action": pagingUrl }).submit();
            }
            else if (type == HttpMethod.Get) {
                if ($linkToElem)
                    $linkToElem.attr("href", pagingUrl);
                else
                    window.location.href = pagingUrl;
            }
        };

        /**
          * 分页
          * @method doPage
          * @param {Number} newPageIndex 跳转页索引
          * @example
          *     <html>
          *         <input type="button" value="Skip" id="btnSkip" />
          *         <div id="pagination"></div>
          *     </html>
          * 
          *     <script>
          *         var pager = $("#pagination").pager({ count: 160 });
          *         
          *         $("#btnSkip").click(function () {
          *             pager.doPage(5);
          *         });
          *     </script> 
          */
        this.doPage = function (newPageIndex) {
            thisPtr.doPageCore(newPageIndex, null);
        };

        this.init = function () {
            thisPtr.setOptions(options);
        };

        thisPtr.init();

        return thisPtr;
    }
})(jQuery, Beyondbit);
(function ($, B) {

	var controls = B.registerNameSpace("Controls");

	/**
     * 扩展jQuery对象集合
     * @module jQuery
     * 
     */

	/**
      *  表单
      *  @class FormEx
      */

	/**
      * jQuery 表单
      * @method Form
      * @param {JSON} options 参考B.Controls.Form对象
      * @example
      * 
      *     $("form").Form();
      */
	$.fn.Form = function (options) {
		var dataKey = "{0}_Form".bformat(B.DESIGNATION);
		if (this.length == 0) { return null; }
		if (!options) {
			var dataForm = this.eq(0).data(dataKey);
			if (dataForm) {
				return dataForm;
			}
		}

		var jElement = this.eq(0);

		options = $.extend(true, {}, { target: jElement }, options);

		var from = controls.Form.create(options);

		jElement.data(dataKey, from);

		return from;
	}

})(jQuery, Beyondbit);

(function ($, B) {    
    /**
     * 相关 Web 界面的类集合
     * @module Beyondbit.Controls
     * @submodule Controls
     */
	var controls = B.registerNameSpace("Controls");

	var c = controls;

	/**
      * 表单属性
      * @class Form
      * @constructor
      * @param {JSON} options 控件属性
      * @example
      *    
      */
	c.Form = function (options) {
		options = initOptions(options);
		
		var $form = $(options.target);

		bindEvent($form, options);
	};

    /**
      * 创建控件
      * @method create
      * @param {JSON} options 控件属性 参考Form属性
      * @example
      *
      *     B.Controls.Form.create({
      *         target:"#formID"
      *     })
      *    
      */
	c.Form.create = function (options) {
	    return new c.Form(options);
	}

	function bindEvent($form, options) {
		var regulate = bindRegulate($form, options.regulate);

		$form.submit(function () {
		    if (!$form.valid) {
		        loadingFormSubmit($form, regulate, options);
		        return;
		    }

		    if ($form.valid()) {
		        loadingFormSubmit($form, regulate, options);
		    }
		});
	}

	function loadingFormSubmit($form, regulate, options) {
	    if (options.isSubmitShowLoading == true) {
	        B.Web.MessageBox.loading(null, options.loadingMessage);
	    }

	    if (regulate != null) {
	        regulate.disabled();
	    }
	}

	function bindRegulate($form, regulateOptions)
	{
	    var regulate;

		if (regulateOptions && $.type(regulateOptions) === "string") {
			regulate = $form.Regulate(regulateOptions);
		}
		return regulate;
	}

	function initOptions(options){

	    var commonRegional = B.CultureInfo.Current.getCommonRegional();

		var newOptions = $.extend(true, {
		  /**
			* 控制按钮
			* @property regulate
			* @type B.Controls.Regulate
			*/
			regulate: null,
			target: null,
		  /**
			* 提交数据时是否显示Loading窗口
			* @property isSubmitShowLoading
			* @type Bool
			*/
			isSubmitShowLoading: true,
			loadingMessage: commonRegional.someThingSaving.bformat(commonRegional.data)
		}, {}, options);

		validateOptions(newOptions);

		return newOptions;
	}

	function validateOptions(options) {
		validateOption(options, "target", null, "{0}参数必填");
	}

	function validateOption(options, key, notExpect, message) {
		if (options[key] == notExpect) {
			throw new Error((message || "参数配置不正确").bformat(key));
		}
	}

})(jQuery, Beyondbit);

(function ($, B) {
    /**
     * 相关 Web 界面的类集合
     * @module Beyondbit.Controls
     * @submodule Controls
     */
    var controls = B.registerNameSpace("Controls");

    var c = controls;

    $.fn.InterLock = function (options) {
        var dataKey = "{0}_InterLock".bformat(B.DESIGNATION);
        if (this.length == 0) { return null; }
        var $this = $(this.eq(0));
        var an = $this.data("dataKey");
        if (!an) {
            options = $.extend(true, {}, {}, options);
            options.target = $this;
            an = new controls.interlock(options);
            $this.data("dataKey", an);
        }
        return an;
    };



    controls.interlock = function (options) {
        var defaults = {};
        options = $.extend(true, {}, defaults, options);
        var inner = init(options);
        var items = [];

        var that = this;
        this.add = function (options) {
            items.push(options);
            return that;
        }

        this.exec = function () {
            $.each(items, function (i, item) {
                loadInterLockItem(item, i, inner);
            });
            return that;
        }
    }

    controls.interlock.empty = function () {
        var emptyInstance = new controls.interlock();
        emptyInstance.add = exec = function () { return this };
        return emptyInstance;
    }();

    function init(options) {
        var inner = { options: options, sender: this };
        inner.childs = [];
        return inner;
    }

    function loadInterLockItem(item, index, inner) {
        var $hidden = item.target || (item.selectValueToControl || item.selectTextToControl);

        var options = $.extend(true, {}, {
        }, item);
        if (index == 0) {
            options.async.enable = true;
            options.async.url = options.async.rawUrl;
        } else {
            var previous = inner.childs[index - 1].element;
            var value = previous.DropDownList().value().value;
            if (value) {
                options.async.enable = true;
                options.async.url = options.async.rawUrl + value;
            }
            else {
                options.async.enable = false;
            }
        }
        options.index = index;
        options.onSelectedValueRaw = options.onSelectedValue;
        options.onSelectedValue = onSelectedValue;
        options.onReset = onReseted;
        options.onEmpty = onReseted;
        $hidden.DropDownList(options);

        inner.childs.push({
            element: $hidden, options: options
        })

        $hidden.data("interlock", inner);
    }

    function onSelectedValue(data) {
        var options = this.getOptions();
        if (options.onSelectedValueRaw) {
            options.onSelectedValueRaw.call(this, data);
        }
        var index = options.index;
        var jElement = options.target;
        var interlock = jElement.data("interlock");
        var childs = interlock.childs;

        if (index < childs.length - 1) {
            var child = childs[index + 1];
            triggerSelectReset(child.element, {
                async: {
                    enable: true,
                    url: child.options.async.rawUrl + data.value
                }
            });
        };
    }

    function onReseted() {
        var options = this.getOptions();
        var index = options.index;
        var jElement = options.target;
        var interlock = jElement.data("interlock");
        var childs = interlock.childs;
        if (index < childs.length - 1) {
            var child = childs[index + 1];
            child.element.DropDownList().empty();
        }
    }

    function triggerSelectReset(jElement, options) {
        var bfclSelect = jElement.DropDownList();
        bfclSelect.setOptions(options)
        bfclSelect.reset();
    }

})(jQuery, Beyondbit);
/// <reference path="Beyondbit.Controls.js" />
(function ($, B) {
	/**
     * 相关 Web 界面的类集合
     * @module Beyondbit.Controls
     * @submodule Controls
     */
	var controls = B.registerNameSpace("Controls");

	$.fn.Regulate = function (options) {
		var dataKey = "{0}_Regulate".bformat(B.DESIGNATION);
		if (this.length == 0) { return null; }
		if (!options) {
			return this.eq(0).data(dataKey);
		}

		var jElement = this.eq(0);

		options = $.extend(true, {}, { target: jElement }, options);

		var regulate = controls.Regulate.create(options);

		jElement.data(dataKey, regulate);

		return regulate;
	};

	var c = controls;

	/**
      * 控制组件
      * @class regulate
      * @constructor
      * @param {JSON} options 控件属性
      * @example
      *    
      */
	c.Regulate = function (options) {

		options = initOptions(options);

		var $controls = $(options.controls);

		/**
		  * 设置禁用或不禁用
		  * @method disabled
		  * @param {Boolean} [value=true] 是否禁用
		  * @example
		  *
		  *     var regulate = B.Controls.Regulate.create({target:"#div"});			
		  *     regulate.disabled();		// 禁用
		  *     regulate.disabled(false);	// 不禁用
		  *    
		  */
		this.disabled = function (value) {
			if (value == false) {
				$controls.removeAttr("disabled");
			} else {
				$controls.attr("disabled", "disabled");
			}

			return this;
		}

		/**
		  * 设置显示状态
		  * @method show
		  * @param {Boolean} [value=true] 是否显示
		  * @example
		  *
		  *     var regulate = B.Controls.Regulate.create({target:"#div"});			
		  *     regulate.show();		// 显示
		  *     regulate.show(false);	// 不显示
		  *    
		  */
		this.show = function (value) {

		    if (value == false) {
				$controls.addClass("hide");
			} else {
				$controls.removeClass("hide");
			}

			return this;
		}

		/**
		  * 设置隐藏
		  * @method show
		  * @example
		  *
		  *     var regulate = B.Controls.Regulate.create({target:"#div"});			
		  *     regulate.hide();		
		  *    
		  */
		this.hide = function () {
			return this.show(false);
		}
	}

    /**
      * 创建一个控制实例
      * @method create
      * @static
      * @example
      *
      *     B.Controls.Regulate.create({"#div"})
      *    
      */

	c.Regulate.create = function (options) {
		return new c.Regulate(options);
	}

	function initOptions(options) {

		var newOptions = $.extend(true, {
			/**
			  * 控制按钮
			  * @property controls
			  */
			controls: null,
			target: null
		}, {}, options);

		validateOptions(newOptions);

		return newOptions;
	}

	function validateOptions(options) {
		
	}

	function validateOption(options, key, notExpect, message) {
		if (options[key] == notExpect) {
			throw new Error((message || "参数配置不正确").bformat(key));
		}
	}

})(jQuery, Beyondbit);
/// <reference path="Beyondbit.Controls.js" />
(function ($, B) {

    /**
     * 扩展jQuery对象集合
     * @module jQuery
     * 
     */

    /**
      * 
      * @class controls
      * 
      */

    /**
      * 
      * @method DropDownList
      * @param {JSON} [options] 配置信息 see {{#crossLink "Controls.select"}}{{#crossLink}}
      * @example
      *    
      *     <html>
      *        <input type="hidden" id="dropDownlist" />
      *     </html>
      *     
      *     <script>
      *         $("#dropDownlist").DropDownList({
      *              source: [
      *                  { name: "一", value: "1" },
      *                  { name: "二", value: "2" }
      *             ]
      *         });
      *     </script>
      *    
      */
    $.fn.DropDownList = function (options) {
        var dataKey = "{0}_Select".bformat(B.DESIGNATION);
        if (this.length == 0) { return this; }
        if (!options) {
            return this.eq(0).data(dataKey);
        }

        options = $.extend(true, {}, {}, options);
        this.each(function (index, item) {
            var $this = $(item);
            var an = $this.data(dataKey);
            if (!an) {
                options.target = $this;
                an = new controls.select(options);
                $this.data(dataKey, an);
            }
        });
        return this;
    };

	/**
     * 相关 Web 界面的类集合
     * @module Beyondbit.Controls
     * @submodule Controls
     */
	var controls = B.registerNameSpace("Controls");
	
	var c = controls;

    /**
      * 下拉框控件
      * @class select
      * @constructor
      * @param {JSON} options 控件属性
      * @example
      *    
      */

	controls.select = function (options) {
	    options = $.extend(true, {
	        /**
              * 控件的ID
              * @property id
              * @type String  
              */
	        id: "",
           /**
             * 触发的目标元素
             * @property target
             * @type jQuery
             * 
             */
	        target: null,
           /**
             * 默认显示文本
             * @property placeholder
             * @type String
             * @default "请选择"
             */
	        placeholder: "请选择",
           /**
             * 异步数据源信息
             * @property async
             * @type JSON
             */
	        async: {
               /**
                 * 是否启用异步数据源
                 * @property async.enable
                 * @type Boolean
                 * @default false
                 */
	            enable: false,
	            /**
                 * 异步数据源URL 
                 * @property async.url
                 * @type String
                 */
				url: null
	        },
            /**
             * 宽度
             * @property width
             * @type Number
             * @default 0
             */
	        width: 0,
	        /**
             * 最小宽度
             * @property minWidth
             * @type Number
             * @default 0
             */
	        minWidth: 0,
	        /**
             * 最大度度
             * @property maxWidth
             * @type Number
             * @default 0
             */
	        maxWidth: 0,
	        /**
             * 样式名称
             * @property className
             * @type String
             */
	        className: null,
	        /**
             * 多选值用什么分隔符
             * @property splitChar
             * @type String
             * @default ","
             */
	        splitChar: ",",
	        /**
             * 接受选择后的值的控件
             * @property selectValueToControl
             * @type jQuery
             */
	        selectValueToControl: null,
	        /**
             * 授受选择后的文本的值控件
             * @property selectTextToControl
             * @type jQuery
             */
	        selectTextToControl: null,
            /**
             * 选择值后的的回调事件
             * @event onSelectedValue
             * @param {Json} data 选择后的值
             * @param {String} data.name 文本
             * @param {String} data.value 值
             * @param {String} [data.text] 显示文本
             */
	        onSelectedValue: null,

			makeText: controls.makeText,
			makeValue: controls.makeValue,

			warpElement: function (element) {
				this.options.target.before(element);
			},

			onReset: null,
			onEmpty: null,
            /**
             * 最大显示选项数
             * @property maxLength
             * @type Number
             * @default 100000
             */
			maxLength: 100000,
            /**
             * 搜索模式;
             *  1. 0: 在原有的数据搜索
             *  2. 1:Ajax请求搜索
             * @property searchMode;
             * @type Number
             * @default 0
             */
			searchMode: 0,
            /**
             * 搜索事件
             * @event onSearch
             * @param {Json} options 
             * @param {Json} data 第一次控件时绑定的数据
             * @param {String} keywords 搜索的关键字
             * @param {Fun} 搜索完成后回调事件 callBackk(data);
             * @param {Json} inner 内部公开对象
             * @returns 搜索返回后的数据
             */
			onSearch: searchKeyData        //搜索回调
		}, {}, options);

		options.target = options.target || (options.selectValueToControl || options.selectTextToControl);

		var inner = { options: options, sender: this };
		this.inner = inner;
		var id = (options.id || options.target.attr("id"));
		if (!id) {
			id = getGuidGenerator();
		}
		this.id = B.DESIGNATION + "_controls_select_{0}".bformat(id);
		var that = this;

		this.setOptions = function (options) {
			inner.options = $.extend(true, {}, inner.options, options);
		}
		this.getOptions = function () {
			return $.extend(true, {}, inner.options, {});
		}

		/**
		  * 重置控件
		  * @method reset
		  * @example
		  *
		  *     var select = new B.Controls.select();
		  *     select.reset();
		  *    
		  */
		this.reset = function () {
			resetHtml(inner);
			this.value({ text: "", value: "" }, false);
			loadData(inner.options, getDataSuccess);
			if (options.onReset) {
				options.onReset.call(that);
			}
		}

		/**
		  * 清空控件数据
		  * @method empty
		  * @example
		  *
		  *    
		  */
		this.empty = function () {
			resetHtml(inner);
			this.value({ text: "", value: "" }, false);
			getDataSuccess([]);
			if (options.onEmpty) {
				options.onEmpty.call(that);
			}
		}

		/**
		  * 获取数据成功后的回调函数
		  * @method getDataSuccess
		  * @private
		  * @param {Array(json)} data 获取到的数据
		  * @example
		  *
		  *    example
		  *    
		  */
		function getDataSuccess(data) {
			data = filterData(data, options);
			inner.data = data;
			bindSelectItem(data, inner.rootElement);
			selectedItem(inner);
		}

		/**
		  * 设置或设置控件的值
		  * @method value
		  * @param {JSON({text:显示的文本,value:选中的值,name:选中的文本,其它})} [data] 要设置控件的数据
		  * @param {Boolean} [isTriggerCallback=false] 是否触发onSelectValue回调
		  * @example
		  *
		  *    example
		  *    
		  */
		var _value = {};
		this.value = function (data, isTriggerCallback) {
			if (data) {
				_value = data;
				options.makeText.set.call(inner, data);
				options.makeValue.set.call(inner, data);
				if (isTriggerCallback != false && options.onSelectedValue) {
					options.onSelectedValue.call(that, data);
				};
			} else {
				var value = {
				    text: options.makeText.get.call(inner)[0] || (_value.name || _value.text),
					value: options.makeValue.get.call(inner)[0] || (_value.value)
				};

				if (!value.text && value.value) {
				    value.text = getItemText(inner, value.value);
				}

				return value;
			}
		}

		this.expand = function (isExpand) {
			var $re = inner.rootElement;
			if (isExpand) {
				$re.addClass("{0}_controls_select_hover".bformat(B.DESIGNATION));
			} else {
			    $re.removeClass("{0}_controls_select_hover".bformat(B.DESIGNATION));
			    var $key = $re.find(":text[name='{0}.key']".bformat(B.DESIGNATION));
			    $key.val($key.data("prevselecttext"));
			}

			return this;
		}

		this.destory = function () {
			this.rootElement.remove();
		}

		this.loading = function (text) {
			text = text || "加载中...";

			var $re = inner.rootElement;
			var $ul = $re.find("ul");
			$ul.html("<li class='empty'>{0}</li>".bformat(text));

			return this;
		}

		renderHtml(inner);
		bindEvent(inner);
		this.loading();
		loadData(inner.options, getDataSuccess);
	}

	function renderHtml(inner) {
		var rootElement = $("#" + inner.sender.id);
		if (rootElement.length == 0) {
			var options = inner.options;

			rootElement = $(('<div id="{0}" class="' + B.DESIGNATION + '_controls_select {1}">&nbsp;</div>').bformat(inner.sender.id, options.className));
			var html = ('<span><em><i class="fa fa-angle-double-down"></i></em><label><input type="text" name="' + B.DESIGNATION + '.key" placeholder="{0}" /></label></span>').bformat(inner.options.placeholder);
			html += '<ul></ul>';
			html = ('<div class="' + B.DESIGNATION + '_controls_select_container"><div>{0}</div></div>').bformat(html);
			rootElement.append(html);

			var minWidth = options.minWidth == 0 ? options.width : options.minWidth;
			var maxWidth = options.maxWidth < options.width ? options.width : options.maxWidth;
			var $container = $(".{0}_controls_select_container".bformat(B.DESIGNATION), rootElement);

			if (options.width > 0) {
				rootElement.width(options.width);
			}
			if (minWidth > 0) {
				rootElement.css("min-width", minWidth);
				$container.css("min-width", minWidth);
			}
			if (maxWidth > 0) {
				rootElement.css("max-width", minWidth);
			}

			inner.options.warpElement.call(inner, rootElement);
			inner.rootElement = rootElement;
		}
	};

	function resetHtml(inner) {
		var rootElement = inner.rootElement;
		rootElement.find(":text[name='{0}.key']".bformat(B.DESIGNATION)).val('').data("prevselecttext", null);
	}


	function bindSelectItem(data, rootElement) {
		var $ul = rootElement.find("ul");
		$ul.html('').data("bfcl_data", data);
		if (!data || data.length == 0) {
			$ul.append("<li class='empty'>无数据!</li>")
			return;
		}
		$.each(data, function (i, item) {
			var $item = $('<li class="{3}"><a href="#" data-value="{1}" data-name="{2}" title="{0}">{0}</a></li>'.bformat(
                    item.text,
                    item.value,
                    item.name,
                    item.noCheck ? "noSelect" : ""
                )
            );
			$item.data("bfcl_data", item);
			$ul.append($item);
		})
	}

	function getItemText(inner, value) {
	    if (value) {
	        var rootElement = inner.rootElement;
	        var selectOption = rootElement.find("ul li a[data-value='{0}']".bformat(value));
	        return selectOption.data("name");
	    }
	}

	function selectedItem(inner, item, jElement) {
	    item = item || inner.sender.value();
	    if (!item || !item.value) {
	        return;
	    }
		var rootElement = inner.rootElement;
		var jElement = jElement || rootElement.find("ul li a[data-value='{0}']".bformat(item.value)).parent();
		jElement.addClass("selected").siblings().removeClass("selected");
		item.name = item.name || jElement.find("a").data("name");
		$(":text[name='{0}.key']".bformat(B.DESIGNATION), rootElement).val(item.name).data("prevselecttext", item.name);
	};

	function bindEvent(inner) {
		/// <summary>绑定事件</summary>
		/// <param name="inner" type="Object">内部唯一引用对象</param>

		var sender = inner.sender;
		var rootElement = inner.rootElement;
		if (rootElement.data("bfcl_bindevent") == true) {
			return;
		}
		rootElement.data("bfcl_bindevent", true);

		var txtKeyElement = $(":text[name='{0}.key']".bformat(B.DESIGNATION), rootElement);
		rootElement.find("ul").click(function (event) {
			var $item = $(event.target);
			var $parent = $item.parent();
			if ($item.is("a") && $parent.is("li:not(.empty,.noSelect)")) {
				var selectListItem = $parent.data("bfcl_data");
				selectedItem(inner, selectListItem, $parent);
				sender.value(selectListItem);
				sender.expand(false);
				return false;
			}
			return false;
		});

		txtKeyElement.keyup(function (event) {
			var $this = $(this);
			var value = $this.val();
			var options = inner.options;
			options.onSearch.call(this, options, inner.data, value, function (data) {
				sender.expand(true);
				data = filterData(data, options);
				bindSelectItem(data, rootElement);
			}, inner);
		})

		rootElement.click(function (event) {
			event.stopPropagation();
		});
		rootElement.find("em").click(function () {
			sender.expand(true);
		})
		$("body").click(function () {
			sender.expand(false);
		})
	}

	function searchKeyData(options, data, keywords, callBack, inner) {
		var $this = $(this);
		var previousKeywords = $this.data("previousKeywords") || "";
		keywords = $.trim(keywords);
		if (keywords == previousKeywords) {
			return;
		}
		$this.data("previousKeywords", keywords);
		if (keywords === "") {
			//搜索关键字空值，则显示初始数据
			callBack(inner.data);
			return;
		}
		if (options.searchMode == 0) {
			var data = data;
			var result = $.grep(data, function (item, i) {
				return item.text.indexOf(keywords) == 0;
			});
			callBack(result);
		} else {
			if (options.async.enable == true) {
				inner.sender.loading();

				if (inner.searchCurrentXhq) {
					inner.searchCurrentXhq.abort();
				}
				var op = $.extend(true, {
				    url: options.async.url,
				    dataType: "json",
				    data: { maxLength: options.maxLength, keywords: keywords },
				    success: function (data) {
				        callBack(formatData(data));
				    },
				    error: function () {
				        //TODO:error handle
				    }
				}, options.async);
				var xhq = $.ajax(op);
				xhq.then(function () {
					inner.searchCurrentXhq = null;
				}, function () {
					inner.searchCurrentXhq = null;
				});
				inner.searchCurrentXhq = xhq;
			}
		}
	}



	function loadData(options, callback) {
		if (options.source) {
			callback(formatData(options.source));
			return;
		}
		if (options.async.enable == true) {
		    var op = $.extend(true, {
		        url: options.async.url,
		        dataType: "json",
		        data: { maxLength: options.maxLength },
		        success: function (data) {
		            callback(formatData(data));
		        },
		        error: function () {
		            //TODO:error handle
		        }
		    }, options.async);
		    $.ajax(op);
		} else {
			callback([]);
		}
	}

	function filterData(data, options) {
		/// <summary>过滤数据</summary>
		/// <param name="data" type="Array(json)">待过滤数据</param>
		/// <param name="options" type="json">控件配置</param>
		/// <returns type="Array(json)" />

		var maxLength = options.maxLength;
		if (data.length > maxLength) {
			data = data.slice(0, maxLength);
		}
		return data;
	}

	function formatData(data) {
		if (!data) {
			return data;
		}
		$.each(data, function (i, item) {
			item.name = item.name || item.text;
			item.text = item.text || item.name;
		});
		return data;
	}

})(jQuery, Beyondbit);
/// <reference path="Beyondbit.Controls.js" />
(function ($, B) {

	/**
     * 扩展jQuery对象集合
     * @module jQuery
     * 
     */

	/**
      * 上传组件
      * @class Upload
      * 
      */

	/**
     * 相关 Web 界面的类集合
     * @module Beyondbit.Controls
     * @submodule Controls
     */
	var controls = B.registerNameSpace("Controls");

    // 已经存在的文件ID前缀
	var EXISTS_ITEM_ID_PREVFIX = "exists_file_";

	var c = controls;

	c.Uploader = function (options) {
		options = initOptions(options);

		renderHtml(options);

		var $container = options.container;

		var webUploader;

		if (options.isEditable == true) {
		    webUploader = createBaiduUploader(options, $container);
		}

		bindEvent(options, webUploader);

		this.upload = function () {
		    webUploader.upload();
		};

		this.stop = function () {
		    webUploader.stop();
		}
	}


	c.Uploader.regional = [];

	c.Uploader.regional[""] = c.Uploader.regional["zh-CN"] = {
	    errorMessage: {
	        Q_EXCEED_NUM_LIMIT: "上传超过了最大能上传的文件数量, 最多能上传{0}个.",
	        F_DUPLICATE: "文件重复上传",
	        F_EXCEED_SIZE: "文件[{0}]上传失败，单个文件超过了上传文件大小限制，最大只能上传: {1}",
	        Q_EXCEED_SIZE_LIMIT: "文件[{0}]上传失败，所有文件总共大小超过了允许上传大小限制，最大只能上传: {1}",
	        Q_TYPE_DENIED: "文件[{0}]上传失败，上传的文件格式不支持，只允许上传后缀名为: {1}",
	        OTHER: "上传出错了, 原因类型：{0}"
	    },
	    uploadErrorTextFormat: "上传失败：{0}",
	    uploadFailText: "[失败]",
	    uploadSuccessText: "上传成功",
	    uploadProgressText: "上传中，当前进度: {0}%",
	    uploadButtonDefaultText: "上传",
	    uploadWarningTitle: "上传文件警告"

	};

	function getRegional() {
	    return B.CultureInfo.Current.getRegional(c.Uploader.regional);
	}

    /**
      * 创建一个实例
      * @method create
      * @example
      *
      *     <html>
      *         <div class="uploader" id="uploader">
      *         </div>
      *     </html>
      * 
      *     <script>
      *     B.Controls.Uploader.create({
      *        isEditable: true,
      *         container: $("#uploader"),
      *         swf: '../../lib/webuploader/0.1.5/Uploader.swf',
      *        server: 'http://localhost:15994/Upload/upload',
      *        items: [{
      *            name: "12345中中中中中中中中中中中中中中中中中中中我是中国中中中中中中中中中中中中中中中.docx",
      *            identity: "1",
      *            size: "12312312"
      *        }, {
      *            name: "123456.docx",
      *            identity: "2",
      *            size: "1231233123"
      *        }],
      *        accept:[{
      *            title: '图片文件',
      *            extensions: 'gif,jpg,jpeg,bmp,png',
      *            mimeTypes: 'image/*'
      *        }, {
      *            title: 'OFFICE文件',
      *            extensions: 'doc,docx,pptx,ppt,xls,xlsx',
      *            mimeTypes: 'application/*'
      *        }],
      *        fileSizeLimit: 1024000,
      *        fileSingleSizeLimit: 512000,
      *        fileNumLimit: 3,
      *        buttonText: "浏览",
      *        onRemoveFile: function (identity) {
      *            if (identity) {
      *                alert("删除文件，标识:" + identity);
      *            }
      *        }
      *     })
      *     </script>
      */
	c.Uploader.create = function(options){
		return new c.Uploader(options);
	}

	function createBaiduUploader(options, $container) {

	    var baiUploadConfig = createBaiduUploadConfig(options);

	    var webUploader = WebUploader.create(baiUploadConfig);

	    webUploader.on("error", function (type) {
	        switch (type) {
	            case "Q_EXCEED_NUM_LIMIT":
	                error.call(options, getRegional().errorMessage.Q_EXCEED_NUM_LIMIT.bformat(baiUploadConfig.fileNumLimit), arguments)
                    break;
	            case "F_DUPLICATE": //重复文件上传
	                error.call(options, getRegional().errorMessage.F_DUPLICATE, arguments);
	                break;
	            case "F_EXCEED_SIZE":
	                var fileSizeLimit = arguments[1];
	                var file = arguments[2];
	                error.call(options, getRegional().errorMessage.F_EXCEED_SIZE.bformat(file.name, formatSize(fileSizeLimit)), arguments);
	                break;
	            case "Q_EXCEED_SIZE_LIMIT":
	                var fileSizeLimit = arguments[1];
	                var file = arguments[2];
	                error.call(options, getRegional().errorMessage.Q_EXCEED_SIZE_LIMIT.bformat(file.name, formatSize(fileSizeLimit)), arguments);
	                break;
	            case "Q_TYPE_DENIED":
	                var file = arguments[1];
                    
	                var acceptMessage = $.map(baiUploadConfig.accept, function (n) {
	                    return "{0}[{1}]".bformat(n.title, n.extensions);
	                }).join(",");

	                error.call(options, getRegional().errorMessage.Q_TYPE_DENIED.bformat(file.name, acceptMessage), arguments);
	                break;
	            default:
	                error.call(options, getRegional().errorMessage.OTHER.bformat(type), arguments);
	        }
	        
	        return false;
	    });

	    webUploader.on("uploadError", function (file, reason) {
	        uploadError(options, file, reason);

	        return false;
	    });

	    webUploader.on("fileQueued", function (file) {
	        uploadFileQueued(options, $container, file);

	        return false;
	    });

	    webUploader.on("filesQueued", function (files) {

	        return false;
	    });

	    webUploader.on("uploadSuccess", function (file, response) {
	        if (response.Flag == 1) {
	            uploadSuccess(options, file, response);
	        } else {
	            uploadError(options, file, response.Message);
	        }

	        return false;
	    });

	    webUploader.on("fileDequeued", function (file) {
	        getFileJQuery(file).remove();

	        return false;
	    });

	    webUploader.on("uploadProgress", function (file, percentage) {
	        uploadProgress(options, file, percentage);

	        return false;
	    });

	    return webUploader;
	}

    
    //#region 事件


	function uploadSuccess(options, file, response) {
	    var identity = response.identity || response.id;
	    if (options.onUploadSuccess) {
	        var flag = options.onUploadSuccess(file, identity, response);
	        if (flag) {
	            return;
	        }
	    }

	    var $li = getFileJQuery(file);
	    $li.data("identity", identity);
	    $li.addClass("uploader-item-success").attr("title", getRegional().uploadSuccessText);
	    $(".uploader-item-tip", $li).html('').attr('title', '');

	    removeFileProgress(file);
	}

	function error(message) {
	    if (this.onError) {
	        this.onError(message, arguments);
	        return false;
	    }
        
	    tips(message);
	}

	function uploadError(options, file, reason) {
	    if (options.onUploadError) {
	        options.onUploadError(file, reason);
	        return;
	    }
	    handleFileUploadError(file, reason);
	}

	function uploadFileQueued(options, $container, file) {
	    if (options.onUploadFileQueued) {
	        options.onUploadFileQueued(file);
	        return;
	    }
	    appendFileItem.call(options, $container, file);
	}

	function uploadProgress(options, file, percentage) {
	    if (options.onUploadProgress) {
	        options.onUploadProgress(file, percentage);
	        return;
	    }

	    var percentageVal = percentage * 100;
	    if (percentage == 1) {
	        percentageVal = 99;
	    }

	    var $li = getFileJQuery(file);
	    $(".uploader-item-tip", $li).html('[{0}%]'.bformat(percentageVal)).attr("title",  getRegional().uploadProgressText.bformat(percentageVal));
	    $(".uploader-item-progress-percentage", $li).css("width",+ percentageVal + '%');
	}


    //#endregion


    //#region 初始化选项

	function initOptions(options) {
	    var newOptions = $.extend(true, {
           /**
             * 容器
             * @property container
             */
	        container: null,
           /**
             * 指定上传按钮 和 container只能用其一
             * 使用button模式，将只有上传按钮，没有其它的表现层内容
             * @property button
             */
            button: null,
			swf: null,
			server: null,
			auto: true,
			multiple: true,
           /**
             * 最大能上传多少大小
             * @property fileSizeLimit
             * @type number
             */
			fileSizeLimit: null,
           /**
             * 最多能上传多少文件
             * @property fileNumLimit
             * @type number
             */
			fileNumLimit: null,
           /**
             * 单个文件最大大小
             * @property fileSingleSizeLimit
             * @type number
             */
			fileSingleSizeLimit: null,
            /**
             * 上传按钮的文本
             * @property buttonText
             * @type string
             * @default 上传附件
             */
			buttonText: getRegional().uploadButtonDefaultText,
	        onUploadFileQueued: null,
			onUploadSuccess: null,
			onUploadProgress: null,
			onUploadError: null,
			onUploadAccept: null,
			onUploadComplete: null,
            onError: null,
           /**
             * 删除附件事件
             * @event onRemoveFile
             * @param identity
             */
			onRemoveFile: null,
            /**
             * 获取附件事件
             */
			onGetFile: null,
            /**
             * 添加一个文件事件
             */
            onAppendFile: null,
           /**
             * 已经存在的附件
             * @property items
             * @type Array
             */
			items: [],
           /**
             * 是否可编辑
             * @property isEditable
             * @type Boolean
             * @default true
             */
			isEditable: true,
            mode: 1
		}, {}, options);

		validateOptions(newOptions);

		return newOptions;
	}

	function validateOptions(options) {
		//validateOption(options, "container", null);
		validateOption(options, "swf", null);
		validateOption(options, "server", null);
	}

	function validateOption(options, key, notExpect) {
		if (options[key] == notExpect) {
			throw new Error("参数配置不正确");
		}
	}

	
	function createBaiduUploadConfig(options) {
	    var newOptions = $.extend(true, {}, {}, options);

	    var container = newOptions.container;
	    if (container) {
	        newOptions.dnd = "#{0} > .uploader-picker".bformat(container.attr("id"));
	        newOptions.pick = $(".uploader-picker > a", container);
	    }
	    else {
	        newOptions.pick = options.button;
	    }
	    
	    newOptions.disableGlobalDnd = true;
		
		//newOptions.runtimeOrder = "flash";
		return newOptions;
	}


    //#endregion

	function renderHtml(options) {
	    if (options.container) {
	        renderContainerHtml(options);
	    }
	}

	function renderContainerHtml(options) {
	    var container = options.container;

	    var identity = B.getIdentity();

	    var html = '<div class="uploader-picker">'
				+ '		<a href="#" class="btn">'
				+ '			{buttonText}'
				+ '		</a>'
				+ '	</div>'
				+ '	<div class="uploader-items">'
				+ '		<ul>'
				+ '		</ul>'
				+ '	</div></div>';

	    html = html.bformat(options);

	    if (!container.attr("id")) {
	        container.attr("id", "uploader" + identity);
	    };

	    container.html(html);

	    if (options.isEditable == false) {
	        $('.uploader-picker', container).remove();
	    }

	    if (options.items && options.items.length > 0) {
	        $.each(options.items, function (i, item) {
	            item.id = EXISTS_ITEM_ID_PREVFIX + item.identity;
	            appendFileItem.call(options, container, item, item.identity);
	        });
	    }
	}

	function bindEvent(options, webUploader) {
	    var container = options.container;
	    if (!container) {
	        return;
	    }

	    var $ul = $(".uploader-items > ul", container);

	    if (options.isEditable == false) {
	        $(".uploader-item-remove", $ul).remove();
	    }

		$ul.click(function (event) {
			var $target = $(event.target);
			if ($target.is(".uploader-item-remove")) {
				var $li = $target.parent();
				var file = $li.data("file");
				var fileIdentity = $li.data("identity") - 0;

				if (options.onRemoveFile) {
				    if (options.onRemoveFile(fileIdentity) == false) {
				        return;
				    }
				}

				if (file.id.indexOf(EXISTS_ITEM_ID_PREVFIX) == -1 && webUploader) {
				    webUploader.removeFile(file, true);
				}
				else {
				    getFileJQuery(file).remove();
				}
			}

		});
	}

    // 添加文件
	function appendFileItem(container, file, identity) {
	    if (container == null) {
	        return;
	    }
	    file.sizefriendy = formatSize(file.size);
		var $ul = $(".uploader-items > ul", container);
		var $li = $('<li></li>');
		$li.append('<span class="uploader-item-tip"></span><a href="#" id="{id}">{name}</a><em>({sizefriendy})</em>'.bformat(file));

		$li.append(' <i class="fa fa-remove uploader-item-remove"></i>');

		appendFileItemProgress(file, $li);

		$li.data("file", file);
		$li.data("identity", identity);

		$ul.append($li);

		var options = this;

		$li.find("a").click(function () {
		    var $this = $(this);
		    var $li = $this.parent();
		    var file = $li.data("file");
		    var fileIdentity = $li.data("identity") - 0;

		    if (options.onGetFile) {
		        return options.onGetFile(fileIdentity);
		    }
		});

		if (options.onAppendFile) {
		    options.onAppendFile(file, identity);
		}
	}

	function formatSize(size) {
	    return WebUploader.formatSize(size);
	}

    // 处理文件上传失败
	function handleFileUploadError(file, message) {
	    var $li = getFileJQuery(file);
	    $li.addClass("uploader-item-error").attr("title", getRegional().uploadErrorTextFormat.bformat(message));
	    $(".uploader-item-tip", $li).html(getRegional().uploadFailText).attr('title', '');
	    removeFileProgress(file);
	}

    // 获取文件的JQuery对象
	function getFileJQuery(file) {
	    return $("#" + file.id).parent();
	}

    // 提示
	function tips(message) {
	    B.Web.MessageBox.alert(getRegional().uploadWaringTitle, message, null, "WARNING");
	}

    // 删除文件的进度
	function removeFileProgress(file) {
	    var $li = getFileJQuery(file);
	    $(".uploader-item-progress", $li).remove();
	}

    // 添加文件的上传进度
	function appendFileItemProgress(file, $item) {
	    if (file.id.indexOf(EXISTS_ITEM_ID_PREVFIX) == -1) {
	        $item.append('<span class="uploader-item-progress"><span class="uploader-item-progress-percentage" style="width: 0;"></span></span>');
	    }
	}

})(jQuery, Beyondbit);
(function ($, B) {
	/**
     * 相关 Web 界面的类集合
     * @module Beyondbit.Controls
     * @submodule Controls
     */
	var controls = B.registerNameSpace("Controls");

	var c = controls;

	/*
	* @description 封装Jquery Val方法封装
	* @private
	* @param {jQuery对象|HtmlElement} jElement 
	* @param {Object} value 设置的value
	*/
	controls.val = function (jElement, value) {
		if (!jElement) {
			return;
		}
		if (value || $.type(value) == "string") {
			if (jElement.is("div,span")) {
				jElement.html(value);
			} else {
				jElement.val(value);
			}
			return jElement;
		} else {
			if (jElement.is("div,span")) {
				return jElement.html();
			} else {
				return jElement.val();
			}
		}
	}


	controls.makeText =
	{
        /*
         * 获取控件的文本
         */
		get: function () {
			return (c.val( this.options.selectTextToControl ) || "")
					  .splitRemoveEmptys(this.options.splitChar, null, true);
		},
        /*
         * 设置控件的文本值
         */
		set: function (value) {
			if (this.options.selectTextToControl) {
				c.val(this.options.selectTextToControl, value.name || value.text);
			}
		}
	};

	controls.makeValue =
	{
        /*
         * 获取控件的值
         */
		get: function () {
			return (c.val(this.options.selectValueToControl || this.options.target) || "")
					.splitRemoveEmptys(this.options.splitChar, null, true);
		},
        /*
         * 设置控件的值
         */
		set: function (value) {
			c.val(this.options.target, value.value);
			if (this.options.selectValueToControl) {
				c.val(this.options.selectValueToControl, value.value);
			}
		}
	}

})(jQuery, Beyondbit);