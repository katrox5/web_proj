window.addEventListener('scroll', function() {
	var rightLower = document.querySelector('.my-friends');
	var scrollPosition = window.scrollY;

	if (scrollPosition > 430) {
		rightLower.classList.add('fixed');
	} else {
		rightLower.classList.remove('fixed');
	}
});

function test(){
	alert(nickname[0]);
}