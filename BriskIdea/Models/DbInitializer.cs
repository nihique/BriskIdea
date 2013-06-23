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
                    new Todo{Title = "Wake up"},
                    new Todo{Title = "Do dishes", IsDone = true},
                    new Todo{Title = "Mow lawn", IsDone = true},
                    new Todo{Title = "Try Breeze"},
                    new Todo{Title = "Tell the world"},
                    new Todo{Title = "Go home early"},
                };

            Array.ForEach(todos, t => context.Todos.Add(t));

            context.SaveChanges(); // Save 'em
        }
    }
}
