var c_all_img_url = [];  //返回单独列表
var r_all_img_url = [];
var c_cid = [];
var r_cid = [];
var c_text = [];
var r_text = [];
var c_time = [];
var r_time = [];
var r_father_reply = [];  //获得回复




function get_allcom_db(this_user_id){
    const xhr = new XMLHttpRequest();
    xhr.open('post', url_prefix + 'getAllComments');     //帖子添加
    xhr.setRequestHeader('Content-Type', 'application/json');    // 报头记得标明类型
    xhr.onload = function(){
        if(xhr.status === 200){
            let obj = JSON.parse(xhr.responseText);
            for(var i = 0;i<obj.row;++i){
                if(obj.content[i][1] == this_user_id)
                {
                    if(obj.content[i][4] == -1)//帖子
                    {
                        c_cid.push(obj.content[i][0]);
                        c_text.push(obj.content[i][2]);
                        c_time.push(obj.content[i][3]);
                        c_all_img_url.push(obj.image[i]);

                    }
                    // else// 评论
                    // {
                        
                    //     r_cid.push(obj.content[i][0]);
                    //     r_text.push(obj.content[i][2]);
                    //     r_time.push(obj.content[i][3]);
                    //     r_father_reply.push(obj.content[i][4]);
                    //     r_all_img_url.push(obj.image[i]);
                    // }
                }
                
            }
            for(var i = 0;i<c_cid.length;++i)
            add_element_to_comment(i);
            // for(var i = 0;i<r_cid.length;++i)
            // add_element_to_reply(i);
        }

    };
    xhr.send(null);

}

//帖子和草稿
function add_element_to_comment(index){
    // 创建问题块元素
    var problemBlock = document.createElement("div");
    problemBlock.classList.add("problem");
    problemBlock.classList.add("comment" + index);
    // 问题配图
    var picDiv = document.createElement("div");
    picDiv.classList.add("pic");
    var img = document.createElement("img");
    if(c_all_img_url[index].length==0)
        img.src = "../../img/hhy_main/udefine_pic.jpg";
    else
        img.src = c_all_img_url[index][0];
    picDiv.appendChild(img);

    // 问题信息
    var messageDiv = document.createElement("div");
    messageDiv.classList.add("message");

    // 文章开头
    var startDiv = document.createElement("div");
    startDiv.classList.add("start");
    startDiv.textContent = c_text[index];

    // 发布时间
    var timeDiv = document.createElement("div");
    timeDiv.classList.add("time");
    timeDiv.textContent = c_time[index];

    // 状态
    var statusDiv = document.createElement("div");
    statusDiv.classList.add("status");
    statusDiv.classList.add("status_1");
    statusDiv.textContent = "已上线";

    messageDiv.appendChild(startDiv);
    messageDiv.appendChild(timeDiv);
    messageDiv.appendChild(statusDiv);

    // 操作
    var operateDiv = document.createElement("div");
    operateDiv.classList.add("operate");

    // 修改
    var editDiv = document.createElement("div");
    editDiv.classList.add("edit");
    editDiv.setAttribute("onclick", "edit_this(" + index + ")");
    var editImg = document.createElement("img");
    editImg.src = "../../img/hhy_main/edit.png";
    var editText = document.createElement("div");
    editText.classList.add("operate-text");
    editText.textContent = "修改";
    editDiv.appendChild(editImg);
    editDiv.appendChild(editText);

    // 删除
    var deleteDiv = document.createElement("div");
    deleteDiv.classList.add("delete");
    deleteDiv.setAttribute("onclick", "delete_this(" + index + ")");
    var deleteImg = document.createElement("img");
    deleteImg.src = "../../img/hhy_main/delete.png";
    var deleteText = document.createElement("div");
    deleteText.classList.add("operate-text");
    deleteText.textContent = "删除";
    deleteDiv.appendChild(deleteImg);
    deleteDiv.appendChild(deleteText);

    operateDiv.appendChild(editDiv);
    operateDiv.appendChild(deleteDiv);

    // 将所有子元素添加到问题块中
    problemBlock.appendChild(picDiv);
    problemBlock.appendChild(messageDiv);
    problemBlock.appendChild(operateDiv);

    // 将问题块添加到容器中
    var rightDownContainer = document.querySelector(".right_down1");

    // 添加 problemBlock 到 right_down 元素中
    if (rightDownContainer) {
        rightDownContainer.appendChild(problemBlock);
    } else {
        console.error("未找到 right_down 容器元素。");
    }
}

