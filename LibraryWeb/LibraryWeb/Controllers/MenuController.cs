using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Model;
using BLL;
using TXK.Component.Tools;
using System.Configuration;
using LibraryWeb.FilterExtensions;

namespace LibraryWeb.Controllers
{
   
    public class MenuController : Controller
    {
        //
        // GET: /Menu/

        private readonly IMenuTree menuTreeService = new MenuTreeService();


        /// <summary>
        /// 获取菜单列表信息
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            var pagingModel = new PagingModel<MenuTree>();

            pagingModel.PageIndex = Convert.ToInt32(Request["PageIndex"] ??ConfigurationManager.AppSettings["PageIndex"]);
            pagingModel.PageSize = Convert.ToInt32(Request["PageSize"] ?? ConfigurationManager.AppSettings["PageSize"]);
            pagingModel.Items = menuTreeService.FindPageList(pagingModel.PageSize, pagingModel.PageIndex, out pagingModel.TotalNumber, m=>m.CreateTime, false).ToList();
            ViewBag.PagingModel = pagingModel;
            var model = pagingModel.Items;
            return View(model);
        }

        public ActionResult Load()
        {
             List<ViewMenu> list = menuTreeService.InitTree();
            //JavaScriptSerializer jss = new JavaScriptSerializer();
            //return Json(jss.Serialize(list), JsonRequestBehavior.AllowGet);
            return Json(list, JsonRequestBehavior.AllowGet);            
        }

        [LoginCheckFilter(IsCheck = true)]
        /// <summary>
        /// 显示菜单列表
        /// </summary>
        /// <returns></returns>
        public ActionResult MenuDisplay()
        {
           
            return View();
        }

        public ActionResult AddMenu(int? id)
        {
            var model = new MenuTree();
            //修改
            if (id>0)
            {
              model=menuTreeService.GetByKey(id);
            }
            return View(model);
        }

        [HttpPost]
        /// <summary>
        /// 保存或者修改菜单
        /// </summary>
        /// <param name="model"></param>
        /// <param name="form"></param>
        /// <returns></returns>
        public JsonResult SaveMenu(MenuTree model,FormCollection form)
        {
            Response res = new Response();
            if (model.MenuTreeID>0)//修改
            {
                if (menuTreeService.Update(model,true)>0)
                {
                    res.Code = 1;
                    res.Message = "修改菜单成功";
                    res.Data = model;
                }
                else
                {
                    res.Code = 0;
                    res.Message = "修改菜单失败";
                    res.Data = model;
                }
                return Json(res);
            }
            else//添加
            {
                if (menuTreeService.Insert(model, true) > 0)
                {
                    res.Code = 1;
                    res.Message = "添加菜单成功";
                    res.Data = model;
                }
                else
                {
                    res.Code = 0;
                    res.Message = "添加菜单失败";
                    res.Data = model;
                }
                return Json(res);
            }
        }
    
    }
}