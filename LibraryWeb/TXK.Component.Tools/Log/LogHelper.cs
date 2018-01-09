using System;
using System.Collections.Generic;
using System.Threading;

namespace TXK.Component.Tools.Log
{
    // public delegate void WriteLogDel(String str);
    public class LogHelper
    {
        protected static Queue<String> ExceptionStringQueue = new Queue<string>();
       //protected static WriteLogDel WriteLogDelFuc;
        private static IList<ILogWriter> list = new List<ILogWriter>();
    
        static LogHelper()
        {
            //WriteLogDelFuc = WriteLogToFile;
            //WriteLogDelFuc += WriteLogToDB;
            list.Add(new DBWriter());
            list.Add(new TextFileWriter());
            ThreadPool.QueueUserWorkItem(m => {
                while (true)
                {
                    if (ExceptionStringQueue.Count > 0)
                    {
                        lock (ExceptionStringQueue)
                        {
                            String str = ExceptionStringQueue.Dequeue();
                            //在此处考虑使用观察着模式(可以借助使用委托链实现)
                            //同时还能使用接口的多态 创建List<Interface> 在此处进行Foreach
                            //WriteLogDelFuc(str);
                            foreach (var logWriter in list)
                            {
                                logWriter.WriteLog(str);
                            }
                        }
                    }
                    else
                    {
                        Thread.Sleep(30);
                    }
                }


            });
        }

        /// <summary>
        /// 把异常信息写入队列
        /// </summary>
        /// <param name="str"></param>
        public static void WriteLog(String str)
        {
            lock (ExceptionStringQueue)
            {
                ExceptionStringQueue.Enqueue(str);
            }
        }



        //#region 委托实现观察者模式的方法(此方法不用了使用接口多态代替观察者模式的实现)
        ///// <summary>
        ///// 把日志写入写入文件
        ///// </summary>
        ///// <param name="str">异常信息字符串</param>
        //private static void WriteLogToFile(String str)
        //{
        //    log4net.Config.XmlConfigurator.Configure();
        //    ILog logWriter = log4net.LogManager.GetLogger("Writer");
        //    logWriter.Error(str);
        //}

        ///// <summary>
        ///// 把日志写入数据库
        ///// </summary>
        ///// <param name="str">异常信息字符串</param>
        //private static void WriteLogToDB(String str)
        //{

        //}
        //#endregion

    }
}
