define(['ng-core'], function () {
    var module = angular.module('oss', []);
    function OssService($rootScope) {

        //-----删除OSS文件
        this.delete = function (fileName, bucketType) {
            var client = initClient(bucketType);
            var result = client.delete(fileName);
            return result;
        };

        //-----批量删除OSS文件
        this.deleteMulti = function (fileNames, bucketType) {
            var client = initClient(bucketType);
            var result = client.deleteMulti(fileNames, { quiet: true });
            return result;
        };

        //-----初始化client
        this.initClient = function (bucketType) {
            return initClient(bucketType);
        };
    }

    //----获取bucketType
    function getBucketName(bucketType) {
        if (bucketType == 'image') {
            return ossConfig.imageBucket;
        }
        if (bucketType == 'video') {
            return ossConfig.videoBucket;
        } else {
            return ossConfig.defaultBucket;
        }
    }

    //初始化client
    function initClient(bucketType) {
        var client = new OSS.Wrapper({
            region: ossConfig.ossEndpoint,
            accessKeyId: ossConfig.accessKeyId,
            accessKeySecret: ossConfig.accessKeySecret,
            bucket: getBucketName(bucketType)
        });
        return client;
    }



    module.factory("ossService", ['$rootScope', function ($rootScope) {
        var ossService = new OssService($rootScope);
        return ossService;
    }]);
});