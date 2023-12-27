const default_headpic_url ='../../img/media/avatar/default_avatar.png'


var AllUsers, AllComments, UserFollow, UserFans, Bottom_Comment;	//都是row + content
var AllCommentsPic = []; //二维数组, 按顺序

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
var comment_num_like;

var userId; //当前用户 和 当前帖子
var target_comment_id, target_user_id;
var top_comment_id;


window.addEventListener('load', function(){
	// 获取 id 的值
	// localStorage.setItem("id", "0");
	userId = localStorage.getItem("id");

	var urlParams = new URLSearchParams(window.location.search);
	comment_id = urlParams.get('commentid');
	

	// 获取当前帖子的置顶评论id
	top_comment_id = localStorage.getItem(String(comment_id));
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
	
	xhr1.setRequestHeader('Content-Type', 'application/json');    // 报头记得标明类型
	xhr2.setRequestHeader('Content-Type', 'application/json');    // 报头记得标明类型
	xhr3.setRequestHeader('Content-Type', 'application/json');    // 报头记得标明类型
	xhr4.setRequestHeader('Content-Type', 'application/json');    // 报头记得标明类型
	
	xhr1.onload = function() {
		// 注意以下均为 异步 进行！！
		if (xhr1.status === 200) {            // 状态码200，表示成功
			AllComments = JSON.parse(xhr1.responseText);   // xhr.responseText为返回结果
			console.log(AllComments)
			AllCommentsPic = AllComments.image;
			// 根据帖子id处理
			commentnum = AllComments.row;
			for(var i = 0; i < commentnum; i ++ ){
				if(AllComments.content[i][Idx_comment_id] == comment_id){
					Comment = AllComments.content[i];
				}
			}
			
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
						if (xhr3.status === 200) {           
							
							UserFollow = JSON.parse(xhr3.responseText);   
							
							xhr4.onload = function() {
								if (xhr4.status === 200) {           
									UserFans = JSON.parse(xhr4.responseText);  
									 
									 console.log("myfans:");
									 console.log(UserFans);
									start_onload1();
								}
							};
							xhr4.send(JSON.stringify({user_id : author_id}));      
						}
					};
					xhr3.send(JSON.stringify({user_id : author_id}));      
				}
			};
			xhr2.send(null);            // 可选发送请求内容，若无可填null
		}
	};
	xhr1.send(null);            // 可选发送请求内容，若无可填null
	
	
	// const xhr4 = new XMLHttpRequest();
	// xhr4.open('post', url_prefix +'addComment');       
	// xhr4.setRequestHeader('Content-Type', 'application/json');    
	// xhr4.onload = function() {
	// 	if (xhr4.status === 200) {           
	// 		let obj = JSON.parse(xhr4.responseText);   
	// 		location.reload()
	// 	}
	// };
	// const data = {
	// 	user_id : 1,
	// 	content : "我是子评论",
	// 	father_comment : 4
	// }
	
	// xhr4.send(JSON.stringify(data));  
	
})



function start_onload1(){

	comment_time = Comment[Idx_time];
	comment_num_reply = Comment[Idx_num_reply];
	comment_content = Comment[Idx_content];
	comment_num_like = Comment[Idx_num_like];
	
	username = Author[Idx_username]
	nickname = Author[Idx_nickname];
	signatrue = Author[Idx_signatrue];
	headpic = Author[Idx_headpic_url];
	if(headpic == null) headpic = default_headpic_url;
	target_comment_id = comment_id;
	target_user_id = author_id;
	
	console.log(AllCommentsPic);
	
	
	maincontent_onload();
	authorinfo_onload();
	
	
	// 获取主贴的底下评论
	const xhr3 = new XMLHttpRequest();
	xhr3.open('post', url_prefix + 'getChildComments');       
	xhr3.setRequestHeader('Content-Type', 'application/json');    
	xhr3.onload = function() {
		if (xhr3.status === 200) {           
			Bottom_Comment = JSON.parse(xhr3.responseText);   
			console.log(Bottom_Comment);
			bottom_comment();
		}
	};
	const data = {
		comment_id : comment_id
	}
	xhr3.send(JSON.stringify(data)); 
}



// 帖子的主要内容
function maincontent_onload() {
	// 创建blank
	var _blankDiv = document.createElement('div');
	_blankDiv.className = '_blank';
	
	// 创建外层容器 div
	var commentContainer = document.createElement('div');
	commentContainer.className = 'comment-content-top';

	// 创建作者部分 div
	var authorDiv = document.createElement('div');
	authorDiv.className = 'author';

	// 创建作者左侧部分 div
	var authorLeftDiv = document.createElement('div');
	authorLeftDiv.className = 'author-left';

	// 创建作者头像部分
	var authorIconDiv = document.createElement('div');
	authorIconDiv.className = 'author-icon';

	var authorIconWrapDiv = document.createElement('div');
	authorIconWrapDiv.className = 'author-icon-wrap';




	var target_page = '../MyCenter/MyCenter.html';
	if(author_id == userId) target_page = '../MyCenter/MyMainCenter.html';
	authorIconWrapDiv.setAttribute('onclick', "window.open('" + target_page + "?userid=" + author_id + "'); return false;");
			
			
			
						

	var authorImg = document.createElement('img');
	authorImg.src = headpic;

	authorIconWrapDiv.appendChild(authorImg);
	authorIconDiv.appendChild(authorIconWrapDiv);
	authorLeftDiv.appendChild(authorIconDiv);

	// 创建作者信息部分
	var authorInfoDiv = document.createElement('div');
	authorInfoDiv.className = 'author-info';

	var authorInfoTopDiv = document.createElement('div');
	authorInfoTopDiv.className = 'author-info-top';

	var authorNameDiv = document.createElement('div');
	authorNameDiv.className = 'author-name';
	authorNameDiv.textContent = nickname;

	authorInfoTopDiv.appendChild(authorNameDiv);
	authorInfoDiv.appendChild(authorInfoTopDiv);

	var authorInfoBottomDiv = document.createElement('div');
	authorInfoBottomDiv.className = 'author-info-bottom';
	authorInfoBottomDiv.textContent =comment_time;

	authorInfoDiv.appendChild(authorInfoBottomDiv);
	authorLeftDiv.appendChild(authorInfoDiv);
	authorDiv.appendChild(authorLeftDiv);
	
  //---------------------------------------关注板块------------------------------
	// 创建关注部分
	var followDiv = document.createElement('div');
	followDiv.setAttribute('role', 'button');
	// 当前用户是否已经关注了该贴主
	// console.log("userId" + userId);
	

	if(userId == author_id){
		followDiv.className = 'following';
		followDiv.textContent = '您的文章';
	}
	else {
		if(UserFans.content.includes(Number(userId))){
			// console.log('已关注');
			followDiv.className = 'following';
			followDiv.textContent = '已关注';
		}	
		else{
			// console.log('未关注');
			followDiv.className = 'follow';	
			followDiv.textContent = '关注';
		}
		
		followDiv.addEventListener('click', function() {
			// 增加关注
			if (followDiv.classList.contains('follow')) {
				// alert("已关注" + nickname);
				if(userId == -1){
					new Message().show({
						type : "error",
						text : "请先登录",
						duration : 2000,
						closeable : true
					});
				}
				else{
					new Message().show({
						type : "success",
						text : "已关注" + nickname,
						duration : 2000,
						closeable : true
					});
					
					followDiv.classList.replace('follow', 'following');
					followDiv.textContent = '已关注';
					
					const xhr = new XMLHttpRequest();
					xhr.open('post', url_prefix +'addSubscribe');       
					xhr.setRequestHeader('Content-Type', 'application/json');    
					xhr.onload = function() {
						if (xhr.status === 200) {           
							let obj = JSON.parse(xhr.responseText);   
							//location.reload()
						}
					};
					const data = {
						user_a : userId,
						user_b : author_id
					}
					xhr.send(JSON.stringify(data));  
				}		
			}
			// 取消关注
			else{
				// alert("已取消关注" + nickname);
				
				new Message().show({
					type : "success",
					text : "已取消关注" + nickname,
					duration : 2000,
					closeable : true
				});
				
				followDiv.classList.replace('following', 'follow');
				followDiv.textContent = '关注';
				
				const xhr = new XMLHttpRequest();
				xhr.open('post', url_prefix +'revokeSubscribe');       
				xhr.setRequestHeader('Content-Type', 'application/json');    
				xhr.onload = function() {
					if (xhr.status === 200) {           
						let obj = JSON.parse(xhr.responseText);   
						//location.reload()
					}
				};
				const data = {
					user_a : userId,
					user_b : author_id
				}
				xhr.send(JSON.stringify(data));  
			}
		});
	}

   //---------------------------------------关注板块------------------------------ 	
   
   
   
	authorDiv.appendChild(followDiv);

	commentContainer.appendChild(_blankDiv);
	commentContainer.appendChild(authorDiv);


	// 创建帖子内容部分
	var mainContentDiv = document.createElement('div');
	mainContentDiv.className = 'main-comment-content';

	var articleElement = document.createElement('article');
	articleElement.textContent = comment_content;

	mainContentDiv.appendChild(articleElement);
	commentContainer.appendChild(mainContentDiv);

	// 创建图片列表部分
	var imgListContainerDiv = document.createElement('div');
	imgListContainerDiv.className = 'imglist-container';

	var emptyDiv1 = document.createElement('div');
	imgListContainerDiv.appendChild(emptyDiv1);

	var imgListDiv = document.createElement('div');
	imgListDiv.className = 'img-list';

	
		var need_pic_idx;
		for(var k = 0; k < commentnum; k ++ ){
			if(AllComments.content[k][Idx_comment_id] == comment_id){
				need_pic_idx = k;
			}
		}
		
		if(AllCommentsPic[need_pic_idx] != undefined){
			for(var k = 0; k < AllCommentsPic[need_pic_idx].length; k ++ ){
				var imgElement = document.createElement('img');
				imgElement.src = AllCommentsPic[need_pic_idx][k];
				imgListDiv.appendChild(imgElement);
			}
		}



	imgListContainerDiv.appendChild(imgListDiv);



	var emptyDiv2 = document.createElement('div');
	imgListContainerDiv.appendChild(emptyDiv2);

	commentContainer.appendChild(imgListContainerDiv);
	var _blankDivCopy = _blankDiv.cloneNode(true);
	commentContainer.appendChild(_blankDivCopy);

	// 将生成的结构添加到页面中的某个容器中
	var container = document.getElementById('my-comment-content');
	container.appendChild(commentContainer);
	
	
	// -------------------------------------底下固定栏-------------------------------------
	var replyWordContainer = document.querySelector('.a-fixed-bottom-left');

	replyWordContainer.addEventListener('click', function() {
		// alert("test");
		target_comment_id = comment_id;
		target_user_id = author_id;
		// 直接评论	
		var textarea = document.querySelector('#commentModal textarea');
		textarea.placeholder = "说一说你的想法~";
		commentModal.style.display = 'block';
	});
	
	
	// 获取元素并修改数字
	var shoucangNumElement = document.querySelector('#bottom_shoucang');
	var chatNumElement = document.querySelector('#bottom_chat');
	var likeNumElement = document.querySelector('#bottom_like');

	// 更新元素的文本内容
	shoucangNumElement.textContent = "收藏";
	chatNumElement.textContent = comment_num_reply;
	likeNumElement.textContent = comment_num_like;
	
	
	// -------------------- 点赞逻辑处理 ---------------------------------
	var likeImgElement = document.querySelector('#bottom_like_img');
	likeImgElement.setAttribute('src', '../../img/comment/like.png');
	
	var likedImgElement = document.querySelector('#bottom_liked_img');
	likedImgElement.setAttribute('src', '../../img/comment/liked.png');
	
	var key = userId + "_" + comment_id;
	var value = localStorage.getItem(key);
	// console.log("val: " + value);
	if(value == null){
		likeImgElement.style.display = '';
		likedImgElement.style.display = 'none'; 
	}
	else{
		likeImgElement.style.display = 'none';
		likedImgElement.style.display = '';		
	}
	
	likeImgElement.addEventListener('click', function() {
		var key = userId + "_" + comment_id;
		var value = localStorage.getItem(key);
		likeImgElement.style.display = 'none';
		likedImgElement.style.display = ''; 
			
		localStorage.setItem(key, 1);
		const xhr = new XMLHttpRequest();
		xhr.open('post', url_prefix +'addLike');       
		xhr.setRequestHeader('Content-Type', 'application/json');    
		xhr.onload = function() {
			if (xhr.status === 200) {           
				let obj = JSON.parse(xhr.responseText);   
				//location.reload()
			}
		};
		const data = {
			comment_id : comment_id,
		}
		xhr.send(JSON.stringify(data));  	
		
	});
	
	likedImgElement.addEventListener('click', function() {
		var key = userId + "_" + comment_id;
		var value = localStorage.getItem(key);

		likeImgElement.style.display = '';
		likedImgElement.style.display = 'none';	
		
		localStorage.removeItem(key);
		const xhr = new XMLHttpRequest();
		xhr.open('post', url_prefix +'subLike');       
		xhr.setRequestHeader('Content-Type', 'application/json');    
		xhr.onload = function() {
			if (xhr.status === 200) {           
				let obj = JSON.parse(xhr.responseText);   
				//location.reload()
			}
		};
		const data = {
			comment_id : comment_id,
		}
		xhr.send(JSON.stringify(data));  
	});
	
	// -------------------------------------底下固定栏-------------------------------------
	
	
	
	// 回复评论按钮
	var replyWordButtons = document.querySelectorAll('.replyCommentBtn');
	replyWordButtons.forEach(function(button) {
		button.addEventListener('click', function() {
			// 关闭
			promptModal.style.display = 'none';
			promptModal2.style.display = 'none';
			// 打开
			var textarea = document.querySelector('#commentModal textarea');
			for (var i = 0; i < usernum; i++) {
				if (AllUsers.content[i][Idx_user_id_byAllUsers] == target_user_id) {
					textarea.placeholder = "回复" + AllUsers.content[i][Idx_nickname] + "：";
				}
			}
			commentModal.style.display = 'block';
		});
	});

	

	// 关闭按钮
	var closeModalButtons = document.querySelectorAll('[data-dismiss="modal"]');

	closeModalButtons.forEach(function(button) {
		button.addEventListener('click', function() {	
			// 关闭
			promptModal.style.display = 'none';
			promptModal2.style.display = 'none';
			commentModal.style.display = 'none';
		});
	});
	
	
	// 删除按钮
	var replyWordButtons = document.querySelectorAll('.deleteCommentBtn');
	replyWordButtons.forEach(function(button) {
		button.addEventListener('click', function() {
			// var confirmation = confirm("你确定要删除这条评论吗");
			
			new Message().show({
				type : "success",
				text : "已删除评论" + nickname,
				duration : 2000,
				closeable : true
			});
			
			
			// if (confirmation) {
				const xhr4 = new XMLHttpRequest();
				xhr4.open('post', url_prefix + 'deleteComment ');       
				xhr4.setRequestHeader('Content-Type', 'application/json');    
				xhr4.onload = function() {
					if (xhr4.status === 200) {           
						let obj = JSON.parse(xhr4.responseText);   
						location.reload()
					}
				};
				const data = {
					comment_id : target_comment_id
				}
				
				xhr4.send(JSON.stringify(data));    
				
				
			// } else {
			// 	promptModal.style.display = 'none';
			// 	promptModal2.style.display = 'none';
			// 	commentModal.style.display = 'none';
			// }
		});
	});
	
	// 置顶按钮
	var replyWordButtons = document.querySelectorAll('.topCommentBtn');
	replyWordButtons.forEach(function(button) {
		button.addEventListener('click', function() {
			if(top_comment_id == target_comment_id){
				
				// var confirmation = confirm("你确定要取消这条评论的置顶吗");
				// if (confirmation) {
					new Message().show({
						type : "success",
						text : "已取消置顶" + nickname,
						duration : 2000,
						closeable : true
					});
					
					localStorage.removeItem(comment_id);
					location.reload();
				// } else {
				// 	promptModal.style.display = 'none';
				// 	promptModal2.style.display = 'none';
				// 	commentModal.style.display = 'none';
				// }
			}
			
			else{
				// var confirmation = confirm("你确定要置顶这条评论吗");
				// if (confirmation) {
					
					new Message().show({
						type : "success",
						text : "已置顶评论" + nickname,
						duration : 2000,
						closeable : true
					});
					localStorage.setItem(comment_id, target_comment_id);
					location.reload();
				// } else {
				// 	promptModal.style.display = 'none';
				// 	promptModal2.style.display = 'none';
				// 	commentModal.style.display = 'none';
				// }
			}

		});
	});
	
};





// 右侧的个人信息
function authorinfo_onload() {
	  // 创建右上角发帖人信息容器 div
	  var publishInfoDiv = document.createElement('div');
	  publishInfoDiv.className = 'publish-info';

	  // 创建用户卡片 div
	  var userCardDiv = document.createElement('div');
	  userCardDiv.className = 'usercard';

	  var target_page = '../MyCenter/MyCenter.html';
	  if(author_id == userId) target_page = '../MyCenter/MyMainCenter.html';
	  userCardDiv.setAttribute('onclick', "window.open('" + target_page + "?userid=" + author_id + "'); return false;");
			


	  // 创建用户头像部分
	  var userPicContainerSpan = document.createElement('span');
	  userPicContainerSpan.className = 'user-pic-container';

	  var userImg = document.createElement('img');
	  userImg.src = headpic;

	  userPicContainerSpan.appendChild(userImg);
	  userCardDiv.appendChild(userPicContainerSpan);

	  // 创建用户名部分
	  var usernameDiv = document.createElement('div');
	  usernameDiv.className = 'username';
	  usernameDiv.textContent = nickname;

	  userCardDiv.appendChild(usernameDiv);

	  // 创建用户签名部分
	  var userSignatureDiv = document.createElement('div');
	  userSignatureDiv.className = 'usersignature';
	  userSignatureDiv.textContent = signatrue;

	  userCardDiv.appendChild(userSignatureDiv);
	  publishInfoDiv.appendChild(userCardDiv);

	  // 创建用户卡片标签部分
	  var userCardTagDiv = document.createElement('div');
	  userCardTagDiv.className = 'usercard-tag';

	  // 创建关注标签
	  var followDiv = document.createElement('div');
	  var followNumSpan = document.createElement('span');
	  followNumSpan.className = 'usercard-num';
	  followNumSpan.textContent = UserFollow.row;
	  var followWordSpan = document.createElement('span');
	  followWordSpan.className = 'usercard-word';
	  followWordSpan.textContent = '关注';

	  followDiv.appendChild(followNumSpan);
	  followDiv.appendChild(followWordSpan);
	  userCardTagDiv.appendChild(followDiv);

	  // 创建粉丝标签
	  var fansDiv = document.createElement('div');
	  var fansNumSpan = document.createElement('span');
	  fansNumSpan.className = 'usercard-num';
	  fansNumSpan.textContent = UserFans.row;
	  var fansWordSpan = document.createElement('span');
	  fansWordSpan.className = 'usercard-word';
	  fansWordSpan.textContent = '粉丝';

	  fansDiv.appendChild(fansNumSpan);
	  fansDiv.appendChild(fansWordSpan);
	  userCardTagDiv.appendChild(fansDiv);

	  // 创建动态标签
	  
	  //获取贴子数
	  need_num = 0;
	  for(var i = 0; i < commentnum; i ++ ){
		  if(AllComments.content[i][Idx_user_id] == author_id && AllComments.content[i][Idx_father_comment] == -1)
			need_num ++;
	  }
	  
	  var postsDiv = document.createElement('div');
	  var postsNumSpan = document.createElement('span');
	  postsNumSpan.className = 'usercard-num';
	  postsNumSpan.textContent = need_num;
	  var postsWordSpan = document.createElement('span');
	  postsWordSpan.className = 'usercard-word';
	  postsWordSpan.textContent = '动态';

	  postsDiv.appendChild(postsNumSpan);
	  postsDiv.appendChild(postsWordSpan);
	  userCardTagDiv.appendChild(postsDiv);

	  publishInfoDiv.appendChild(userCardTagDiv);

	  // 将生成的结构添加到页面中的某个容器中
	  var container = document.getElementById('my-author-div');
	  container.appendChild(publishInfoDiv);
};



//底部评论
let AllSubComment = []; // 存储所有子评论的数组

function getAllofSubCommemt(request_comment_id) {	
	for(var i = 0; i < commentnum; i ++ ){
		var now_Comment = AllComments.content[i];
		if(now_Comment[Idx_father_comment] == request_comment_id){
			AllSubComment.push(now_Comment);
			getAllofSubCommemt(now_Comment[Idx_comment_id]); // 递归调用以获取子评论的子评论	
		}
	}		
}


function bottom_comment() {
	var Bottom_Comment_len = Bottom_Comment.row;
	Bottom_Comment = Bottom_Comment.content;
	console.log(Bottom_Comment);

	// // 将置顶评论放到第一位
	if(top_comment_id != null){
		Bottom_Comment.sort(function(a, b) {
			if (a[Idx_comment_id_bottom] == top_comment_id) {
				return -1; 
			} 
			else if (b[Idx_comment_id_bottom] == top_comment_id) {
				return 1; 
			}
			return 0; 
		});	
	}
	console.log(Bottom_Comment);
	
	
	// 获取评论区容器
	var commentContainer = document.querySelector('.comment-content-bottom');
	  
	// 创建评论标题
	var commentTitleDiv = document.createElement('div');
	commentTitleDiv.className = 'comment-content-bottom-title';
	  
	var commentTitleInnerDiv = document.createElement('div');
	commentTitleInnerDiv.style.opacity = '1';
	commentTitleInnerDiv.style.fontSize = '1.09091rem';
	commentTitleInnerDiv.textContent = '全部评论 ' + comment_num_reply;
	  
	commentTitleDiv.appendChild(commentTitleInnerDiv);
	commentContainer.appendChild(commentTitleDiv);
	  
	// 创建回复容器
	var replyContainerSection = document.createElement('section');
	replyContainerSection.className = 'reply-containner';
	
	
	for(var i = 0; i < Bottom_Comment_len; i ++ ){
		now_Comment = Bottom_Comment[i];

		// 创建一条回复
		var replyDiv = document.createElement('div');
		  
		var replyContentDiv = document.createElement('div');
		replyContentDiv.className = 'reply-content';
		  
		var replyInnerContentDiv = document.createElement('div');
		replyInnerContentDiv.className = 'reply-inner-content';
		  
		// 创建回帖人信息
		var replyHeaderDiv = document.createElement('div');
		replyHeaderDiv.className = 'reply-header';
		  
		var replyHeaderLeftDiv = document.createElement('div');
		replyHeaderLeftDiv.className = 'reply-header-left';
		replyHeaderLeftDiv.setAttribute('role', 'button');
		replyHeaderLeftDiv.setAttribute('tabindex', '0');
		replyHeaderLeftDiv.setAttribute('aria-label', 'PANTA的主页');
		  
		var replyHeaderImgContainerDiv = document.createElement('div');
		replyHeaderImgContainerDiv.className = 'reply-header-img-containner';
		
		var target_page = '../MyCenter/MyCenter.html';
		if(now_Comment[Idx_user_id_bottom] == userId) target_page = '../MyCenter/MyMainCenter.html';
		replyHeaderImgContainerDiv.setAttribute('onclick', "window.open('" + target_page + "?userid=" + now_Comment[Idx_user_id_bottom] + "'); return false;");
		  
		  
		// 通过评论id找作者nickname和头像和userid
		var need_nickname, need_headpic, need_userid;
		
		for(var k = 0; k < usernum; k ++ ){
			if(AllUsers.content[k][Idx_user_id_byAllUsers] == now_Comment[Idx_user_id_bottom]){
				need_nickname = AllUsers.content[k][Idx_nickname];
				need_headpic = AllUsers.content[k][Idx_headpic_url];
				if(need_headpic == null) need_headpic = default_headpic_url;
			}
		}
		

		
		var replyHeaderImgWrapperDiv = document.createElement('div');
		replyHeaderImgWrapperDiv.className = 'reply-header-img-wrapper';
		
		var replyHeaderImg = document.createElement('img');
		replyHeaderImg.src = need_headpic;
		  
		replyHeaderImgWrapperDiv.appendChild(replyHeaderImg);
		replyHeaderImgContainerDiv.appendChild(replyHeaderImgWrapperDiv);
		replyHeaderLeftDiv.appendChild(replyHeaderImgContainerDiv);
		  
		var replyHeaderInfoContainerDiv = document.createElement('div');
		replyHeaderInfoContainerDiv.className = 'reply-header-info-containner';
		  
		var replyHeaderInfoNameDiv = document.createElement('span');
		replyHeaderInfoNameDiv.className = 'reply-header-info-name';
		
		var need_nickname;  

		replyHeaderInfoNameDiv.textContent = need_nickname;
		
		// 置顶操作
		if(now_Comment[Idx_comment_id_bottom] == top_comment_id){
			var top_replyHeaderInfoNameDiv = document.createElement('span');
			top_replyHeaderInfoNameDiv.className = 'top_icon';
			top_replyHeaderInfoNameDiv.textContent = "[已置顶]";
			replyHeaderInfoNameDiv.append(top_replyHeaderInfoNameDiv);
		}
		
		
		
		replyHeaderInfoContainerDiv.appendChild(replyHeaderInfoNameDiv);
		replyHeaderLeftDiv.appendChild(replyHeaderInfoContainerDiv);
		  
		replyHeaderDiv.appendChild(replyHeaderLeftDiv);
		replyInnerContentDiv.appendChild(replyHeaderDiv);
		  
		// 创建回帖内容
		var replyWordContainerDiv = document.createElement('div');
		replyWordContainerDiv.className = 'reply-word-container';
		replyWordContainerDiv.setAttribute('role', 'button');
		replyWordContainerDiv.setAttribute('tabindex', '1');
		
		// -----------------给评论添加comment_id和user_id属性-----------------
		replyWordContainerDiv.setAttribute('comment_id', now_Comment[Idx_comment_id_bottom]); // 添加自定义属性和值
		replyWordContainerDiv.setAttribute('user_id', now_Comment[Idx_user_id_bottom]); // 添加自定义属性和值
		// -----------------给评论添加comment_id属性-----------------
		replyWordContainerDiv.addEventListener('click', function() {
			target_comment_id = this.getAttribute('comment_id');
			target_user_id = this.getAttribute('user_id');
			var promptModal = document.querySelector('#promptModal');
			var promptModal2 = document.querySelector('#promptModal2');
			var commentModal = document.querySelector('#commentModal');
			var closeModalButtons = document.querySelectorAll('[data-dismiss="modal"]');
			// 如果当前用户是贴主
			if(userId == author_id){
				promptModal.style.display = 'block';
			}
			// 如果当前用户是普通用户
			else{
				// 如果是自己的评论
				if(target_user_id == userId){
					promptModal2.style.display = 'block';
				}
				// 如果是别人的评论
				else{
					var textarea = document.querySelector('#commentModal textarea');
					for (var i = 0; i < usernum; i++) {
						if (AllUsers.content[i][Idx_user_id_byAllUsers] == target_user_id) {
							textarea.placeholder = "回复" + AllUsers.content[i][Idx_nickname] + "：";
						}
					}
					commentModal.style.display = 'block';
				}
			}
		});  
		  
		  
		var replyWordSpan = document.createElement('span');
		replyWordSpan.textContent = now_Comment[Idx_content_bottom];
		  
		replyWordContainerDiv.appendChild(replyWordSpan);
		replyInnerContentDiv.appendChild(replyWordContainerDiv);


		var imgListDiv = document.createElement('div');
		imgListDiv.className = 'img-list';

			var need_pic_idx;
			for(var k = 0; k < commentnum; k ++ ){
				if(AllComments.content[k][Idx_comment_id] == now_Comment[Idx_comment_id_bottom]){
					need_pic_idx = k;
				}
			}
			
			if(AllCommentsPic[need_pic_idx] != undefined){
				for(var k = 0; k < AllCommentsPic[need_pic_idx].length; k ++ ){
					var imgElement = document.createElement('img');
					imgElement.src = AllCommentsPic[need_pic_idx][k];
					imgListDiv.appendChild(imgElement);
				}
			}
			

		replyInnerContentDiv.appendChild(imgListDiv);

		// 创建帖子的信息
		var replyInfoContainerDiv = document.createElement('div');
		replyInfoContainerDiv.className = 'reply-info-containner';
		  
		var replyShowtimeDiv = document.createElement('div');
		replyShowtimeDiv.className = 'reply-showtime';
		replyShowtimeDiv.textContent = now_Comment[Idx_time_bottom];
		  
		var replyLikeContainerDiv = document.createElement('div');
		replyLikeContainerDiv.className = 'reply-like-container';
		  
		var replyLikeNumDiv = document.createElement('div');
		replyLikeNumDiv.className = 'reply-likenum';
		replyLikeNumDiv.textContent = now_Comment[Idx_num_like_bottom];
		// console.log("评论：");
		// console.log(now_Comment);
		// console.log(now_Comment[Idx_comment_id_bottom]);
		
		
		
		// ---------------------------- 点赞-------------------------------
		var replyLikeImg = document.createElement('img');
		replyLikeImg.className = 'reply-like-img';
		replyLikeImg.setAttribute("comment_id", now_Comment[Idx_comment_id_bottom] + "like");
		replyLikeImg.setAttribute('src', '../../img/comment/like.png');
		
		
		
		var replyLikedImg = document.createElement('img');
		replyLikedImg.className = 'reply-like-img';
		replyLikedImg.setAttribute("comment_id", now_Comment[Idx_comment_id_bottom] + "liked");
		replyLikedImg.setAttribute('src', '../../img/comment/liked.png');

		var key = userId + "_" + now_Comment[Idx_comment_id_bottom];
		var value = localStorage.getItem(key);	

		if(value == null){
			replyLikeImg.style.display = '';
			replyLikedImg.style.display ='none';
		}
		else{
			replyLikeImg.style.display = 'none';
			replyLikedImg.style.display = '';			
		}

		replyLikeImg.addEventListener('click', function() {
			var comment_id = this.getAttribute("comment_id");
			comment_id = comment_id.slice(0, comment_id.length - 4);
			var key = userId + "_" + comment_id;
			var value = localStorage.getItem(key);

			
			localStorage.setItem(key, 1);
			this.style.display = 'none';
			
			var need = comment_id + "liked";
			var targetElement = document.querySelector('img.reply-like-img[comment_id="' + need + '"]');
			console.log(targetElement);
			targetElement.style.display = '';	
			
			
			const xhr = new XMLHttpRequest();
			xhr.open('post', url_prefix +'addLike');       
			xhr.setRequestHeader('Content-Type', 'application/json');    
			xhr.onload = function() {
				if (xhr.status === 200) {           
					let obj = JSON.parse(xhr.responseText);   
					//location.reload()
				}
			};
			const data = {
				comment_id : comment_id
			}
			xhr.send(JSON.stringify(data));  
					
		});
		
		
		replyLikedImg.addEventListener('click', function() {
			var comment_id = this.getAttribute("comment_id");
			comment_id = comment_id.slice(0, comment_id.length - 5);
			
			var key = userId + "_" + comment_id;
			var value = localStorage.getItem(key);
			
			localStorage.removeItem(key);
			
			this.style.display = 'none';
			var need = comment_id + "like";
			var targetElement = document.querySelector('img.reply-like-img[comment_id="' + need + '"]');
			console.log(targetElement);
			targetElement.style.display = '';
			
			const xhr = new XMLHttpRequest();
			xhr.open('post', url_prefix +'subLike');       
			xhr.setRequestHeader('Content-Type', 'application/json');    
			xhr.onload = function() {
				if (xhr.status === 200) {           
					let obj = JSON.parse(xhr.responseText);   
					//location.reload()
				}
			};
			const data = {
				comment_id : comment_id
			}
			xhr.send(JSON.stringify(data));  				
		});	
		
		// ---------------------------- 点赞-------------------------------	
			
			
		replyLikeContainerDiv.appendChild(replyLikeNumDiv);
		replyLikeContainerDiv.appendChild(replyLikeImg);
		replyLikeContainerDiv.appendChild(replyLikedImg);
		
		replyInfoContainerDiv.appendChild(replyShowtimeDiv);
		replyInfoContainerDiv.appendChild(replyLikeContainerDiv);
		  
		replyInnerContentDiv.appendChild(replyInfoContainerDiv);
		  
		replyContentDiv.appendChild(replyInnerContentDiv);
		replyDiv.appendChild(replyContentDiv);
		replyContainerSection.appendChild(replyDiv);		
			
	
		// 创建子回复列表容器
		var subReplyContainerDiv = document.createElement('div');
		subReplyContainerDiv.className = 'sub-reply-container';
			
		var subReplyListUl = document.createElement('ul');
		subReplyListUl.className = 'sub-reply-list';
			
			
		AllSubComment = [];
		
		getAllofSubCommemt(now_Comment[Idx_comment_id_bottom]);
				//console.log(AllSubComment);
				// 所有子评论已获取完毕
				//console.log(AllSubComment); // 在控制台输出所有子评论
				// 按时间排序
				AllSubComment.sort(function(a, b) {
					var timeA = Date.parse(a[3]);
				    var timeB = Date.parse(b[3]);
				    return timeA - timeB;
				});
				  
				  
				for(var j = 0; j < AllSubComment.length; j ++ ){
				  	now_SubComment = AllSubComment[j];
				  	// 创建一条子回复
				  	var subReplyListItemLi = document.createElement('li');
				  	
				  	var subReplyDiv = document.createElement('div');
				  	subReplyDiv.style.paddingTop = '0.625rem';
				  	
				  	// 创建子回帖人信息
				  	var subReplyHeaderDiv = document.createElement('div');
				  	subReplyHeaderDiv.className = 'sub-reply-header';
				  	
				  	var subReplyHeaderLeftDiv = document.createElement('div');
				  	subReplyHeaderLeftDiv.className = 'sub-reply-header-left';
				  	subReplyHeaderLeftDiv.setAttribute('role', 'button');
				  	subReplyHeaderLeftDiv.setAttribute('tabindex', '0');
				  	subReplyHeaderLeftDiv.setAttribute('aria-label', 'PANTA的主页');
				  	
				  	var subReplyHeaderImgContainerDiv = document.createElement('div');
				  	subReplyHeaderImgContainerDiv.className = 'sub-reply-header-img-containner';

					var target_page = '../MyCenter/MyCenter.html';
					if(now_SubComment[Idx_user_id] == userId) target_page = '../MyCenter/MyMainCenter.html';
					subReplyHeaderImgContainerDiv.setAttribute('onclick', "window.open('" + target_page + "?userid=" + now_SubComment[Idx_user_id] + "'); return false;");
					    
					  
					  
				  	var subReplyHeaderImgWrapperDiv = document.createElement('div');
				  	subReplyHeaderImgWrapperDiv.className = 'sub-reply-header-img-wrapper';
				  	
					
					// 通过评论id找作者nickname和头像
					var sub_need_nickname, sub_need_headpic;

					for(var k = 0; k < usernum; k ++ ){
						if(AllUsers.content[k][Idx_user_id_byAllUsers] == now_SubComment[Idx_user_id]){
							sub_need_nickname = AllUsers.content[k][Idx_nickname];
							sub_need_headpic = AllUsers.content[k][Idx_headpic_url];
							if(sub_need_headpic == null) sub_need_headpic = default_headpic_url;
						}
					}

					
					
				  	var subReplyHeaderImg = document.createElement('img');
				  	subReplyHeaderImg.src = sub_need_headpic;
				  	
				  	subReplyHeaderImgWrapperDiv.appendChild(subReplyHeaderImg);
				  	subReplyHeaderImgContainerDiv.appendChild(subReplyHeaderImgWrapperDiv);
				  	subReplyHeaderLeftDiv.appendChild(subReplyHeaderImgContainerDiv);
				  	
				  	var subReplyHeaderInfoContainerDiv = document.createElement('div');
				  	subReplyHeaderInfoContainerDiv.className = 'sub-reply-header-info-containner';
				  	
				  	var subReplyHeaderInfoNameDiv = document.createElement('div');
				  	subReplyHeaderInfoNameDiv.className = 'sub-reply-header-info-name';
					

					
					subReplyHeaderInfoNameDiv.textContent = sub_need_nickname;
					
				  	subReplyHeaderInfoContainerDiv.appendChild(subReplyHeaderInfoNameDiv);
				  	subReplyHeaderLeftDiv.appendChild(subReplyHeaderInfoContainerDiv);
				  	
				  	subReplyHeaderDiv.appendChild(subReplyHeaderLeftDiv);
				  	subReplyDiv.appendChild(subReplyHeaderDiv);
				  	
				  	// 创建内容
				  	var subReplyWordContainerDiv = document.createElement('div');
				  	subReplyWordContainerDiv.className = 'sub-reply-word-container';
				  	subReplyWordContainerDiv.setAttribute('role', 'button');
				  	subReplyWordContainerDiv.setAttribute('tabindex', '1');
					
					// -----------------给评论添加comment_id和user_id属性-----------------
				  	subReplyWordContainerDiv.setAttribute('comment_id', now_SubComment[Idx_comment_id]); // 添加自定义属性和值
					subReplyWordContainerDiv.setAttribute('user_id', now_SubComment[Idx_user_id]); // 添加自定义属性和值
				  	// -----------------给评论添加comment_id属性----------------- 
					subReplyWordContainerDiv.addEventListener('click', function() {
						target_comment_id = this.getAttribute('comment_id');
						target_user_id = this.getAttribute('user_id');
						var promptModal = document.querySelector('#promptModal');
						var promptModal2 = document.querySelector('#promptModal2');
						var commentModal = document.querySelector('#commentModal');
						
						// alert(userId + " " + author_id + " " + target_user_id);
						
						// 如果当前用户是贴主 或者是 自己的评论
						if(userId == author_id || target_user_id == userId){
							promptModal2.style.display = 'block';
						}
						// 普通用户 别人的评论
						else{
							commentModal.style.display = 'block';
							var textarea = document.querySelector('#commentModal textarea');
							for(var i = 0; i < usernum; i ++ ){
								if(AllUsers.content[i][Idx_user_id_byAllUsers] == target_user_id){
									textarea.placeholder = "回复" + AllUsers.content[i][Idx_nickname] + "：";
								}
							}
						}
					});  
					
				  	var subReplyWordSpan = document.createElement('span');
				  	subReplyWordSpan.textContent = now_SubComment[Idx_content];

								
					var subimgListDiv = document.createElement('div');
					subimgListDiv.className = 'img-list';
					
						var need_pic_idx;
						for(var k = 0; k < commentnum; k ++ ){
							if(AllComments.content[k][Idx_comment_id] == now_SubComment[Idx_comment_id]){
								need_pic_idx = k;
							}
						}
						
						if(AllCommentsPic[need_pic_idx] != undefined){
							for(var k = 0; k < AllCommentsPic[need_pic_idx].length; k ++ ){
								var imgElement = document.createElement('img');
								imgElement.src = AllCommentsPic[need_pic_idx][k];
								subimgListDiv.appendChild(imgElement);
							}
						}
					

				  	subReplyWordContainerDiv.appendChild(subReplyWordSpan);
					subReplyWordContainerDiv.appendChild(subimgListDiv);
				  	subReplyDiv.appendChild(subReplyWordContainerDiv);
				  	
				  	// 创建子回复信息
				  	var subReplyInfoContainerDiv = document.createElement('div');
				  	subReplyInfoContainerDiv.className = 'sub-reply-info-containner';
				  	
				  	var subReplyShowtimeDiv = document.createElement('div');
				  	subReplyShowtimeDiv.className = 'sub-reply-showtime';
				  	subReplyShowtimeDiv.textContent = now_SubComment[Idx_time];
				  	
				  	var subReplyLikeContainerDiv = document.createElement('div');
				  	subReplyLikeContainerDiv.className = 'sub-reply-like-container';
				  	
				  	var subReplyLikeNumDiv = document.createElement('div');
				  	subReplyLikeNumDiv.className = 'reply-likenum';
				  	subReplyLikeNumDiv.textContent = now_SubComment[Idx_num_like];
				  	
					// ---------------------------- 点赞-------------------------------
					var subReplyLikeImg = document.createElement('img');
					subReplyLikeImg.className = 'reply-like-img';
					subReplyLikeImg.setAttribute("comment_id", now_SubComment[Idx_comment_id] + "like");
					subReplyLikeImg.setAttribute('src', '../../img/comment/like.png');
					
					
					
					var subReplyLikedImg = document.createElement('img');
					subReplyLikedImg.className = 'reply-like-img';
					subReplyLikedImg.setAttribute("comment_id", now_SubComment[Idx_comment_id] + "liked");
					subReplyLikedImg.setAttribute('src', '../../img/comment/liked.png');
					
					var key = userId + "_" + now_SubComment[Idx_comment_id]
					var value = localStorage.getItem(key);	
					
					if(value == null){
						subReplyLikeImg.style.display = '';
						subReplyLikedImg.style.display ='none';
					}
					else{
						subReplyLikeImg.style.display = 'none';
						subReplyLikedImg.style.display = '';			
					}
					
					subReplyLikeImg.addEventListener('click', function() {
						var comment_id = this.getAttribute("comment_id");
						comment_id = comment_id.slice(0, comment_id.length - 4);
						var key = userId + "_" + comment_id;
						var value = localStorage.getItem(key);
					
						
						localStorage.setItem(key, 1);
						this.style.display = 'none';
						
						var need = comment_id + "liked";
						var targetElement = document.querySelector('img.reply-like-img[comment_id="' + need + '"]');
						console.log(targetElement);
						targetElement.style.display = '';	
						
						
						const xhr = new XMLHttpRequest();
						xhr.open('post', url_prefix +'addLike');       
						xhr.setRequestHeader('Content-Type', 'application/json');    
						xhr.onload = function() {
							if (xhr.status === 200) {           
								let obj = JSON.parse(xhr.responseText);   
								//location.reload()
							}
						};
						const data = {
							comment_id : comment_id
						}
						xhr.send(JSON.stringify(data));  
								
					});
					
					
					subReplyLikedImg.addEventListener('click', function() {
						var comment_id = this.getAttribute("comment_id");
						comment_id = comment_id.slice(0, comment_id.length - 5);
						
						var key = userId + "_" + comment_id;
						var value = localStorage.getItem(key);
						
						localStorage.removeItem(key);
						
						this.style.display = 'none';
						var need = comment_id + "like";
						var targetElement = document.querySelector('img.reply-like-img[comment_id="' + need + '"]');
						console.log(targetElement);
						targetElement.style.display = '';
						
						const xhr = new XMLHttpRequest();
						xhr.open('post', url_prefix +'subLike');       
						xhr.setRequestHeader('Content-Type', 'application/json');    
						xhr.onload = function() {
							if (xhr.status === 200) {           
								let obj = JSON.parse(xhr.responseText);   
								//location.reload()
							}
						};
						const data = {
							comment_id : comment_id
						}
						xhr.send(JSON.stringify(data));  				
					});	
					
					// ---------------------------- 点赞-------------------------------
					

					
				  	subReplyLikeContainerDiv.appendChild(subReplyLikeNumDiv);
				  	subReplyLikeContainerDiv.appendChild(subReplyLikeImg);
				  	subReplyLikeContainerDiv.appendChild(subReplyLikedImg);
					
				  	subReplyInfoContainerDiv.appendChild(subReplyShowtimeDiv);
				  	subReplyInfoContainerDiv.appendChild(subReplyLikeContainerDiv);
				  	
				  	subReplyDiv.appendChild(subReplyInfoContainerDiv);
				  	
				  	subReplyListItemLi.appendChild(subReplyDiv);
				  	subReplyListUl.appendChild(subReplyListItemLi);
				  	subReplyContainerDiv.appendChild(subReplyListUl);
				  	
				  	replyContainerSection.appendChild(subReplyContainerDiv);
				  	
				}
				// 创建回复最后的分割线
				var divider = document.createElement('div');
				divider.className = 'devider';
				replyContainerSection.appendChild(divider);

	  }
	  
	  // 将回复容器添加到评论区容器中
	  commentContainer.appendChild(replyContainerSection);						
}

