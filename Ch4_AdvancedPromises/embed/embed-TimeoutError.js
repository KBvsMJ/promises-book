function copyOwnFrom(target, source) {
    Object.getOwnPropertyNames(source).forEach(function (propName) {
        Object.defineProperty(target, propName, Object.getOwnPropertyDescriptor(source, propName));
    });
    return target;
}
function TimeoutError() {
    var superInstance = Error.apply(null, arguments);
    copyOwnFrom(this, superInstance);
}
TimeoutError.prototype = Object.create(Error.prototype);
TimeoutError.prototype.constructor = TimeoutError;