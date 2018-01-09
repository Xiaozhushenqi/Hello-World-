using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using TXK.Component.Data;

namespace DAL
{
    public abstract class BaseAbstractImplement<TEntity> : BaseInterface<TEntity> where TEntity : class
    {
        protected SQLDBContext EFContext = SQLDBContextFactory.CurrentContext();//数据库上下文单例模式

        #region 属性

        /// <summary>
        /// 获取当前实体的查询数据集
        /// </summary>
        public virtual IQueryable<TEntity> Entities
        {
            get { return EFContext.Set<TEntity>(); }
        }
       
        #endregion

        #region 方法

        /// <summary>
        ///  查找指定主键的实体记录
        /// </summary>
        /// <param name="key"> 指定主键 </param>
        /// <returns> 符合编号的记录，不存在返回null </returns>
        public virtual TEntity GetByKey(object key)
        {
            return EFContext.Set<TEntity>().Find(key);
        }
        /// <summary>
        /// 插入实体记录
        /// </summary>
        /// <param name="entity"> 实体对象 </param>
        /// <param name="isSave"> 是否执行保存 </param>
        /// <returns> 操作影响的行数 </returns>
        public virtual int Insert(TEntity entity, bool isSave = true)
        {
            EFContext.Entry<TEntity>(entity).State = System.Data.Entity.EntityState.Added;
            return isSave ? EFContext.SaveChanges() : 0;
        }

        /// <summary>
        /// 批量插入实体记录集合
        /// </summary>
        /// <param name="entities"> 实体记录集合 </param>
        /// <param name="isSave"> 是否执行保存 </param>
        /// <returns> 操作影响的行数 </returns>
        public virtual int Insert(IEnumerable<TEntity> entities, bool isSave = true)
        {
            foreach (var item in entities)
            {
                EFContext.Entry<TEntity>(item).State = System.Data.Entity.EntityState.Added;
            }
            return isSave ? EFContext.SaveChanges() : 0;
        }

        /// <summary>
        /// 删除指定编号的记录
        /// </summary>
        /// <param name="id"> 实体记录编号 </param>
        /// <param name="isSave"> 是否执行保存 </param>
        /// <returns> 操作影响的行数 </returns>
        public virtual int Delete(object id, bool isSave = true)
        {
            TEntity entity = EFContext.Set<TEntity>().Find(id);
            EFContext.Set<TEntity>().Attach(entity);
            EFContext.Entry<TEntity>(entity).State = System.Data.Entity.EntityState.Deleted;
            return entity != null ? Delete(entity, isSave) : 0;
        }
        /// <summary>
        /// 删除实体记录
        /// </summary>
        /// <param name="entity"> 实体对象 </param>
        /// <param name="isSave"> 是否执行保存 </param>
        /// <returns> 操作影响的行数 </returns>
        public virtual int Delete(TEntity entity, bool isSave = true)
        {
            EFContext.Set<TEntity>().Attach(entity);
            EFContext.Entry<TEntity>(entity).State = System.Data.Entity.EntityState.Deleted;
            return isSave ? EFContext.SaveChanges() : 0;
        }


        /// <summary>
        /// 删除实体记录集合
        /// </summary>
        /// <param name="entities"> 实体记录集合 </param>
        /// <param name="isSave"> 是否执行保存 </param>
        /// <returns> 操作影响的行数 </returns>
        public virtual int Delete(IEnumerable<TEntity> entities, bool isSave = true)
        {
            foreach (var item in entities)
            {
                EFContext.Set<TEntity>().Attach(item);
                EFContext.Entry<TEntity>(item).State = System.Data.Entity.EntityState.Deleted;
            }
            return isSave ? EFContext.SaveChanges() : 0;
        }

        /// <summary>
        /// 删除所有符合特定表达式的数据
        /// </summary>
        /// <param name="predicate"> 查询条件谓语表达式 </param>
        /// <param name="isSave"> 是否执行保存 </param>
        /// <returns> 操作影响的行数 </returns>
        public virtual int Delete(Expression<Func<TEntity, bool>> predicate, bool isSave = true)
        {
            List<TEntity> entities = EFContext.Set<TEntity>().Where(predicate).ToList();
            foreach (var item in entities)
            {
                EFContext.Set<TEntity>().Attach(item);
                EFContext.Entry<TEntity>(item).State = System.Data.Entity.EntityState.Deleted;
            }
            return entities.Count > 0 ? Delete(entities, isSave) : 0;
        }


        /// <summary>
        ///  更新实体记录
        /// </summary>
        /// <param name="entity"> 实体对象 </param>
        /// <param name="isSave"> 是否执行保存 </param>
        /// <returns> 操作影响的行数 </returns>
        public virtual int Update(TEntity entity, bool isSave = true)
        {
            EFContext.Set<TEntity>().Attach(entity);
            EFContext.Entry<TEntity>(entity).State = System.Data.Entity.EntityState.Modified;
            return isSave ? EFContext.SaveChanges() : 0;

        }

        /// <summary>
        /// 查找分页列表
        /// </summary>
        /// <param name="pageSize">每页记录数。必须大于1</param>
        /// <param name="pageIndex">页码。首页从1开始，页码必须大于1</param>
        /// <param name="totalNumber">总记录数</param>
        /// <param name="order">排序键</param>
        /// <param name="asc">是否正序</param>
        /// <returns></returns>
        public virtual IQueryable<TEntity> FindPageList<TKey>(int pageSize, int pageIndex, out int totalNumber, Expression<Func<TEntity, TKey>> order, bool asc)
        {
            //if (pageIndex < 1) pageIndex = 1;
            //if (pageSize < 1) pageSize = 10;
            IQueryable<TEntity> list = EFContext.Set<TEntity>();
            list = asc ? list.OrderBy(order) : list.OrderByDescending(order);
            totalNumber = list.Count();
            //return list.Skip((pageIndex - 1) * pageSize).Take(pageSize);
           return list.Skip(pageIndex* pageSize).Take(pageSize);

        }


        /// <summary>
        /// 查找分页列表
        /// </summary>
        /// <param name="pageSize">每页记录数。必须大于1</param>
        /// <param name="pageIndex">页码。首页从1开始，页码必须大于1</param>
        /// <param name="totalNumber">总记录数</param>
        /// <param name="order">排序键</param>
        /// <param name="predicate"> 查询条件谓语表达式 </param>
        /// <param name="asc">是否正序</param>
        /// <returns></returns>
        public virtual IQueryable<TEntity> FindPageList<TKey>(int pageSize, int pageIndex, out int totalNumber, Expression<Func<TEntity, TKey>> order, bool asc, Expression<Func<TEntity, Boolean>> predicate)
        {
            //if (pageIndex < 1) pageIndex = 1;
            //if (pageSize < 1) pageSize = 10;
            IQueryable<TEntity> list = EFContext.Set<TEntity>().Where(predicate);
            list = asc ? list.OrderBy(order) : list.OrderByDescending(order);
            totalNumber = list.Count();
            //return list.Skip((pageIndex - 1) * pageSize).Take(pageSize);
            return list.Skip(pageIndex * pageSize).Take(pageSize);

        }


        #endregion



    }
}
