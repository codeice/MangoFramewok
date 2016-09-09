using System;
using System.Collections.Generic;
using System.Net.Http;

namespace Sample.Infrastructure.Extensions.Files
{
    /// <summary>
    /// 二进制数据对象
    /// </summary>
    public class BlobDescription
    {
        /// <summary>
        /// 文件唯一标识
        /// </summary>
        public string Key { get; set; }

        /// <summary>
        /// 实际保存名称
        /// </summary>
        public string SavedName { get; set; }

        /// <summary>
        /// 文件原名
        /// </summary>
        public string FileName { get; set; }

        /// <summary>
        /// 文件大小
        /// </summary>
        public long? Size { get; set; }
    }

    /// <summary>
    /// Custom for file extension
    /// </summary>
    public class WithExtMultipartFormDataStreamProvider : MultipartFormDataStreamProvider
    {
        public List<BlobDescription> Blobs = new List<BlobDescription>();

        public WithExtMultipartFormDataStreamProvider(string path)
            : base(path)
        {
        }

        public override string GetLocalFileName(System.Net.Http.Headers.HttpContentHeaders headers)
        {
            var key = Guid.NewGuid().ToString();
            var savedName = key;

            var fileName = !string.IsNullOrWhiteSpace(headers.ContentDisposition.FileName) ? headers.ContentDisposition.FileName : "NoName";
            fileName = fileName.TrimStart('\"').TrimEnd('\"');
            var extention = fileName.LastIndexOf('.');
            if (extention > 0)
            {
                savedName += fileName.Substring(extention);
            }
            Blobs.Add(new BlobDescription
            {
                Key = key,
                SavedName = savedName,
                FileName = fileName,
                Size = headers.ContentDisposition.Size
            });
            return savedName;
        }
    }
}