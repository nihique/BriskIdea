using System.Web.Http;
using BriskIdea.App_Start;
using WebActivator;

[assembly: PreApplicationStartMethod(typeof (BreezeWebApiConfig), "RegisterBreezePreStart")]

namespace BriskIdea.App_Start
{
    public static class BreezeWebApiConfig
    {
        public static void RegisterBreezePreStart()
        {
            GlobalConfiguration.Configuration.Routes.MapHttpRoute(
                name: "BreezeApi",
                routeTemplate: "api/breeze/{action}",
                defaults: new 
                    {
                        controller = "Breeze",
                        action = "Metadata",
                    }
                );
        }
    }
}