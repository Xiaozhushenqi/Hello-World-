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
    /// 角色权限表
    /// </summary>
    public class RolePrivilege : BaseEntity
    {
        /// <summary>
        /// 主键
        /// </summary>
        [Key]
        [Required]
        public int RolePrivilegeID { get; set; }

        /// <summary>
        /// 角色ID  
        /// </summary>
        public int RoleRoleID { get; set; }
        /// <summary>
        /// 菜单
        /// </summary>
        public int MenuTreeID { get; set; }

        /// <summary>
        /// 父菜单ID 
        /// </summary>
        public int ParentID { get; set; }
    }
}
