using System.ServiceProcess;
using System.Timers;
using Common.Logging;
using Quartz;
using Quartz.Impl;

namespace QuartzDemo
{
    public partial class DemoService : ServiceBase
    {
        /* private Timer timer = null;*/
        protected readonly ILog logger;
        private IScheduler scheduler;
        public DemoService()
        {
            InitializeComponent();
            logger = LogManager.GetLogger(GetType());
            ISchedulerFactory schedulerFactory = new StdSchedulerFactory();
            scheduler = schedulerFactory.GetScheduler();
        }

        protected override void OnStart(string[] args)
        {
            /*            timer = new Timer();
                        this.timer.Interval = 1000;
                        this.timer.Elapsed += new ElapsedEventHandler(this.job);
                        timer.Enabled = true;
                        FileHelper.WirteLog("test window service started");*/
            logger.Info("服务启动...");
            scheduler.Start();
        }

        protected override void OnStop()
        {
            logger.Info("服务停止...");
            scheduler.Shutdown();
        }

        /*        private void job(object sender, ElapsedEventArgs e)
                {
                    logger.Info("业务逻辑处理...");
                }*/
    }
}
