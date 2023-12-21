function reg() {
    const user = username.value;
    const pswd = password.value;

    var flag = false;
    if (user == '') {
        remindUsername('账号不能为空');
        shake(document.getElementsByClassName('ipt-box')[0]);
        flag = true;
    }
    if (pswd == '') {
        remindPassword('密码不能为空');
        shake(document.getElementsByClassName('ipt-box')[1]);
        flag = true;
    }
    if (flag)
        return;

    const cfm = $('confirm');
    if (pswd != cfm.value) {
        new Message().show({
            type: 'warning',
            text: '两次输入的密码不同',
            closeable: true
        });
        password.value = cfm.value = '';
        password.focus();
        return;
    }

    // 提交到数据库
    register(user, pswd);
}

function register(user, pswd) {
    const xhr = new XMLHttpRequest();
    xhr.open('post', url_prefix + 'addUser');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            let obj = JSON.parse(xhr.responseText);
            if (obj.status == 'success') {
                regSuccess();
            }
            new Message().show({
                type: obj.status,
                text: obj.message,
                closeable: true
            });
        }
    };
    const data = {
        username: user,
        password: pswd
    };
    xhr.send(JSON.stringify(data));
}

// 注册成功
function regSuccess() {
    setTimeout(() => {
        window.location.assign('login.html');
    }, 2300);
    document.documentElement.style.pointerEvents = 'none';
}
