using System;

namespace Sample.Infrastructure.Extensions.Exceptions
{
    public class InfrastructureException : Exception
    {
        /// <summary>
        /// 服务名
        /// </summary>
        public string Name { get; set; }

        public InfrastructureException(string message, string name)
            : base(message)
        {
            Name = name;
        }

        public InfrastructureException(string message, string name, Exception innerException)
            : base(message, innerException)
        {
            Name = name;
        }
    }
}
