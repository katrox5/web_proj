const username = document.getElementById('username');
const style = username.style.border;

username.addEventListener('input', function() {
	recover(this);
});

function send() {
	const user = username.value;
	
	if (user == '') {
		remindAndShake();
		return;
	}
}

if ((user = localStorage.getItem('username')) != null)
{
	username.value = user;
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
