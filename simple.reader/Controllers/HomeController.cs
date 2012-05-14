using System;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Xml;
using System.Xml.Linq;

namespace simple.reader.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult FeedProxy(string name, string url)
        {
            var feed = new {
                    Name = name,
                    Posts =  (from item in XDocument.Load(url).Descendants("item") 
                        select new 
                               {
                                   Title = item.Element("title").Value(),
                                   Published = item.Element("pubDate").Value<DateTime>().ToString("ddd MMM dd, yyyy HH:mm"),
                                   Link = item.Element("link").Value(),
                                   Tags = (from category in item.Elements("category") orderby category.Value() select  category.Value()).ToArray()
                               }).Take(5).ToArray()
                };
            return Json(feed);
        }

        [HttpPost]
        public ActionResult OffLineFeed(string name, string url)
        {
            System.Threading.Thread.Sleep(1000);
            using (var reader = System.IO.File.OpenRead(url))
            {
                var feed = new
                {
                    Name = name,
                    Posts = (from item in XDocument.Load(reader).Descendants("item")
                             select new
                             {
                                 Title = item.Element("title").Value(),
                                 Published = item.Element("pubDate").Value<DateTime>().ToString("ddd MMM dd, yyyy HH:mm"),
                                 Link = item.Element("link").Value(),
                                 Tags = (from category in item.Elements("category") orderby category.Value() select category.Value()).ToArray()
                             }).Take(5).ToArray()
                };
                return Json(feed);
            }
        }
    }

    public static class XmlNodeExtensions
    {
        public static string Value(this XElement element)
        {
            return element.Value<string>();
        }
        public static T Value<T>(this XElement element)
        {
            return element == null ? default(T) : (T)Convert.ChangeType(element.Value, typeof(T));
        }
    }
}