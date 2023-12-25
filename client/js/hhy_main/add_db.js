

var  AllComments;	//都是row + content
const Idx_comment_id = 0, Idx_user_id = 1, Idx_content = 2, Idx_time = 3, Idx_father_comment = 4, Idx_num_like = 5, Idx_num_reply = 6;// getAllComments

var father_comment=-1;


// window.addEventListener('load', function(){
    
// 	const xhr2 = new XMLHttpRequest();

//     //跨域请求
    
// 	xhr2.open('post', url_prefix + 'addCommentImg');      //图片添加
    
   
// 	xhr2.setRequestHeader('Content-Type', 'application/json');    // 报头记得标明类型
//     xhr2.onload = function(comment_id,url,num_order){
//         if(xhr2.status === 200){
//             let obj1 = JSON.parse(xhr.responseText);
//             if (obj1.status === 'success') {

//             }
//         }
//     };
//     const data1 = {
//         comment_id:comment_id,
//         url:img_url,
//         num_order: img_order
//     };
//     xhr2.send(JSON.stringify(data1));
//     add_text();

    

// })

function add_text_request(text_user_id,text_content,father_id){
    const xhr = new XMLHttpRequest();
    xhr.open('post', url_prefix + 'addComment');     //帖子添加
    xhr.setRequestHeader('Content-Type', 'application/json');    // 报头记得标明类型
    xhr.onload = function(){
        if(xhr.status === 200){
            let obj = JSON.parse(xhr.responseText);
            var comment_id=obj.comment_id;
            if (obj.status === 'success') {
                console.log("文本添加成功");
            }else{
                console.log("文本添加失败");
            }
        }


    };
    const data = {
        user_id: text_user_id,
        content: text_content,
        father_comment: father_id
    };
    xhr.send(JSON.stringify(data));

}

function add_text(){
    const text = document.getElementById("question-text").value;

    var flag=false;
    if (text.length === 0) {
        alert("问题必须填写后才能发表");
        flag=true;
    } 
    if (text.length < 5) {
        alert("问题字数太少（大于5个字）");
        flag=true;
    } 
    if (text.length > 1000) {
        alert("超出问题字数限额（大于1000个字）");
        flag=true;
    } 
    if (flag)
        return;

    //localStorage.setItem('question',text);

    // 通过验证，调用添加问题的函数
    //add_question(text,-1);
    return text;
}

function pic_add(){
    // 获取图片列表
    const imageList = document.querySelectorAll('.preview-image');
    const imageInfoArray = [];
    imageList.forEach((image, index) => {
        const comment_id = comment_id; 
        const pic_url = image.querySelector('img').src;
        const pic_num_order = index + 1;
        imageInfoArray.push({ comment_id, pic_url, pic_num_order });
    });


}