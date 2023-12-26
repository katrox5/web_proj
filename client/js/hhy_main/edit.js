function delete_this(index){
    var c_id = c_cid[index];
    delete_db(c_id);//发送删除请求
    // 获取带有指定类名的元素
    var elementToRemove = document.querySelector('.problem.comment' + index);

    // 检查元素是否存在
    if (elementToRemove) {
        // 从其父元素中移除该元素
        elementToRemove.parentNode.removeChild(elementToRemove);
    } else {
        console.log('Element not found');
    }

}

function edit_this(index){
    var c_id = c_cid[index];
    delete_db(c_id);
    var elementToRemove = document.querySelector('.problem.comment' + index);
    // 检查元素是否存在
    if (elementToRemove) {
        // 从其父元素中移除该元素
        elementToRemove.parentNode.removeChild(elementToRemove);
    } else {
        console.log('Element not found');
    }
    localStorage.setItem("drafttext",c_text[index]);
    // 存储数组
    localStorage.setItem("draftimage", JSON.stringify(c_all_img_url[index]));

    updata_loc();
    changeBox('type1');
}