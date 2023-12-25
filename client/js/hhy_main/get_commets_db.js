function get_allcom_db(){
    const xhr = new XMLHttpRequest();
    xhr.open('post', url_prefix + 'getAllComments');     //帖子添加
    xhr.setRequestHeader('Content-Type', 'application/json');    // 报头记得标明类型
    xhr.onload = function(){
        if(xhr.status === 200){
            let obj = JSON.parse(xhr.responseText);
            console.log(obj);
        }


    };
    xhr.send(null);

}