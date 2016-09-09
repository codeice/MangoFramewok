using System;
using System.Configuration;
using System.Diagnostics;
using System.Web;
using MangoFramework.Infrastructure.ApiResponse;
using MangoFramework.Infrastructure.Extensions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Quartz;
using Quartz.Impl;

namespace UnitTest
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void SpellCode()
        {
            var name = "林雅斌";
            var letter = SpellingCode.GetSpellCode(name.Substring(0, 1));
            Debug.Print(letter);
        }

        [TestMethod]
        public void UploadToPublicOss()
        {
            var bucketName = ConfigurationManager.AppSettings["publicBucket"];
            var fileKey = Guid.NewGuid().ToString();
            var filePath = System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "test.png");
            var result = AliyunOSSClient.OssClientFactory.UploadToPublic(bucketName, fileKey, filePath);
            Console.WriteLine(result.AbsoluteUrl);
            Console.WriteLine(result.ETag);
            Debug.Assert(true);
        }

        [TestMethod]
        public void ListBuckets()
        {
            AliyunOSSClient.OssClientFactory.ListBuckets();
            Debug.Assert(true);
        }

    }
}
