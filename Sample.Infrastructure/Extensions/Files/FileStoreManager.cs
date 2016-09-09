using System;
using System.Configuration;
using System.IO;

namespace Sample.Infrastructure.Extensions.Files
{
    /// <summary>
    /// 文件管理
    /// </summary>
    public class FileStoreManager
    {
        #region constant
        /// <summary>
        /// 文件系统路径
        /// </summary>
        public static string FileStorePath
        {
            get
            {
                try
                {
                    return ConfigurationManager.AppSettings["FileStorePath"];
                }
                catch
                {
                    throw new Exception("FileStorePath未在web.config中配置");
                }
            }
        }

        /// <summary>
        ///文件系统Url
        /// </summary>
        public static string FileStoreUrl
        {
            get
            {
                try
                {
                    return ConfigurationManager.AppSettings["FileStoreUrl"];
                }
                catch
                {
                    throw new Exception("FileStoreUrl未在web.config中配置");
                }
            }
        }

        #endregion

        #region 文件目录操作
        /// <summary>
        /// 创建一级目录
        /// </summary>
        /// <param name="name"></param>
        /// <returns>返回 目录路径</returns>
        public static string CreateDirectory(string name)
        {
            var dir = Path.Combine(FileStorePath, name.ToString());
            if (!Directory.Exists(dir))
            {
                Directory.CreateDirectory(dir);
            }
            return dir;
        }

        /// <summary>
        /// / 创建二级目录
        /// </summary>
        /// <param name="firstLevelDirName">一级目录名称</param>
        /// <param name="secondLevelDirName">二级目录名称</param>
        /// <returns></returns>
        public static string CreateDirectory(string firstLevelDirName, string secondLevelDirName)
        {
            var firstDir = CreateDirectory(firstLevelDirName);
            var dir = Path.Combine(firstDir, secondLevelDirName);
            if (!Directory.Exists(dir))
            {
                Directory.CreateDirectory(dir);
            }
            return dir;
        }

        /// <summary>
        /// / 创建二级目录
        /// </summary>
        /// <param name="firstLevelDirName">一级目录名称</param>
        /// <param name="secondLevelDirName">二级目录名称</param>
        /// <param name="thirdLevelDirName">三级目录名称</param>
        /// <returns></returns>
        public static string CreateDirectory(string firstLevelDirName, string secondLevelDirName, string thirdLevelDirName)
        {
            var twoLevelDir = CreateDirectory(firstLevelDirName, secondLevelDirName);
            var dir = Path.Combine(twoLevelDir, thirdLevelDirName);
            if (!Directory.Exists(dir))
            {
                Directory.CreateDirectory(dir);
            }
            return dir;
        }

        #endregion

        #region 获取文件路径

        public static string GetFileAbsoluteUrl(string relativeUrl)
        {
            return FileStoreUrl.TrimEnd('/') + "/" + relativeUrl;
        }
        #endregion
    }
}
