
namespace Sample.Infrastructure.Extensions.ApiResponse
{
    /// <summary>
    /// General api response warper.
    /// </summary>
    /// <typeparam name="TModel">api response data type.</typeparam>
    public class ApiResponse<TModel> : ApiResponse
    {
        /// <summary>
        /// response data
        /// </summary>
        public TModel Data { get; set; }
    }
}
