using System;
using System.Collections.Generic;
using System.Web.Http.ExceptionHandling;
using MangoFramework.Infrastructure.Exceptions;
using ExceptionHandler = System.Web.Http.ExceptionHandling.ExceptionHandler;

namespace MangoFramework.Infrastructure.ApiResponse
{
    /// <summary>
    /// Custom api exception handler
    /// 根据Exception类型包装ApiResponse
    /// 简化编码
    /// </summary>
    public class ApiResponseErrorhandler : ExceptionHandler
    {
        /// <summary>
        /// hander core
        /// 根据Exception类型包装ApiResponse
        /// 之后单独拆分优化
        /// </summary>
        /// <param name="context">错误上下文</param>
        public override void Handle(ExceptionHandlerContext context)
        {
            if (context.Exception is ArgumentException || context.Exception is KeyNotFoundException)
            {
                context.Result = new ApiResponseErrorResult
                {
                    Request = context.Request,
                    Code = ResponseCode.ArgumentException,
                    Message = context.Exception.Message
                };
            }
            else if (context.Exception is AuthorizationException)
            {
                context.Result = new ApiResponseErrorResult
                {
                    Request = context.Request,
                    Code = ResponseCode.AuthorizationException,
                    Message = context.Exception.Message
                };
            }
            else if (context.Exception is BusinessException)
            {
                context.Result = new ApiResponseErrorResult
                {
                    Request = context.Request,
                    Code = ResponseCode.BusinessException,
                    Message = context.Exception.Message
                };
            }
            else if (context.Exception is InfrastructureException)
            {
                context.Result = new ApiResponseErrorResult
                {
                    Request = context.Request,
                    Code = ResponseCode.InfrastructureException,
                    Message = context.Exception.Message
                };
            }
            else
            {
                /*    var errorLog = new CSM.LogPublishWorker.Models.ErrorLog
                    {
                        HResult = context.ExceptionContext.Exception.HResult,
                        Message = context.ExceptionContext.Exception.Message,
                        Target = context.ExceptionContext.Request.RequestUri.ToString(),
                        StackTrace = context.ExceptionContext.Exception.StackTrace,
                        APPName = "CE"
                    };
                    var error = new CSM.LogPublishWorker.LogPublishHelper.ErrorLogPublishHelper();
                    error.ErrorLogPublish(errorLog);*/

                context.Result = new ApiResponseErrorResult
                 {
                     Request = context.Request,
                     Code = ResponseCode.UnKnown,
                     Message = context.Exception.Message
                 };

            }
        }

        /// <summary>
        /// always return true
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public override bool ShouldHandle(ExceptionHandlerContext context)
        {
            return true;
        }
    }
}