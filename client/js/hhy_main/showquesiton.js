    // 动态生成的样例数据
    const problemsData = [
        {
            imgSrc: "../../img/hhy_main/udefine_pic.jpg",
            startText: "这是我的手机",
            time: "2023-12-21 21:00:32",
            status: "已上线"
        },
        // 添加更多数据
    ];

    // 生成单个问题元素的函数
    function generateProblemElement(data) {
        const problemElement = document.createElement('div');
        problemElement.classList.add('problem', 'done_problem');

        // 问题配图
        const picDiv = document.createElement('div');
        picDiv.classList.add('pic');
        const imgElement = document.createElement('img');
        imgElement.src = data.imgSrc;
        picDiv.appendChild(imgElement);

        // 问题信息
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');

        // 文章开头
        const startDiv = document.createElement('div');
        startDiv.classList.add('start');
        startDiv.textContent = data.startText;

        // 发布时间
        const timeDiv = document.createElement('div');
        timeDiv.classList.add('time');
        timeDiv.textContent = data.time;

        // 状态
        const statusDiv = document.createElement('div');
        statusDiv.classList.add('status', 'status_1');
        statusDiv.textContent = data.status;

        messageDiv.appendChild(startDiv);
        messageDiv.appendChild(timeDiv);
        messageDiv.appendChild(statusDiv);

        // 操作按钮
        const operateDiv = document.createElement('div');
        operateDiv.classList.add('operate');
        const editButton = document.createElement('button');
        editButton.classList.add('edit');
        editButton.textContent = '修改';
        editButton.onclick = edit;

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete');
        deleteButton.textContent = '删除';
        deleteButton.onclick = del;

        operateDiv.appendChild(editButton);
        operateDiv.appendChild(deleteButton);

        // 组装问题元素
        problemElement.appendChild(picDiv);
        problemElement.appendChild(messageDiv);
        problemElement.appendChild(operateDiv);

        return problemElement;
    }

    // 样例编辑和删除函数
    function edit() {
        console.log('点击了编辑按钮');
    }

    function del() {
        console.log('点击了删除按钮');
    }

    // 生成所有问题的函数
    function generateProblems() {
        const problemsContainer = document.getElementById('problems-container');

        problemsData.forEach(data => {
            const problemElement = generateProblemElement(data);
            problemsContainer.appendChild(problemElement);
        });
    }

    // 页面加载时调用生成问题的函数
    window.onload = generateProblems;