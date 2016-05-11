(function () {

    var apiServer = location.protocol + "//" + location.host + '/PS.Api/';
    var apiBatchServer = location.protocol + "//" + location.host + '/PS.Api/batch/';
    var baseUrl = location.protocol + "//" + location.host + '/SPASample';
    var entryRoute = "#/home"; //登录后跳转到的页面

    //----wsaf api
    var wsafApiServer = 'http://172.16.193.135/wsaf.service/api/v1/';
    /*var appId = 'FA0DBB67-5315-41CF-BD7D-3AD3BF22E37F';*/
    /* var appId = '9ea11880-90bb-4786-bdf8-1e6d182db893';*/
    var appId = '2c385956-9bb6-4547-97a4-64525514812f';

    /*  var oauthBaseUri = location.protocol + "//" + location.host + "/WSIdentityServer/core";*/
    var oauthBaseUri = "https://172.16.193.135/core";

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
