using System;
using System.Collections.Generic;
using System.Configuration;
using StackExchange.Redis;

namespace Sample.Infrastructure.Redis
{
    public class RedisContext
    {
        public static readonly ConnectionMultiplexer Instance;
        const int temporaryCacheDb = 5;
        const int pesistentCacheDb = 1;
        public static readonly string RedisMasterIp;
        public static readonly string RedisAUTH;

        static RedisContext()
        {
            RedisMasterIp = ConfigurationManager.AppSettings["RedisMasterIp"] ?? "172.16.193.240";
            RedisAUTH = ConfigurationManager.AppSettings["RedisAUTH"];

            var config = new ConfigurationOptions
            {
                EndPoints =
                {
                    {RedisMasterIp, 6379}
                },
                CommandMap = CommandMap.Create(new HashSet<string>
                {
                    // EXCLUDE a few commands
                    "INFO",
                    "CONFIG",
                    "CLUSTER",
                    "PING",
                    "ECHO",
                    "CLIENT"
                }, available: false),
                KeepAlive = 180,
                DefaultVersion = new Version(2, 8, 8),
                Password = RedisAUTH
            };
            Instance = ConnectionMultiplexer.Connect(config);
        }

        public static IDatabase GetTemporaryCache()
        {
            return Instance.GetDatabase(temporaryCacheDb);
        }

        public static IDatabase GetPersistentCache()
        {
            return Instance.GetDatabase(pesistentCacheDb);
        }

        public static IDatabase GetDatabase()
        {
            return Instance.GetDatabase();
        }
    }
}
