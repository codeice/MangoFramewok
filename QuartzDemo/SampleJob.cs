using System;
using Common.Logging;
using Quartz;

namespace QuartzDemo
{
    public class SampleJob : IJob
    {
        protected ILog _logger;
        public SampleJob()
        {
            _logger = LogManager.GetLogger(GetType());
        }

        public void Execute(IJobExecutionContext context)
        {
            _logger.Info("业务逻辑：触发");
            try
            {
                FileHelper.WirteLog("业务代码...");
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
