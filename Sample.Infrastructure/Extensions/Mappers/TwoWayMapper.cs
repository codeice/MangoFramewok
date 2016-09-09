using AutoMapper;

namespace Sample.Infrastructure.Extensions.Mappers
{
    /// <summary>
    /// 双向mapper
    /// </summary>
    public class TwoWayMapper
    {
        public static TwoWayMappingExpression<T1, T2> CreateTwoWayMap<T1, T2>()
        {
            var map = new TwoWayMappingExpression<T1, T2>
            {
                First = Mapper.CreateMap<T1, T2>(),
                Second = Mapper.CreateMap<T2, T1>()
            };
            return map;
        }
    }

    public class TwoWayMappingExpression<T1, T2>
    {
        public IMappingExpression<T1, T2> First { get; set; }
        public IMappingExpression<T2, T1> Second { get; set; }
    }
}
