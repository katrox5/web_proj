document.addEventListener('DOMContentLoaded', function () {
    const textarea = document.getElementById('question-text');

    // 构造敏感词map，手动构建
    const sensitiveWordList = ['毛泽东', '习近平', '赌博', '黑话' , '狗粉丝','fuck','TMD','公安','大麻',
        '色情','暴力','粪便','政治','蒋中国','法轮功','遗言','台湾共和国','团中央','神经病','死人','文革','诈骗',
        '日本帝国','总书记','性交','放屁','滚蛋','查封','近亲相奸','身份证','激情电影在线观看','私人服务器',

    ];
    const sensitiveMap = makeSensitiveMap(sensitiveWordList);

    textarea.addEventListener('input', function () {
        const inputValue = textarea.value;
        const filterResult = filterSensitiveWord(inputValue, sensitiveMap);

        if (filterResult.flag) {
            new Message().show(
                {
                    type:'error',
                    text:'存在敏感词，请删除后再输入',
                    duration:1500,
                    closeable:true
                });
            // 禁止用户继续输入
            textarea.value = textarea.value.replace(new RegExp(filterResult.sensitiveWord, 'g'), '');
        }
    });

    /**
     * 构造敏感词map
     * 将敏感词转换成树结构，节点+状态标识，判断是否最后，每条链路必须要有个终点节点
     */
    function makeSensitiveMap(sensitiveWordList) {
        const result = new Map();
        for (const word of sensitiveWordList) {
            let map = result;
            for (let i = 0; i < word.length; i++) {
                const char = word.charAt(i);
                if (map.get(char)) {
                    map = map.get(char);
                } else {
                    if (map.get('laster') === true) {
                        map.set('laster', false);
                    }
                    const item = new Map();
                    item.set('laster', true);
                    map.set(char, item);
                    map = map.get(char);
                }
            }
        }
        return result;
    }

    /**
     * 检查敏感词是否存在
     * 从头开始找，找到结尾节点则匹配成功了，反之继续匹配
     */
    function checkSensitiveWord(sensitiveMap, txt, index) {
        let currentMap = sensitiveMap;
        let flag = false;
        let wordNum = 0;
        let sensitiveWord = '';
        for (let i = index; i < txt.length; i++) {
            const word = txt.charAt(i);
            currentMap = currentMap.get(word);
            if (currentMap) {
                wordNum++;
                sensitiveWord += word;
                if (currentMap.get('laster') === true) {
                    flag = true;
                    break;
                }
            } else {
                break;
            }
        }
        if (wordNum < 2) {
            flag = false;
        }
        return { flag, sensitiveWord };
    }

    /**
     * 判断文本中是否存在敏感词
     */
    function filterSensitiveWord(txt, sensitiveMap) {
        let matchResult = { flag: false, sensitiveWord: '' };
        //正则非中文、数字和英文字符去除
        const txtTrim = txt.replace(/[^\u4e00-\u9fa5\u0030-\u0039\u0061-\u007a\u0041-\u005a]+/g, '');
        for (let i = 0; i < txtTrim.length; i++) {
            matchResult = checkSensitiveWord(sensitiveMap, txtTrim, i);
            if (matchResult.flag) {
                console.log(`sensitiveWord:${matchResult.sensitiveWord}`);
                break;
            }
        }
        return matchResult;
    }
});
