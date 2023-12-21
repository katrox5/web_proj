const autolog = $('autolog');

document.addEventListener('keyup', function(event) {
    if (event.keyCode == 13) log();
});

if ((user = localStorage.getItem('username')) != null) {
    // 记住账号功能
    username.value = user;
    // 保持登录功能
    if (localStorage.getItem('autolog') == 'true' && (pswd = localStorage.getItem('password')) != null) {
        password.value = pswd;
        autolog.checked = true;
        log();
    } else password.focus();
}

function log() {
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

    // 记录账号
    localStorage.setItem('username', user);
    
    // 提交到数据库
    login(user, pswd);
}

function login(user, pswd) {
    const xhr = new XMLHttpRequest();
    xhr.open('post', url_prefix + '/verify');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            let obj = JSON.parse(xhr.responseText);
            if (obj.status == 'success') {
                localStorage.setItem('id', obj.id)
                return logSuccess();
            }
            logFailure();
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

// 登录成功
function logSuccess() {
    window.location.assign('../../html/dyz_main/main.html')

    // 记录是否保持登录
    localStorage.setItem('autolog', autolog.checked);
    if (autolog.checked)
        localStorage.setItem('password', password.value);
}

let failureCount = 0;       // 登录失败次数

// 登录失败
function logFailure() {
    password.value = '';
    password.focus();

    // 失败超过5次进入冷却
    if (++failureCount >= 5) {
        failureCount = 0;
        let btn = $('login');
        let sec = 30;
        const txt = btn.innerText;
        btn.disabled = true;
        btn.innerText = sec + '秒后重试';
        let timer = setInterval(function() {
            if (--sec <= 0) {
                clearInterval(timer);
                btn.innerText = txt;
                btn.disabled = false;
            } else btn.innerText = sec + '秒后重试';
        }, 1000);
    }
}
