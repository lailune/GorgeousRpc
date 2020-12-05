const EventEmitter = require("events");

const {ERROR_TIMEOUT} = require('./Errors')

/**
 * Класс асинхронного вызова методов, где требуется ожидание результата
 */
class RemoteClass extends EventEmitter {
    constructor(timeout = 30000) {

        super();

        this._timeout = timeout;
        this._callHeap = {};
        this._callHeapIds = [];
    }

    /**
     * Получение кучи вызовов по namespace
     * @param {string} namespace
     * @returns {{}}
     */
    getCallHeap(namespace = false) {
        if(!namespace || namespace === '') {
            return this._callHeap;
        }

        let namespacedHeap = {};

        for (let callId of this._callHeapIds) {
            if(this._callHeap[callId].namespace === namespace) {
                namespacedHeap[callId] = this._callHeap[callId];
            }
        }

        return namespacedHeap;
    }

    /**
     * Вызвать метод с таймаутом
     * @param {string} namespace
     * @param {string} method
     * @param {object|array} params
     * @returns {Promise<*>}
     */
    callMethod(namespace, method, params) {
        let callId = String(Math.round(Math.random() * 10000000)) + String(Math.round(Math.random() * 10000000));
        let that = this;
        return new Promise(((resolve, reject) => {
            this._callHeapIds.push(callId);
            this._callHeap[callId] = {
                namespace,
                method,
                params,
                callId,
                callback: (error, result) => {
                    this.cancel(callId);

                    if(error) {
                        return reject(error);
                    }

                    resolve(result);
                }
            }

            this._callHeap[callId].timeoutTimer = setTimeout(() => {
                this.emit('timeout', this._callHeap[callId]);
                this._callHeap[callId].callback(ERROR_TIMEOUT);
            }, this._timeout);

            this.emit('call', this._callHeap[callId]);

        }));
    }

    /**
     * Отменить вызов
     * @param {string} callId
     */
    cancel(callId) {
        clearTimeout(this._callHeap[callId].timeoutTimer);
        delete this._callHeap[callId];
        this._callHeapIds = this._callHeapIds.filter((aCallId) => aCallId !== callId);
    }


    /**
     * Выполнить ожидающий метод
     * @param callId
     * @param error
     * @param result
     * @returns {Promise<void>}
     */
    async resolveCallback(callId, error, result){
       return await (this._callHeap[callId].callback(error, result));
    }
}

module.exports = RemoteClass;