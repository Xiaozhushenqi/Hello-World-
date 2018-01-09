/*!
 * Beyondbit Front-end Framework v2.0.0
 changeset 826 *
 * http://bsdn.beyondbit.com
 *
 * Copyright (c) 2015 xakoy
 * Released under the  license
 */
(function ($, B) {

    B.regional["en-US"] = {
        prompt: "Prompt",
        del: "Delete",
        data: "Data",
        someThingSaving: "{0} Saving..",
        confirmToDoSomeThing: "Are you sure {0} ?"
    };

    B.CultureInfo.Current.set("en-US");

})(jQuery, Beyondbit);
(function ($, B) {

    var controls = B.registerNameSpace("Controls");

    controls.Uploader.regional["en-US"] = {
        errorMessage: {
            Q_EXCEED_NUM_LIMIT: "Upload exceeds the maximum number of files to upload, upload a maximum {0}.",
            F_DUPLICATE: "File repeat upload",
            F_EXCEED_SIZE: "File: [{0}] upload failed, single file upload file size limit exceeded, the maximum can only upload: {1}",
            Q_EXCEED_SIZE_LIMIT: "File: [{0}] upload failed, all the total size of the file exceeds the allowed upload size limit, the maximum can only upload: {1}",
            Q_TYPE_DENIED: "File: [{0}] failed to upload, upload the file format is not supported, only allow upload extension is: {1}",
            OTHER: "upload error, reason : {0}"
        },
        uploadErrorTextFormat: "upload fail : {0}",
        uploadFailText: "[Fail]",
        uploadSuccessText: "upload success",
        uploadProgressText: "uploading，percentage: {0}%",
        uploadButtonDefaultText: "Upload",
        uploadWarningTitle: "Upload file warning"

    };

})(jQuery, Beyondbit);
(function ($, B) {

	var opicker = B.OPicker;

	opicker.regional["en-US"] = {
		service: {
			notAllowRegisterCodeEmpty: "register service code not empty",
			repeatRegistered: "repeat register service code:{0}",
			useNotRegisteredCode: "use not registered service code:{0}"
		},
		title: "OPicker",
		notSetObjectCode: "Not input selector object Codes",
		defaultNamesLengthNotEqualValuesLength: "name and value length not equal of deafult value!",
		buttons: {
			ok: "Confirm",
			clear: "Clear",
			cancel: "Cancel"
		},
		search: {
			title: "Search",
			placeholder: "keywords"
		},
		select: {
			selected: "Selected",
			up: "Up",
			down: "Down"
		}
	}

	opicker.regional["en-US"].services = {
		orgUser: {
			title: "Org User"
		},
		roleUser: {
			title: "Role"
		},
		org: {
			title: "Department"
		},
		role: {
			title: "Role"
		},
		source: {
			title: "Selector"
		},
		orgDeputy: {
			title: "Org Deputy",
			notConfigHierarchyCode: "not Config hierarchyCode argument"
		}
	};


})(jQuery, Beyondbit);
(function ($, B) {

    B.Web.MessageBox.regional["en-US"] = {
        messages: {
            ok: "Confirm",
            cancel: "Cancel",
            yes: "Yes",
            no: "No",
            close: "Close"
        },
        sysTips: {
            title: "System Tip",
            loadingContent: "loading.."
        }
    }


    //B.CultureInfo.Current.set("en-US");

})(jQuery, Beyondbit);
(function ($, B) {

    B.Web.Window.regional["en-US"] = {
        notAllowIdIsEmpty: "Not Allow Id Is Empty",
        loading: "Loading..",
        buttons: {
            close: "Close"
        }
    }

})(jQuery, Beyondbit);
(function ($, B) {

    var pager = B.jQueryEx.Pager;

    pager.regional["en-US"] = {
        prevText: "PREV",
        nextText: "NEXT",
        pageCurrent: "Current",
        pageTotal: "Total Page",
        pageSize: "Page Size",
        recordTotal: "Total",
        redirect: "Redirect",
        recordUnit: "row"
    }

})(jQuery, Beyondbit);


(function ($, B) {

    var ajax = B.jQueryEx.Ajax;

    ajax.regional = [];

    ajax.regional["en-US"] = {
        message: {
            title: "System Tip",
            actionName: "Operate"
        },
        close: "Close",
        ok: "Confirm",
        success: "{0} success!",
        loading: "{0} ing..."
    }


})(jQuery, Beyondbit);