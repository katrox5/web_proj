var c_img_url = localStorage.getItem('draftimage');
var c_text =localStorage.getItem('drafttext');

function get_allcom_loc(this_user_id)
{console.log(c_text);
    for(var i = 0;i<c_text.length;++i)
    { 
        add_element_to_comment1(i);
    }
}


//展示草稿
function add_element_to_comment1(index){
    
    // 创建问题块元素
    var problemBlock = document.createElement("div");
    problemBlock.classList.add("problem");

    // 问题配图
    var picDiv = document.createElement("div");
    picDiv.classList.add("pic");
    var img = document.createElement("img");
    if(c_img_url[index].length==0)
        img.src = "../../img/hhy_main/udefine_pic.jpg";
    else
        img.src = c_img_url[index][0];
    picDiv.appendChild(img);

    // 问题信息
    var messageDiv = document.createElement("div");
    messageDiv.classList.add("message");

    // 文章开头
    var startDiv = document.createElement("div");
    startDiv.classList.add("start");
    startDiv.textContent = c_text[index];

    // // 发布时间
    // var timeDiv = document.createElement("div");
    // timeDiv.classList.add("time");
    // timeDiv.textContent = c_time[index];

    // 状态
    var statusDiv = document.createElement("div");
    statusDiv.classList.add("status");
    statusDiv.classList.add("status_2");
    statusDiv.textContent = "草稿";

    messageDiv.appendChild(startDiv);
    //messageDiv.appendChild(timeDiv);
    messageDiv.appendChild(statusDiv);

    // 操作
    var operateDiv = document.createElement("div");
    operateDiv.classList.add("operate");

    // 修改
    var editDiv = document.createElement("div");
    editDiv.classList.add("edit");
    editDiv.setAttribute("onclick", "edit_this(" + c_cid[index] + ")");
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
    deleteDiv.setAttribute("onclick", "delete_this(" + c_cid[index] + ")");
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
    var rightDownContainer = document.querySelector(".right_down3");

    // 添加 problemBlock 到 right_down 元素中
    if (rightDownContainer) {
        rightDownContainer.appendChild(problemBlock);
    } else {
        console.error("未找到 right_down 容器元素。");
    }
}



