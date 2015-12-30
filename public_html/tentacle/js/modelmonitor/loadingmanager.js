/* global Tentacle, _ */

// TODO: pas optimisé, à retravailler
Tentacle.LoadingManager = function () {

    var files = [];
    var datas = {};

    this.addFile = function (url) {
        files.push(url);
    };

    this.load = function (callback) {

        var count = 0;

        _.each(files, function (url) {

            $.get(url, function (data) {
                datas[url] = data;

                count++;

                if (count === files.length) {
                    callback(datas);
                }
            });
        });
    };
};