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
		password.value = cfm.value = '';
		password.focus();
		remindPassword('两次输入的密码不同');
		shake(document.getElementsByClassName('ipt-box')[1]);
		return;
	}
	
	// 提交到数据库
	addUser(user, pswd);
}

function regSuccess() {
	// 注册成功
}

function regFailure() {
	username.value = '';
	username.focus();
	remindUsername('账号已被注册');
	shake(document.getElementsByClassName('ipt-box')[0]);
}
