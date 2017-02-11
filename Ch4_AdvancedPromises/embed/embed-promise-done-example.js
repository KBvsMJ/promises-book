if (typeof Promise.prototype.done === 'undefined') {
    Promise.prototype.done = function (onFulfilled, onRejected) {
        this.then(onFulfilled, onRejected).catch(function (error) {
            setTimeout(function () {
                throw error;
            }, 0);
        });
    };
}
var promise = Promise.resolve();
promise.done(function () {
    JSON.parse('this is not json');    // => SyntaxError: JSON.parse
});