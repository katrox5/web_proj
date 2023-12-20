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

const userRegex = /^[\w@.]*$/;                                              // 账号只能是手机号或邮箱
const pswdRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,16}$/;      // 密码长度8-16位且必须包含数字、大小写字母

function addUser(user, pswd) {
    if (!userRegex.test(user))
        return regFailure4UserIsIllegal();
    if (!pswdRegex.test(pswd))
        return regFailure4PswdIsIllegal();

    const request = indexedDB.open('userInfo', 1);
    request.onsuccess = () => {
        let db = request.result;
        let tr = db.transaction('account', 'readwrite');
        let store = tr.objectStore('account');
        store.getAll(user).onsuccess = function(event) {
            if (JSON.stringify(event.target.result) == '[]') {
                store.add({username: user, password: sha1(pswd)});
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
                    if (account.password == sha1(pswd))
                        logSuccess();
                    else
                        logFailure();
                }
            } else logFailure();
        }
    }
}

function modifyPswd(user, pswd) {
    if (!pswdRegex.test(pswd))
        return modFailure4PswdIsIllegal();

    const request = indexedDB.open('userInfo', 1);
    request.onsuccess = () => {
        let db = request.result;
        let tr = db.transaction('account', 'readwrite');
        let store = tr.objectStore('account');
        store.getAll(user).onsuccess = function(event) {
            if (JSON.stringify(event.target.result) != '[]') {
                store.put({username: user, password: sha1(pswd)});
                modSuccess();
            } else modFailure();
        }
    }
}
