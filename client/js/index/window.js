function show() {
    const container = document.createElement('div');
    container.id = 'board';
    container.innerHTML = `
        <div class="header"><span>编辑个人资料</span><img src="../../img/zhy_main/cancel.png" onclick="cancel()"/></div>
        <div class="content">
            <div class="left-content"><img id="avatar"/><input type="file" accept="image/*" id="upload"/></div>
            <div class="right-content">
                <table>
                    <tr><td>账号</td><td id="username"></td></tr>
                    <tr><td>昵称</td><td><input id="nickname"/></td></tr>
                    <tr><td>个性签名</td><td><textarea id="signature"></textarea></td></tr>
                </table>
            </div>
        </div>
        <div class="foot"><button onclick="saveUserInfo()">保存</button></div>
    `;
    document.body.appendChild(container);

    getUserInfo();
    uploadPicture();
}

function $(id)
{
    return document.getElementById(id);
}

function cancel() {
    $('board').remove()
}

function uploadPicture() {
    $('upload').addEventListener('change', function() {
        $('avatar').src = URL.createObjectURL(this.files[0]);
    });
}

function saveUserInfo() {
    const xhr = new XMLHttpRequest();
    xhr.open('post', url_prefix + 'modifyUser');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            let obj = JSON.parse(xhr.responseText);
            if (obj.status == 'success') {
                cancel();
            }
            new Message().show({
                type: obj.status,
                text: obj.message,
                closeable: true
            });
        }
    };
    const data = {
        user_id: localStorage.getItem('id'),
        nickname: $('nickname').value,
        signature: $('signature').value,
        avatar_url: media_path + 'avatar/' + $('upload').files[0].name
    };
    xhr.send(JSON.stringify(data));
}

function getUserInfo() {
    const xhr = new XMLHttpRequest();
    xhr.open('post', url_prefix + 'getUserById');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            let obj = JSON.parse(xhr.responseText);
            loadData(obj.content[0]);
        }
    };
    const data = {
        user_id: localStorage.getItem('id')
    };
    xhr.send(JSON.stringify(data));
}

function loadData(info) {
    $('username').innerText = info[0];
    $('nickname').value = info[1];
    $('signature').innerText = info[2];
    if (info[3] != null)
        $('avatar').src = info[3];
    else
        $('avatar').src = media_path + 'avatar/default_avatar.png';
}
