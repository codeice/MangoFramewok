(function () {
    //api 配置
    var apiServer = location.protocol + "//" + location.host + '/Sample.Api/';
    var apiBatchServer = location.protocol + "//" + location.host + '/Sample.Api/batch/';
    var baseUrl = location.protocol + "//" + location.host + '/SPATemplate2/';
    var entryRoute = "#/home"; //登录后跳转到的页面

    //----wsaf api
    var wsafApiServer = location.protocol + "//" + location.host + '/wsaf.service2.0/api/v1/';
    var appId = 'a7f60bbc-91e1-4887-a86f-041da5357148';
    //----登录地址
    var oauthBaseUri = location.protocol + "//" + location.host + "/WSIdentityServer2.0/core";

    window.config = {
        //oauthConfig
        oauthConfig: {
            authorizeEndpoint: oauthBaseUri + "/connect/authorize",
            logoutEndpoint: oauthBaseUri + "/connect/endsession",
            jwksUri: oauthBaseUri + "/.well-known/jwks",
            userInfoUri: oauthBaseUri + "/connect/userinfo",
            //oauth Client
            clientId: appId,
            redirectUri: baseUrl
        },
        //app config
        appConfig: {
            apiServer: apiServer,
            apiBatchServer: apiBatchServer,
            baseUrl: baseUrl,
            entryRoute: entryRoute,
            wsafApiServer: wsafApiServer,
            appId: appId
        }

    };
})();
