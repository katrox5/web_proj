function request() {
    const xhr = new XMLHttpRequest();
    xhr.open('post', 'http://172.29.18.101:25565/getALLUsers');
    xhr.onload = function() {
        if (xhr.status === 200) {
            alert(xhr.responseText);
        }
    };
    xhr.send(null);
}
