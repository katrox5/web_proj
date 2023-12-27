var user_result = [];
var flag_comment = false;
var flag_user = false;
var search_user_name = [];
var search_user_avatar = [];
var searchnow='C';

function get_all_user_insearch() {
	const xhr = new XMLHttpRequest();
	xhr.open('post', url_prefix + 'getAllUsers');
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onload = function() {
		if (xhr.status === 200) {
			obj = JSON.parse(xhr.responseText);
			alluser = obj.content;
		}
	};
	xhr.send(null);
	setTimeout(function() {

		//alert(alluser);
	}, 200);
}

function handleKeyPress(event) {
	// 检测是否按下回车键
	if (event.key === 'Enter') {
		// 阻止默认的回车键行为（例如提交表单）
		event.preventDefault();
		// 执行搜索事件
		performSearch();
	}
}

function performSearch() {
	document.getElementById('noresult').style.display = 'none'; //不显示没有哦搜索到
	var commentBoxElements = document.querySelectorAll('.commentBox');
	var usersBoxElements = document.querySelectorAll('.search-users-content');
	commentBoxElements.forEach(function(element) { //删除原有搜索
		element.remove(); // 删除元素
	});
	usersBoxElements.forEach(function(element) {
		element.remove(); // 删除元素
	});
	var key_word = document.querySelector(".hot-search").value;
	console.log(key_word);
	if (!key_word)
		return;
	flag_user = false;
	flag_comment = false;
	if (typeof key_word === 'number') {
	    // 如果是数字，将其转为字符串
	    key_word = key_word.toString();
	}
	get_search_comment(key_word);
	get_search_user(key_word);
}

function get_search_comment(key_word) {
	//请求评论搜索
	var obj;
	const xhr = new XMLHttpRequest();
	xhr.open('post', url_prefix + 'search4Content');
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onload = function() {
		if (xhr.status === 200) {
			obj = JSON.parse(xhr.responseText);
			allrootcomment = obj.content;
			num_comment = obj.row;
			store_allrootcomment();
			console.log(allrootcomment);
			if (comment_ID.length == 0) {
				flag_comment = false;
				if(searchnow == 'C')
				document.getElementById('noresult').style.display = 'block';
			}
			else{
				flag_comment = true;
				if(searchnow == 'C')
				document.getElementById('noresult').style.display = 'none';
			}
			all_img(0);
			// for (var i = 0; i < comment_ID.length; ++i) {
			// 	addcomment(i);
			// }
		}
	};
	const the_key = {
		key: key_word
	};
	xhr.send(JSON.stringify(the_key));
}

function get_search_user(key_word) {
	// 请求用户搜索
	var obj;
	const xhr = new XMLHttpRequest();
	xhr.open('post', url_prefix + 'search4User');
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.onload = function() {
		if (xhr.status === 200) {
			obj = JSON.parse(xhr.responseText);
			user_result = obj.content;
			console.log(user_result);
			if (user_result.length == 0) {
				flag_user = false;
				if(searchnow == 'D')
				document.getElementById('noresult').style.display = 'block';
			}
			else
			{
				flag_user = true;
				if(searchnow == 'D')
				document.getElementById('noresult').style.display = 'none';
			}
			
			store_allsearchusers();
			for (var i = 0; i < user_result.length; ++i) {
				addsearchusers(i);
			}
		}
	};
	const the_key = {
		key: key_word
	};
	xhr.send(JSON.stringify(the_key));
}

function addsearchusers(index) {
	// 创建评论框
	var searchuserBox = document.createElement('div');
	// 设置 <div> 元素的 onclick 事件处理函数
	searchuserBox.onclick = function() {
		window.open('../MyCenter/MyCenter.html?userid=' + user_result[index][0]); //前面的域名改成要跳转的界面（这里是个人中心界面）
		return false; // 阻止默认行为和事件冒泡
	};
	// 设置class name 
	searchuserBox.className = "search-users-content";
	// 头像
	var avatarBox = document.createElement('img');
	avatarBox.src = search_user_avatar[index];
	// 昵称
	var nicknameBox = document.createElement('div');
	nicknameBox.className = "search-user-name";
	nicknameBox.innerHTML = search_user_name[index];
	// 头像昵称添加到searchuserBox
	searchuserBox.appendChild(avatarBox);
	searchuserBox.appendChild(nicknameBox);

	// 将朋友添加到朋友区
	document.querySelector('.search-users').appendChild(searchuserBox);
}

function store_allsearchusers() {
	search_user_name = [];
	search_user_avatar = []; //清理原储存
	for (var i = 0; i < user_result.length; ++i) {
		search_user_name[i] = user_result[i][2];
		search_user_avatar[i] = user_result[i][4];
		if (search_user_avatar[i] == null)
			search_user_avatar[i] = media_path+'avatar/default_avatar.png';
	}
}

function get_hot_search() {
	// 随机选出一个字符串
	let randomIndex = Math.floor(Math.random() * text_content.length);
	let selectedString = text_content[randomIndex];

	// 检查 selectedString 是否是字符串
	if (typeof selectedString === 'string') {
		let result = selectedString.split(',')[0].trim().substring(0, 10);
		var inputElement = document.querySelector('.hot-search');
		inputElement.placeholder = "大家都在搜：" + result;
		localStorage.setItem('hot-search', result);
	} else {
	}

}

function showBox(boxId) {
	document.getElementById('boxC').style.display = 'none';
	document.getElementById('boxD').style.display = 'none';
	if(boxId=='C')
	{
		searchnow = 'C';
		if(flag_comment==false)
		document.getElementById('noresult').style.display = 'block';	
		else
		document.getElementById('noresult').style.display = 'none';	
	}
    if(boxId=='D')
    {
		searchnow = 'D';
    	if(flag_user==false)
    	document.getElementById('noresult').style.display = 'block';	
    	else
    	document.getElementById('noresult').style.display = 'none';	
    }
	document.getElementById('box' + boxId).style.display = 'block';
}

function changeColor(boxId, isHover) {
	if (isHover) {
		document.getElementById('box' + boxId).style.backgroundColor = '#eee';
	} else {
		document.getElementById('box' + boxId).style.backgroundColor = '#fff';
	}
}