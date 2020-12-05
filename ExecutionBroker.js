const EventEmitter = require("events");
const RemoteClass = require("./RemoteClass");


class ExecutionBroker extends RemoteClass {
    constructor(options = {}) {
        super(options.timeout);
        this._options = options;
        this._annoncedMethods = {};
    }

    /**
     * Представляет метод
     * @param namespace
     * @param method
     * @param func
     */
    annonceMethod(namespace, method, func) {
        if(!this._annoncedMethods[namespace]) {
            this._annoncedMethods[namespace] = {};
        }
        this._annoncedMethods[namespace][method] = func;
    }

    /**
     * Вызов метода по namespace
     * @param namespace
     * @param method
     * @param params
     * @returns {Promise<*>}
     */
    async callMethod(namespace, method, params) {
        if(this._annoncedMethods[namespace][method]) {
            return await this._annoncedMethods[namespace][method](...params);
        }
        return await super.callMethod(namespace, method, params);
    }

    /**
     * Узнать все неймспейсы
     * @returns {string[]}
     */
    getNamespaces() {
        return Object.keys(this._annoncedMethods);
    }


}

module.exports = ExecutionBroker;