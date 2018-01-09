$.uploadify.setCurrentCulture("zh-CN");
$.uploadify.regional[$.uploadify.getCurrentCulture()] = {
    buttonText: '选择文件',
    errorMsgPrelogue: '一些文件未加入队列:',
    errorMsgFileAlreadyInQueue: '文件"{0}"已存在队列中，\n是否需要替换当前队列中的文件?',
    errorMsgFileExceedsSizeLimit: '\n文件 "{0}" 超过大小限制 ({1}).',
    errorMsgZeroByteFile: '\n文件 "{0}" 为空.',
    msgComplete: ' - 上传完成'
};