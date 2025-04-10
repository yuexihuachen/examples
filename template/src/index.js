window.addEventListener("popstate", (event) => {
    console.log(`位置：${document.location}，状态：${JSON.stringify(event.state)}`);
});
// pushState和replaceState被调用时，是不会触发 popstate 事件的
// 向浏览器的会话历史栈增加了一个条目。
history.pushState({ page: 1 }, "标题 1", "?page=1");
// 向浏览器的会话历史栈增加了一个条目。
history.pushState({ page: 2 }, "标题 2", "?page=2");
// 更新浏览器的会话历史栈最新的一个条目。
history.replaceState({ page: 3 }, "标题 3", "?page=3");
history.pushState({ page: 6 }, "标题 6", "?page=6");
// 浏览器会话历史存在两条记录
console.log(history.length)
// 下面三个实力方法会触发 popstate 事件
history.back(); 
history.back(); 
history.forward()
history.go(2)