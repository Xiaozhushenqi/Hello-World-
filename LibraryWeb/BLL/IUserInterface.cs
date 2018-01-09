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
    /// <summary>
    /// 此接口继承基类接口（如果业务还需要扩展 只需要在此接口中添加方法即可）
    /// </summary>
    public interface IUserInterface : BaseInterface<User>
    {
        Task<User> Login(User user);
    }
}
