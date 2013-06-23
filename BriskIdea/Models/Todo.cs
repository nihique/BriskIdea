using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BriskIdea.Model
{
    public class Todo
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public DateTime Created { get; set; }
    }
}