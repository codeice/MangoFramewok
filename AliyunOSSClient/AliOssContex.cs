using System.Configuration;
using Aliyun.OSS;

namespace AliyunOSSClient
{
    public class AliOssContex
    {

        public static readonly string Endpoint = ConfigurationManager.AppSettings["Endpoint"] ?? "oss-cn-shanghai.aliyuncs.com";
        public static readonly string AccessKeyId = ConfigurationManager.AppSettings["AccessKeyId"] ?? "bRUqWdypn33Ec8YC";
        public static readonly string AccessKeySecret = ConfigurationManager.AppSettings["AccessKeySecret"] ?? "R2M3bMbSEFkq6gLoevmFDdUYyAvapP";
        public static readonly string DefaultBucket = ConfigurationManager.AppSettings["DefaultBucket"] ?? "default-space";

        public static OssClient GetInstance()
        {
            return new OssClient(Endpoint, AccessKeyId, AccessKeySecret);
        }

        public static string GetFileUrl(string bucketName, string fileName)
        {
            var absoluteUrl = string.Format("http://{0}.{1}/{2}", bucketName, Endpoint, fileName);
            return absoluteUrl;
        }
    }
}
