###订阅发布模式(自定义事件)

订阅发布模式这种东西，其实在js中是很常见啊，其实就是事件机制设计的思想，通过注册回调函数，在未来事件触发
之后调用该回调函数，进而处理一些数据。

如下是一个简单的点击事件：

```js

btn.addEventListener("click",function (){
    //todo...
});

```

通过浏览器这个媒介去触发js中的click事件，之后调用我们事先注册好的回调函数,这就是一种典型的订阅-发布事件，
在我的代码中实现了订阅发布这种模式的自定义事件：

```js

let Event = (function () {
    /**
     * clientList = {
     *      evt:[fn1,fn2,...]
     * }
    * */
    let clientList = {},
        listen,
        trigger,
        remove;

    listen = function ( evt, fn ) {
        //其中的fn需要为一个函数名，不然无法删除
        //判断是否存在该事件，然后将对应注册函数丢进数组中
        if ( !clientList[evt] ){
            clientList[evt] = [];
        }
        clientList[evt].push(fn);
    };

    trigger = function () {
        //去掉arguments的第一个参数，剩余的参数传入fn当中进行执行
        let evt = Array.prototype.shift.call(arguments);
        let fns = clientList[evt];
        if ( !fns || fns.length === 0 ) {
            return false;
        }
        for ( let i = 0, fn; fn = fns[ i++ ]; ) {
            fn.apply(this,arguments);
        }
    };

    remove = function ( evt, fn ) {
        let fns = clientList[evt];
        if ( !fns || fns === 0 ) {
            return false;
        }
        for ( let i = 0,l = fns.length; i < l; i++ ) {
            if ( fn === fns[i] ) {
                //删除该事件注册的fn(函数名，函数本身无法删除)
                clientList[evt].splice( i, 1 );
            }
        }
    };

    return {
        listen:listen,
        trigger:trigger,
        remove:remove
    }
})();

```
上面的Event对象可以自定义某些事件，通过trigger方法手动触发。

先订阅，再发布，这是一种很常见的情形，那么如果我们有需要先发布，再订阅呢？比如我先登录，这之后再进行
注册回调，操作登录后获得的数据。

根据需求，我自己撸了一个发布-订阅对象：

```js

trigger = function () {
        //获取evt事件
        let evt = Array.prototype.shift.call(arguments);
        let arg = releaseList[evt];
        if ( !arg ) {
            let arr = [];
            //循环取出arguments内的参数
            for (let i = 0,l = arguments.length; i < l; i++ ) {
                arr.push(arguments[i]);
            }
            releaseList[evt] = arr;
            return true;
        }
        else {
            //如果想重新发布新的消息，本身事件内的evt存在，
            // 则给一个空数组再递归进行一次触发，将arguments再次传入
            delete releaseList[evt];
            trigger.call(this,evt,arguments);
        }
    };

```

上面是一个发布消息的方法，如果想要覆盖相同事件的消息，则内部将会删除原来的发布消息，再进行一次递归
重新发布消息

```js

listen = function (evt,fn) {
        let arg = releaseList[evt];
        if ( !arg || arg.length ===0 ) {
            return false;
        }
        //执行注册的函数并将evt中的参数传入
        fn.apply(this,arg);
    };

```

当listen手动触发时，查询是否发布了消息，然后再执行传入的fn进行数据的操作
移除发布消息则不再赘述，可查看代码。


