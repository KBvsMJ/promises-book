function JSONPromise(value) {
    return new Promise(function (resolve) {
        resolve(JSON.parse(value));
    });
}