using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Quartz;

namespace WindowsService
{
    /// <summary>
    /// 实现IJob接口
    /// </summary>
    public class DemoJob : IJob
    {
        //使用Common.Logging.dll日志接口实现日志记录
        private static readonly Common.Logging.ILog logger = Common.Logging.LogManager.GetLogger(typeof(DemoJob));

        public DemoJob()
        {

        }
        public void Execute(IJobExecutionContext context)
        {
            try
            {
                logger.Info(string.Format("Hello World! - {0}", System.DateTime.Now.ToString("r")));
            }
            catch (Exception ex)
            {
                logger.Error("DemoJob1 运行异常", ex);
            }

        }

    }
}
