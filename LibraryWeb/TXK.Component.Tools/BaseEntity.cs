using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TXK.Component.Tools
{
    /// <summary>
    /// 可持久到数据库的领域模型的基类。
    /// </summary>
    [Serializable]
    public abstract class BaseEntity
    {
        #region 构造函数

        /// <summary>
        /// 数据实体基类
        /// </summary>
        protected BaseEntity()
        {
            IsDeleted = false;
            CreateTime = DateTime.Now;
           // HXM = CombHelper.NewComb();
        }

        #endregion

        #region 属性

        /// <summary>
        /// 唯一编号(做为候选码)
        /// </summary>
       // public Guid HXM { get; set; }
  
        /// <summary>
        /// 获取或设置 获取或设置是否禁用，逻辑上的删除，非物理删除
        /// </summary>
        public bool IsDeleted { get; set; }

        /// <summary>
        /// 获取或设置 添加时间
        /// </summary>

        public DateTime CreateTime { get; set; }
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
        /// <summary>
        /// 获取或设置 版本控制标识，用于处理并发
        /// </summary>
        //[Timestamp]
        //public byte[] Timestamp { get; set; }
        #endregion
    }
}


