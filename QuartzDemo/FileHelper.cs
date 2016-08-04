using System;
using System.IO;

namespace QuartzDemo
{
    public static class FileHelper
    {
        /// <summary>
        /// 写入文件
        /// </summary>
        /// <param name="msg"></param>
        public static void WirteLog(string msg)
        {
            var sw = new StreamWriter(AppDomain.CurrentDomain.BaseDirectory + "\\logFile.txt", true);
            try
            {
                sw.WriteLine(DateTime.Now.ToString().Trim() + ":" + msg.Trim());
                sw.Flush();
                sw.Close();
            }
            catch (Exception ex)
            {
                sw.WriteLine(DateTime.Now.ToString().Trim() + ":" + ex.Message.Trim());
            }
        }


    }
}
