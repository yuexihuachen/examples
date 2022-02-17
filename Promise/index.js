// // # 基础版本 
// function Promise(fn){
//   let callbacks = [] //callbacks任务队列中的回调一一执行；

//   this.then = function(onFulfilled){// microtask queue
//     callbacks.push(onFulfilled)
//   }

//   function resolve(value){ //wait macrotask 执行（在microtask之后）
//     callbacks.forEach(fn => fn(value));
//   }

//   fn(resolve)
// }

// /**
//  * 1. 传递一个函数Fn作为构造函数Promise的参数
//  * 2. 构造函数Promise把内部私有函数resolve作为参数函数Fn的参数
//  * 3. resolve接收一个参数value，代表异步操作返回的结果，当下一个macrotask执行成功后
//  * 4. 调用resolve方法，执行callbacks任务队列中的回调一一执行
//  */
// let promise = new Promise(function(resolve){
//   setTimeout(() => { // macrotask queue
//     resolve('complete')
//   }, 2000)
// })

// /**
//  * microtask queue
//  * 1. then方法在callback任务队列添加一个onFulfilled的任务
//  */
// promise.then(response => {
//   console.log(response) // complete
// })

// promise.then(response => {
//   console.log(response) // complete
// })

// // # 链式调用（伪链式，每次返回结果相同） + 延迟机制
// /**
//  * 延迟机制: 保证resolve函数(同步或者异步)执行前，then函数完成callbacks任务队列的注册
//  */
// function Promise(fn){
//   let callbacks = [] //callbacks任务队列中的回调一一执行；

//   this.then = function(onFulfilled){// microtask queue
//     callbacks.push(onFulfilled)
//     return this // 链式调用 返回当前的对象
//   }

//   function resolve(value){ //wait macrotask 执行（在microtask之后）
//     setTimeout(() => { // macrotask queue 延迟机制，保证callbacks任务队列不为空
//       callbacks.forEach(fn => fn(value));
//     },0)
//   }

//   fn(resolve)
// }

// let p1 = new Promise(function(resolve){
//     resolve('complete p1')
// }).then(data => console.log(data))
// .then(data => console.log(data))
// .then(data => console.log(data))

// // # 增加状态
// /**
//  * 通过状态控制延迟机制
//  * 三种状态: pending fulfilled rejected
//  *    pending可以转成fulfilled或rejected其中一个，切只能转化一次
//  */
// function Promise(fn){
//   let state = "pending" // 状态
//   let value = null  // 结果
//   let callbacks = [] //callbacks任务队列中的回调一一执行；

//   this.then = function(onFulfilled){// microtask queue
//     if (state === "pending") { 
//       // 如果resolve被包含在一个macrotask里面,在resolve之前执行，添加到callbacks任务队列添加一个onFulfilled的任务
//       callbacks.push(onFulfilled)
//     } else {
//       // 同步，如果resolve是一个同步函数，在resolve之后执行，直接调用onFulfilled函数，返回结果
//       onFulfilled(value)
//     }
//     return this // 链式调用 返回当前的对象
//   }

//   function resolve(result){ //wait macrotask 执行（在microtask之后）
//     state = "fulfilled"; // 改变状态
//     value = result; // 保存结果
//     callbacks.forEach(fn => fn(result));
//   }

//   fn(resolve)
// }

// let p2 = new Promise(function(resolve){
//     resolve('complete p1')
// }).then(data => console.log(data))
// .then(data => console.log(data))
// .then(data => console.log(data))

// # 真正的链式调用
function Promise(fn){
  let state = "pending",
    value = null,
    callbacks =[];

  this.then = function(onFulfilled){
    // 串行Promise的基础，是实现真正链式调用的根本
    // 这是衔接当前 Promise 和后邻 Promise 的关键所在
    // 返回的promise实例的resolve和then方法返回的promise实例onFulfilled方法一致
    return new Promise(function(resolve, reject){
      handler({
        onFulfilled,
        resolve
      })
    })
  }

  function handler(callback){
    if (state === 'pending') {
      callbacks.push(callback)
      return
    } 
    //如果then中没有传递任何东西
    if (!callback.onFulfilled) {
      callback.resolve(value)
      return
    }

    let ret = callback.onFulfilled(value)
    callback.resolve(ret)
  }

  // 考虑都是then onFulfilled 返回值是 value 的情况
  function resolve(result){
    if (result && ['function','object'].includes(typeof result)) {
      let then = result.then
      if (typeof then === 'function') {
        then.call(result, resolve.bind(this))
        return
      }
    }
    state = 'fulfilled';//改变状态
    value = result;//保存结果
    callbacks.forEach(callback => handler(callback));
  }

  fn(resolve)

}

Promise.resolve = function(value){
  if (value && typeof value === 'object' && value instanceof Promise) {
    return value
  }
  return new Promise(resolve => resolve(value))
}

Promise.all = function(promises){
  return new Promise(function(rs) {
    let count = 0;
    let result = [];
    let len = promises.length
    promises.forEach((p,i)=>{
      Promise.resolve(p).then(res => {
        count+=1;
        result[i] = res;
        if (len === count) {
          rs(result)
        }
      })
    })
  })
}

Promise.any = function(promises){
  return new Promise(function(rs) {
    let count = 0;
    let len = promises.length
    promises.forEach((p,i)=>{
      Promise.resolve(p).then(res => {
        rs(res)
      })
    })
  })
}

let p1 = function(){
  return new Promise(function(resolve){
    setTimeout(() => {
      resolve('p1')
    })
  })
}

let p2 = function(){
  return new Promise(function(resolve){
    setTimeout(() => {
      resolve('p2')
    })
  })
}

let p3 = function(){
  return new Promise(function(resolve){
    setTimeout(()=>{
      resolve('p3')
    })
  })
}

// 上一级 then onFulfilled return 的值，会变成下一级 onFulfilled 的结果
let p6 = new Promise(function(resolve){
    resolve('complete p1')
}).then(data => {
  console.log(data)
  return p1()
})
.then(data => {
  console.log(data)
  return p2()
})
.then(data => {
  console.log(data)
  return p3()
})
.then(data => console.log(data))

Promise.all([p1(),p2()]).then(data => console.log(data))

