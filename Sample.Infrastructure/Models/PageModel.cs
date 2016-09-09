using System.Collections.Generic;

namespace SaiQuaner.Infrastructure.Models
{
    /// <summary>
    /// 分页模型
    /// </summary>
    public class PageModel<T>
    {
        #region 构造器
        public PageModel()
        {
        }
        public PageModel(int pageNumber, int pageSize)
        {
            PageNumber = pageNumber;
            PageSize = pageSize;
        }
        public PageModel(int pageNumber, int pageSize, ICollection<T> data)
        {
            PageNumber = pageNumber;
            PageSize = pageSize;
            Data = data;
        }
        #endregion

        /// <summary>
        /// 页码 从1开始
        /// </summary>
        public int PageNumber { get; set; }

        /// <summary>
        /// 每页显示的条数
        /// </summary>
        public int PageSize { get; set; }

        /// <summary>
        /// 记录总数
        /// </summary>
        public long RecordCount { get; set; }

        /// <summary>
        /// 总页数
        /// </summary>
        public long PageCount
        {
            get
            {
                if (PageSize == 0)
                    return 0;
                return RecordCount % PageSize == 0 ? RecordCount / PageSize : RecordCount / PageSize + 1;
            }
        }

        /// <summary>
        /// 返回的结果集
        /// </summary>
        private IEnumerable<T> _data = new HashSet<T>();
        public IEnumerable<T> Data
        {
            get { return _data; }
            set { _data = value; }
        }
    }
}
