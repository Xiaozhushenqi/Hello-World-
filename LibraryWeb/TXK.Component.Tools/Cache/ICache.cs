using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TXK.Component.Tools.Cache
{
    public interface ICache
    {
        void AddCache(String key, object value);
        void AddCache(String key, object value,DateTime expiredTime);
        object GetCache(String key);

        void SetCache(String key, object value);
        void SetCache(String key, object value, DateTime expiredTime);
        T GetCache<T>(String key);
    }
}
