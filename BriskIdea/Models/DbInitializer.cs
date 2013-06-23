using System;
using System.Data.Entity;

namespace BriskIdea.Models
{
    public class DbInitializer : DropCreateDatabaseIfModelChanges<BriskIdeaDbContext>
    {
        protected override void Seed(BriskIdeaDbContext context)
        {
            var todos = new []
                {
                    new Todo
                    {
                        Title = "Discover Meteor",
                        Description = "http://www.discovermeteor.com/",
                        IsDone = false,
                    },
                };

            Array.ForEach(todos, t => context.Todos.Add(t));

            context.SaveChanges(); // Save 'em
        }
    }
}
