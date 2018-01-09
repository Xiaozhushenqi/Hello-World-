using LibraryWeb.Controllers;
using Model;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TXK.Component.Tools.Cache;

namespace LibraryWeb.FilterExtensions
{
    public class LoginCheckFilterAttribute:ActionFilterAttribute
    {
        public Boolean IsCheck { set; get; }

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            base.OnActionExecuting(filterContext);
            if (IsCheck)
            {
                if (filterContext.HttpContext.Request.Cookies["userLoginId"]==null)
                {
                    filterContext.HttpContext.Response.Redirect("/Account/Login");
                    return;
                }
                else
                {
                    if (filterContext.HttpContext.Request.Cookies["userLoginId"].Value == null)
                    {
                        filterContext.HttpContext.Response.Redirect("/Account/Login");
                        return;
                    }
                    String userGuid = filterContext.HttpContext.Request.Cookies["userLoginId"].Value;
                    var user = JsonConvert.DeserializeObject<User>(CacheHelper.GetCache(userGuid).ToString());
                    if (user == null)
                    {
                        filterContext.HttpContext.Response.Redirect("/Account/Login");
                        return;
                    }
                    AccountController.userInfo = user;
                    CacheHelper.SetCache(userGuid, JsonConvert.SerializeObject(user), DateTime.Now.AddMinutes(20));
                }
               
            }
           
        }
    }
}