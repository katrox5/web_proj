var user_ID = [0];
var user_avatar = ["../../img/dyz_main/logo/小米.jpg"];
var nick_name = ["dyz"];

function addfriends()
{
	// 创建评论框
	var friendBox = document.createElement('div');
	// 设置 <div> 元素的 onclick 事件处理函数
	friendBox.onclick = function() {
	    window.open('test.html?commentid='+user_ID[index]);//前面的域名改成要跳转的界面（这里是评论详情界面）
	    return false; // 阻止默认行为和事件冒泡
	};
    // 设置class name 
	friendBox.className = "friends-content";
	// 头像
	var avatarBox = document.createElement('img');
	avatarBox.src = user_avatar[index];
	// 昵称
	var nicknameBox = document.createElement('div');
	nicknameBox.className = "friend-name";
	nicknameBox.innerHTML = nick_name[index];
	// 头像昵称添加到friendBox
	friendBox.appendChild(avatarBox);
	friendBox.appendChild(nicknameBox);
	
	// 将朋友添加到朋友区
	document.querySelector('.my-friends').appendChild(friendBox);
}