using LibraryWeb.FilterExtensions;
using System.Web;
using System.Web.Mvc;

namespace LibraryWeb
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
           // filters.Add(new HandleErrorAttribute());
            filters.Add(new MyExceptionFilterAttribute());
            filters.Add(new LoginCheckFilterAttribute()/* { IsCheck=true}*/);
        }
    }
}
