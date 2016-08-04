namespace MangoFramework.Infrastructure.ApiResponse
{
    /// <summary>
    /// ApiResponse分类
    /// </summary>
    public enum ResponseCode
    {
        /// <summary>
        /// 成功
        /// </summary>
        Ok = 0,

        /// <summary>
        /// 验证异常
        /// </summary>
        AuthorizationException = 10,
        
        /// <summary>
        /// 参数异常
        /// </summary>
        ArgumentException = 20,
        
        /// <summary>
        /// 基础服务调用异常
        /// </summary>
        InfrastructureException = 40,
        
        /// <summary>
        /// 业务异常
        /// </summary>
        BusinessException = -1,

        /// <summary>
        /// 未知
        /// </summary>
        UnKnown = 99,
    }
}
