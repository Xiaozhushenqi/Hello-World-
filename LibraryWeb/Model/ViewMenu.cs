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
    public  class ViewMenu
    {
        public int MenuTreeID { get; set; }


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
        public int ParentID { get; set; }

        /// <summary>
        /// 菜单链接地址
        /// </summary>
        public string Url { get; set; }

        public bool IsDeleted { get; set; }

      
        /// <summary>
        /// 备注
        /// </summary>
        [MaxLength(128)]
        public string Remark { get; set; }

        /// <summary>
        /// 预留字段1
        /// </summary>
        public string YuLiu1 { get; set; }

        /// <summary>
        /// 预留字段2
        /// </summary>
        public string YuLiu2 { get; set; }

        /// <summary>
        /// 预留字段3
        /// </summary>
        public string YuLiu3 { get; set; }

        public object MenuChildren { get; set; }
    }
}
