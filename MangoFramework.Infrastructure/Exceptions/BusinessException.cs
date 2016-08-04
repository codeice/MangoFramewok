using System;

namespace MangoFramework.Infrastructure.Exceptions
{
    /// <summary>
    /// 业务错误
    /// </summary>
    public class BusinessException : Exception
    {
        /// <summary>
        /// 业务事件
        /// </summary>
        public string BusinessEvent { get; set; }

        public BusinessException(string message)
            : base(message)
        {
        }

        /// <summary>
        /// 构造器
        /// </summary>
        /// <param name="message">错误信息</param>
        /// <param name="event">业务事件</param>
        public BusinessException(string message, string @event)
            : base(message)
        {
            BusinessEvent = @event;
        }

        /// <summary>
        /// 构造器
        /// </summary>
        /// <param name="message">错误信息</param>
        /// <param name="event">业务事件</param>
        /// <param name="innerException">内部错误</param>
        public BusinessException(string message, string @event, Exception innerException)
            : base(message, innerException)
        {
            BusinessEvent = @event;
        }
    }
}
