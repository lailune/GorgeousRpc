const AsyncRPC = require('./RemoteClass');

const LocalClass = require('./LocalClass');
const RPCInterface = require('./RPCInterface');
const ExecutionBroker = require('./ExecutionBroker');

(async () => {

    /* let rpc = new AsyncRPC(5000);

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
     }, 1000)*/

    /*let TestClass = new (class Test extends LocalClass {
        testMethod(a, b) {
            console.log('CALLED TEST METHOD', a, b);
            return a + b;
        }
    });*/

    let broker = new ExecutionBroker();

    broker.annonceMethod(false, 'test', async (a, b) => {
        return 'Hello' + (a + b);
    });

    broker.on('call', (methodCall) => {
        console.log(methodCall);
        setTimeout(() => {
            broker.resolveCallback(methodCall.callId, null, 'HELLO HELLO ' + methodCall.params.join(','))
        }, 3000)
    })

    console.log(await broker.callMethod(false, 'test', [1, 2]));
    console.log(await broker.callMethod(false, 'test2', [1, 2]));


})()