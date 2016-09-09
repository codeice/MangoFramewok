using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AliyunOSSClient
{
    /// <summary>
    /// 上传后返回的结果对象
    /// </summary>
    public class OssResult
    {

        /// <summary>
        /// 绝对路径
        /// </summary>
        public string AbsoluteUrl { get; set; }

        /// <summary>
        /// 上传后返回的标识
        /// </summary>
        public string ETag { get; set; }
    }
}
