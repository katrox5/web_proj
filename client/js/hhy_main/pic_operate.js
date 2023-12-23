// 在你的 imageUpload.js 中
function setupImageUpload() {
    const imageInput = document.getElementById('image-upload');
    const uploadProgress = document.getElementById('upload-progress');
    const imagePreviewContainer = document.getElementById('image-preview-container');

    imageInput.addEventListener('change', function () {
        const files = imageInput.files;

        if (files.length > 0) {
            // 显示上传进度条
            uploadProgress.style.display = 'block';

            const formData = new FormData();
            for (let i = 0; i < Math.min(files.length, 9); i++) {
                formData.append(`image${i + 1}`, files[i]);
            }

            // 模拟异步上传
            simulateImageUpload(formData, function (progress) {
                // 更新上传进度条
                uploadProgress.value = progress;

                if (progress === 100) {
                    // 上传完成后隐藏进度条，并显示预览
                    uploadProgress.style.display = 'none';
                    displayImagePreviews(files);
                }
            });
        }
    });
}

// 模拟图片上传的函数（可以替换为实际的上传逻辑）
function simulateImageUpload(formData, progressCallback) {
    const total = 100;
    let current = 0;

    const interval = setInterval(function () {
        current += 10;

        if (current <= total) {
            progressCallback(current);
        } else {
            clearInterval(interval);
        }
    }, 500);
}

// 显示上传的预览图片
function displayImagePreviews(files) {
    const imagePreviewContainer = document.getElementById('image-preview-container');
    imagePreviewContainer.innerHTML = '';

    for (let i = 0; i < Math.min(files.length, 9); i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = function (e) {
            const imagePreview = document.createElement('div');
            imagePreview.className = 'image-preview';

            const img = document.createElement('img');
            img.src = e.target.result;

            imagePreview.appendChild(img);
            imagePreviewContainer.appendChild(imagePreview);
        };

        reader.readAsDataURL(file);
    }
}

// 调用函数进行图片上传的设置
setupImageUpload();
