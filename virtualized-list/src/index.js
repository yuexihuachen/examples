const throttle = (fn, delay) => {
    let timer = null;
    return (...args) => {
        if (timer) return;
        timer = setTimeout(() => {
            fn(args);
            timer = null;
        }, delay)
    }
}
const run = () => {
    console.log('节流')
}

const mockFn = throttle(run, 1000)
// 模拟频繁调用
setInterval(mockFn, 10);


