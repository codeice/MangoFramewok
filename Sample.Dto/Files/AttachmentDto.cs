using System;

namespace Sample.Dto.Files
{
    /// <summary>
    /// 附件模型
    /// </summary>
    public class AttachmentDto
    {
        /// <summary>
        /// 主键标识
        /// </summary>
        public Guid? Id { get; set; }

        /// <summary>
        /// 文件原始名称
        /// </summary>
        public string OriginalName { get; set; }

        /// <summary>
        ///存储后的文件名
        /// </summary>
        public string FileName { get; set; }

        /// <summary>
        ///文件虚拟路径
        /// </summary>
        public string VirtualPath { get; set; }

        /// <summary>
        /// 绝对路径
        /// </summary>
        public string AbsolutePath { get; set; }

        /// <summary>
        /// Oss 的绝对路径
        /// </summary>
        public string OssAbsoluteUrl { get; set; }

        /// <summary>
        /// oos Object Tag
        /// </summary>
        public string ETag { get; set; }

        /// <summary>
        /// 物理路径
        /// </summary>
        public string PhysicalPath { get; set; }

        /// <summary>
        /// 文件大小
        /// </summary>
        public long? FileSize { get; set; }

        /// <summary>
        /// 分类
        /// </summary>
        public string Category { get; set; }

        /// <summary>
        /// 文件扩展名
        /// </summary>
        public string Extension { get; set; }

        /// <summary>
        /// 序号
        /// </summary>
        public int SortIndex { get; set; }

    }
}
