using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel;
using TXK.Component.Tools;
using TXK.Component.Tools.EnumEntity;

namespace Model
{
    [Serializable]
    /// <summary>
    /// 用户信息表
    /// </summary>
    public class User : BaseEntity
    {
        /// <summary>
        /// 用户ID 主键
        /// </summary>
        [Key]
        [Required]
        public Int32 UserID  { get; set; }

        public String UserUid { get; set; }
        /// <summary>
        /// 获取或设置用户名
        /// </summary>
        public string UserName { get; set; }

        /// <summary>
        /// 获取或设置密码
        /// </summary>
     
        public string Password { get; set; }

        /// <summary>
        /// 性别
        /// </summary>
        public SexEnum Sex { get; set; }

        /// <summary>
        /// 获取或设置用户邮箱
        /// </summary>

        public string Email { get; set; }

        /// <summary>
        /// 用户状态
        /// </summary>
        public int State { set; get; }

    }
}
