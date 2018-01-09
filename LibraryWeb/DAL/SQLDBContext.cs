using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.ComponentModel.DataAnnotations.Schema;
namespace DAL
{
    public class SQLDBContext : DbContext
    {

        /// <summary>
        /// 实体User
        /// </summary>
        public DbSet<User> Users { get; set; }

        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<MenuTree> MenuTrees { get; set; }
        public DbSet<RolePrivilege> RolePermissions { get; set; }
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            //移除一对多的级联删除约定，想要级联删除可以在 EntityTypeConfiguration<TEntity>的实现类中进行控制
            modelBuilder.Conventions.Remove<OneToManyCascadeDeleteConvention>();
            //多对多启用级联删除约定，不想级联删除可以在删除前判断关联的数据进行拦截
            //modelBuilder.Conventions.Remove<ManyToManyCascadeDeleteConvention>();

            modelBuilder.Entity<User>().HasKey(m => m.UserID).Property(m =>
            m.UserID);

            modelBuilder.Entity<Role>().HasKey(m => m.RoleID).Property(m =>
          m.RoleID).HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity);

            modelBuilder.Entity<UserRole>().HasKey(m => m.UserRoleID).Property(m =>
          m.UserRoleID).HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity);

            modelBuilder.Entity<MenuTree>().HasKey(m => m.MenuTreeID);

            modelBuilder.Entity<RolePrivilege>().HasKey(m => m.RolePrivilegeID).Property(m =>
          m.RolePrivilegeID).HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity);

           // Database.SetInitializer<SQLDBContext>(new DropCreateDatabaseIfModelChanges<SQLDBContext>());

        }
    }
}
