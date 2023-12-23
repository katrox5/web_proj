document.addEventListener('DOMContentLoaded', function () {
    // 获取文本框和按钮
    var questionText = document.getElementById('question-text');
    var publishButton = document.querySelector('.button_3');
    var draftButton = document.querySelector('.button_1');

    // 添加发布按钮点击事件监听器
    publishButton.addEventListener('click', function (event) {
        // 获取文本框内容
        var textContent = questionText.value.trim();

        // 进行文本检查
        if (textContent.length === 0) {
            alert("问题必须填写后才能发表");
            event.preventDefault(); // 阻止默认行为（跳转）
        } else if (textContent.length < 5) {
            alert("问题字数太少（大于5个字）");
            event.preventDefault(); 
        } else if (textContent.length > 1000) {
            alert("超出问题字数限额（大于1000个字）");
            event.preventDefault(); 
        }
    });

    // 添加保存草稿按钮点击事件监听器
    draftButton.addEventListener('click', function (event) {
        // 获取文本框内容
        var textContent = questionText.value.trim();

        // 进行文本检查
        if (textContent.length === 0) {
            alert("问题必须填写后才能保存草稿");
            event.preventDefault(); // 阻止默认行为（跳转）
        }
    });
});