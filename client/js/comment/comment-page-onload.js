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
	var urlParams = new URLSearchParams(window.location.search);
	var comment_id = urlParams.get('commentid');

})


window.addEventListener('load', function(){
	const xhr1 = new XMLHttpRequest();
	const xhr2 = new XMLHttpRequest();
	
	// 跨域请求
	xhr1.open('post', 'http://172.29.18.101:25565/getAllComments');        // 请求的地址，跟 卓宏宇 沟通确认
	xhr2.open('post', 'http://172.29.18.101:25565/getAllUsers');        // 请求的地址，跟 卓宏宇 沟通确认
	
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
			
			author_id = Comment[Idx_user_id];
			
			
			xhr2.onload = function() {
				if (xhr2.status === 200) {            // 状态码200，表示成功
					AllUsers = JSON.parse(xhr2.responseText);   // xhr.responseText为返回结果
					console.log(AllUsers);
					usernum = AllUsers.row;
					for(var i = 0; i < usernum; i ++ ){
						if(AllUsers.content[i][Idx_user_id] == author_id)
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
	
	comment_time = Comment[Idx_time];
	comment_num_reply = Comment[Idx_num_reply];
	comment_content = Comment[Idx_content];
	
	
	username = Author[Idx_username]
	nickname = Author[Idx_nickname];
	signatrue = Author[Idx_signatrue];
	avatar_url = Author[Idx_avatar_url];
	
	target_comment_id = comment_id;
	target_user_id = author_id;
	
	maincontent_onload();
	authorinfo_onload();
	
	
	// 获取主贴的底下评论
	const xhr3 = new XMLHttpRequest();
	xhr3.open('post', 'http://172.29.18.101:25565/getChildComments');       
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

	var authorImg = document.createElement('img');
	authorImg.src = '../../img/comment/headpic.webp';

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

	// 创建关注部分
	var followDiv = document.createElement('div');
	followDiv.className = 'follow';
	followDiv.textContent = '关注';
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
	imgListDiv.className = 'imglist';

	var imgListWrapperDiv = document.createElement('div');
	imgListWrapperDiv.className = 'imglist-wrapper';

	var imgElement = document.createElement('img');
	imgElement.className = 'imglist-img';
	imgElement.src = '../../img/comment/headpic.webp';

	imgListWrapperDiv.appendChild(imgElement);
	imgListDiv.appendChild(imgListWrapperDiv);
	imgListContainerDiv.appendChild(imgListDiv);

	var emptyDiv2 = document.createElement('div');
	imgListContainerDiv.appendChild(emptyDiv2);

	commentContainer.appendChild(imgListContainerDiv);
	var _blankDivCopy = _blankDiv.cloneNode(true);
	commentContainer.appendChild(_blankDivCopy);

	// 将生成的结构添加到页面中的某个容器中
	var container = document.getElementById('my-comment-content');
	container.appendChild(commentContainer);
	
	
	// 底下固定栏
	var replyWordContainer = document.querySelector('.a-fixed-bottom-left');

	replyWordContainer.addEventListener('click', function() {
		target_comment_id = comment_id;
		target_user_id = author_id;
		// 直接评论	
		var textarea = document.querySelector('#commentModal textarea');
		textarea.placeholder = "说一说你的想法~";
		commentModal.style.display = 'block';
	});
	
	
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
	
	
};





// 右侧的个人信息
function authorinfo_onload() {
	  // 创建右上角发帖人信息容器 div
	  var publishInfoDiv = document.createElement('div');
	  publishInfoDiv.className = 'publish-info';

	  // 创建用户卡片 div
	  var userCardDiv = document.createElement('div');
	  userCardDiv.className = 'usercard';

	  // 创建用户头像部分
	  var userPicContainerSpan = document.createElement('span');
	  userPicContainerSpan.className = 'user-pic-container';

	  var userImg = document.createElement('img');
	  userImg.src = '../../img/comment/headpic.webp';

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
	  followNumSpan.textContent = '0';
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
	  fansNumSpan.textContent = '4';
	  var fansWordSpan = document.createElement('span');
	  fansWordSpan.className = 'usercard-word';
	  fansWordSpan.textContent = '粉丝';

	  fansDiv.appendChild(fansNumSpan);
	  fansDiv.appendChild(fansWordSpan);
	  userCardTagDiv.appendChild(fansDiv);

	  // 创建动态标签
	  var postsDiv = document.createElement('div');
	  var postsNumSpan = document.createElement('span');
	  postsNumSpan.className = 'usercard-num';
	  postsNumSpan.textContent = '5';
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
	return new Promise((resolve, reject) => {
		let xhr = new XMLHttpRequest();
		xhr.open('POST', 'http://172.29.18.101:25565/getChildComments');
		xhr.setRequestHeader('Content-Type', 'application/json');
    
		xhr.onload = function() {
			if (xhr.status === 200) {
				let response = JSON.parse(xhr.responseText);
				console.log(response);
				if(response.row != 0){
					let subComments = response.content;
					let len = response.row;
			
					for(var i = 0; i < len; i ++ ){
						now_subComment = subComments[i];
						AllSubComment.push(now_subComment);
						getAllofSubCommemt(now_subComment[Idx_comment_id_bottom]); // 递归调用以获取子评论的子评论	
					}		
				}
				resolve(); // 异步操作完成，调用resolve
			}
			else {
				reject(xhr.statusText);
			}
		};
		xhr.onerror = function() {
			reject(xhr.statusText);
		};
		xhr.send(JSON.stringify({ comment_id: request_comment_id }));
	});
}


function bottom_comment() {
	var Bottom_Comment_len = Bottom_Comment.row;
	Bottom_Comment = Bottom_Comment.content;
	
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
		  
		var replyHeaderImgWrapperDiv = document.createElement('div');
		replyHeaderImgWrapperDiv.className = 'reply-header-img-wrapper';
		
		var replyHeaderImg = document.createElement('img');
		replyHeaderImg.src = '../../img/comment/headpic.webp';
		  
		replyHeaderImgWrapperDiv.appendChild(replyHeaderImg);
		replyHeaderImgContainerDiv.appendChild(replyHeaderImgWrapperDiv);
		replyHeaderLeftDiv.appendChild(replyHeaderImgContainerDiv);
		  
		var replyHeaderInfoContainerDiv = document.createElement('div');
		replyHeaderInfoContainerDiv.className = 'reply-header-info-containner';
		  
		var replyHeaderInfoNameDiv = document.createElement('div');
		replyHeaderInfoNameDiv.className = 'reply-header-info-name';
		  
		// 通过评论id找作者nickname
		for(var k = 0; k < usernum; k ++ ){
			if(AllUsers.content[k][Idx_user_id] == now_Comment[Idx_user_id_bottom])
				replyHeaderInfoNameDiv.textContent = AllUsers.content[k][Idx_nickname];
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
		  
		var replyLikeImg = document.createElement('img');
		replyLikeImg.className = 'reply-like-img';
		replyLikeImg.src = '../../img/comment/like.png';
		  
		replyLikeContainerDiv.appendChild(replyLikeNumDiv);
		replyLikeContainerDiv.appendChild(replyLikeImg);
		  
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
		getAllofSubCommemt(now_Comment[Idx_comment_id_bottom])
			.then(() => {
				// 所有子评论已获取完毕
				console.log(AllSubComment); // 在控制台输出所有子评论
				// 按时间排序
				AllSubComment.sort(function(a, b) {
					var timeA = Date.parse(a[3]);
				    var timeB = Date.parse(b[3]);
				    return timeB - timeA;
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
				  	
				  	var subReplyHeaderImgWrapperDiv = document.createElement('div');
				  	subReplyHeaderImgWrapperDiv.className = 'sub-reply-header-img-wrapper';
				  	
				  	var subReplyHeaderImg = document.createElement('img');
				  	subReplyHeaderImg.src = '../../img/comment/headpic.webp';
				  	
				  	subReplyHeaderImgWrapperDiv.appendChild(subReplyHeaderImg);
				  	subReplyHeaderImgContainerDiv.appendChild(subReplyHeaderImgWrapperDiv);
				  	subReplyHeaderLeftDiv.appendChild(subReplyHeaderImgContainerDiv);
				  	
				  	var subReplyHeaderInfoContainerDiv = document.createElement('div');
				  	subReplyHeaderInfoContainerDiv.className = 'sub-reply-header-info-containner';
				  	
				  	var subReplyHeaderInfoNameDiv = document.createElement('div');
				  	subReplyHeaderInfoNameDiv.className = 'sub-reply-header-info-name';
					
					// 通过评论id找作者nickname
					for(var k = 0; k < usernum; k ++ ){
						  if(AllUsers.content[k][Idx_user_id] == now_SubComment[Idx_user_id_bottom])
							subReplyHeaderInfoNameDiv.textContent = AllUsers.content[k][Idx_nickname];
					}
					
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
				  	subReplyWordContainerDiv.setAttribute('comment_id', now_SubComment[Idx_comment_id_bottom]); // 添加自定义属性和值
					subReplyWordContainerDiv.setAttribute('user_id', now_SubComment[Idx_user_id_bottom]); // 添加自定义属性和值
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
				  	subReplyWordSpan.textContent = now_SubComment[Idx_content_bottom];

					
				  	subReplyWordContainerDiv.appendChild(subReplyWordSpan);
				  	subReplyDiv.appendChild(subReplyWordContainerDiv);
				  	
				  	// 创建子回复信息
				  	var subReplyInfoContainerDiv = document.createElement('div');
				  	subReplyInfoContainerDiv.className = 'sub-reply-info-containner';
				  	
				  	var subReplyShowtimeDiv = document.createElement('div');
				  	subReplyShowtimeDiv.className = 'sub-reply-showtime';
				  	subReplyShowtimeDiv.textContent = now_SubComment[Idx_time_bottom];
				  	
				  	var subReplyLikeContainerDiv = document.createElement('div');
				  	subReplyLikeContainerDiv.className = 'sub-reply-like-container';
				  	
				  	var subReplyLikeNumDiv = document.createElement('div');
				  	subReplyLikeNumDiv.className = 'reply-likenum';
				  	subReplyLikeNumDiv.textContent = now_SubComment[Idx_num_like_bottom];
				  	
				  	var subReplyLikeImg = document.createElement('img');
				  	subReplyLikeImg.className = 'reply-like-img';
				  	subReplyLikeImg.src = '../../img/comment/like.png';
				  	
				  	subReplyLikeContainerDiv.appendChild(subReplyLikeNumDiv);
				  	subReplyLikeContainerDiv.appendChild(subReplyLikeImg);
				  	
				  	subReplyInfoContainerDiv.appendChild(subReplyShowtimeDiv);
				  	subReplyInfoContainerDiv.appendChild(subReplyLikeContainerDiv);
				  	
				  	subReplyDiv.appendChild(subReplyInfoContainerDiv);
				  	
				  	subReplyListItemLi.appendChild(subReplyDiv);
				  	subReplyListUl.appendChild(subReplyListItemLi);
				  	subReplyContainerDiv.appendChild(subReplyListUl);
				  	
				  	replyContainerSection.appendChild(subReplyContainerDiv);
				  	
				}
				// 创建回复最后的分割线
			})
			.catch((error) => {
				console.error('Error:', error);
				// 处理错误情况
			});
	  }
	  
	  // 将回复容器添加到评论区容器中
	  commentContainer.appendChild(replyContainerSection);						
}

