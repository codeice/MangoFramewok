(function () {

    var apiServer = location.protocol + "//" + location.host + '/PS.Api/';
    var apiBatchServer = location.protocol + "//" + location.host + '/PS.Api/batch/';
    var baseUrl = location.protocol + "//" + location.host + '/SPATemplate/';
    var entryRoute = "#/home"; //登录后跳转到的页面

    //----wsaf api
    var wsafApiServer = location.protocol + "//" + location.host + '/wsaf.service2.0/api/v1/';
    var appId = '2c385956-9bb6-4547-97a4-64525514812f';

    var oauthBaseUri = location.protocol + "//" + location.host + "/WSIdentityServer2.0/core";
    /*    var oauthBaseUri = "https://172.16.193.135/core";*/

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
