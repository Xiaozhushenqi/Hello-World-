
using log4net;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TXK.Component.Tools.Log
{
    public class TextFileWriter : ILogWriter
    {
        public void WriteLog(string ex)
        {
            log4net.Config.XmlConfigurator.Configure();
            ILog logWriter = log4net.LogManager.GetLogger("Writer");
            logWriter.Error(ex);
        }
    }
}
