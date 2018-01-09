using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model;
using DAL;
using TXK.Component.Data;
namespace BLL
{
    public interface IMenuTree : BaseInterface<MenuTree>
    {
        IEnumerable<MenuTree> GetAllMenu();
        List<ViewMenu> InitTree();
    }
}
