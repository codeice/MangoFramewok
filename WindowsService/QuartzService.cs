using System.ServiceProcess;
using Common.Logging;
using Quartz;
using Quartz.Impl;

namespace WindowsService
{
    public partial class QuartzService : ServiceBase
    {
        private readonly ILog logger;
        /*   private IScheduler scheduler;*/
        public QuartzService()
        {
            InitializeComponent();
            logger = LogManager.GetLogger(GetType());
            /*            ISchedulerFactory schedulerFactory = new StdSchedulerFactory();
                        scheduler = schedulerFactory.GetScheduler();*/
        }

        protected override void OnStart(string[] args)
        {
            /*     scheduler.Start();*/
            for (var i = 0; i < 10; i++)
            {
                logger.Info("count" + i);
            }
            logger.Info("Quartz服务成功启动");
        }

        protected override void OnStop()
        {
            /*         scheduler.Shutdown();*/
            logger.Info("Quartz服务成功终止");
        }

        protected override void OnPause()
        {
            logger.Info("Quartz服务暂停");
            /*  scheduler.PauseAll();*/
        }

        protected override void OnContinue()
        {
            logger.Info("Quartz服务继续...");
            /*   scheduler.ResumeAll();*/
        }

        /*        public void SetTask()
                {
                    Console.WriteLine(DateTime.Now.ToString("r"));
                    //1.首先创建一个作业调度池
                    //2.创建出来一个具体的作业
                    var job = JobBuilder.Create<DemoJob>().Build();
                    //3.创建并配置一个触发器
                    //NextGivenSecondDate：如果第一个参数为null则表名当前时间往后推迟2秒的时间点。
                    var startTime = DateBuilder.NextGivenSecondDate(DateTime.Now.AddSeconds(1), 2);
                    var endTime = DateBuilder.NextGivenSecondDate(DateTime.Now.AddHours(2), 3);
                    var trigger = (ISimpleTrigger)TriggerBuilder.Create().StartAt(startTime).EndAt(endTime)
                                                .WithSimpleSchedule(x => x.WithIntervalInSeconds(3).WithRepeatCount(100))
                                                .Build();
                    //4.加入作业调度池中
                    scheduler.ScheduleJob(job, trigger);
                    //5.开始运行
                    scheduler.Start();
                    Console.ReadKey();
                }*/
    }
}
