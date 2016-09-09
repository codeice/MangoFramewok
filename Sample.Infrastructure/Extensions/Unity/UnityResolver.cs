using System;
using System.Collections.Generic;
using System.Web.Http.Dependencies;
using Microsoft.Practices.Unity;

namespace Sample.Infrastructure.Extensions.Unity
{
    public class UnityResolver : IDependencyResolver
    {
        //private ILog logger;

        protected IUnityContainer container;

        public UnityResolver(IUnityContainer container)
        {
            if (container == null)
            {
                throw new ArgumentNullException("container");
            }
            this.container = container;
            //logger = LogManager.GetCurrentClassLogger();
        }

        public object GetService(Type serviceType)
        {
            //logger.Info(string.Format("resolving {0}", serviceType.Name));
            try
            {
                var resolved = container.Resolve(serviceType);
                //logger.Info(string.Format("{0} resolved as {1}", serviceType.Name, resolved.GetType().Name));
                return resolved;
            }
            catch (ResolutionFailedException)
            {
                //logger.Error(string.Format("resolving {0} failed.", serviceType.Name));
                return null;
            }
        }

        public IEnumerable<object> GetServices(Type serviceType)
        {
            //logger.Info(string.Format("resolving {0}", serviceType.Name));
            try
            {
                var resolved = container.ResolveAll(serviceType);
                foreach (var o in resolved)
                {
                    //logger.Info(string.Format("{0} resolved as {1}", serviceType.Name, o.GetType().Name));
                }
                return resolved;
            }
            catch (ResolutionFailedException)
            {
                //logger.Error(string.Format("resolving {0} failed.", serviceType.Name));
                return new List<object>();
            }
        }

        public IDependencyScope BeginScope()
        {
            var child = container.CreateChildContainer();
            return new UnityResolver(child);
        }

        public void Dispose()
        {
            container.Dispose();
        }
    }
}