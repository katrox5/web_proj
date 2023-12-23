var alluser = [];
var allrootcomment = [];
var num_comment = 0;

window.addEventListener('scroll', function() {
	var rightLower = document.querySelector('.my-friends');
	var scrollPosition = window.scrollY;

	if (scrollPosition > 430) {
		rightLower.classList.add('fixed');
	} else {
		rightLower.classList.remove('fixed');
	}
});


function all_user() { //获取库中所有user
	var obj;
	const xhr = new XMLHttpRequest();
	xhr.open('post', url_prefix + 'getAllUsers');
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onload = function() {
		if (xhr.status === 200) {
			obj = JSON.parse(xhr.responseText);
			alluser = obj.content;
			setTimeout(all_comment(), 100);
		}
	};
	xhr.send(null);
	setTimeout(function() {

		//alert(alluser);
	}, 200);


}

function all_comment() { //获取库中所有评论并按时间排序
	var obj;
	const xhr = new XMLHttpRequest();
	xhr.open('post', url_prefix + 'getRootComments');
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onload = function() {
		if (xhr.status === 200) {
			obj = JSON.parse(xhr.responseText);
			allrootcomment = obj.content;
			store_allrootcomment();
			setTimeout(function() {
				for (var i = 0; i < comment_ID.length; ++i) {
					addcomment(i);
				}
			}, 100);

		}
	};
	xhr.send(null);
	setTimeout(function() {
		//alert(allrootcomment);
	}, 200);
}

function all_img(index) { //获取库中所有评论图片并按时间排序
	var c_id = comment_ID[index];
	const xhr = new XMLHttpRequest();
	xhr.open('post', url_prefix + 'getCommentImgByCommentId');
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onload = function() {
		if (xhr.status === 200) {
			if (index < num_comment) {
				let obj = JSON.parse(xhr.responseText);
				alert(obj.content);
				for (var i = 0; i < obj.row; ++i) {
					img_content[index][i] = obj.content[i][1];
				}
				all_img(++index);
			}
		}
	};
	var this_comment_id = {
		comment_id: c_id
	};
	xhr.send(JSON.stringify(this_comment_id));
}

function add_img(commentid, img_url, img_order) { //获取库中所有评论图片并按时间排序
	const xhr = new XMLHttpRequest();
	xhr.open('post', url_prefix + 'addCommentImg');
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onload = function() {
		if (xhr.status === 200) {
			let pro = JSON.parse(xhr.responseText);
			console.log(pro);
			setTimeout(all_img(0), 100);

		}
	};
	var this_comment_id = {
		comment_id: commentid,
		url: img_url,
		num_order: img_order
	};
	xhr.send(JSON.stringify(this_comment_id));
}


function test() {
	alert(nickname[0]);
}