/*
using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace Sample.Infrastructure.Extensions.Implements
{
    public class LogService : ILogService
    {
        private readonly ICurrentUser _currentUser;
        private readonly ILogPublish _logPub;
        private static readonly ILog logger = LogManager.GetCurrentClassLogger();

        public LogService(ILogPublish logPublish, ICurrentUser currentUser)
        {
            _logPub = logPublish;
            _currentUser = currentUser;
        }
        #region ali日志服务
        /// <summary>
        /// 行为日志
        /// </summary>
        /// <param name="origin">来源</param>
        /// <param name="verb">行为</param>
        /// <param name="obj">对象</param>
        /// <param name="target">目标</param>
        public void LogActivity(string origin, string verb, string obj = "", string target = "")
        {
            try
            {
                var logObj = new
                {
                    Alias = _currentUser.Account,
                    Actor = _currentUser.DisplayName,
                    Verb = verb,
                    Origin = "saiquaner.Portal",
                    Time = DateTime.Now,
                    Object = obj,
                    Target = target
                };
                _logPub.PublishToAliSLS(System.Web.Configuration.WebConfigurationManager.AppSettings["ActivityLogStore"], new List<string> { JsonConvert.SerializeObject(logObj) });
            }
            catch (Exception ex)
            {
                Exception(ex);
            }
        }

        /// <summary>
        ///操作日志
        /// </summary>
        /// <param name="origin">来源</param>
        /// <param name="operationType">操作类型</param>
        /// <param name="result">操作结果</param>
        public void LogOperation(string origin, string operationType, string result)
        {
            try
            {
                var logObj = new
                {
                    Alias = _currentUser.Account,
                    Actor = _currentUser.DisplayName,
                    OperationType = operationType,
                    Origin = origin,
                    Result = result,
                    Time = DateTime.Now,
                };
                _logPub.PublishToAliSLS(System.Web.Configuration.WebConfigurationManager.AppSettings["OperationLogStore"], new List<string> { JsonConvert.SerializeObject(logObj) });
            }
            catch (Exception ex)
            {
                Exception(ex);
            }
        }

        /// <summary>
        /// 异常日志
        /// </summary>
        /// <param name="ex">异常</param>
        public void LogException(Exception ex)
        {
            try
            {
                var logObj = new ExceptionLog
                {

                    Time = DateTime.Now,
                    Exception = ex
                };
                _logPub.Publish(System.Web.Configuration.WebConfigurationManager.AppSettings["ExceptionLogStore"], new List<string> { JsonConvert.SerializeObject(logObj) });
            }
            catch
            {
            }
        }

        #endregion


        #region log4net
        /// <summary>
        /// 信息记录在文件
        /// </summary>
        /// <param name="messege"></param>
        public void Info(string messege)
        {
            logger.Info(messege);
        }
        /// <summary>
        /// 异常记录在文件
        /// </summary>
        /// <param name="ex"></param>
        public void Exception(Exception ex)
        {
            string error = "【错误信息】： " + ex.Message + "<br>";
            if (ex.StackTrace != null)
            {
                error += "Stack Message:" + ex.StackTrace + "<br>";
            }
            if (ex.InnerException != null)
            {
                error += "InnerException" + ex.InnerException.Message + "<br>";
            }
            logger.Error(error);
        }
        #endregion
    }
}
*/
