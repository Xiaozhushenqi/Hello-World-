using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Model;
using DAL;
namespace BLL
{
    public class UserService : BaseAbstractImplement<User>, IUserInterface
    {
        public override int Insert(User entity, bool isSave = true)
        {
            return base.Insert(entity, isSave);
        }

        public Task<User> Login(User user)
        {
            return Task.Run<User>(() => { return base.Entities.Where(m => m.UserUid.Equals(user.UserUid) && m.Password.Equals(user.Password)).FirstOrDefault(); });

        }
    }
}
