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
    /// 菜单树结构表
    /// </summary>
    public class MenuTree : BaseEntity
    {
        /// <summary>
        /// 菜单树结构表ID
        /// </summary>
        [Key]
        [Required]

        public int MenuTreeID  { get; set; }


        /// <summary>
        /// 菜单标题
        /// </summary>
        public string Title { get; set; }
        /// <summary>
        /// 菜单描述
        /// </summary>
        public string Desn { get; set; }

        /// <summary>
        /// 菜单父ID 
        /// </summary>
        public int? ParentID { get; set; }

        /// <summary>
        /// 菜单链接地址
        /// </summary>
        public string Url  { get; set; }
    }
}
