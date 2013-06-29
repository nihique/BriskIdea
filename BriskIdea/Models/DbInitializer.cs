using System;
using System.Data.Entity;

namespace BriskIdea.Models
{
    public class DbInitializer : DropCreateDatabaseAlways<BriskIdeaDbContext>
    {
        private static Random _random = new Random();

        protected override void Seed(BriskIdeaDbContext context)
        {
            for (int i = 0; i < 3; i++)
            {
                var todos = CreateTodos();
                Array.ForEach(todos, t => context.Todos.Add(t));
                context.SaveChanges(); // Save 'em
            }
        }

        private static Todo[] CreateTodos()
        {
            var todos = new[]
                {
                    new Todo
                        {
                            Title = "Buy and read 'Discover Meteor' boox",
                            Notes = "http://www.discovermeteor.com/",
                            IsDone = RandomBoolean,
                        },
                    new Todo
                        {
                            Title = "Read free FUJI XE-1 book",
                            Notes = "http://fujifilm-x.com/app/x-e1/en/?link=FBXworld",
                            IsDone = RandomBoolean,
                        },
                    new Todo
                        {
                            Title = "Buy and read 'Mastering the fujifilm x-pro 1' book from Amazon",
                            Notes = "http://www.amazon.com/Mastering-Fujifilm-X-Pro-Rico-Pfirstinger/dp/1937538141/ref=sr_1_1?ie=UTF8&qid=1366134541&sr=8-1&keywords=mastering+the+X-PRO1",
                            IsDone = RandomBoolean,
                        },
                    new Todo
                        {
                            Title = "Backup!!!",
                            Notes = null,
                            IsDone = RandomBoolean,
                        },
                    new Todo
                        {
                            Title = "Watch Pluralsight Typescript 0.8 course",
                            Notes = "And find course or introduction for TypeScript 0.9 version...",
                            IsDone = RandomBoolean,
                        },
                };
            return todos;
        }

        private static bool RandomBoolean
        {
            get { return _random.Next(100) % 2 == 0; }
        }
    }
}
