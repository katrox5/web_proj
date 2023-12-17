const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
if (!window.indexedDB)
	console.error("浏览器不支持 indexedDB");
else {
	let request = indexedDB.open('userInfo', 1);
	request.onupgradeneeded = () => {
		let db = request.result;
		db.createObjectStore('account', {keyPath: 'username'});
	};
}

function addUser(user, pswd) {
	const request = indexedDB.open('userInfo', 1);
	request.onsuccess = () => {
		let db = request.result;
		let tr = db.transaction('account', 'readwrite');
		let store = tr.objectStore('account');
		store.getAll(user).onsuccess = function(event) {
			if (JSON.stringify(event.target.result) == '[]') {
				store.add({username: user, password: pswd});
				regSuccess();
			} else regFailure();
		}
	}
}

function verifyPswd(user, pswd) {
	const request = indexedDB.open('userInfo', 1);
	request.onsuccess = () => {
		let db = request.result;
		let tr = db.transaction('account', 'readonly');
		let store = tr.objectStore('account');
		store.getAll(user).onsuccess = function(event) {
			if (JSON.stringify(event.target.result) != '[]') {
				for (account of event.target.result) {
					if (account.password == pswd)
						logSuccess();
					else
						logFailure();
				}
			} else logFailure();
		}
	}
}
