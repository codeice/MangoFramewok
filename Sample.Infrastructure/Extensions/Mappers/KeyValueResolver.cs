using System.Collections.Generic;
using System.Linq;
using AutoMapper;

namespace Sample.Infrastructure.Extensions.Mappers
{
    public class KeyValueResolver : ValueResolver<string, string>
    {
        public readonly IEnumerable<KeyValuePair<string, string>> SourceKeyValuePairs;
        public string Result = string.Empty;

        public KeyValueResolver(IEnumerable<KeyValuePair<string, string>> dataSource)
        {
            SourceKeyValuePairs = dataSource;
        }

        protected override string ResolveCore(string source)
        {

            if (!string.IsNullOrWhiteSpace(source))
            {
                var array = source.Split(',');
                foreach (var item in array)
                {
                    Result += "," + SourceKeyValuePairs.FirstOrDefault(ent => ent.Key == item).Value;
                }
                return Result.Trim(',');
            }
            else
            {
                return source;
            }
        }
    }
}
