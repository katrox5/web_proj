const url_prefix ='http://172.29.18.101:25565/'
const default_headpic_url ='../../img/media/avatar/default_avatar.png'

var AllUsers, AllComments, AllMyFollow, AllMyFans;	//都是row + content
var comment_id=0, author_id=0;

const Idx_user_id_byAllUsers= 0, Idx_username = 1, Idx_nickname = 2, Idx_signatrue = 3, Idx_headpic_url = 4; //getAllUsers 
const Idx_comment_id = 0, Idx_user_id = 1, Idx_content = 2, Idx_time = 3, Idx_father_comment = 4, Idx_num_like = 5, Idx_num_reply = 6;// getAllComments
const Idx_comment_id_bottom = 0, Idx_user_id_bottom = 1, Idx_content_bottom = 2, Idx_time_bottom = 3, Idx_num_like_bottom = 4, Idx_num_reply_bottom = 5;//getChildComments

var Author, Comment;	//主贴的作者与内容
var nickname, username;
var signatrue;
var headpic;

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
	
	var urlParams = new URLSearchParams(window.location.search);
	// 通过comment_id点进来
	comment_id = urlParams.get('commentid');
})


window.addEventListener('load', function(){
	const xhr1 = new XMLHttpRequest();
	const xhr2 = new XMLHttpRequest();
	const xhr3 = new XMLHttpRequest();
	const xhr4 = new XMLHttpRequest();
	
	// 跨域请求
	xhr1.open('post', url_prefix + 'getAllComments');       
	xhr2.open('post', url_prefix + 'getAllUsers');       
	xhr3.open('post', url_prefix + 'getSubscribe');    
	xhr4.open('post', url_prefix + 'getSubscribed');
	
	
	xhr1.setRequestHeader('Content-Type', 'application/json');    
	xhr2.setRequestHeader('Content-Type', 'application/json');  
	xhr3.setRequestHeader('Content-Type', 'application/json');  
	xhr4.setRequestHeader('Content-Type', 'application/json');
	
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
					
					xhr3.onload = function() {
						if (xhr3.status === 200) {            // 状态码200，表示成功
							AllMyFollow = JSON.parse(xhr3.responseText);   // xhr.responseText为返回结果			
							console.log(AllMyFollow);
							
							
							xhr4.onload = function() {
								// 注意以下均为 异步 进行！！
								if (xhr4.status === 200) { 
									AllMyFans = JSON.parse(xhr4.responseText);   // xhr.responseText为返回结果
									start_onload();
								}
							};
							xhr4.send(JSON.stringify({user_id : author_id}));
						}
					};
					
					xhr3.send(JSON.stringify({user_id : author_id}));            // 可选发送请求内容，若无可填null
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
	headpic = Author[Idx_headpic_url];
	if(headpic == null) headpic = default_headpic_url;
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
	
	// 修改头像
	
	headpicElement = document.querySelector('.headpic');
	headpicElement.src = headpic;
	
	
	// 修改关注数
	var followerElement = document.getElementById('follower-num');
	followerElement.textContent = AllMyFollow.row;
	
	// 修改粉丝数
	var fansElement = document.getElementById('fans-num');
	fansElement.textContent = AllMyFans.row;
	
	// 修改获赞数
	var need_num = 0;
	for(var i = 0; i < commentnum; i ++ ){
		if(AllComments.content[i][Idx_user_id] == author_id){
			need_num += AllComments.content[i][Idx_num_like];
		}
	}
	var likeElement = document.getElementById('like-num');
	likeElement.textContent = need_num;
}


function display_comment(){
	Comment_to_display = [];
	for(var i = 0; i < commentnum; i ++ ){
		now_Comment = AllComments.content[i];
		if(now_Comment[Idx_user_id] == author_id && now_Comment[Idx_father_comment] == -1)
			Comment_to_display.push(now_Comment);
	}
	
	// 将父容器添加到DOM中的适当位置
	var parentElement = document.getElementById("total-contents");
	parentElement.innerHTML = '';
	
	var contentsDiv = document.createElement("div");
	contentsDiv.classList.add("contents");
	for(var i = 0; i < Comment_to_display.length; i ++ ){
		var now_Comment = Comment_to_display[i];
		// 创建回帖人信息
		var replyHeaderDiv = document.createElement("div");
		replyHeaderDiv.classList.add("reply-header");

		// 创建回帖人信息左侧
		var replyHeaderLeftDiv = document.createElement("div");
		replyHeaderLeftDiv.classList.add("reply-header-left");
		replyHeaderLeftDiv.setAttribute("role", "button");
		replyHeaderLeftDiv.setAttribute("tabindex", "0");
		replyHeaderLeftDiv.setAttribute("aria-label", "PANTA的主页");

		// 创建回帖人头像容器
		var replyHeaderImgContainerDiv = document.createElement("div");
		replyHeaderImgContainerDiv.classList.add("reply-header-img-containner");

		// 创建回帖人头像包裹器
		var replyHeaderImgWrapperDiv = document.createElement("div");
		replyHeaderImgWrapperDiv.classList.add("reply-header-img-wrapper");

		// 创建回帖人头像
		var replyHeaderImg = document.createElement("img");
		replyHeaderImg.setAttribute("src", headpic);

		// 将头像添加到包裹器
		replyHeaderImgWrapperDiv.appendChild(replyHeaderImg);

		// 将包裹器添加到头像容器
		replyHeaderImgContainerDiv.appendChild(replyHeaderImgWrapperDiv);

		// 将头像容器添加到回帖人信息左侧
		replyHeaderLeftDiv.appendChild(replyHeaderImgContainerDiv);

		// 创建回帖人信息容器
		var replyHeaderInfoContainerDiv = document.createElement("div");
		replyHeaderInfoContainerDiv.classList.add("reply-header-info-containner");

		// 创建回帖人姓名
		var replyHeaderInfoNameDiv = document.createElement("div");
		replyHeaderInfoNameDiv.classList.add("reply-header-info-name");
		replyHeaderInfoNameDiv.textContent = nickname;

		// 将姓名添加到信息容器
		replyHeaderInfoContainerDiv.appendChild(replyHeaderInfoNameDiv);

		// 将信息容器添加到回帖人信息左侧
		replyHeaderLeftDiv.appendChild(replyHeaderInfoContainerDiv);

		// 将回帖人信息左侧添加到回帖人信息
		replyHeaderDiv.appendChild(replyHeaderLeftDiv);

		// 将回帖人信息添加到父容器
		contentsDiv.appendChild(replyHeaderDiv);

		// 创建多行文本框
		var multilineTextboxDiv = document.createElement("div");
		multilineTextboxDiv.classList.add("multiline-textbox");
		multilineTextboxDiv.textContent = now_Comment[Idx_content];
		var target_page = '../comment/comment.html';
		multilineTextboxDiv.setAttribute('onclick', "window.open('" + target_page + "?commentid=" + now_Comment[Idx_comment_id] + "'); return false;");
			
			
		// 将多行文本框添加到父容器
		contentsDiv.appendChild(multilineTextboxDiv);

		// 创建图片列表
		var imgListDiv = document.createElement("div");
		imgListDiv.classList.add("img-list");

		// 创建并添加图片到图片列表
		for (var j = 0; j < 8; j++) {
		  var imgSrc = "../../img/dyz_main/logo/小米.jpg";
		  var img = document.createElement("img");
		  img.setAttribute("src", imgSrc);
		  img.setAttribute("alt", "");
		  imgListDiv.appendChild(img);
		}

		// 将图片列表添加到父容器
		contentsDiv.appendChild(imgListDiv);

		// 创建点赞区域
		var likeDiv = document.createElement("div");
		likeDiv.classList.add("like");

		// 创建日期容器
		var dateDiv = document.createElement("div");
		dateDiv.classList.add("date");
		dateDiv.textContent = now_Comment[Idx_time];

		// 创建点赞图标
		var likeIconImg = document.createElement("img");
		likeIconImg.setAttribute("src", "../../img/dyz_main/like.png");
		likeIconImg.setAttribute("alt", "");

		// 创建点赞数量
		var likeCountSpan = document.createElement("span");
		likeCountSpan.textContent = "12 ";

		// 创建回复图标
		var replyIconImg = document.createElement("img");
		replyIconImg.setAttribute("src", "../../img/dyz_main/reply.png");
		replyIconImg.setAttribute("alt", "");

		// 创建回复数量
		var replyCountSpan = document.createElement("span");
		replyCountSpan.textContent = "13";

		// 将所有元素添加到点赞区域
		likeDiv.appendChild(dateDiv);
		likeDiv.appendChild(likeIconImg);
		likeDiv.appendChild(likeCountSpan);
		likeDiv.appendChild(replyIconImg);
		likeDiv.appendChild(replyCountSpan);

		// 将点赞区域添加到父容器
		contentsDiv.appendChild(likeDiv);

		// 创建分隔线
		var dividerDiv = document.createElement("div");
		dividerDiv.classList.add("Divider");

		// 将分隔线添加到父容器
		contentsDiv.appendChild(dividerDiv);


		parentElement.appendChild(contentsDiv);
	}
}




function display_comment_follow(){
	Comment_to_display = [];
	
	for(var i = 0; i < commentnum; i ++ ){
		now_Comment = AllComments.content[i];
		if(now_Comment[Idx_father_comment] == -1 && AllMyFollow.content.includes(now_Comment[Idx_user_id])){
			Comment_to_display.push(now_Comment);
		}
	}
	
	
	// 将父容器添加到DOM中的适当位置
	var parentElement = document.getElementById("total-contents");
	parentElement.innerHTML = '';
	
	var contentsDiv = document.createElement("div");
	contentsDiv.classList.add("contents");
	for(var i = 0; i < Comment_to_display.length; i ++ ){
		var now_Comment = Comment_to_display[i];
		// 创建回帖人信息
		var replyHeaderDiv = document.createElement("div");
		replyHeaderDiv.classList.add("reply-header");

		// 创建回帖人信息左侧
		var replyHeaderLeftDiv = document.createElement("div");
		replyHeaderLeftDiv.classList.add("reply-header-left");
		replyHeaderLeftDiv.setAttribute("role", "button");
		replyHeaderLeftDiv.setAttribute("tabindex", "0");
		replyHeaderLeftDiv.setAttribute("aria-label", "PANTA的主页");

		// 创建回帖人头像容器
		var replyHeaderImgContainerDiv = document.createElement("div");
		replyHeaderImgContainerDiv.classList.add("reply-header-img-containner");

		// 创建回帖人头像包裹器
		var replyHeaderImgWrapperDiv = document.createElement("div");
		replyHeaderImgWrapperDiv.classList.add("reply-header-img-wrapper");

		// 创建回帖人头像
		var replyHeaderImg = document.createElement("img");
		replyHeaderImg.setAttribute("src", "../../img/comment/headpic.webp");

		// 将头像添加到包裹器
		replyHeaderImgWrapperDiv.appendChild(replyHeaderImg);

		// 将包裹器添加到头像容器
		replyHeaderImgContainerDiv.appendChild(replyHeaderImgWrapperDiv);

		// 将头像容器添加到回帖人信息左侧
		replyHeaderLeftDiv.appendChild(replyHeaderImgContainerDiv);

		// 创建回帖人信息容器
		var replyHeaderInfoContainerDiv = document.createElement("div");
		replyHeaderInfoContainerDiv.classList.add("reply-header-info-containner");

		// 创建回帖人姓名
		var replyHeaderInfoNameDiv = document.createElement("div");
		replyHeaderInfoNameDiv.classList.add("reply-header-info-name");
		
		for(var j = 0; j < usernum; j ++ ){
			if(now_Comment[Idx_user_id] == AllUsers.content[j][Idx_user_id_byAllUsers]){
				replyHeaderInfoNameDiv.textContent = AllUsers.content[j][Idx_nickname];				
			}
		}


		// 将姓名添加到信息容器
		replyHeaderInfoContainerDiv.appendChild(replyHeaderInfoNameDiv);

		// 将信息容器添加到回帖人信息左侧
		replyHeaderLeftDiv.appendChild(replyHeaderInfoContainerDiv);

		// 将回帖人信息左侧添加到回帖人信息
		replyHeaderDiv.appendChild(replyHeaderLeftDiv);

		// 将回帖人信息添加到父容器
		contentsDiv.appendChild(replyHeaderDiv);

		// 创建多行文本框
		var multilineTextboxDiv = document.createElement("div");
		multilineTextboxDiv.classList.add("multiline-textbox");
		multilineTextboxDiv.textContent = now_Comment[Idx_content];
		var target_page = '../comment/comment.html';
		multilineTextboxDiv.setAttribute('onclick', "window.open('" + target_page + "?commentid=" + now_Comment[Idx_comment_id] + "'); return false;");
			
		// 将多行文本框添加到父容器
		contentsDiv.appendChild(multilineTextboxDiv);

		// 创建图片列表
		var imgListDiv = document.createElement("div");
		imgListDiv.classList.add("img-list");

		// 创建并添加图片到图片列表
		for (var j = 0; j < 8; j++) {
		  var imgSrc = "../../img/dyz_main/logo/小米.jpg";
		  var img = document.createElement("img");
		  img.setAttribute("src", imgSrc);
		  img.setAttribute("alt", "");
		  imgListDiv.appendChild(img);
		}

		// 将图片列表添加到父容器
		contentsDiv.appendChild(imgListDiv);

		// 创建点赞区域
		var likeDiv = document.createElement("div");
		likeDiv.classList.add("like");

		// 创建日期容器
		var dateDiv = document.createElement("div");
		dateDiv.classList.add("date");
		dateDiv.textContent = "日期";

		// 创建点赞图标
		var likeIconImg = document.createElement("img");
		likeIconImg.setAttribute("src", "../../img/dyz_main/like.png");
		likeIconImg.setAttribute("alt", "");

		// 创建点赞数量
		var likeCountSpan = document.createElement("span");
		likeCountSpan.textContent = "12 ";

		// 创建回复图标
		var replyIconImg = document.createElement("img");
		replyIconImg.setAttribute("src", "../../img/dyz_main/reply.png");
		replyIconImg.setAttribute("alt", "");

		// 创建回复数量
		var replyCountSpan = document.createElement("span");
		replyCountSpan.textContent = "13";

		// 将所有元素添加到点赞区域
		likeDiv.appendChild(dateDiv);
		likeDiv.appendChild(likeIconImg);
		likeDiv.appendChild(likeCountSpan);
		likeDiv.appendChild(replyIconImg);
		likeDiv.appendChild(replyCountSpan);

		// 将点赞区域添加到父容器
		contentsDiv.appendChild(likeDiv);

		// 创建分隔线
		var dividerDiv = document.createElement("div");
		dividerDiv.classList.add("Divider");

		// 将分隔线添加到父容器
		contentsDiv.appendChild(dividerDiv);


		parentElement.appendChild(contentsDiv);
	}
}


// -----------------------------按钮切换时的效果-----------------------------
var myComment = document.getElementById("myComment");
var followComment = document.getElementById("followComment");
var udl1 = document.getElementById("udl1");
var udl2 = document.getElementById("udl2");

// 添加点击事件监听器
myComment.addEventListener("click", function() {
	myComment.style.color = "#0e151c"; 
	followComment.style.color = "rgba(14,21,28,.1)"; 
	udl1.style.display = "block"; 
	udl2.style.display = "none"; 
	display_comment();
});


followComment.addEventListener("click", function() {
	myComment.style.color = "rgba(14,21,28,.1)"; 
	followComment.style.color = "#0e151c"; 
	udl1.style.display = "none"; 
	udl2.style.display = "block"; 
	display_comment_follow();
});