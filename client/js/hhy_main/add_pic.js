var comment_id;
var father_comment=-1;

function $(id)
{
    return document.getElementById(id);
}

function requestGetComImg(){
    const xhr = new XMLHttpRequest();
    xhr.open('post', url_prefix + 'getUserImgByUserId');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {               // 请求成功
            let obj = JSON.parse(xhr.responseText);
            loadImgs(obj.content);              // 加载相册到页面
        }
    };
    const data = {
        //???
        //读取数值还是设置
        comment_id:father_comment,
    }
    xhr.send(JSON.stringify(data));
}

function loadImgs(imgs) {
    const containner = $('image-preview-container');

    for (var i = 0; i < imgs.length; i++) {
        var img = document.createElement('img');
        img.src = imgs[i][1];
        img.classList.add('list-item');
        img.classList.add(imgs[i][0]);
        img.id = imgs[i][2];
        img.draggable = 'true';
        containner.appendChild(img);
    }
    // 上传图片按钮
    var img = document.createElement('img');
    img.src = '../../img/index/add.png';
    img.className = 'list-item';
    img.id = 'list-add';
    img.onclick = () => $('uploadImg').click();
    containner.appendChild(img);
}


function setPictureDraggable() {
    const containner = $('image-preview-container');
    let sourceNode;         // 用于存储拖拽目标元素
    containner.ondragstart = function(e) {
        if (e.target.id == 'pic-add') {
            sourceNode = null;
            return;
        }
        // 在拖拽开始时，将目标元素设置为拖拽目标，并在稍后隐藏原位置上的图片
        setTimeout(() => {
            e.target.classList.add('moving');
        }, 0);
        sourceNode = e.target;          // 设置拖拽目标元素
    };
    containner.ondragenter = function(e) {
        // 当拖拽元素进入容器时，根据拖拽的位置重新排列元素
        if (e.target === list || e.target === sourceNode || sourceNode == null)
            return;                     // 排除自身和父元素

        const children = Array.from(containner.children);
        const sourceIndex = children.indexOf(sourceNode);
        const targetIndex = children.indexOf(e.target);

        if (targetIndex == children.length-1)
            return;
        if (sourceIndex < targetIndex)  // 往下拖动
            list.insertBefore(sourceNode, e.target.nextElementSibling);
        else                            // 往上拖动
            list.insertBefore(sourceNode, e.target);
    };
    // 释放，该图片重新display
    containner.ondragend = (e) => e.target.classList.remove('moving');
}

function uploadPicture() {
    $('uploadImg').addEventListener('change', function() {
        const containner = $('image-preview-container');
        const { files } = this;
        for (var i = 0; i < files.length; i++) {
            if (containner.childNodes.length >= 9) {
                new Message().show({
                    type: 'error',
                    text: '最多只能上传8张照片！',
                    closeable: true
                });
                break;
            }
            var img = document.createElement('img');
            img.src = URL.createObjectURL(this.files[i]);
            img.classList.add('image-preview');
            img.classList.add(this.files[i].name);
            img.classList.add('new');           // 用于标识
            img.id = containner.childNodes.length - 1;
            img.draggable = 'true';
            containner.insertBefore(img, $('pic-add'));
        }
    });
}


function saveComImgs() {
    const containner = $('image-preview-container');
    const items = containner.childNodes;

    let queue = [];
    for (var i = 0; i < items.length - 1; i++) {
        var order = items[i].id;
        if (items[i].classList.length == 3) {
            var url = media_path + 'user/' + items[i].classList[1];
            queue.push([url, i]);
        } else if (order != i) {
            requestModifyComImgOrder(items[i].classList[1], i);
        }
    }
    request4AddUserImg(queue);
}

function requestModifyComImgOrder(id, order) {
    const xhr = new XMLHttpRequest();
    xhr.open('post', url_prefix + 'modifyCommentImgOrder');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            let obj = JSON.parse(xhr.responseText);
            if (obj.status == 'failure') {
                console.warn('Update image order failed');
                console.error(obj.message);
            }
        }
    };
    const data = {
        img_id: id,
        num_order: order
    };
    xhr.send(JSON.stringify(data));
}

function requestAddComImg(queue) {
    if (queue.length == 0) {        // 当队列为空，结束上传
        return closeWindow();
    }

    pair = queue.pop();
    var url = pair[0];
    var order = pair[1];

    const xhr = new XMLHttpRequest();
    xhr.open('post', url_prefix + 'addCommentImg');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            let obj = JSON.parse(xhr.responseText);
            if (obj.status == 'failure') {
                console.warn('Insert image failed');
                console.error(obj.message);
            }
            request4AddUserImg(queue);
        }
    };
    const data = {
        user_id: localStorage.getItem('id'),
        url: url,
        num_order: order
    };
    xhr.send(JSON.stringify(data));
}
