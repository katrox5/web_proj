var father_comment=-1;
var useID =localStorage.getItem('id');
var all_img_url;


function add_to_db(){
    const text = document.getElementById("question-text").value;

    if (text.length === 0) {
        new Message().show(
        {
            type:'error',
            text:'问题描述不能为空',
            duration:1500,
            closeable:true
        });
        console.log("为空");
        return;
    } 
    if (text.length < 5) {
        new Message().show(
        {
            type:'error',
            text:'问题字数太少（大于5个字）',
            duration:1500,
            closeable:true
        });
        return;
    } 
    if (text.length > 1000) {
        new Message().show(
        {
            type:'error',
            text:'超出问题字数限额（大于1000个字）',
            duration:1500,
            closeable:true
        });
        return;
    } 

    //localStorage.setItem('question',text);

    // 通过验证，调用添加问题的函数
    add_text_request(useID,text,father_comment);
}

function add_text_request(useID,text_content,father_comment){
    const xhr = new XMLHttpRequest();
    xhr.open('post', url_prefix + 'addComment');     //帖子添加
    xhr.setRequestHeader('Content-Type', 'application/json');    // 报头记得标明类型
    xhr.onload = function(){
        if(xhr.status === 200){
            let obj = JSON.parse(xhr.responseText);
            var comment_id=obj.content;
            console.log(obj.content);
            add_img(obj.content,saveImgs(),0);
        }
    };
    const data = {
        user_id: useID,
        content: text_content,
        father_comment: father_comment
    };
    xhr.send(JSON.stringify(data));

}

function add_img(comment_id,img_url,img_order){
    if(img_order>=img_url.length)
    return;
    //图片
    const xhr1 = new XMLHttpRequest();
    xhr1.open('post', url_prefix + 'addCommentImg');     //帖子添加
    xhr1.setRequestHeader('Content-Type', 'application/json');    // 报头记得标明类型
    xhr1.onload = function(){
        if(xhr1.status === 200){
            let obj1 = JSON.parse(xhr1.responseText);
            //文本上传成功或者图片上传成功就可以发布
            if (obj1.status === 'success') {
                add_img(comment_id,img_url,img_order+1);
                console.log("发布图片"+img_order);
                
            }else{
                console.log(obj1.code);
                console.log("文本添加失败");
            }
        }
    };
    const data1 = {
        comment_id: comment_id,
        url: img_url[img_order],
        num_order: img_order
    };
    xhr1.send(JSON.stringify(data1));
}


// 从容器中获取图片URL的函数
function saveImgs() {//保存
    const list = $('image-preview-container');
    const items = list.childNodes;
    console.log(items);
    let queue = [];
    for (var i = 3; i < items.length; i++) {
            var url = media_path + 'question/' + items[i].classList[1];
            queue.push([url]);
        }
    console.log(queue);
    return queue;
    //request4AddUserImg(queue);
}
