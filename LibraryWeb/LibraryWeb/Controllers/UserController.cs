using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Model;
using BLL;
using TXK.Component.Tools;
using System.Configuration;
using TXK.Component.Tools.EnumEntity;
using TXK.Component.Tools.Log;
using TXK.Component.Tools.Cache;
using System.Text;
using LibraryWeb.Extensions;
using LibraryWeb.FilterExtensions;

namespace LibraryWeb.Controllers
{
    
    public class UserController : Controller
    {
        private readonly IUserInterface userService = new UserService();

        // GET: User
        public ActionResult Index()
        {
            var pagingModel = new PagingModel<User>();

            pagingModel.PageIndex = Convert.ToInt32(Request["PageIndex"] ?? ConfigurationManager.AppSettings["PageIndex"]);
            pagingModel.PageSize = Convert.ToInt32(Request["PageSize"] ?? ConfigurationManager.AppSettings["PageSize"]);
            pagingModel.Items = userService.FindPageList(pagingModel.PageSize, pagingModel.PageIndex, out pagingModel.TotalNumber, m => m.CreateTime, false, m => m.IsDeleted.Equals(false)).ToList();
            ViewBag.PagingModel = pagingModel;
            var model = pagingModel.Items;
            return View(model);
        }
        public ActionResult AddUser(Int32? id)
        {
            var model = new User();
            ViewBag.sexDisplay = EnumHelper.EnumToDictionary<SexEnum>().Select(m => new SelectListItem() { Text = m.Key, Value = m.Value }).ToList();

            if (!string.IsNullOrWhiteSpace(id.ToString()))
            {
                model = userService.GetByKey(id);
            }
            ViewBag.userId = model.UserID;
            return View(model);
        }
        [HttpPost]
        /// <summary>
        /// 保存或者修改用户信息
        /// </summary>
        /// <param name="model"></param>
        /// <param name="form"></param>
        /// <returns></returns>
        public JsonResult SaveUser(User model, FormCollection form)
        {
            Response res = new Response();
            if (model.UserID!=0)//修改
            {
                if (userService.Update(model) > 0)
                {
                    res.Code = 1;
                    res.Message = "修改用户信息成功";
                    res.Data = model;
                }
                else
                {
                    res.Code = 0;
                    res.Message = "修改用户信息失败";
                    res.Data = model;
                }
            }
            else//新增
            {
                var entity = userService.Entities.Where(m => m.UserUid.Equals(model.UserUid)).ToList();
                if (entity != null && entity.Count > 0)
                {
                    res.Code = 0;
                    res.Message = "已存在该用户";
                    res.Data = model;
                }
                else
                {
                    if (userService.Insert(model, true) > 0)
                    {
                        res.Code = 1;
                        res.Message = "添加用户信息成功";
                        res.Data = model;
                    }
                    else
                    {
                        res.Code = 0;
                        res.Message = "添加用户信息失败";
                        res.Data = model;
                    }
                }
                    
            }

            return Json(res);



        }

        public ActionResult DeleteUser(string id)
        {
            Response res = new Response();
            if (!string.IsNullOrWhiteSpace(id))
            {
                try
                {
                    var Id = Convert.ToInt32(id);
                    var entity = userService.GetByKey(Id);
                    entity.IsDeleted = true;
                    if (userService.Update(entity) > 0)
                    {
                        res.Code = 1;
                        res.Message = "删除用户成功";
                        res.Data = entity;
                    }
                    else
                    {
                        res.Code = 0;
                        res.Message = "删除用户失败";
                        res.Data = null;
                    }
                }
                catch (Exception ex)
                {
                    LogHelper.WriteLog(ex.ToString());
                }

            }
            return RedirectToAction("Index", "User");

        }

        /// <summary>
        /// 判断用户是否存在
        /// </summary>
        /// <param name="UserID"></param>
        /// <returns></returns>
        public ActionResult CheckUserIsExist(String UserUid)
        {
            Response res = new Response();
            var entity = userService.Entities.Where(m => m.UserUid.Equals(UserUid)).ToList();
            if (entity != null && entity.Count > 0)
            {


                res.Code = 1;
                res.Message = "已存在此用户";
                res.Data = entity;



            }
            return Json(res);
        }


        /// <summary>
        /// 导出用户列表
        /// </summary>
        /// <param name="printName"></param>
        /// <returns></returns>
        public ActionResult Export(string printName)
        {
            var model = userService.Entities;
            string fileName = "用户列表" + ".doc";
            byte[] by = Encoding.UTF8.GetBytes(ControllerContext.RenderViewToString(printName, model));
            return File(by, "application/octet-stream", HttpUtility.UrlEncode(fileName, Encoding.UTF8));
        }


       

    }
}