var alluser = [];
var allrootcomment = [];
var num_comment = 0;
var this_user_id;
var this_user_name;
var this_user_avatar;

function change_logo_state() {
			    console.log("执行中...");
			
			    // 假设条件是计数器达到了5
			    if (alluser.length>0&&allrootcomment.length>0) {
			        console.log("满足退出条件，退出定时器。");
					this_user_id = localStorage.getItem('id');
					if(this_user_id!=-1)//用户登录
					{
						 var now_user = get_userbyID(this_user_id);
						 this_user_name = now_user[2];
						 this_user_avatar = now_user[4];
						 change_from_visiter_to_user();
						 changefriends();
					}
					else{
						change_from_user_to_visiter();
						
					}
			        clearInterval(intervalId);  // 清除定时器
			    }
			}
			
window.addEventListener('scroll', function() {
	var rightLower = document.querySelector('.right-down');
	var scrollPosition = window.scrollY;

	if (scrollPosition > 420) {
		rightLower.classList.add('fixed');
	} else {
		rightLower.classList.remove('fixed');
	}
});

function change_from_visiter_to_user() { //游客模式切换用户模式
	var blockA = document.querySelector('.login');
	var blockB = document.querySelector('.avatar');
	var avatar = document.querySelector('.user-avatar');
	avatar.src = this_user_avatar;
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
			const storecomment = setInterval(function(){
				console.log("user loading...")
				if(alluser.length>0)
				{
					console.log("user loaded!")
					all_comment();
					clearInterval(storecomment);
				}
			},10)
			
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
			const creatcomment = setInterval(function(){
				console.log("comment loading...")
				if(alluser.length>0)
				{
					console.log("comment loaded!")
					store_allrootcomment();//存储评论
					get_hot_search();//更新热搜
						for (var i = 0; i < comment_ID.length; ++i) {
							addcomment(i);
						}
					clearInterval(creatcomment);
				}
			},10)
			

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