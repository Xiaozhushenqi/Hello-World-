using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting.Messaging;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class SQLDBContextFactory
    {
        public static SQLDBContext CurrentContext()
        {
            SQLDBContext dbContext = CallContext.GetData("SQLDBContext") as SQLDBContext;
            if (dbContext == null)
            {
                dbContext = new SQLDBContext();
                CallContext.SetData("SQLDBContext", dbContext);
            }
            return dbContext;
        }
    }
}
