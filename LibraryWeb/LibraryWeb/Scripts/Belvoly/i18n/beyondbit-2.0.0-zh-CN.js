/*!
 * Beyondbit Front-end Framework v2.0.0
 changeset 826 *
 * http://bsdn.beyondbit.com
 *
 * Copyright (c) 2015 xakoy
 * Released under the  license
 */
(function ($, B) {

    B.regional["zh-CN"] = {
        prompt: "提示",
        del: "删除",
        data: "数据",
        someThingSaving: "{0}保存中..",
        confirmToDoSomeThing: "确定要{0}吗？"
    };

    B.CultureInfo.Current.set("zh-CN");

})(jQuery, Beyondbit);
(function ($, B) {

    var controls = B.registerNameSpace("Controls");

    controls.Uploader.regional["zh-CN"] = {
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

})(jQuery, Beyondbit);
(function ($, B) {

    var opicker = B.OPicker;

    opicker.regional["zh-CN"] = {
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


})(jQuery, Beyondbit);
(function ($, B) {

    B.Web.MessageBox.regional["zh-CN"] = {
        messages: {
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

})(jQuery, Beyondbit);
(function ($, B) {

    B.Web.Window.regional["zh-CN"] = {
        notAllowIdIsEmpty: "组件Id不能为空",
        loading: "正在加载..",
        buttons: {
            close: "关闭"
        }
    }

})(jQuery, Beyondbit);
(function ($, B) {

    B.Web.Window.regional["zh-CN"] = {
        notAllowIdIsEmpty: "组件Id不能为空",
        loading: "正在加载..",
        buttons: {
            close: "关闭"
        }
    }

})(jQuery, Beyondbit);
(function ($, B) {

	var pager = B.jQueryEx.Pager;

	pager.regional["zh-CN"] = {
		prevText: "上一页",
		nextText: "下一页",
		pageCurrent: "当前页",
		pageTotal: "总页数",
		pageSize: "每页",
		recordTotal: "总数",
		redirect: "跳转至",
		recordUnit: "条"
	}

})(jQuery, Beyondbit);

(function ($, B) {

	var ajax = B.jQueryEx.Ajax;

	ajax.regional = [];

	ajax.regional["zh-CN"] = {
		message: {
			title: "系统提示",
			actionName: "操作"
		},
		close: "关闭",
		ok: "确定",
		success: "{0} 成功！",
		loading: "正在{0}中..."
	}


})(jQuery, Beyondbit);