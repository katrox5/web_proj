document.addEventListener('DOMContentLoaded', function () {
    // 获取问题元素
    var doneProblem = document.querySelector('.done_problem');
    var draftProblem = document.querySelector('.draft_problem');

    // 获取类型选择元素
    var typeChoose1 = document.querySelector('.type_choose_1');
    var typeChoose2 = document.querySelector('.type_choose_2');

    // 初始状态显示 done_problem 或 draft_problem，取决于当前页面类型
    if (window.location.href.includes('type=1')) {
        doneProblem.style.display = 'flex';
        draftProblem.style.display = 'none';
    } else if (window.location.href.includes('type=2')) {
        doneProblem.style.display = 'none';
        draftProblem.style.display = 'flex';
    }

    // 添加点击事件监听器
    typeChoose1.addEventListener('click', function () {
        doneProblem.style.display = 'flex';
        draftProblem.style.display = 'none';
    });

    typeChoose2.addEventListener('click', function () {
        doneProblem.style.display = 'none';
        draftProblem.style.display = 'flex';
    });
});
