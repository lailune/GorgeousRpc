const BLACKLIST = ['constructor', 'getMethods'];

/**
 * Локальный класс для RPC вызовов
 */
class LocalClass {
    constructor(namespace = false) {
        this._namespace = namespace;
    }

    /**
     * Получить список методов текущего класса
     * @returns {PropertyKey[]}
     */
    getMethods() {
        return Reflect.ownKeys(Reflect.getPrototypeOf(this)).filter((method) => !BLACKLIST.includes(method));
    }

    /**
     * Namespace к которому принадлежит класс
     * @returns {boolean}
     */
    getNamespace() {
        return this._namespace;
    }

}

module.exports = LocalClass;