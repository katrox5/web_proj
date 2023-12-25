// 全局变量用于跟踪草稿数量
var Count = 0;

// 设置图片拖拽容器
const container = document.getElementById('image-preview-container');

function addloc() {
    // 获取问题描述的输入框元素
    var questionTextElement = document.getElementById("question-text");

    // 获取问题描述的值
    var questionText = questionTextElement.value.trim();

    // 检查问题描述是否为空
    if (questionText === "") {
        // 如果为空，输出提示
        alert("草稿不能为空，必须填写");
    } else {
        // 获取当前草稿的序号
        var commentId = ++Count;
        var fatherID = -1;

        // 设置本地存储，使用草稿序号作为键
        localStorage.setItem("comment_" + commentId, questionText);
        localStorage.setItem("father_" + fatherID, -1);

        alert("草稿已保存，草稿序号：" + commentId);
    }

    // 获取图片列表
    const imageList = document.querySelectorAll('.preview-image');

    // 构建图片信息数组
    const imageInfoArray = [];
    imageList.forEach((image, index) => {
        const pic_id = index + 1; // pic_id从1开始
        const pic_url = image.querySelector('img').src;
        const pic_num_order = index + 1;
        imageInfoArray.push({ pic_id, pic_url, pic_num_order });
    });

    // 将图片信息保存到本地存储
    localStorage.setItem('imageInfoArray', JSON.stringify(imageInfoArray));
}

document.getElementById('image-upload').addEventListener('change', handleImageUpload);

function handleImageUpload(event) {
    const { files } = event.target;
    // 遍历上传的文件列表
    for (let i = 0; i < files.length; i++) {
        if (container.children.length >= 9) {
            alert('最多只能上传9张图片！');
            break;
        }
        // 创建一个图片容器元素
        const imgContainer = document.createElement('div');
        imgContainer.classList.add('preview-image');
        // 创建一个图片元素，并设置其 src 属性为上传文件的 URL
        const img = document.createElement('img');
        img.src = URL.createObjectURL(files[i]);
        img.draggable = true;
        // 创建一个删除图标元素
        const deleteIcon = document.createElement('span');
        deleteIcon.classList.add('delete-icon');
        deleteIcon.innerHTML = '&times;';
        deleteIcon.addEventListener('click', () => { // 点击时移除对应的图片容器
            imgContainer.remove();
        });
        // 将图片元素和删除图标元素添加到容器中
        imgContainer.appendChild(img);
        imgContainer.appendChild(deleteIcon);

        container.appendChild(imgContainer);
    }
}

// 设置图片拖拽效果
container.addEventListener('dragstart', handleDragStart);
container.addEventListener('dragover', handleDragOver);
container.addEventListener('drop', handleDrop);

function handleDragStart(event) { // 处理拖拽开始事件
    // 将被拖拽元素的 ID 存储到拖拽数据中
    event.dataTransfer.setData('text/plain', event.target.id);
    // 设置被拖拽元素的透明度
    event.target.style.opacity = '0.4';
}

function handleDragOver(event) { // 处理拖拽过程中的事件
    event.preventDefault();
    // 获取正在拖拽的元素
    const draggingElement = document.querySelector('.preview-image.dragging');
    // 获取鼠标位置下的元素
    const elementMouseIsOver = document.elementFromPoint(event.clientX, event.clientY);
    // 检查拖拽元素、鼠标位置下的元素是否为图片
    if (draggingElement !== null && elementMouseIsOver !== null && elementMouseIsOver.classList.contains('preview-image')) {
        const position = elementMouseIsOver.compareDocumentPosition(draggingElement);
        if (position === 0) { //两个元素相同，则返回
            return;
        }
        container.insertBefore(draggingElement, elementMouseIsOver);
    }
}

function handleDrop(event) { // 处理拖拽结束事件
    event.preventDefault();
    // 获取拖拽数据中存储的文本内容
    const data = event.dataTransfer.getData('text/plain');
    const draggedElement = document.getElementById(data);
    const elementMouseIsOver = document.elementFromPoint(event.clientX, event.clientY);
    // 检查拖拽元素、鼠标位置下的元素是否为图片容器
    if (draggedElement !== null && elementMouseIsOver !== null && elementMouseIsOver.classList.contains('preview-image')) {
        const position = elementMouseIsOver.compareDocumentPosition(draggedElement);
        if (position === 0) {
            return;
        }
        // 在鼠标位置下的元素之前插入拖拽元素
        container.insertBefore(draggedElement, elementMouseIsOver);
    }
    // 恢复拖拽元素的透明度
    draggedElement.style.opacity = '1';
}




// <!-- 备份本地的一个增加 -->

// <!-- <script>
//     // 全局变量用于跟踪草稿数量
//     var Count = 0;
//     var fatherID;

//     function addloc() {
//         // 获取问题描述的输入框元素
//         var questionTextElement = document.getElementById("question-text");

//         // 获取问题描述的值
//         var questionText = questionTextElement.value.trim();

//         // //检查问题描述是否为空
//         if (questionText === "") {
//             // 如果为空，输出提示
//             alert("草稿不能为空，必须填写");
//         } else {
//             // 获取当前草稿的序号
//             var commentId = ++Count;
//             var fatherID=-1;

//             // 设置本地存储，使用草稿序号作为键
//             localStorage.setItem("comment_" + commentId, questionText);
//             localStorage.setItem("father_"+ fatherID, -1);

//             alert("草稿已保存，草稿序号：" + commentId);
//         }
//     }
// </script> -->


// <!-- <script>
//     function addloc() {
//         // 获取图片列表
//         const imageList = document.querySelectorAll('.preview-image');

//         // 构建图片信息数组
//         const imageInfoArray = [];
//         imageList.forEach((image, index) => {
//             const pic_id = index + 1; // pic_id从1开始
//             const pic_url = image.src;
//             const pic_num_order = index + 1;
//             imageInfoArray.push({ pic_id, pic_url, pic_num_order });
//         });

//         // 将图片信息保存到本地存储
//         localStorage.setItem('imageInfoArray', JSON.stringify(imageInfoArray));

//         alert('草稿已保存');
//     }

//     document.getElementById('image-upload').addEventListener('change', handleImageUpload);

//     function handleImageUpload(event) {
//         const container = document.getElementById('image-preview-container');
//         const { files } = event.target;
//         // 遍历上传的文件列表
//         for (let i = 0; i < files.length; i++) {
//             if (container.children.length >= 9) {
//                 alert('最多只能上传9张图片！');
//                 break;
//             }
//             // 创建一个图片容器元素
//             const imgContainer = document.createElement('div');
//             imgContainer.classList.add('preview-image');
//             // 创建一个图片元素，并设置其 src 属性为上传文件的 URL
//             const img = document.createElement('img');
//             img.src = URL.createObjectURL(files[i]);
//             img.draggable = true;
//              // 创建一个删除图标元素
//             const deleteIcon = document.createElement('span');
//             deleteIcon.classList.add('delete-icon');
//             deleteIcon.innerHTML = '&times;';
//             deleteIcon.addEventListener('click', () => { // 点击时移除对应的图片容器
//                 imgContainer.remove();
//             });
//             // 将图片元素和删除图标元素添加到容器中
//             imgContainer.appendChild(img);
//             imgContainer.appendChild(deleteIcon);

//             container.appendChild(imgContainer);
//         }
//     }

//     // 设置图片拖拽效果
//     const container = document.getElementById('image-preview-container');
//     container.addEventListener('dragstart', handleDragStart);
//     container.addEventListener('dragover', handleDragOver);
//     container.addEventListener('drop', handleDrop);

//     function handleDragStart(event) { // 处理拖拽开始事件
//         // 将被拖拽元素的 ID 存储到拖拽数据中
//         event.dataTransfer.setData('text/plain', event.target.id);
//         // 设置被拖拽元素的透明度
//         event.target.style.opacity = '0.4';
//     }

//     function handleDragOver(event) { // 处理拖拽过程中的事件
//         event.preventDefault();
//         // 获取正在拖拽的元素
//         const draggingElement = document.querySelector('.preview-image.dragging');
//         // 获取鼠标位置下的元素
//         const elementMouseIsOver = document.elementFromPoint(event.clientX, event.clientY);
//         // 检查拖拽元素、鼠标位置下的元素是否为图片
//         if (draggingElement !== null && elementMouseIsOver !== null && elementMouseIsOver.classList.contains('preview-image')) {
//             const position = elementMouseIsOver.compareDocumentPosition(draggingElement);
//             if (position === 0) { //两个元素相同，则返回
//                 return;
//             }
//             container.insertBefore(draggingElement, elementMouseIsOver);
//         }
//     }

//     function handleDrop(event) { // 处理拖拽结束事件
//         event.preventDefault();
//         // 获取拖拽数据中存储的文本内容
//         const data = event.dataTransfer.getData('text/plain');
//         const draggedElement = document.getElementById(data);
//         const elementMouseIsOver = document.elementFromPoint(event.clientX, event.clientY);
//         // 检查拖拽元素、鼠标位置下的元素是否为图片容器
//         if (draggedElement !== null && elementMouseIsOver !== null && elementMouseIsOver.classList.contains('preview-image')) {
//             const position = elementMouseIsOver.compareDocumentPosition(draggedElement);
//             if (position === 0) {
//                 return;
//             }
//             // 在鼠标位置下的元素之前插入拖拽元素
//             container.insertBefore(draggedElement, elementMouseIsOver);
//         }
//         // 恢复拖拽元素的透明度
//         draggedElement.style.opacity = '1';
//     }
// </script> -->