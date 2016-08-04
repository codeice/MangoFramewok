using System;

namespace MangoFramework.Infrastructure.Exceptions
{
    public class AuthorizationException : Exception
    {
        public AuthorizationException(string message)
            : base(message)
        {
        }
    }
}