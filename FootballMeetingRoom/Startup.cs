using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(FootballMeetingRoom.Startup))]
namespace FootballMeetingRoom
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
