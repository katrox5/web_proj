document.addEventListener('DOMContentLoaded', function () {
    const textArea = document.getElementById('question-text');
    const imageInput = document.getElementById('image-input');
    const imagePreview = document.getElementById('image-preview');
    const saveDraftBtn = document.getElementById('save-draft');
    const previewBtn = document.getElementById('preview');
    const publishBtn = document.getElementById('publish');

    // 保存草稿
    saveDraftBtn.addEventListener('click', function () {
        // 实现保存草稿的逻辑
        console.log('保存草稿');
    });

    // 在线预览
    previewBtn.addEventListener('click', function () {
        // 实现在线预览的逻辑
        console.log('在线预览');
    });

    // 发布
    publishBtn.addEventListener('click', function () {
        // 实现发布的逻辑
        console.log('发布');
    });

    // 图片上传预览
    imageInput.addEventListener('change', function () {
        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            };
            reader.readAsDataURL(file);
        }
    });
});
