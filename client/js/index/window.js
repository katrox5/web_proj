function showWindow() {
    const container = document.createElement('div');
    container.id = 'board';
    container.innerHTML = `
        <div class="header"><span>编辑个人资料</span><img src="../../img/index/cancel.png" onclick="closeWindow()"/></div>
        <div class="content">
            <div class="left-content"><img id="avatar"/><input type="file" accept="image/*" id="upload"/></div>
            <div class="right-content">
                <table>
                    <tr><td align="right">账号：</td><td id="username"></td></tr>
                    <tr><td align="right">昵称：</td><td><input id="nickname"/></td></tr>
                    <tr><td align="right">个性签名：</td><td><textarea id="signature"></textarea></td></tr>
                </table>
            </div>
        </div>
        <div class="album"><h3>个人相册</h3><div id="list"></div></div>
        <div class="foot"><button onclick="save()">保存</button></div>
        <input type="file" accept="image/*" id="uploadImg" style="display: none" multiple/></input>
    `;
    const overlay = document.createElement('div');
    overlay.id = 'modal-overlay';
    overlay.appendChild(container);
    document.body.appendChild(overlay);

    request4GetUserInfo();
    request4GetUserImgs();
    dragPicture();
    uploadAvatar();
    uploadPicture();
}

function $(id)
{
    return document.getElementById(id);
}

function closeWindow() {
    $('modal-overlay').remove()
}

function uploadAvatar() {
    $('upload').addEventListener('change', function() {
        $('avatar').src = URL.createObjectURL(this.files[0]);
    });
}

function uploadPicture() {
    $('uploadImg').addEventListener('change', function() {
        const list = $('list');
        const { files } = this;
        for (var i = 0; i < files.length; i++) {
            if (list.childNodes.length >= 8) {
                new Message().show({
                    type: 'error',
                    text: '最多只能上传7张照片！',
                    closeable: true
                });
                break;
            }
            var img = document.createElement('img');
            img.src = URL.createObjectURL(this.files[i]);
            img.classList.add('list-item');
            img.classList.add(this.files[i].name);
            img.classList.add('new');           // 用于标识
            img.id = list.childNodes.length - 1;
            img.draggable = 'true';
            list.insertBefore(img, $('list-add'));
        }
    });
}

function dragPicture() {
    const list = $('list');
    let sourceNode;         // 用于存储拖拽目标元素
    list.ondragstart = function(e) {
        if (e.target.id == 'list-add') {
            sourceNode = null;
            return;
        }
        // 在拖拽开始时，将目标元素设置为拖拽目标，并在稍后隐藏原位置上的图片
        setTimeout(() => {
            e.target.classList.add('moving');
        }, 0);
        sourceNode = e.target;          // 设置拖拽目标元素
    };
    list.ondragenter = function(e) {
        // 当拖拽元素进入容器时，根据拖拽的位置重新排列元素
        if (e.target === list || e.target === sourceNode || sourceNode == null)
            return;                     // 排除自身和父元素

        const children = Array.from(list.children);
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
    list.ondragend = (e) => e.target.classList.remove('moving');
}

function save() {
    saveUserInfo();
    // save: saveUserInfo -> saveUserImgs -> closeWindow
}

function saveUserInfo() {
    let avatar_url;
    if (typeof($('upload').files[0]) == 'undefined')
        avatar_url = null;
    else
        avatar_url = media_path + 'avatar/' + $('upload').files[0].name;
    let nickname = $('nickname').value;
    let signature = $('signature').value;

    request4ModifyUser(nickname, signature, avatar_url);
}

function saveUserImgs() {
    const list = $('list');
    const items = list.childNodes;

    let queue = [];
    for (var i = 0; i < items.length - 1; i++) {
        var order = items[i].id;
        if (items[i].classList.length == 3) {
            var url = media_path + 'user/' + items[i].classList[1];
            queue.push([url, i]);
        } else if (order != i) {
            request4ModifyUserImgOrder(items[i].classList[1], i);
        }
    }

    exec(queue);
    closeWindow();
}

let flag = true;            // 服务器是否返回处理结果

// 处理队列流程
function exec(queue) {
    if (queue.length == 0)  // 当队列为空，退出处理流程
        return;

    if (flag) {             // 若flag为false，代表服务器还未返回处理结果
        pair = queue.pop();

        var url = pair[0];
        var num_order = pair[1];
        request4AddUserImg(url, num_order);
        flag = false;
    }

    setTimeout(function() {
        exec(queue);        // 等待50毫秒，再执行一次
    }, 50);
}

function loadInfo(info) {
    $('username').innerText = info[0];
    $('nickname').value = info[1];
    $('signature').innerText = info[2];
    if (info[3] != null)
        $('avatar').src = info[3];
    else
        $('avatar').src = media_path + 'avatar/default_avatar.png';
}

function loadImgs(imgs) {
    const list = $('list');

    for (var i = 0; i < imgs.length; i++) {
        var img = document.createElement('img');
        img.src = imgs[i][1];
        img.classList.add('list-item');
        img.classList.add(imgs[i][0]);
        img.id = imgs[i][2];
        img.draggable = 'true';
        list.appendChild(img);
    }
    // 上传图片按钮
    var img = document.createElement('img');
    img.src = '../../img/index/add.png';
    img.className = 'list-item';
    img.id = 'list-add';
    img.onclick = () => $('uploadImg').click();
    list.appendChild(img);
}

// 请求获取用户信息
function  request4GetUserInfo() {
    const xhr = new XMLHttpRequest();
    xhr.open('post', url_prefix + 'getUserById');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {               // 请求成功
            let obj = JSON.parse(xhr.responseText);
            loadInfo(obj.content[0]);           // 加载信息到页面
        }
    };
    const data = {
        user_id: localStorage.getItem('id')     // 通过用户id获取其信息
    };
    xhr.send(JSON.stringify(data));
}

// 请求获取用户相册
function request4GetUserImgs() {
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
        user_id: localStorage.getItem('id')     // 通过用户id获取其相册
    };
    xhr.send(JSON.stringify(data));
}

function request4ModifyUser(nickname, signature, avatar_url) {
    const xhr = new XMLHttpRequest();
    xhr.open('post', url_prefix + 'modifyUser');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            let obj = JSON.parse(xhr.responseText);
            if (obj.status == 'failure') {
                console.warn('Update user info failed');
                console.error(obj.message);
            } else if (obj.status == 'error') {
                new Message().show({
                    type: 'error',
                    text: obj.message,
                    closeable: true
                });
            } else if (obj.status == 'success') {
                saveUserImgs();
            }
        }
    };
    const data = {
        user_id: localStorage.getItem('id'),
        nickname: nickname,
        signature: signature,
        avatar_url: avatar_url
    };
    xhr.send(JSON.stringify(data));
}

function request4AddUserImg(url, order) {
    const xhr = new XMLHttpRequest();
    xhr.open('post', url_prefix + 'addUserImg');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            let obj = JSON.parse(xhr.responseText);
            if (obj.status == 'failure') {
                console.warn('Insert image failed');
                console.error(obj.message);
            }
            flag = true;
        }
    };
    const data = {
        user_id: localStorage.getItem('id'),
        url: url,
        num_order: order
    };
    xhr.send(JSON.stringify(data));
}

function request4ModifyUserImgOrder(id, order) {
    const xhr = new XMLHttpRequest();
    xhr.open('post', url_prefix + 'modifyUserImgOrder');
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
