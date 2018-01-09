/// <reference path="../jquery-1.8.2.min.js" />
/// <reference path="Config.js" />

// 附件上传组件控制脚本
//使用举例：
// <input runat="server" clientidmode="Static" type="file" id="File3" class="uploadify" data-idprefix="a5" data-tablename="CallBoard" data-kindof="5" data-multi="true" data-queuesizelimit="5" data-attachidcontrol="FileIds" data-uploadedcontrol="FileIds_HasUploaded" />
//   <input type="hidden" id="FileIds" />
//  <input type="hidden"id="HF_5_HasUploaded" value="true" datatype="*" nullmsg="附件上传未完成！" />
//说明：
//在页面中创建3个控件
//其中第一个是type为“file”的input，要使用异步上传组件，应将class设置为“uploadify”，
//  data-idprefix:控件前缀，用于区别页面上的其他上传控件
//  data-fromTableName 对应附件表中的TableName字段
//  data-uploadAction   对应上传URL
//  data-deleteAction  删除附件URL
//  data-multi是否可以上传多个附件
//  data-queuesizelimit允许上传的最大文件数
//  data-attachidcontrol用于存放已上传文件的id值的控件ID。
//  data-uploadedcontrol用于标识是否还有未上传的附件，该控件的value在附件开始上传之前会设置为空，上传完成时会设置为true
//第二个是data-attachidcontrol对应的服务器端控件，若不需要从后台取值，可使用html控件。此处多半需要从后台取得该值，所以建议使用asp:HiddenField并将其设置为ClientIDMode="Static"。若上传单个附件，该控件的值为上传文件在数据库中的ID，且多次上传后仅保留最后一个文件，之前的文件将会从数据库中物理删除；若上传多个附件，该控件以逗号分割存放文件ID，且最后会多一个逗号，请注意，上传文件总数达到设置值的时候，上传按钮会被禁用，并且取消队列中正在上传的附件，在删除已上传的文件后才可以添加其他文件
//第三个是ata-uploadedcontrol对应的控件

$(
    function () {
        $(".uploadify").each(UploadControl.Init);
    }
);



var UploadControl = {};
UploadControl.AppStartupDir = "";
//UploadControl.AppStartupDir = "/Meeting";   //应用虚拟目录名称，如访问地址为 http://localhost:8001/Calendar/， 则此处应修改为“/Calendar”
///上传组件配置
UploadControl.DefaultImageFolder = UploadControl.AppStartupDir + "/Content/Themes/Meeting/img/";  //默认图片路径http://localhost:21091/Content/Themes/Calendar
UploadControl.UploadifySwf = UploadControl.AppStartupDir + "/Scripts/uploadify/3.2/uploadify.swf";  //文件上传组件SWF路径
UploadControl.DeleteAttachImg = UploadControl.DefaultImageFolder + "false_tip.png";
UploadControl.ShowAttachImg = UploadControl.AppStartupDir + "/Content/Themes/Meeting/img/annex_tip.png";  //显示附件缩略图页面

UploadControl.Init = function () {
    var prefix = $(this).attr("data-idprefix");
    var fromTableName = $(this).attr("data-fromTableName");
    var refTableID = $(this).attr("data-refTableID");
    var fileTypeExts = $(this).attr("data-fileTypeExts");
    var uploadAction = $(this).attr("data-uploadAction");
    var deleteAction = $(this).attr("data-deleteAction");
    var multi = eval($(this).attr("data-multi"));
    var queueSizeLimit = eval($(this).attr("data-queueSizeLimit"));
    var attachIDControl = $(this).attr("data-attachidcontrol");
    var uploadedControl = $(this).attr("data-uploadedcontrol");
    var controlId = $(this).attr("id");
    var uploadifyer = this;

    var uploadedAttach;
    if (queueSizeLimit > 1) {
        uploadedAttach = "<div id=\"" + prefix + "_UploadedAttach\" class=\"showAttach\"></div>";
    } else {
        uploadedAttach = "<div id=\"" + prefix + "_UploadedAttach\" class=\"showAttach\"></div>";
    }
    $(uploadifyer).after(uploadedAttach);

    var fileQueue = "<div id=\"" + prefix + "_FileQueue\" class=\"fileQueue\"></div>";
    $(uploadifyer).after(fileQueue);


    $(uploadifyer).uploadify({
        swf: UploadControl.UploadifySwf,
        uploader: uploadAction,
        queueID: prefix + '_FileQueue',
        auto: true,
        formData: { 'fromTableName': fromTableName, 'refTableID': refTableID },
        multi: multi,  //允许上传多个文件
        buttonText: "添加附件",
        removeCompleted: true,
        removeTimeout: 1,
        fileSizeLimit: '8MB',
        queueSizeLimit: queueSizeLimit,
        successTimeout: 300,
        fileTypeExts: fileTypeExts,
        onUploadStart: function (file) {
            if ($("#" + prefix + "_UploadedAttach").find("table").length >= queueSizeLimit) {
                $(uploadifyer).uploadify('stop');
                $(uploadifyer).uploadify('cancel', '*');
                alert("总文件数超过限制，仅能上传最多" + queueSizeLimit + "个文件，其余文件上传已自动取消，请删除部分文件再试。");
            }

            $("#" + uploadedControl).val("");
        },
        onUploadSuccess: function (file, data, response) {
            var attachID = $.parseJSON(data).attachid;
            UploadControl.ShowUploadedAttach(prefix + "_UploadedAttach", controlId, attachID, file, multi, attachIDControl, fromTableName, deleteAction);
            $(uploadifyer).uploadify('disable', false);
            if (fromTableName == "Meeting_MeetingRoom") {
                LoadData();
            }
        },
        onUploadError: function (file, errorCode, errorMsg, errorString) {
        },
        onQueueComplete: function (queueData) {
            $("#" + uploadedControl).val(true);
            if ($("#" + prefix + "_UploadedAttach").find("table").length >= queueSizeLimit) {
                $(uploadifyer).uploadify('disable', true);
            }
        }
    });
}

UploadControl.ShowUploadedAttach = function (uploadedQueueID, controlId, attachID, fileObj, multi, attachIDControl, fromTableName, deleteAction) {
    var attachItemHtml = '<table border="0" cellpadding="0" cellspacing="0" id="Uploaded_' + attachID + '" title="' + fileObj.name + '"><tr><td class="img" rowspan="2"><img src="' + UploadControl.ShowAttachImg + '" /></td><td class="filename text-ellipsis" colspan="2"><span>' + fileObj.name + '</span></td></tr><tr><td class="filesize">' + UploadControl.GetSize(fileObj.size) + '</td><td class="delete"><img src="' + UploadControl.DeleteAttachImg + '" onclick="UploadControl.DelUploadedAttach(\'' + controlId + '\',' + attachID + ',\'' + deleteAction + '\')" /></td></tr></table>';

    if (multi) {
        if (fromTableName != "Meeting_MeetingRoom") {
            $("#" + uploadedQueueID).append(attachItemHtml);
        }
    } else {
        $("#" + uploadedQueueID).html(attachItemHtml);
        if ($("#" + attachIDControl).val() != undefined && $("#" + attachIDControl).val() != "") {
            UploadControl.DelUploadedAttach($("#" + attachIDControl).val());
        }
    }

    var attachIDControlValue = $("#" + attachIDControl).val();
    if (multi) {
        attachIDControlValue += (attachID + ",");
    } else {
        attachIDControlValue = attachID;
    }
    $("#" + attachIDControl).val(attachIDControlValue);
}

UploadControl.DelUploadedAttach = function (controlId, attachID, deleteAction) {
    B.ajax({
        url: deleteAction,
        data: { attachId: attachID },
        type: "POST",
        cache: false,
        success: function (result) {
            $("#Uploaded_" + attachID).remove();
            if (controlId != undefined) {
                $("#" + controlId).uploadify('disable', false);
            }
            $("table[data_id=" + attachID + "]").remove();
        }
    });

    //禁止onclick冒泡
    var e = window.event;

    if (e != null) {
        if (e.stopPropagation) { //W3C阻止冒泡方法
            e.stopPropagation();
        } else {
            e.cancelBubble = true; //IE阻止冒泡方法
        }
    }
}

UploadControl.GetSize = function (size) {
    var fileSize = 0;
    var suffix = 'byte';

    if (size < 1024) {
        suffix = 'byte';
        fileSize = size;
    } else if (size / 1024 < 1024) {
        suffix = 'Kb';
        fileSize = Math.round(size / 1024);
    } else if (size / 1024 / 1024 < 1024) {
        suffix = 'M';
        fileSize = size / 1024 / 1024;
    }
    var fileSizeParts = fileSize.toString().split('.');
    fileSize = fileSizeParts[0];
    if (fileSizeParts.length > 1) {
        fileSize += '.' + fileSizeParts[1].substr(0, 2);
    }
    fileSize += suffix;
    return fileSize;
}

UploadControl.Remove = function () {
    $(".uploadify").remove();
}

UploadControl.DownLoadFile = function (attachId, downloadAction) {
    window.location.href = downloadAction + "?attachId=" + attachId;
}
