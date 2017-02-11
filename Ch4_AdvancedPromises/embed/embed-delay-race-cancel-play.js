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
function delayPromise(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}
function timeoutPromise(promise, ms) {
    var timeout = delayPromise(ms).then(function () {
            return Promise.reject(new TimeoutError('Operation timed out after ' + ms + ' ms'));
        });
    return Promise.race([promise, timeout]);
}
function cancelableXHR(URL) {
    var req = new XMLHttpRequest();
    var promise = new Promise(function (resolve, reject) {
            req.open('GET', URL, true);
            req.onload = function () {
                if (req.status === 200) {
                    resolve(req.responseText);
                } else {
                    reject(new Error(req.statusText));
                }
            };
            req.onerror = function () {
                reject(new Error(req.statusText));
            };
            req.onabort = function () {
                reject(new Error('abort this request'));
            };
            req.send();
        });
    var abort = function () {
        // 既にrequestが止まってなければabortする
        // https://developer.mozilla.org/en/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
        if (req.readyState !== XMLHttpRequest.UNSENT) {
            req.abort();
        }
    };
    return {
        promise: promise,
        abort: abort
    };
}
var object = cancelableXHR('http://httpbin.org/get');
// main
timeoutPromise(object.promise, 1000).then(function (contents) {
    console.log('Contents', contents);
}).catch(function (error) {
    if (error instanceof TimeoutError) {
        object.abort();
        console.error(error);
        return;
    }
    console.log('XHR Error :', error);
});