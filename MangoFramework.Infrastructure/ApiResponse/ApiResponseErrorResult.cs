using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;
using Newtonsoft.Json;

namespace MangoFramework.Infrastructure.ApiResponse
{
    /// <summary>
    /// ApiResponse http回应
    /// </summary>
    public class ApiResponseErrorResult : IHttpActionResult
    {
        const string jsonMediaType = "application/json";

        public HttpRequestMessage Request { get; set; }

        /// <summary>
        /// 错误类型
        /// </summary>
        public ResponseCode Code { get; set; }

        /// <summary>
        /// 错误信息
        /// </summary>
        public string Message { get; set; }

        public Task<HttpResponseMessage> ExecuteAsync(CancellationToken cancellationToken)
        {
            var response = new HttpResponseMessage(HttpStatusCode.OK)
                             {
                                 Content = new StringContent(JsonConvert.SerializeObject(new ApiResponse<int>
                                 {
                                     Code = Code,
                                     Message = Message
                                 }), Encoding.UTF8 , jsonMediaType),
                                 RequestMessage = Request
                             };

            return Task.FromResult(response);
        }
    }
}