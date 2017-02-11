/**
 * Created by azu on 2014/04/20.
 * LICENSE : MIT
 */
var assert = require('assert');
function failTest(value) {
    throw new Error(value);
}
function mayBeRejected() {
    return Promise.reject(new Error('woo'));
}
it('should then pattern', function () {
    return mayBeRejected().then(failTest, function (error) {
        assert(error.message === 'woo');
    });
});