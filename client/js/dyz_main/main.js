 window.addEventListener('scroll', function() {
      var rightLower = document.querySelector('.right-down-content');
      var scrollPosition = window.scrollY;

      if (scrollPosition > 430) {
        rightLower.classList.add('fixed');
      } else {
        rightLower.classList.remove('fixed');
      }
    });