 function handleKeyPress(event) {
      // 检测是否按下回车键
      if (event.key === 'Enter') {
        // 阻止默认的回车键行为（例如提交表单）
        event.preventDefault();
        // 执行搜索事件
        performSearch();
      }
    }
	
function performSearch(){
	
	nickname[0] = "dyz";
	var key_word = document.querySelector(".search-input").value.toLowerCase();
	if(!key_word)
		return ;
	//const searchResults = data.filter(item => item.toLowerCase().includes(key_word));//模糊搜索
	addcomment(0);
}

function get_hot_search(){
	// 随机选出一个字符串
	let randomIndex = Math.floor(Math.random() * text_content.length);
	let selectedString = text_content[randomIndex];
	
	// 检查 selectedString 是否是字符串
	if (typeof selectedString === 'string') {
	    let result = selectedString.split(',')[0].trim().substring(0, 10);
	    console.log(result);
		var inputElement = document.querySelector('.hot-search');
		inputElement.placeholder = "大家都在搜："+result;
		localStorage.setItem('hot-search',result);
	} else {
	    console.error("selectedString 不是一个字符串。");
	}

}