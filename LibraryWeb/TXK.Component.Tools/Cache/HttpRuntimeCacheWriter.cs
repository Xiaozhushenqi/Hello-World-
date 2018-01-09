using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace TXK.Component.Tools.Cache
{
    public class HttpRuntimeCacheWriter : ICache
    {
        public void AddCache(string key, object value)
        {
            //HttpRuntime类中Cache类作为HttpRuntime的静态成员变量。实际上是System.Web.Caching命名空间下的Cache类
            // HttpRuntime.Cache.Insert(key,value)等于System.Web.Caching.Cache.Insert()
            HttpRuntime.Cache.Insert(key,value);
        }

        public void AddCache(string key, object value, DateTime expiredTime)
        {
            HttpRuntime.Cache.Insert(key, value, null, expiredTime,TimeSpan.Zero);
        }

        public object GetCache(string key)
        {
           return HttpRuntime.Cache.Get(key);
        }

        public T GetCache<T>(string key)
        {
            return (T)HttpRuntime.Cache.Get(key);
        }

        public void SetCache(string key, object value)
        {
            HttpRuntime.Cache.Remove(key);
            HttpRuntime.Cache.Insert(key, value);
        }

        public void SetCache(string key, object value, DateTime expiredTime)
        {

            HttpRuntime.Cache.Remove(key);
            HttpRuntime.Cache.Insert(key, value, null, expiredTime, TimeSpan.Zero);
        }
    }
}
