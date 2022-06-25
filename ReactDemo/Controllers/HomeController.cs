using Microsoft.AspNetCore.Mvc;

namespace ReactDemo.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
