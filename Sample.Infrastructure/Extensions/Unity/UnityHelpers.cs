using System;
using System.Linq;
using Common.Logging;
using Microsoft.Practices.Unity;

namespace Sample.Infrastructure.Extensions.Unity
{
    public static class UnityHelpers
    {
        private static ILog _logger;

        static UnityHelpers()
        {
            _logger = LogManager.GetCurrentClassLogger();
        }

        #region Unity Container
        private static Lazy<IUnityContainer> container = new Lazy<IUnityContainer>(() =>
        {
            var container = new UnityContainer();

            _logger.Info(string.Format("{0}", container.Registrations.Count()));
            return container;
        });

        public static IUnityContainer GetConfiguredContainer()
        {
            return container.Value;
        }
        #endregion

        public static void RegisterTypes(IUnityContainer container)
        {

        }
    }
}