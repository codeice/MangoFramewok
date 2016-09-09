/*using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Web;
using Microsoft.Practices.Unity;
using SaiQuaner.Domain.Extensions;
using SaiQuaner.Infrastructure.Extensions.Unity;

namespace SaiQuaner.Infrastructure.Extensions.Implements
{

    /// <summary>
    /// 获取当前账号信息(Mobile web端 新版auth User)
    /// </summary>
    public class MockUser : ICurrentUser
    {
        private const string claimUserId = "Id";
        private const string claimAccount = "account";
        private const string claimName = "name";
        private const string claimDisplayName = "displayName";

        #region 基本信息
        /// <summary>
        /// 用户Id
        /// </summary>
        public Guid UserId { get { return Guid.NewGuid(); } }

        public long? ExternalUserId
        {
            get { return 1; }
        }


        /// <summary>
        /// 账号
        /// </summary>
        public string Account { get { return "mockuser"; } }

        /// <summary>
        /// 昵称
        /// </summary>
        public string Name
        {
            get
            {
                return "mockuser";

            }
        }

        /// <summary>
        /// 显示名
        /// </summary>
        public string DisplayName
        {
            get { return "匿名账户"; }
        }

        public List<string> Roles { get; private set; }
        public void DoOperationLog(string operationType, string result)
        {
            throw new NotImplementedException();
        }

        public void DoActivityLog(string verb, string obj = "", string target = "")
        {
            var logService = UnityHelpers.GetConfiguredContainer().Resolve<ILogService>();
            logService.LogActivity("UnitTest", verb, obj, target);
        }

        #endregion
    }
}*/