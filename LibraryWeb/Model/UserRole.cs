using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel;
using TXK.Component.Tools;

namespace Model
{
    /// <summary>
    ///  用户角色表
    /// </summary>
    public class UserRole : BaseEntity
    {
        /// <summary>
        /// 用户角色表ID
        /// </summary>
        [Key]
        [Required]
        public int UserRoleID { get; set; }
        /// <summary>
        /// 角色ID  
        /// </summary>
        public  int RoleID { get; set; }
        /// <summary>
        /// 用户ID
        /// </summary>
        public  int UserID { get; set; }
    }
}
