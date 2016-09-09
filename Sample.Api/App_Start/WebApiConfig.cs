using System.Net.Http.Formatting;
using System.Web.Http;
using System.Web.Http.Batch;
using System.Web.Http.Cors;
using System.Web.Http.ExceptionHandling;
using Sample.Infrastructure.Extensions.ApiResponse;
using Sample.Infrastructure.Extensions.Unity;

namespace Sample.Api
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            #region webapi config
            //cross domain config
            var cors = new EnableCorsAttribute("*", "*", "*");
            config.EnableCors(cors);

            //----依赖注入
            config.DependencyResolver = new UnityResolver(UnityHelpers.GetConfiguredContainer());

            //formatter config
            config.Formatters.Clear();
            config.Formatters.Add(new JsonMediaTypeFormatter());

            // 注册custom exception handler
            config.Services.Replace(typeof(IExceptionHandler), new ApiResponseErrorhandler());

            // Web API routes
            config.MapHttpAttributeRoutes();
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            // var server = new HttpServer(config);
            config.Routes.MapHttpBatchRoute(
                routeName: "BatchApi",
                //restful api 批量操作设置
                routeTemplate: "batch",
                batchHandler: new DefaultHttpBatchHandler(GlobalConfiguration.DefaultServer));
            #endregion
        }
    }
}
