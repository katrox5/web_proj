var allnews = [
  "小米新旗舰发布", "MIUI更新惊喜", "米粉独家福利", "小米科技大会", "小米超级充电",
  "骁龙芯片搭载", "小米家居新品", "小米AI助手升级", "小米电视全新系列", "小米路由器新功能",
  "米家智能家居", "小米CC系列亮相", "骁龙888手机发布", "MIUI稳定版推送", "小米VR眼镜上市",
  "小米手表新品", "小米生态链更新", "小米汽车计划", "MIUI新功能揭秘", "小米摄像头升级",
  "小米手机液冷散热", "小米无线充电宝", "小米智能音响", "小米折叠屏手机", "MIUI系统优化",
  "小米电视迎新", "小米耳机新品", "小米智能灯泡", "小米手环最新版", "小米盒子全新升级",
  "小米商城大促销", "小米快充技术", "小米笔记本新款", "小米无人机发布", "小米智能门锁",
  "MIUI安全更新", "小米电动车计划", "小米空调新品", "米家扫地机器人", "小米电视音响",
  "MIUI全新设计", "小米体感游戏", "小米智能手表", "小米AI翻译器", "小米高速充电",
  "小米助手AI语音", "MIUI稳定版发布", "小米水滴屏手机", "小米家电生态链", "小米智慧城市计划"
];

var news_index = [0, 1, 2, 3, 4, 5];
var bottom = [0,"-100px","-200px","-175px","-100px","-140px","-170px","-130px"];
function change_news() {
	
	var strips = [];
	for(var i = 1;i<=7;++i)
	{
		strips[i] = document.querySelector('.s'+i);
		//bottom[i] = window.getComputedStyle(strips[i]).bottom;
		strips[i].style.bottom = "1200px";
	}
	setTimeout(function(){
		var newsInputs = document.querySelectorAll('.news');
		var max_num = allnews.length;
		var max_length = news_index.length;
		// 生成包含0到n-1的所有索引的数组
		const allIndices = Array.from({
			length: max_num
		}, (_, index) => index);
		
		// 随机打乱数组
		for (let i = max_num - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[allIndices[i], allIndices[j]] = [allIndices[j], allIndices[i]];
		}
		// 截取前x个索引
		const result = allIndices.slice(0, max_length);
		var new_news = [];
		for(var i = 0;i<max_length;++i)
		{
			new_news[i] = allnews[result[i]];
		}
		newsInputs.forEach(function(input, index) {
		        // 修改值为新的文本
		        input.value = new_news[index];
		});
		setTimeout(function(){
			for(var i = 1;i<=7;++i)
			{
				strips[i].style.transition = "bottom 0s ease-in-out";
				strips[i].style.bottom = bottom[i];
			}
			setTimeout(function(){
				for(var i = 1;i<=7;++i)
				{
					strips[i].style.transition = "bottom 1s ease-in-out";
				}
			},100)
		},500)
		
	},500);
	
}
