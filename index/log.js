const autolog = $('autolog');

document.addEventListener('keyup', function(event) {
	if (event.keyCode == 13)
		log();
});

if ((user = localStorage.getItem('username')) != null) {
	username.value = user;
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
	
	localStorage.setItem('username', user);
	
	// 提交到数据库
	verifyPswd(user, pswd);
}

function logSuccess() {
	// 登录成功
	
	// 验证成功后
	localStorage.setItem('autolog', autolog.checked);
	if (autolog.checked)
		localStorage.setItem('password', pswd);
}

function logFailure() {
	password.value = '';
	password.focus();
	remindPassword('账号或密码错误');
	shake(document.getElementsByClassName('ipt-box')[1]);
}
