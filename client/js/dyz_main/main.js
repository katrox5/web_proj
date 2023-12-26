var alluser = [];
var allrootcomment = [];
var num_comment = 0;
var this_user_id;
var this_user_name;
var this_user_avatar;
var img_over;

function showHiddenBlock() { //显示个人中心
				document.querySelector('.user-choice').style.display = 'block';
			}

			function hideHiddenBlock() { //隐藏
				document.querySelector('.user-choice').style.display = 'none';
			}

			function toggleHiddenBlock() { //单击改变
				var hiddenBlock = document.querySelector('.user-choice');
				hiddenBlock.style.display = (hiddenBlock.style.display === 'none' || hiddenBlock.style.display === '') ?
					'block' : 'none';
			}

function change_logo_state() {
	console.log("执行中...");

	// 假设条件是计数器达到了5
	if (alluser.length > 0 && allrootcomment.length > 0) {
		console.log("满足退出条件，退出定时器。");
		this_user_id = localStorage.getItem('id');
		console.log(this_user_id);
		if (this_user_id != -1) //用户登录
		{
			var now_user = get_userbyID(this_user_id);
			this_user_name = now_user[2];
			this_user_avatar = now_user[4];
			localStorage.setItem('this_user_name', this_user_name);
			localStorage.setItem('this_user_avatar', this_user_avatar);
			change_from_visiter_to_user();
			changefriends();
		} else {
			change_from_user_to_visiter();

		}
		clearInterval(intervalId); // 清除定时器
	}
}



function change_from_visiter_to_user() { //游客模式切换用户模式
	var blockA = document.querySelector('.login');
	var blockB = document.querySelector('.avatar');
	var avatar = document.querySelector('.user-avatar');
	avatar.src = this_user_avatar;
	var center = document.querySelector('.go_to_center');
	var publish = document.querySelector('.go_to_publish');
	center.onclick = function() {
		window.open('../MyCenter/MyMainCenter.html?userid=' + this_user_id); //前面的域名改成要跳转的界面（这里是评论详情界面）
		return false; // 阻止默认行为和事件冒泡
	};
	publish.onclick = function() {
		window.open('../hhy_main/publish.html?userid=' + this_user_id); //前面的域名改成要跳转的界面（这里是评论详情界面）
		return false; // 阻止默认行为和事件冒泡
	};
	// 切换显示
	blockA.classList.remove('active');
	blockB.classList.add('active');
}

function change_from_user_to_visiter() { //用户模式切换游客模式
	var blockA = document.querySelector('.avatar');
	var blockB = document.querySelector('.login');


	// 切换显示
	blockA.classList.remove('active');
	blockB.classList.add('active');
}


function all_user() { //获取库中所有user
	var obj;
	const xhr = new XMLHttpRequest();
	xhr.open('post', url_prefix + 'getAllUsers');
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onload = function() {
		if (xhr.status === 200) {
			obj = JSON.parse(xhr.responseText);
			alluser = obj.content;
			const storecomment = setInterval(function() {
				if (alluser.length > 0) {
					all_comment();
					clearInterval(storecomment);
				}
			}, 10)

		}
	};
	xhr.send(null);
	setTimeout(function() {

		//alert(alluser);
	}, 200);


}

function all_comment() { //获取库中所有评论并按时间排序
	img_over = false;
	var obj;
	const xhr = new XMLHttpRequest();
	xhr.open('post', url_prefix + 'getRootComments');
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onload = function() {
		if (xhr.status === 200) {
			obj = JSON.parse(xhr.responseText);
			allrootcomment = obj.content;
			num_comment = obj.row;
			store_allrootcomment(); //存储评论
			get_hot_search(); //更新热搜
			all_img(0);


		}
	};
	xhr.send(null);
	setTimeout(function() {
		//alert(allrootcomment);
	}, 200);
}

function all_img(index) { //获取库中所有评论图片并按时间排序
	var c_id = comment_ID[index];
	if (index < num_comment) {
		const xhr = new XMLHttpRequest();
		xhr.open('post', url_prefix + 'getCommentImgByCommentId');
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onload = function() {
			if (xhr.status === 200) {

				let obj = JSON.parse(xhr.responseText);
				for (var i = 0; i < obj.row; ++i) {
					img_content[index][i] = obj.content[i][1];
				}
				console.log(obj.content);
				if (index < num_comment) {
					addcomment(index);

				}
				all_img(++index);

			}

		};
		const this_comment_id = {
			comment_id: c_id
		};
		xhr.send(JSON.stringify(this_comment_id));
	}
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

