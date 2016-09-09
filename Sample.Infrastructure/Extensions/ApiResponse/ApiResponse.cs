namespace Sample.Infrastructure.Extensions.ApiResponse
{
    /// <summary>
    /// General response
    /// </summary>
    public abstract class ApiResponse
    {
        /// <summary>
        /// response code
        /// </summary>
        public ResponseCode Code { get; set; }

        /// <summary>
        /// extra message
        /// </summary>
        public string Message { get; set; }

        /// <summary>
        /// factory method
        /// </summary>
        /// <param name="model">response data</param>
        /// <returns>successful response</returns>
        public static ApiResponse Ok<T>(T data)
        {
            return new ApiResponse<T>
            {
                Code = ResponseCode.Ok,
                Data = data
            };
        }

        /// <summary>
        /// factory method
        /// </summary>
        /// <param name="message">optional message</param>
        /// <returns>not authorized response</returns>
        public static ApiResponse NotAuthorized(string message = "未授权")
        {
            return new ApiResponse<int>
            {
                Code = ResponseCode.AuthorizationException,
                Message = message,
                //Data = default(TModel)
            };
        }

        /// <summary>
        /// factory method
        /// </summary>
        /// <param name="message">optional message</param>
        /// <returns>invalid request response</returns>
        public static ApiResponse InValidRequest(string message = "参数错误")
        {
            return new ApiResponse<int>
            {
                Code = ResponseCode.ArgumentException,
                Message = message,
                //Data = default(TModel)
            };
        }

        /// <summary>
        /// factory method
        /// </summary>
        /// <param name="message">error message</param>
        /// <returns>business error response</returns>
        public static ApiResponse BusinessError(string message)
        {
            return new ApiResponse<int>
            {
                Code = ResponseCode.BusinessException,
                Message = message,
                //Data = default(TModel)
            };
        }
    }
}
