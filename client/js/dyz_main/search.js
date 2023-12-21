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