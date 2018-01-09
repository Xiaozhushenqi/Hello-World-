using System;
using System.IO;
using System.Web.Mvc;

namespace LibraryWeb.Extensions
{
    internal static class ControllerContextExtension
    {
        public static String RenderViewToString(this ControllerContext context, String viewName, Object model)
        {
            var oldViewData = context.Controller.ViewData;
            var oldTempData = context.Controller.TempData;
            context.Controller.ViewData = new ViewDataDictionary();
            context.Controller.TempData = new TempDataDictionary();
            context.Controller.ViewData.Model = model;

            using (var textWriter = new StringWriter())
            {
                var viewResult = ViewEngines.Engines.FindPartialView(context, viewName);
                if (viewResult.View == null)
                {
                    throw new InvalidOperationException(string.Format("未找到视图“{0}”.", viewName));
                }
                var viewContext = new ViewContext(context, viewResult.View, context.Controller.ViewData, context.Controller.TempData, textWriter);
                viewResult.View.Render(viewContext, textWriter);

                context.Controller.ViewData = oldViewData;
                context.Controller.TempData = oldTempData;

                return textWriter.ToString();
            }
        }
    }
}