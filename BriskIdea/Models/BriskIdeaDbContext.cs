using System.Data.Entity;

namespace BriskIdea.Models {
    
    public class BriskIdeaDbContext : DbContext 
    {
        static BriskIdeaDbContext()
        {
            // DEVELOPMENT ONLY: initialize the database
            Database.SetInitializer(new DbInitializer());
        }    

        public DbSet<Todo> Todos { get; set; }
    }
    
}