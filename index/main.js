function $(id)
{
	return document.getElementById(id);
}

const username = $('username');
const password = $('password');
const style = username.style.border;

username.addEventListener('blur', function() {
	if (this.value == '')
		remindUsername('账号不能为空');
});

username.addEventListener('input', function() {
	recover(this);
});

password.addEventListener('blur', function() {
	if (this.value == '')
		remindPassword('密码不能为空');
});

password.addEventListener('input', function() {
	recover(this);
});

function shake(element) {
	let effect = new KeyframeEffect(
		element,
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

function remindUsername(text) {
	username.placeholder = text;
	username.style.border = '1px solid rgba(255,0,0,0.7)';
}

function remindPassword(text) {
	password.placeholder = text;
	password.style.border = '1px solid rgba(255,0,0,0.7)';
}

function recover(input) {
	input.placeholder = '';
	input.style.border = style;
}
