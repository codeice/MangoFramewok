namespace SaiQuaner.Infrastructure.Models
{
    public class Pager
    {
        public Pager()
        {
            this.PageNumber = 1;
            this.PageSize = 10;
        }

        public Pager(int pageNumber, int pageSize)
        {
            PageNumber = pageNumber;
            PageSize = pageSize;
        }

        /// <summary>
        /// 页码
        /// </summary>
        public int PageNumber { get; set; }

        /// <summary>
        /// 每页显示记录数
        /// </summary>
        public int PageSize { get; set; }
    }
}
