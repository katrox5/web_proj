var comment_ID = []; // 评论ID
var avatar = []; //头像
var nickname = []; //昵称
var text_content = []; //文本内容
var img_content = []; //图片内容
var like_num = []; //点赞数
var reply_num = []; //回复数
var date_pub = []; //发布时间

/* var comment_ID = [0];// 评论ID
var avatar = ["../../img/dyz_main/search.jfif"];//头像
var nickname = ["name"];//昵称
var text_content = ["aaaa"];//文本内容
var img_content = [["../../img/dyz_main/logo/小米.jpg","../../img/dyz_main/logo/小米.jpg"]];//图片内容
var like_num = ["12"];//点赞数
var reply_num = ["13"];//回复数
var date_pub = ["2023.12.20 23:06"];//发布时间 */

function store_allrootcomment() {
	clear_all();
	for (var i = 0; i < allrootcomment.length; ++i) {
		var thisuser = get_userbyID(allrootcomment[i][1]); //用户
		comment_ID[i] = allrootcomment[i][0]; //评论ID
		avatar[i] = thisuser[4]; //用户头像
		nickname[i] = thisuser[2]; //用户昵称
		//alert(nickname[i]);
		text_content[i] = allrootcomment[i][2]; //评论内容
		date_pub[i] = allrootcomment[i][3]; //时间
		like_num[i] = allrootcomment[i][4]; //点赞
		reply_num[i] = allrootcomment[i][5]; //回复
		var x = [];
		img_content[i] = x;
	}
}


function clear_all() {
	comment_ID = []; // 评论ID
	avatar = []; //头像
	nickname = []; //昵称
	text_content = []; //文本内容
	img_content = []; //图片内容
	like_num = []; //点赞数
	reply_num = []; //回复数
	date_pub = []; //发布时间
}

function get_userbyID(userid) {
	for (var i = 0; i < alluser.length; ++i)
		if (alluser[i][0] == userid)
			return alluser[i];
}

function addcomment(index) {
	// 创建评论框
	var commentBox = document.createElement('div');
	// 设置 <div> 元素的 onclick 事件处理函数
	commentBox.onclick = function() {
		window.open('../comment/comment.html?commentid=' + comment_ID[index]); //前面的域名改成要跳转的界面（这里是评论详情界面）
		return false; // 阻止默认行为和事件冒泡
	};

	// 创建用户：头像昵称
	var userBox = document.createElement('div');
	userBox.className = "user";
	// 头像
	var avatarBox = document.createElement('img');
	avatarBox.src = avatar[index];
	// 昵称
	var nicknameBox = document.createElement('input');
	// 设置 input 元素的类型为 "text"
	nicknameBox.type = 'text';
	// 设置 input 元素的值为 "name"
	nicknameBox.value = nickname[index];
	// 将 input 元素设置为只读
	nicknameBox.readOnly = true;
	// 头像昵称添加到user
	userBox.appendChild(avatarBox);
	userBox.appendChild(nicknameBox);

	// 创建评论内容
	var contentsDiv = document.createElement('div');
	contentsDiv.className = 'contents';

	// 创建文本内容元素
	var multilineTextboxDiv = document.createElement('div');
	multilineTextboxDiv.className = 'multiline-textbox';
	multilineTextboxDiv.innerHTML = text_content[index];

	// 创建多个<img>元素
	var imgElement = [];
	for (var i = 0; i < img_content[index].length; ++i) {
		imgElement[i] = document.createElement('img');
		imgElement[i].src = img_content[index][i];
	}


	// 创建<div class="like">元素
	var likeDiv = document.createElement('div');
	likeDiv.className = 'like';

	// 创建<div class="date">元素
	var dateDiv = document.createElement('div');
	dateDiv.className = 'date';
	dateDiv.textContent = date_pub[index];

	// 创建<img>元素，表示点赞
	var likeImg = document.createElement('img');
	likeImg.src = '../../img/dyz_main/like.png';

	// 创建<span>元素，表示点赞数
	var likeCountSpan = document.createElement('span');
	likeCountSpan.textContent = like_num[index];

	// 创建<img>元素，表示回复
	var replyImg = document.createElement('img');
	replyImg.src = '../../img/dyz_main/reply.png';

	// 创建<span>元素，表示回复数
	var replyCountSpan = document.createElement('span');
	replyCountSpan.textContent = reply_num[index];

	// 将所有元素添加到<div class="like">中
	likeDiv.appendChild(dateDiv);
	likeDiv.appendChild(likeImg);
	likeDiv.appendChild(likeCountSpan);
	likeDiv.appendChild(document.createTextNode('\u2003')); // 添加空白字符
	likeDiv.appendChild(replyImg);
	likeDiv.appendChild(replyCountSpan);

	// 创建<hr>元素
	var hrElement = document.createElement('hr');

	// 将所有元素添加到<div class="contents">中
	contentsDiv.appendChild(multilineTextboxDiv);
	for (var i = 0; i < img_content[index].length; ++i) {
		contentsDiv.appendChild(imgElement[i]);
	}
	contentsDiv.appendChild(likeDiv);
	contentsDiv.appendChild(hrElement);
	// 将上述两部分（user和contents添加到评论框）
	commentBox.appendChild(userBox);
	commentBox.appendChild(contentsDiv);
	// 将评论框添加到评论区
	document.querySelector('.comments').appendChild(commentBox);

}