using System;
using System.Configuration.Install;
using System.Reflection;
using System.ServiceProcess;

namespace QuartzDemo
{
    static class Program
    {
        static void Main(string[] args)
        {
            if (Environment.UserInteractive)
            {
                string parameter = string.Concat(args);
                switch (parameter)
                {
                    case "--install":
                        ManagedInstallerClass.InstallHelper(new[] { Assembly.GetExecutingAssembly().Location });
                        break;
                    case "--uninstall":
                        ManagedInstallerClass.InstallHelper(new[] { "/u", Assembly.GetExecutingAssembly().Location });
                        break;
                }
            }
            else
            {
                var servicesToRun = new ServiceBase[]
                {
                    new DemoService(), 
                };
                ServiceBase.Run(servicesToRun);
            }
        }
    }
}
