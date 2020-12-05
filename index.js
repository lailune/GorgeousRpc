const AsyncRPC = require('./AsyncRPC');

(async () => {

    let rpc = new AsyncRPC(5000);

     rpc.on('call', (method) => {
         //console.log(method);
         setTimeout(() => {
             method.callback(null, 123);
         }, 3000)
     })


    rpc.callMethod('test', 'testMethod', [1, 2, 3]);
    rpc.callMethod('test2', 'testMethod', [1, 2, 3]);

    setInterval(()=>{  console.log(rpc._callHeapIds);
        rpc.callMethod('test2', 'testMethod', [1, 2, 3]);
    }, 1000)

})()