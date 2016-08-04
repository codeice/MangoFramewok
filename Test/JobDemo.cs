using System;
using Common.Logging;
using Quartz;

namespace Test
{
    public class JobDemo : IJob
    {
        protected ILog _logger;
        public JobDemo()
        {
            _logger = LogManager.GetLogger(GetType());
        }
        public void Execute(IJobExecutionContext context)
        {
            _logger.Info("业务逻辑：触发");
            try
            {
                _logger.Info("业务逻辑：主体部分");
            }
            catch (Exception ex)
            {
                _logger.Error("业务逻辑异常：", ex);
            }
            finally
            {
                _logger.Info("业务逻辑：执行结束");
            }
        }
    }
}
