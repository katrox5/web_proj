function delete_text(comment_id){

    delete_db(comment_id);
}

function delete_db(comment_id){
    const xhr = new XMLHttpRequest();
    xhr.open('post', url_prefix + 'deleteComment');     //帖子删除
    xhr.setRequestHeader('Content-Type', 'application/json');    // 报头记得标明类型
    xhr.onload = function(){
        if(xhr.status === 200){
            let obj = JSON.parse(xhr.responseText);
            if (obj.status === 'success') {
                console.log("帖子删除成功");
            }
        }
    };
    const data = {
        comment_id :comment_id,
    };
    xhr.send(JSON.stringify(data));
}