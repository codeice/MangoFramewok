using System;
using Common.Logging;
using Quartz;
using Quartz.Impl;

namespace Test
{
    class Program
    {
        private static ILog _logger = LogManager.GetLogger(typeof(Program));
        static void Main(string[] args)
        {
            try
            {
                Console.WriteLine(DateTime.Now.ToString("r") + "任务准备启动:");
                ISchedulerFactory schedFact = new StdSchedulerFactory();
                IScheduler sched = schedFact.GetScheduler();
                sched.Start();
                Console.WriteLine("启动成功");
            }
            catch (Exception ex)
            {
                Console.WriteLine("启动失败" + ex.Message);
                _logger.Error("quartz初始化失败");
            }
            Console.ReadKey();
            // SetTask();
        }




        /// <summary>
        /// 设置任务去执行作业
        /// </summary>
        /*public static void SetTask()
        {
            Console.WriteLine(DateTime.Now.ToString("r"));
            //1.首先创建一个作业调度池
            var schedf = new StdSchedulerFactory();
            var sched = schedf.GetScheduler();
            //2.创建出来一个具体的作业
            var job = JobBuilder.Create<JobDemo>().Build();
            //3.创建并配置一个触发器
            //NextGivenSecondDate：如果第一个参数为null则表名当前时间往后推迟2秒的时间点。
            var startTime = DateBuilder.NextGivenSecondDate(DateTime.Now.AddSeconds(1), 2);
            var endTime = DateBuilder.NextGivenSecondDate(DateTime.Now.AddHours(2), 3);
            var trigger = (ISimpleTrigger)TriggerBuilder.Create().StartAt(startTime).EndAt(endTime)
                                        .WithSimpleSchedule(x => x.WithIntervalInSeconds(3).WithRepeatCount(100))
                                        .Build();
            //4.加入作业调度池中
            sched.ScheduleJob(job, trigger);
            //5.开始运行
            sched.Start();
            Console.ReadKey();
        }*/
    }
}
