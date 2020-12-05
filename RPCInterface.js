const EventEmitter = require("events");

const RemoteClass = require('./RemoteClass');

class RPCInterface extends EventEmitter {
    constructor(options = {}) {
        super();
        this._options = {};
        this._localClasses = {};
        this._remoteClasses = {};
        this._namespaces = [];

    }

    /**
     * Создать класс-обертку для удаленного вызова
     * @param annotationClass
     * @param name
     * @private
     */
    _createRemoteClass(annotationClass, name) {
        let remoteClass = new RemoteClass(this._options.timeout);

        remoteClass.on('timeout', (method) => {
            this.emit('timeout', {remoteClass, method});
        })

        remoteClass.on('call', (method) => {
            this.emit('call', {remoteClass, method});
        })

        for (let method of annotationClass.getMethods()) {
            remoteClass[method] = async function () {
                return await this.callMethod(annotationClass.getNamespace(), method, ...arguments);
            }
        }

        if(!this._remoteClasses[annotationClass.getNamespace()]) {
            this._remoteClasses[annotationClass.getNamespace()] = {};
        }

        this._remoteClasses[annotationClass.getNamespace()][name] = remoteClass;
    }

    /**
     * Аннонсировать новый класс
     * @param annotationClass
     * @param name
     */
    annonceClass(annotationClass, name) {
        if(!this._namespaces.includes(annotationClass.getNamespace())) {
            this._namespaces.push(annotationClass.getNamespace());
        }

        if(!this._localClasses[annotationClass.getNamespace()]) {
            this._localClasses[annotationClass.getNamespace()] = {};
        }

        this._localClasses[annotationClass.getNamespace()][name] = annotationClass;

        this._createRemoteClass(annotationClass, name);
    }

    /**
     * Получить удаленный класс
     * @param namespace
     * @param name
     * @returns {*}
     */
    getRemoteClass(namespace, name){
        return this._remoteClasses[namespace][name];
    }

    /**
     * Поулчить локальный класс
     * @param namespace
     * @param name
     * @returns {*}
     */
    getLocalClass(namespace, name){
        return this._localClasses[namespace][name];
    }
}

module.exports = RPCInterface