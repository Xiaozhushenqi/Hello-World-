using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model;
using DAL;
namespace BLL
{
    public class MenuTreeService:BaseAbstractImplement<MenuTree>,IMenuTree
    {
        public virtual IEnumerable<MenuTree> GetAllMenu()
        {
            var temp= this.Entities;
            return temp;
            
        }

        public override int Insert(MenuTree entity, bool isSave = true)
        {
            return base.Insert(entity, isSave);
        }

        public override int Update(MenuTree entity, bool isSave = true)
        {
            return base.Update(entity, isSave);
        }
        public override MenuTree GetByKey(object key)
        {
            return base.GetByKey(key);
        }

        

        #region Vision


        public List<ViewMenu> InitTree()

        {
            //1.获取所有的菜单列表
            var allMenuItem = this.GetAllMenu().ToList();

            //2.声明一个用来展示的模型变量的集合
            List<ViewMenu> viewMenuList = new List<ViewMenu>();

         

            foreach (var item in allMenuItem.Where(p => p.ParentID.Equals(0)))
            {  
                //3.声明一个viewModel（这个模型用来保存递归时候的用来查询子孩子的变量）
                ViewMenu viewMenuModel = new ViewMenu();
                viewMenuModel.MenuTreeID = item.MenuTreeID;
                viewMenuModel.Title = item.Title;
                viewMenuModel.ParentID = (int)item.ParentID;
                viewMenuModel.Url = item.Url;
                //4.这一步递归生成子节点
                viewMenuModel.MenuChildren = CreateChildTree(allMenuItem, viewMenuModel);
                viewMenuList.Add(viewMenuModel);
            }
            return viewMenuList;
        }

        /// <summary>
        /// 递归获取子菜单
        /// </summary>
        /// <param name="TreeList"></param>
        /// <param name="viewMenu"></param>
        /// <returns></returns>
        private List<ViewMenu> CreateChildTree(List<MenuTree> allMenuItem, ViewMenu viewMenu)
        {
            //2.声明一个用来展示的模型变量的集合
            List<ViewMenu> viewMenuList = new List<ViewMenu>();

          
            var children = allMenuItem.Where(t => t.ParentID == viewMenu.MenuTreeID);
            foreach (var chl in children)
            {
                ViewMenu viewMenuModel = new ViewMenu();
                viewMenuModel.MenuTreeID = chl.MenuTreeID;
                viewMenuModel.Title = chl.Title;
                viewMenuModel.ParentID = (int)chl.ParentID;
                viewMenuModel.Url = chl.Url;
                viewMenuModel.MenuChildren = CreateChildTree(allMenuItem, viewMenuModel);
                viewMenuList.Add(viewMenuModel);
            }
            return viewMenuList;
        }

        #endregion
    }
}
