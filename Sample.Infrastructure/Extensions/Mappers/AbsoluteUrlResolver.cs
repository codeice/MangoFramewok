using AutoMapper;

namespace Sample.Infrastructure.Extensions.Mappers
{
    public class AbsoluteUrlResolver : ValueResolver<string, string>
    {
        public readonly string FileSystem = string.Empty;

        public readonly string DefaultUrl = string.Empty;

        public AbsoluteUrlResolver(string fileStoreUrl)
        {
            if (!string.IsNullOrWhiteSpace(fileStoreUrl))
            {
                FileSystem = fileStoreUrl.Trim('/');
            }
        }

        public AbsoluteUrlResolver(string fileStoreUrl, string defaultUrl)
        {
            if (!string.IsNullOrWhiteSpace(fileStoreUrl))
            {
                FileSystem = fileStoreUrl.Trim('/');
            }
            if (!string.IsNullOrWhiteSpace(defaultUrl))
            {
                DefaultUrl = defaultUrl.Trim('/');
            }
        }

        protected override string ResolveCore(string source)
        {
            if (!string.IsNullOrEmpty(source))
            {
                return string.Format("{0}/{1}", FileSystem, source.Trim('/'));
            }
            return DefaultUrl;
        }
    }
}
