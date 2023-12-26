function delete_text(comment_id){

    delete_db(comment_id);
}
function delete_db(c_id){
    const xhr = new XMLHttpRequest();
    xhr.open('post', url_prefix + 'deleteComment');     //帖子添加
    xhr.setRequestHeader('Content-Type', 'application/json');    // 报头记得标明类型
    xhr.onload = function(){
        if(xhr.status === 200){
            let obj = JSON.parse(xhr.responseText);
            //文本上传成功或者图片上传成功就可以发布
            if (obj.status === 'success') {
                console.log("success");
                
            }else{
                console.log(obj.code);
                console.log("删除添加失败");
            }
        }
    };
    const data = {
        comment_id: c_id,
    };
    xhr.send(JSON.stringify(data));
}
