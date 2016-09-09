using System;
using System.Collections.Generic;
using System.Linq;
using Aliyun.OSS;
using Common.Logging;
using Newtonsoft.Json;

namespace AliyunOSSClient
{
    public static class OssClientFactory
    {
        private static OssClient _client;
        private static ILog _log;
        static OssClientFactory()
        {
            _client = AliOssContex.GetInstance();
            _log = LogManager.GetCurrentClassLogger();
        }

        #region Upload

        /// <summary>
        /// 上传指定的文件到指定的OSS的Public存储空间
        /// </summary>
        /// <param name="bucketName">指定的存储空间名称</param>
        /// <param name="fileName">文件的在OSS上保存的名称</param>
        /// <param name="fileToUpload">指定上传文件的本地路径</param>
        public static OssResult UploadToPublic(string bucketName, string fileName, string fileToUpload)
        {
            var result = new OssResult();
            try
            {
                if (!DoesBucketExist(bucketName))
                {
                    bucketName = AliOssContex.DefaultBucket;
                }
                result.ETag = _client.PutObject(bucketName, fileName, fileToUpload).ETag;
                result.AbsoluteUrl = AliOssContex.GetFileUrl(bucketName, fileName);
                _log.Info(string.Format("成功将文件{0}上传到bucket{1}", fileName, bucketName));
            }
            catch (Exception ex)
            {
                _log.Error(ex.Message);
            }
            return result;
        }

        #endregion

        #region private
        /// <summary>
        /// 检查Bucket是否存在
        /// </summary>
        /// <param name="bucketName"></param>
        /// <returns></returns>
        private static bool DoesBucketExist(string bucketName)
        {
            var exist = ListBuckets().Any(ent => ent.Name == bucketName);
            return exist;
        }

        public static IEnumerable<Bucket> ListBuckets()
        {

            var buckets = new List<Bucket>();
            try
            {
                buckets = _client.ListBuckets().ToList();
            }
            catch (Exception ex)
            {
                Console.WriteLine("List bucket failed. {0}", ex.Message);
            }
            return buckets;
        }

        #endregion
    }
}
