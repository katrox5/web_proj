uploadPicture();
setPictureDraggable();
window.onload = updata_loc;
function updata_loc(){
    var loc_text = localStorage.getItem('drafttext');
    var loc_img = JSON.parse(localStorage.getItem("draftimage"));
    var area = document.getElementById('question-text');
    area.value = "";
    const list = $('image-preview-container');
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    if(loc_text!=null)
    {
        area.value += loc_text;
    }
    if(loc_img!=null)
    {
        
        for (var i = 0; i < loc_img.length; i++) {
            var img = document.createElement('img');
            img.src = loc_img[i];
            img.classList.add('list-item');
            // 找到字符串 b 在字符串 a 中的位置
            var b = media_path+"question/";
            var index = loc_img[i].indexOf(b);
			console.log(loc_img[i]);
			console.log(b);
            var result;
            // 提取 a 的后半部分
            if (index !== -1) {
                result = loc_img[i].substring(index + b.length); 
            }else {
            }
			
			console.log(result);
            img.classList.add(result);
            img.classList.add('new');           // 用于标识
            img.id = list.childNodes.length - 1;
            img.draggable = 'true';
            img.onclick = (e) => displayImg(e.target);
            list.insertBefore(img, $('list-add'));
        }
    }
    setPictureDraggable();
}

function add_to_loc() {
    // 获取问题描述文本
    var drafttext = document.getElementById("question-text").value;

    // 获取预览图片的URL数组
    var draftimage = saveImgsdraft();

    //获取时间

    // 检查问题文本和图片是否为空
    if (drafttext.trim() === "" && draftimage.length === 0) {
        // 显示错误消息
        new Message().show(
            {
                type: 'error',
                text: '草稿不能为空！',
                duration: 1500,
                closeable: true
            });
        return; // 停止继续执行
    }

    // // 获取现有数据或初始化空数组
    // var storeText = localStorage.getItem("drafttext");
    // var storeImage = JSON.parse(localStorage.getItem("draftimage"));

    // // 将新数据添加到数组
    // storeText.push(drafttext);
    // storeImage.push(draftimage);

    // 将更新后的数组重新存储到本地存储中
    localStorage.setItem("drafttext", drafttext);
	console.log(draftimage);
    localStorage.setItem("draftimage", JSON.stringify(draftimage));

    // 显示成功消息
    new Message().show(
        {
            type: 'success',
            text: '草稿保存成功！',
            duration: 1500,
            closeable: true
        });
        
}
// D:\学习资料\大三上\基于web的编程\期末大作业\code\web_proj\client\img\media\question
// 从容器中获取图片URL的函数
function saveImgsdraft() {//保存
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

//保存草稿
function save_draft(){

    var image =  saveImgs();
    var text = document.getElementById('question-text').value;
    localStorage.setItem("drafttext",text);
    // 存储数组
	console.log(image);
	var temp_image = [];
	for(var i = 0;i<image.length;++i)
	temp_image[i] = image[i][0];
    localStorage.setItem("draftimage", JSON.stringify(temp_image));

        // 显示成功消息
        new Message().show(
            {
                type: 'success',
                text: '草稿保存成功！',
                duration: 1500,
                closeable: true
            });
}



function uploadPicture() {// 预览
    $('image-upload').addEventListener('change', function() {
        const list = $('image-preview-container');
        const { files } = this;
        for (var i = 0; i < files.length; i++) {
            if (list.childNodes.length >= 9) {
                new Message().show({
                    type: 'error',
                    text: '最多只能上传9张照片！',
                    closeable: true
                });
                break;
            }
            var img = document.createElement('img');
            img.src = URL.createObjectURL(this.files[i]);
            img.classList.add('list-item');
            img.classList.add(this.files[i].name);
            img.id = list.childNodes.length - 1;
            img.draggable = 'true';
            img.onclick = (e) => displayImg(e.target);
            list.insertBefore(img, $('list-add'));
        }
    });
}

function displayImg(target) {
    let img = new Image(target);

    let btn_container = document.createElement('div');
    btn_container.className = 'btn-container';
    let del_btn = document.createElement('h1');
    del_btn.innerText = '删除';
    del_btn.className = 'del-btn';
    del_btn.onclick = () => {
         btn_container.remove();
         target.remove();
         img.close();
    }

    let sep = document.createElement('hr');

    let cel_btn = document.createElement('h1');
    cel_btn.innerText = '取消';
    cel_btn.className = 'cel-btn';
    cel_btn.onclick = () => btn_container.remove();

    btn_container.appendChild(del_btn);
    btn_container.appendChild(sep);
    btn_container.appendChild(cel_btn);
    img.setFunction(function() {
        document.body.appendChild(btn_container);
    });
    img.onclose = () => {
        btn_container.remove();
    };
    img.display();
}

function setPictureDraggable() {
    const list = $('image-preview-container');
    let sourceNode;         // 用于存储拖拽目标元素
    list.ondragstart = function(e) {
        // 在拖拽开始时，将目标元素设置为拖拽目标，并在稍后隐藏原位置上的图片
        setTimeout(() => {
            e.target.classList.add('moving');
        }, 0);
        sourceNode = e.target;          // 设置拖拽目标元素
    };
    list.ondragenter = function(e) {
        // 当拖拽元素进入容器时，根据拖拽的位置重新排列元素
        if (e.target === list || e.target === sourceNode)
            return;                     // 排除自身和父元素

        const children = Array.from(list.children);
        const sourceIndex = children.indexOf(sourceNode);
        const targetIndex = children.indexOf(e.target);

        if (sourceIndex < targetIndex)  // 往下拖动
            list.insertBefore(sourceNode, e.target.nextElementSibling);
        else                            // 往上拖动
            list.insertBefore(sourceNode, e.target);
    };
    // 释放，该图片重新display
    list.ondragend = (e) => e.target.classList.remove('moving');
}
function $(id)
{
    return document.getElementById(id);
}


