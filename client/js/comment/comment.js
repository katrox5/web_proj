// return top
// $(function(){
// 	$(window).scroll(function(){
// 		if($(this).scrollTop() >= $(this).height()){
// 			$('#top-span').css('display','block');
// 		}else{
// 			$('#top-span').css('display','none');
// 		}
// 	});
// 	$('#top-span').click(function(){
// 		alert("???");
// 		$('html,body').animate({scrollTop:0},500);
// 	});
// })


//调整底部栏宽度
  window.addEventListener('DOMContentLoaded', function() {
    var commentContentTop = document.querySelector('.main-left');
    var fixedBottom = document.querySelector('.a-fixed-bottom');
    
    var commentContentTopWidth = commentContentTop.offsetWidth;
    fixedBottom.style.width = commentContentTopWidth + 'px';
  });



