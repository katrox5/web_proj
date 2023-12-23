const url_prefix ='http://172.29.18.101:25565/'

var AllUsers, AllComments ;	//都是row + content
var comment_id=1, author_id=0;
const Idx_user_id_byAllUsers= 0, Idx_username = 1, Idx_nickname = 2, Idx_signatrue = 3, Idx_avatar_url = 4; //getAllUsers 
const Idx_comment_id = 0, Idx_user_id = 1, Idx_content = 2, Idx_time = 3, Idx_father_comment = 4, Idx_num_like = 5, Idx_num_reply = 6;// getAllComments
const Idx_comment_id_bottom = 0, Idx_user_id_bottom = 1, Idx_content_bottom = 2, Idx_time_bottom = 3, Idx_num_like_bottom = 4, Idx_num_reply_bottom = 5;//getChildComments

var Author, Comment;	//主贴的作者与内容
var nickname, username;
var signatrue;
var avatar_url;

var usernum, commentnum;
var comment_time;
var comment_num_reply;


var Bottom_Comment;

var userId; //当前用户 和 当前帖子
var target_comment_id, target_user_id;
window.addEventListener('load', function(){
	// 获取 id 的值
	localStorage.setItem("id", "0");
	userId = localStorage.getItem("id");
	// alert(userId);
	
	// var urlParams = new URLSearchParams(window.location.search);
	// // 通过comment_id点进来
	// var comment_id = urlParams.get('commentid');
})


window.addEventListener('load', function(){
	const xhr1 = new XMLHttpRequest();
	const xhr2 = new XMLHttpRequest();
	
	// 跨域请求
	xhr1.open('post', url_prefix + 'getAllComments');        // 请求的地址，跟 卓宏宇 沟通确认
	xhr2.open('post', url_prefix + 'getAllUsers');        // 请求的地址，跟 卓宏宇 沟通确认
	
	xhr1.setRequestHeader('Content-Type', 'application/json');    // 报头记得标明类型
	xhr2.setRequestHeader('Content-Type', 'application/json');    // 报头记得标明类型
	
	xhr1.onload = function() {
		// 注意以下均为 异步 进行！！
		if (xhr1.status === 200) {            // 状态码200，表示成功
			AllComments = JSON.parse(xhr1.responseText);   // xhr.responseText为返回结果
			console.log(AllComments)
			
			// 根据帖子id处理
			commentnum = AllComments.row;
			for(var i = 0; i < commentnum; i ++ ){
				if(AllComments.content[i][Idx_comment_id] == comment_id){
					Comment = AllComments.content[i];
				}
			}
			
			// 当前页面的作者
			author_id = Comment[Idx_user_id];
			
			
			xhr2.onload = function() {
				if (xhr2.status === 200) {            // 状态码200，表示成功
					AllUsers = JSON.parse(xhr2.responseText);   // xhr.responseText为返回结果
					console.log(AllUsers);
					usernum = AllUsers.row;
					for(var i = 0; i < usernum; i ++ ){
						if(AllUsers.content[i][Idx_user_id_byAllUsers] == author_id)
							Author = AllUsers.content[i];
					}
					start_onload();
				}
			};
			xhr2.send(null);            // 可选发送请求内容，若无可填null
		}
	};
	xhr1.send(null);            // 可选发送请求内容，若无可填null
})


function start_onload(){
	console.log("Comment!!" + Comment);
	console.log("Author!!" + Author);
		
	username = Author[Idx_username]
	nickname = Author[Idx_nickname];
	signatrue = Author[Idx_signatrue];
	avatar_url = Author[Idx_avatar_url];
	
	
	display_information();
	display_comment();
}

function display_information(){
	// 修改签名
	var signatureElement = document.querySelector('.homepage-user-signature');
	signatureElement.textContent = signatrue;
	
	// 修改名字
	var nameElement = document.querySelector('.homepage-user-nickname');
	nameElement.textContent = nickname;
	
	// 修改关注数
	var followerElement = document.getElementById('follower-num');
	followerElement.textContent = '10';
	
	// 修改粉丝数
	var fansElement = document.getElementById('fans-num');
	fansElement.textContent = '50';
	
	// 修改获赞数
	var likeElement = document.getElementById('like-num');
	likeElement.textContent = '100';
}

function display_comment(){
	Comment_to_display = [];
	for(var i = 0; i < commentnum; i ++ ){
		now_Comment = AllComments.content[i];
		if(now_Comment[Idx_user_id] == author_id && now_Comment[Idx_father_comment] == -1)
			Comment_to_display.push(now_Comment);
	}
	
	
	// 获取评论容器元素
	var commentContainer = document.querySelector('.contents');
	console.log(Comment_to_display.length);
	for(var i = 0; i < Comment_to_display.length; i ++ ){
		var now_Comment = Comment_to_display[i];
		console.log(now_Comment);
		// 创建评论内容元素
		var commentContent = document.createElement('div');
		commentContent.classList.add('multiline-textbox');
		commentContent.textContent = now_Comment[Idx_content];
		
		// 创建图片列表容器元素
		var imageListContainer = document.createElement('div');
		imageListContainer.classList.add('img-list');
		
		// 创建图片元素
		for (var j = 0; j < 8; j++) {
		  var image = document.createElement('img');
		  image.src = '../../img/dyz_main/logo/小米.jpg';
		  image.alt = '';
		  imageListContainer.appendChild(image);
		}
		
		// 创建点赞和回复元素
		var likeContainer = document.createElement('div');
		likeContainer.classList.add('like');
		likeContainer.innerHTML = `
		  <div class="date">date</div>
		  <img src="../../img/dyz_main/like.png" alt="" />
		  12&ensp;
		  <img src="../../img/dyz_main/reply.png" alt="" />
		  13
		`;
		
		// 创建分割线元素
		var divider = document.createElement('div');
		divider.classList.add('Divider');
		
		// 将创建的元素添加到评论容器中
		commentContainer.appendChild(commentContent);
		commentContainer.appendChild(imageListContainer);
		commentContainer.appendChild(likeContainer);
		commentContainer.appendChild(divider);
	}


}
