/**
 * Created by gunjoe on 2017/2/17.
 */
//自定义先订阅再发布
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

//自定义先发布，再订阅
let releaseEvent = (function () {
    let releaseList = {},
        trigger,
        listen,
        removeRelease;

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

    listen = function (evt,fn) {
        let arg = releaseList[evt];
        if ( !arg || arg.length ===0 ) {
            return false;
        }
        //执行注册的函数并将evt中的参数传入
        fn.apply(this,arg);
    };

    removeRelease = function (evt) {
        delete releaseList[evt];
    };

    return {
        trigger:trigger,
        listen:listen,
        removeRelease:removeRelease
    }
})();

// //测试用

// releaseEvent.trigger("ajax","消息");
// releaseEvent.trigger("ajax","覆盖前面的消息");
// setTimeout(function () {
//     releaseEvent.listen("ajax",function () {
//         console.log(arguments);
//     })
// },3000);

// releaseEvent.trigger("ajax","{'status':'true'}","params2");
//
// setTimeout(function () {
//     releaseEvent.listen("ajax",function () {
//         let arr = [];
//         for (let i = 0,l = arguments.length; i < l; i++ ) {
//             arr.push(arguments[i]);
//         }
//         console.log(arr[0]);
//         console.log(arr[1]);
//     })
// },2000);
//
// // releaseEvent.removeRelease("ajax");
//
// setTimeout(function () {
//     releaseEvent.listen("ajax",function () {
//         let arr = [];
//         for (let i = 0,l = arguments.length; i < l; i++ ) {
//             arr.push(arguments[i]);
//         }
//         console.log(arr[1]);
//         console.log(arr[0]);
//     });
// },3000);








