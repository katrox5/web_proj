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
	addUser(user, pswd);
}

// 注册成功
function regSuccess() {
    new Message().show({
        type: 'success',
        text: '注册成功，跳转到登录页...',
        duration: 1500,
        closeable: true
    });

	// 跳转到主页
	setTimeout(() => {
	    window.location.assign('login.html');
	}, 2000);
}

// 注册失败
function regFailure() {
    new Message().show({
        type: 'error',
        text: '账号已被注册',
        closeable: true
    });
    username.value = '';
    username.focus();
}

// 账号非法导致注册失败
function regFailure4UserIsIllegal() {
    new Message().show({
        type: 'error',
        text: '账号只能是手机号或邮箱',
        closeable: true
    });
}

// 密码非法导致注册失败
function regFailure4PswdIsIllegal() {
    new Message().show({
        type: 'error',
        text: '密码长度8-16位且必须包含数字、大小写字母',
        closeable: true
    });
}
