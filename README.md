#���ķ���ģʽ(�Զ����¼�)

���ķ���ģʽ���ֶ�������ʵ��js���Ǻܳ���������ʵ�����¼�������Ƶ�˼�룬ͨ��ע��ص���������δ���¼�����
֮����øûص���������������һЩ���ݡ�

������һ���򵥵ĵ���¼���

```js

btn.addEventListener("click",function (){
    //todo...
});

```

ͨ����������ý��ȡ����js�е�click�¼���֮�������������ע��õĻص�����,�����һ�ֵ��͵Ķ���-�����¼���
���ҵĴ�����һ�����ַ�ʽʵ�ֵ��Զ����¼��Ķ���

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
        //���е�fn��ҪΪһ������������Ȼ�޷�ɾ��
        //�ж��Ƿ���ڸ��¼���Ȼ�󽫶�Ӧע�ắ������������
        if ( !clientList[evt] ){
            clientList[evt] = [];
        }
        clientList[evt].push(fn);
    };

    trigger = function () {
        //ȥ��arguments�ĵ�һ��������ʣ��Ĳ�������fn���н���ִ��
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
                //ɾ�����¼�ע���fn(�����������������޷�ɾ��)
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
�����Event��������Զ���ĳЩ�¼���ͨ��trigger�����ֶ�������

�ȶ��ģ��ٷ���������һ�ֺܳ��������Σ���ô�����������Ҫ�ȷ������ٶ����أ��������ȵ�¼����֮���ٽ���
ע��ص���������¼���õ����ݡ�

�����������Լ�ߣ��һ������-���Ķ���

```js

trigger = function () {
        //��ȡevt�¼�
        let evt = Array.prototype.shift.call(arguments);
        let arg = releaseList[evt];
        if ( !arg ) {
            let arr = [];
            //ѭ��ȡ��arguments�ڵĲ���
            for (let i = 0,l = arguments.length; i < l; i++ ) {
                arr.push(arguments[i]);
            }
            releaseList[evt] = arr;
            return true;
        }
        else {
            //��������·����µ���Ϣ�������¼��ڵ�evt���ڣ�
            // ���һ���������ٵݹ����һ�δ�������arguments�ٴδ���
            delete releaseList[evt];
            trigger.call(this,evt,arguments);
        }
    };

```

������һ��������Ϣ�ķ����������Ҫ������ͬ�¼�����Ϣ�����ڲ�����ɾ��ԭ���ķ�����Ϣ���ٽ���һ�εݹ�
���·�����Ϣ

```js

listen = function (evt,fn) {
        let arg = releaseList[evt];
        if ( !arg || arg.length ===0 ) {
            return false;
        }
        //ִ��ע��ĺ�������evt�еĲ�������
        fn.apply(this,arg);
    };

```

��listen�ֶ�����ʱ����ѯ�Ƿ񷢲�����Ϣ��Ȼ����ִ�д����fn�������ݵĲ���
�Ƴ�������Ϣ����׸�����ɲ鿴���롣


