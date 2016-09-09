/*using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using SaiQuaner.Infrastructure.Extensions.Unity;

namespace Sample.Infrastructure.Extensions.Implements
{

    /// <summary>
    /// 获取当前账号信息(Mobile web端 新版auth User)
    /// </summary>
    public class ClaimsPrincipalUser : ICurrentUser
    {
        private const string claimUserId = "Id";
        private const string claimAccount = "UserName";
        private const string claimName = "UserName";
        private const string claimDisplayName = "displayName";
        private const string level = "Level"; //0第三方未绑定用户，1本地未绑定，2 已绑定用户
        private const string origin = "saiquaner.portal";

        #region 基本信息
        /// <summary>
        /// 用户Id
        /// </summary>
        public Guid UserId { get; set; }

        public long? ExternalUserId
        {
            get
            {
                var c = ((ClaimsPrincipal)HttpContext.Current.User).Claims.FirstOrDefault(ent => ent.Type == claimUserId);
                if (c != null)
                {
                    return Convert.ToInt64(c.Value);
                }
                else
                {
                    return null;
                }
            }
        }

        /// <summary>
        /// 账号
        /// </summary>
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
                    return "anonymous";
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
                    return "anonymous";
                }
            }
        }

        /// <summary>
        /// 显示名
        /// </summary>
        public string DisplayName
        {
            get
            {
                var c = ((ClaimsPrincipal)HttpContext.Current.User).Claims.FirstOrDefault(ent => ent.Type == claimDisplayName);
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

        /// <summary>
        /// 角色
        /// </summary>
        public List<string> Roles { get; private set; }

        public void DoOperationLog(string operationType, string result)
        {
            var logService = UnityHelpers.GetConfiguredContainer().Resolve<ILogService>();
            logService.LogActivity(origin, operationType, result);
        }

        #endregion



    }
}*/