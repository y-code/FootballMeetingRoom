using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FootballMeetingRoom.Controllers
{
    //[Authorize]
    public class StrategyRoomController : Controller
    {
        // GET: StrategyRoom
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Board()
        {
            return View();
        }
    }
}