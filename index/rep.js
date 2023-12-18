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
if ((user = localStorage.getItem('username')) != null)
{
	username.value = user;
}

let CODE;       // 验证码

function send() {
	const user = username.value;
	
	if (user == '') {
		remindAndShake();
		return;
	}

	// 生成6位验证码
    CODE = spawnCode(6);
    console.log(CODE);

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
    const user = username.value;

    if (code.value != CODE) {
        new Message().show({
            type: 'error',
            text: '验证码错误',
            closeable: true
        });
        code.value = '';
        code.focus();
        return;
    }

    new Message().show({
        type: 'success',
        text: '验证成功',
        closeable: true
    });
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
        modifyPswd(user, pswd);
    };
}

// 密码修改成功
function modSuccess() {
    new Message().show({
        type: 'success',
        text: '修改成功，跳转到登录页...',
        duration: 1500,
        closeable: true
    });

	// 跳转到主页
	setTimeout(() => {
	    window.location.assign('login.html');
	}, 2000);
}

// 密码修改失败
function modFailure() {
    new Message().show({
        type: 'error',
        text: '密码重置失败，请联系管理员',
        closeable: true
    });
}

// 密码非法导致修改失败
function modFailure4PswdIsIllegal() {
    new Message().show({
        type: 'error',
        text: '密码长度8-16位且必须包含数字、大小写字母',
        closeable: true
    });
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

// 生成随机字符串
function spawnCode(len) {
    let res = '';

    const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < len; i++)
        res += str.charAt(Math.floor(Math.random() * str.length));

    return res;
}
