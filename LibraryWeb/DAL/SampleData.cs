using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.Entity;
using Model;
namespace DAL
{
    public class SampleData : DropCreateDatabaseIfModelChanges<SQLDBContext>
    {
        protected override void Seed(SQLDBContext context)
        {
            var menuTree = new List<MenuTree>()
            {
                new MenuTree(){ MenuTreeID=1,Title="系统设置",IsDeleted=false,CreateTime=DateTime.Now,ParentID=0},
                new MenuTree(){ MenuTreeID=2,Title="菜单管理",IsDeleted=false,CreateTime=DateTime.Now,ParentID=1},
                new MenuTree(){ MenuTreeID=3,Title="新增菜单",IsDeleted=false,CreateTime=DateTime.Now,ParentID=2,Url="http://localhost:3170/Menu/AddMenu"},
                new MenuTree(){ MenuTreeID=4,Title="用户管理",IsDeleted=false,CreateTime=DateTime.Now,ParentID=1},
                new MenuTree(){ MenuTreeID=5,Title="新增用户",IsDeleted=false,CreateTime=DateTime.Now,ParentID=4,Url="http://localhost:3170/User/AddUser"},
                new MenuTree(){ MenuTreeID=6,Title="菜单列表",IsDeleted=false,CreateTime=DateTime.Now,ParentID=2,Url="http://localhost:3170/Menu/Index"},
                new MenuTree(){ MenuTreeID=7,Title="用户列表",IsDeleted=false,CreateTime=DateTime.Now,ParentID=4,Url="http://localhost:3170/User/Index"},
            };
            var user = new List<User>()
            {
                new User() {UserUid="admin",UserName="谭小康",Password="123456" }
            };
            DbSet<User> Users = context.Set<User>();
            user.ForEach(m => Users.Add(m));
            context.SaveChanges();
            DbSet<MenuTree> MenuTrees = context.Set<MenuTree>();
            menuTree.ForEach(m => MenuTrees.Add(m));
            context.SaveChanges();
        }
    }
}
