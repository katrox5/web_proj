function $(id)
{
    return document.getElementById(id);
}

const username = $('username');
const code = $('code');
const style = username.style.border;

username.addEventListener('input', function() {
    recover(this);
});

// 自动补充用户名
if ((user = localStorage.getItem('username')) != null) {
    username.value = user;
}

function send() {
    const user = username.value;

    if (user == '') {
        remindAndShake();
        return;
    }

    // 冷却60秒
    let btn = $('send');
    let sec = 60;
    const txt = btn.innerText;
    btn.disabled = true;
    btn.innerText = sec + ' S';
    let timer = setInterval(function() {
        if (--sec <= 0) {
            clearInterval(timer);
            btn.innerText = txt;
            btn.disabled = false;
        } else btn.innerText = sec + ' S';
    }, 1000);
}

function confirm() {
    const xhr = new XMLHttpRequest();
    xhr.open('post', url_prefix + 'verifyCode');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            let obj = JSON.parse(xhr.responseText);
            new Message().show({
                type: obj.status,
                text: obj.message,
                closeable: true
            });
            if (obj.status == 'success') {
                return verifySuccess();
            }
            code.value = '';
            code.focus();
        }
    };
    const data = {
        username: username.value,
        code: code.value
    };
    xhr.send(JSON.stringify(data));
}

function verifySuccess() {
    document.getElementsByClassName('ipt-box')[0].remove();
    document.getElementsByClassName('cod-box')[0].remove();

    var ipt1 = document.createElement('div');
    ipt1.className = 'ipt-box';
    ipt1.innerHTML = `
        <label>密码</label>
        <input type="text" id="password"/>
    `;
    var ipt2 = document.createElement('div');
    ipt2.className = 'ipt-box';
    ipt2.innerHTML = `
        <label>确认密码</label>
        <input type="text" id="confirm"/>
    `;

    document.getElementsByClassName('box')[0].insertBefore(ipt1, document.getElementsByClassName('btn-box')[0]);
    document.getElementsByClassName('box')[0].insertBefore(ipt2, document.getElementsByClassName('btn-box')[0]);

    $('okay').onclick = function() {
        const pswd = $('password').value;
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
        modifyPassword(user, pswd);
    };
}

function modifyPassword(user, pswd) {
    const xhr = new XMLHttpRequest();
    xhr.open('post', url_prefix + 'modifyPassword');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status === 200) {
            let obj = JSON.parse(xhr.responseText);
            if (obj.status == 'success') {
                setTimeout(() => {
                    window.location.assign('login.html');
                }, 2000);
            }
            new Message().show({
                type: obj.status,
                text: obj.message,
                duration: 1500,
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

function remindAndShake() {
    username.placeholder = '账号不能为空';
    username.style.border = '1px solid rgba(255,0,0,0.7)';
    let effect = new KeyframeEffect(
        document.getElementsByClassName('ipt-box')[0],
        [
            {
                marginLeft: '0'
            },
            {
                marginLeft: '0.5rem'
            },
            {
                marginLeft: '0'
            },
            {
                marginLeft: '-0.5rem'
            }
        ],
        {
            duration: 200,
            easing: 'ease-in-out',
            iterations: 2
        }
    );
    new Animation(effect, document.timeline).play();
}

function recover() {
    username.placeholder = '';
    username.style.border = style;
}
