using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TXK.Component.Tools
{
   public static class EnumHelper
    {
        public static Dictionary<string, string> EnumToDictionary<TEnum>()
        {
            Dictionary<string, string> dic = new Dictionary<string, string>();
            var keys = Enum.GetNames(typeof(TEnum));
            var values = Enum.GetValues(typeof(TEnum));
            for (int i = 0; i < keys.Length; i++)
            {
                dic.Add(keys[i], values.GetValue(i).ToString());
            }

            return dic;
        }
    }
}
