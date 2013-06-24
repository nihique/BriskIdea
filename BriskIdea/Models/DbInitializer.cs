using System;
using System.Data.Entity;

namespace BriskIdea.Models
{
    public class DbInitializer : DropCreateDatabaseAlways<BriskIdeaDbContext>
    {
        protected override void Seed(BriskIdeaDbContext context)
        {
            var todos = new []
                {
                    new Todo
                    {
                        Title = "Buy and read 'Discover Meteor' boox",
                        Notes = "http://www.discovermeteor.com/",
                        IsDone = false,
                    },
                    new Todo
                    {
                        Title = "Read free FUJI XE-1 book",
                        Notes = "http://fujifilm-x.com/app/x-e1/en/?link=FBXworld",
                        IsDone = false,
                    },
                    new Todo
                    {
                        Title = "Buy and read 'Mastering the fujifilm x-pro 1' book from Amazon",
                        Notes = "http://www.amazon.com/Mastering-Fujifilm-X-Pro-Rico-Pfirstinger/dp/1937538141/ref=sr_1_1?ie=UTF8&qid=1366134541&sr=8-1&keywords=mastering+the+X-PRO1",
                        IsDone = false,
                    },
                    new Todo
                    {
                        Title = "Backup!!!",
                        Notes = null,
                        IsDone = false,
                    },
                    new Todo
                    {
                        Title = "Watch Pluralsight Typescript 0.8 course",
                        Notes = "And find course or introduction for TypeScript 0.9 version...",
                        IsDone = false,
                    },
                };

            Array.ForEach(todos, t => context.Todos.Add(t));

            context.SaveChanges(); // Save 'em
        }
    }
}
