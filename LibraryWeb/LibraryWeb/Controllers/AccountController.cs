using BLL;
using LibraryWeb.FilterExtensions;
using Model;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using TXK.Component.Tools;
using TXK.Component.Tools.Cache;

namespace LibraryWeb.Controllers
{
    [LoginCheckFilterAttribute(IsCheck =false)]
    public class AccountController : Controller
    {
        private readonly IUserInterface userService = new UserService();
        public static User userInfo { set; get; }
        // GET: Account
        public ActionResult Index()
        {
            return View();
        }


        public  ActionResult Login(/*User user,FormCollection form*/)
        {
            var model = new User();
            return View(model);
        }

        [HttpPost]
        public async Task<ActionResult> Login(User user, FormCollection form)
        {
            Response res = new Response();
            if (form["Validate"] != Session["ValidateCode"].ToString()||String.IsNullOrEmpty(Session["ValidateCode"].ToString()))
            {
                res.Code = 0;
                res.Message = "验证码不正确";
             
            }
            else
            {
                userInfo = await userService.Login(user);
                if (userInfo != null)
                {
                    res.Code = 2;
                    res.Message = "登陆成功";
                    res.Data = userInfo;
                    // Session["User"] = model;用redis分布式缓存模拟session
                    String userLoginId = Guid.NewGuid().ToString();
                   
                    CacheHelper.AddCache(userLoginId, JsonConvert.SerializeObject(userInfo), DateTime.Now.AddMinutes(20));

                    //往客户端写入cookie
                    Response.Cookies["userLoginId"].Value = userLoginId;
                }
                else
                {
                    res.Code = 1;
                    res.Message = "用户名或者密码不正确";
                    res.Data = userInfo;
                }
              
      
            }
          
            return Json(res); 
        }


        [AllowAnonymous]
        public ActionResult GetValidateCode()
        {
            ValidateCode vCode = new ValidateCode();
            int width = 140;
            int height = 35;
            int fontsize = 20;
            string code = string.Empty;
            byte[] bytes = ValidateCode.CreateValidateGraphic(out code, 4, width, height, fontsize);
            Session["ValidateCode"] = code;
            return File(bytes, @"image/jpeg");
        }

    }
}