using System.Linq;
using System.Web.Http;
using Newtonsoft.Json.Linq;
using Breeze.WebApi;
using BriskIdea.Models;

namespace BriskIdea.Controllers {

    [BreezeController]
    public class BreezeController : ApiController {

        public BreezeController()
        {
            Provider = new EFContextProvider<BriskIdeaDbContext>();
        }

        public EFContextProvider<BriskIdeaDbContext> Provider { get; private set; }

        public BriskIdeaDbContext Db 
        { 
            get { return Provider.Context; } 
        }

        [HttpGet]
        public string Metadata() 
        {
            return Provider.Metadata();
        }
        
        [HttpPost]
        public SaveResult SaveChanges(JObject saveBundle) 
        {
            return Provider.SaveChanges(saveBundle);
        }
        
        [HttpGet]
        public IQueryable<Todo> Todos() 
        { 
            return Db.Todos; 
        }
    }
}