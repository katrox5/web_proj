    // 删除本地数据库的函数
    function delloc() {
        try {
            // 从 localStorage 中删除 commentId
            localStorage.removeItem('commentId');
            console.log('删除成功');
        } catch (error) {
            console.error('删除失败', error);
        }
    }