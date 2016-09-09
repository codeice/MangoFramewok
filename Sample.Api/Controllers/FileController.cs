using System;
using System.Configuration;
using System.Net;
using System.Net.Http;
using System.Runtime.Remoting.Channels;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;
using AliyunOSSClient;
using MangoFramework.Infrastructure.ApiResponse;
using Sample.Dto.Files;
using Sample.Infrastructure.Extensions.Files;

namespace Sample.Api.Controllers
{
    public class FileController : ApiController
    {


        #region 文件上传
        /// <summary>
        /// 文件上传
        /// </summary>
        /// <param name="category">文件目录</param>
        /// <param name="isToOss">是否上传到aliyun Oss(默认为true)</param>
        /// <returns>返回文件对象</returns>
        [HttpPost]
        [ResponseType(typeof(ApiResponse<AttachmentDto>))]
        [Route("Files/Upload/{category}/{IsToOss}")]
        public async Task<IHttpActionResult> UploadFile([FromUri]string category, [FromUri]bool isToOss = true)
        {
            //上传
            var attachmentDto = await Upload(category);
            if (isToOss)
            {
                var result = await UploadToOss(category, attachmentDto.FileName, attachmentDto.PhysicalPath);
                attachmentDto.OssAbsoluteUrl = result.AbsoluteUrl;
                attachmentDto.ETag = result.ETag;
            }
            return Ok(attachmentDto);
        }


        /// <summary>
        /// 文件同时上传服务器和AliyunOss
        /// </summary>
        /// <returns>文件信息</returns>
        [HttpPost]
        [ResponseType(typeof(ApiResponse<AttachmentDto>))]
        [Route("AliOss/Upload/{category}")]
        public async Task<IHttpActionResult> UploadFileToOss([FromUri]string category)
        {
            //上传
            var attachmentDto = await Upload(category);
            //入库
            var result = await UploadToOss(category, attachmentDto.FileName, attachmentDto.PhysicalPath);
            attachmentDto.AbsolutePath = result.AbsoluteUrl;
            attachmentDto.ETag = result.ETag;
            return Ok(attachmentDto);
        }

        /// <summary>
        /// 上传到AliOss
        /// </summary>
        /// <param name="category"></param>
        /// <param name="fileName"></param>
        /// <param name="filePhycialPath"></param>
        /// <returns></returns>
        private async Task<OssResult> UploadToOss(string category, string fileName, string filePhycialPath)
        {
            var bucketName = "";
            if (category.ToLower() == DirectoryCategory.Images.ToString().ToLower())
            {
                bucketName = ConfigurationManager.AppSettings["imageBucket"];

            }
            else if (category.ToLower() == DirectoryCategory.Videos.ToString().ToLower())
            {
                bucketName = ConfigurationManager.AppSettings["videoBucket"];
            }
            else
            {
                bucketName = ConfigurationManager.AppSettings["defaultBucket"];
            }
            return OssClientFactory.UploadToPublic(bucketName, fileName, filePhycialPath);
        }

        /// <summary>
        /// 上传文件
        /// </summary>
        /// <param name="direcatoryName">目录分类</param>
        /// <returns></returns>
        private async Task<AttachmentDto> Upload(string direcatoryName)
        {
            var result = new AttachmentDto();
            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }
            var datePath = DateTime.Now.ToString("yyyyMMdd");
            var savePath = FileStoreManager.CreateDirectory(direcatoryName, datePath);
            var fileUrl = String.Format("{0}/{1}/", direcatoryName, datePath);
            var provider = new WithExtMultipartFormDataStreamProvider(savePath);
            await Request.Content.ReadAsMultipartAsync(provider);
            if (provider.FileData.Count > 0)
            {
                var blob = provider.Blobs[0];
                var relativeUrl = fileUrl + blob.SavedName;
                result = new AttachmentDto
                {
                    OriginalName = blob.FileName,
                    FileName = blob.SavedName,
                    VirtualPath = relativeUrl,
                    AbsolutePath = FileStoreManager.GetFileAbsoluteUrl(relativeUrl),
                    PhysicalPath = savePath + "\\" + blob.SavedName,
                    FileSize = blob.Size
                };
            }
            return result;
        }

        #endregion

        #region 文件上传至OOS
        /// <summary>
        /// 文件上传到对应目录
        /// </summary>
        /// <returns>文件信息</returns>
        [HttpPost]
        [ResponseType(typeof(ApiResponse<AttachmentDto>))]
        [Route("Upload/Oss")]
        public async Task<IHttpActionResult> UploadToOss()
        {
            var bucketName = ConfigurationManager.AppSettings["bucket"];
            var fileKey = Guid.NewGuid().ToString();
            var filePath = HttpContext.Current.Server.MapPath("~/Resources/test.png");
            AliyunOSSClient.OssClientFactory.UploadToPublic(bucketName, fileKey, filePath);
            return Ok(ApiResponse.Ok(1));
        }
        #endregion
    }
}
