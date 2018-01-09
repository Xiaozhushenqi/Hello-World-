using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Configuration;
namespace TXK.Component.Tools.Cache
{
    public class CacheHelper
    {
        static ICache cacheWriter { set; get; }
        static CacheHelper()
        {
            var instance = Assembly.Load(ConfigurationManager.AppSettings["assemblyName"]).GetType(ConfigurationManager.AppSettings["nameSpaceName"]);
            var cacheInstance= Activator.CreateInstance(instance);
            cacheWriter = (ICache)cacheInstance;
        }
       
        public static void AddCache(string key, object value)
        {
           
            cacheWriter.AddCache(key, value);
        }

        public static void AddCache(string key, object value, DateTime expiredTime)
        {
            cacheWriter.AddCache(key, value, expiredTime);
        }

        public static object GetCache(string key)
        {
           return cacheWriter.GetCache(key);
        }

        public static T GetCache<T>(string key)
        {
            return (T)cacheWriter.GetCache<T>(key);
        }

        public static void SetCache(string key, object value)
        {
            cacheWriter.SetCache(key, value);
        }

        public static void SetCache(string key, object value, DateTime expiredTime)
        {
            cacheWriter.SetCache(key, value, expiredTime);
        }
    }
}
