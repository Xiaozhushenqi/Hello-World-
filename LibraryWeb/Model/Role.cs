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
    /// 角色信息表
    /// </summary>
    public class Role : BaseEntity
    {
        /// <summary>
        /// 角色ID主键 
        /// </summary>
        [Key]
        [Required]
        public int RoleID { get; set; }


        /// <summary>
        /// 角色名称 
        /// </summary>
        public string RoleName { get; set; }

        /// <summary>
        /// 角色描述 
        /// </summary>
        public string RoleDesc { get; set; }

        /// <summary>
        /// 角色权限 
        /// </summary>
        public string PerMission { get; set; }

        
    }
}
