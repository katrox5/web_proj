var index = 0;
var slides = document.querySelectorAll('.carousel-img');
var li_slides = document.querySelectorAll('.carousel-index-ul li');
var timer;

function updateSlides() {//更新图片
      for (var i = 0; i < slides.length; i++) {
        slides[i].classList.remove('active');
        li_slides[i].classList.remove('active');
      }

      slides[index].classList.add('active');
      li_slides[index].classList.add('active');
    }

function changeSlide(n) {//轮播
	index += n;

	if (index < 0) {
		index = slides.length - 1;
	} else if (index >= slides.length) {
		index = 0;
	}
	updateSlides();
}

 function changeSlideByIndex(newIndex) {//按索引更新
      index = newIndex;
      updateSlides();
    }

function startTimer() { //鼠标离开图片就轮播
	timer = setInterval(function() {
		changeSlide(1);
	}, 5000); // 每1秒切换一次
}

function stopTimer() { //鼠标停留在轮播区就停止
	clearInterval(timer);
}