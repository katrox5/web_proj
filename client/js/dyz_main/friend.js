var friends_ID = [];
var friends_avatar = [];
var friends_nick_name = [];

function addfriends(index) {
	// 创建评论框
	var friendBox = document.createElement('div');
	// 设置 <div> 元素的 onclick 事件处理函数
	friendBox.onclick = function() {
		window.open('../MyCenter/MyCenter.html?userid=' + friends_ID[index]); //前面的域名改成要跳转的界面（这里是评论详情界面）
		return false; // 阻止默认行为和事件冒泡
	};
	// 设置class name 
	friendBox.className = "friends-content";
	// 头像
	var avatarBox = document.createElement('img');
	avatarBox.src = friends_avatar[index];
	// 昵称
	var nicknameBox = document.createElement('div');
	nicknameBox.className = "friend-name";
	nicknameBox.innerHTML = friends_nick_name[index];
	// 头像昵称添加到friendBox
	friendBox.appendChild(avatarBox);
	friendBox.appendChild(nicknameBox);

	// 将朋友添加到朋友区
	document.querySelector('.my-friends').appendChild(friendBox);
}

function changefriends() {
	var obj;
	const xhr = new XMLHttpRequest();
	xhr.open('post', url_prefix + 'getSubscribe');
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onload = function() {
		if (xhr.status === 200) {
			obj = JSON.parse(xhr.responseText);
			var all_friends = obj.content;
			const createfriends = setInterval(function() {
				if (all_friends.length > 0) {
					for (var i = 0; i < all_friends.length; ++i) {
						var user = get_userbyID(all_friends[i]);
						friends_ID[i] = all_friends[i];
						friends_nick_name[i] = user[2];
						friends_avatar[i] = user[4];
						addfriends(i);
					}
					clearInterval(createfriends);
				}
			}, 10)

		}
	};
	const data = {
		user_id: this_user_id
	}
	xhr.send(JSON.stringify(data));
	setTimeout(function() {

		//alert(alluser);
	}, 200);
}

function addfriendstodb() {
	var obj;
	const xhr = new XMLHttpRequest();
	xhr.open('post', url_prefix + 'addSubscribe');
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onload = function() {
		if (xhr.status === 200) {
			obj = JSON.parse(xhr.responseText);
		}
	};
	const data = {
		user_a: 2,
		user_b: 0
	}
	xhr.send(JSON.stringify(data));
	/* 	setTimeout(function() {
		
			//alert(alluser);
		}, 200); */
}
