function SetDatepickerRange2(obj, id, ref, startVal, endVal) {
    var set = false;
    if (id.indexOf(".StartTime") > -1) {
        $(obj).datepicker({
            autoSize: true,
            changeMonth: true,
            changeYear: true,
            dateFormat: "yy-mm-dd",
            onSelect: function (startDate) {
                var endObj = $($.find("input[id='" + ref + "']")[0]);
                var endDate = endObj.datepicker('getDate');
                if (endDate < startDate) {
                    endObj.datepicker('setDate', endVal);
                }
                set = true;
                endObj.datepicker("option", "minDate", startDate);
            }
        }).attr("readonly", "readonly");

        if (!set)
            $(obj).datepicker("option", "minDate", startVal);
        $(obj).datepicker("option", "maxDate", endVal);
    } else {
        $(obj).datepicker({
            autoSize: true,
            changeMonth: true,
            changeYear: true,
            dateFormat: "yy-mm-dd",
            onSelect: function (endDate) {
                var startObj = $($.find("input[id='" + ref + "']")[0]);
                var startDate = startObj.datepicker("getDate");
                if (endDate < startDate) {
                    startObj.datepicker('setDate', startVal);
                }
                set = true;
                startObj.datepicker("option", "maxDate", endDate);
            }
        }).attr("readonly", "readonly");
        if (!set)
            $(obj).datepicker("option", "maxDate", endVal);
        $(obj).datepicker("option", "minDate", startVal);

    }
}