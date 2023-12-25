var commentID;
var fatherComment=-1;

function add(){
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
    add_question(text,-1);

}

function add_question(commentID,text,fatherComment) {
    // 使用XMLHttpRequest对象向服务器发送POST请求，包含question-text信息
    const xhr = new XMLHttpRequest();
    xhr.open('post', url_prefix + 'addComment');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        if (xhr.status === 200) {
            let obj = JSON.parse(xhr.responseText);
            commentID=obj.comment_id;
            if (obj.status === 'success') {
                addSuccess();
            }
            new Message().show({
                type: obj.status,
                // text: obj.message,
                closeable: true
            });
        }
    };
    const data = {
        commentID:null,
        question: text,
        father_comment:-1
    };
    xhr.send(JSON.stringify(data));
}

function addSuccess() {
    // 成功的逻辑
    setTimeout(() => {
        window.location.assign('../../html/hhy_main/manage.html');
    }, 2300);
    document.documentElement.style.pointerEvents = 'none';
}
