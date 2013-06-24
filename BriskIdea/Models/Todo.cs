using System;

namespace BriskIdea.Models
{
    public class Todo
    {
        public Todo()
        {
            IsDone = false;
            CreatedOn = DateTime.UtcNow;
        }

        public int Id { get; set; }             
        public string Title { get; set; } 
        public string Notes { get; set; } 
        public bool IsDone { get; set; }       
        public DateTime CreatedOn { get; set; }       
    }
}