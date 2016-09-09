/*
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Web;
using Microsoft.Practices.Unity;
using SaiQuaner.Domain.Extensions;
using SaiQuaner.Infrastructure.Extensions.Unity;

namespace SaiQuaner.Infrastructure.Extensions.Implements
{
    public class WSAFClaimsPrincipalUser : ICurrentUser
    {
        private const string claimUserId = "userId";

        /// <summary>
        /// wsaf里面账户就是name
        /// </summary>
        private const string claimAccount = "name";
        private const string claimName = "name";
        private const string claimDisplayName = "displayName";
        private const string claimDptName = "deptName";
        private const string claimDptDisplay = "deptDisplayName";

        private const string origin = "saiquaner.adminPortal";

        #region 基本信息
        /// <summary>
        /// 用户Id
        /// </summary>
        public Guid UserId
        {
            get
            {
                var c = ((ClaimsPrincipal)HttpContext.Current.User).Claims.FirstOrDefault(ent => ent.Type == claimUserId);
                if (c != null)
                {
                    return new Guid(c.Value);
                }
                else
                {
                    return Guid.Empty;
                }
            }
        }

        /// <summary>
        /// 前台用户Id
        /// </summary>
        public long? ExternalUserId { get; set; }


        public string Account
        {
            get
            {
                var c = ((ClaimsPrincipal)HttpContext.Current.User).Claims.FirstOrDefault(ent => ent.Type == claimAccount);
                if (c != null)
                {
                    return c.Value;
                }
                else
                {
                    return string.Empty;
                }
            }
        }

        /// <summary>
        /// 昵称
        /// </summary>
        public string Name
        {
            get
            {
                var c = ((ClaimsPrincipal)HttpContext.Current.User).Claims.FirstOrDefault(ent => ent.Type == claimName);
                if (c != null)
                {
                    return c.Value;
                }
                else
                {
                    return "anymous";
                }
            }
        }

        public string DisplayName
        {
            get
            {
                var c =
                    ((ClaimsPrincipal)HttpContext.Current.User).Claims.FirstOrDefault(ent => ent.Type == claimDisplayName);
                if (c != null)
                {
                    return c.Value;
                }
                else
                {
                    return "匿名账户";
                }
            }
        }

        public List<string> Roles { get; private set; }
        #endregion

        #region 日志记录

        /// <summary>
        /// 操作日志
        /// </summary>
        /// <param name="operationType">操作类型</param>
        /// <param name="result">操作结果</param>
        public void DoOperationLog(string operationType, string result)
        {
            var logService = UnityHelpers.GetConfiguredContainer().Resolve<ILogService>();
            logService.LogOperation(origin, operationType, result);
        }

        #endregion
    }
}
*/
