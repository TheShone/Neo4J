using System.Globalization;

namespace Models
{
    public class Izdavanje
    {
        [Key]
        public int ID { get; set;}
        public DateTime VremeIzdavanja {get; set;}
        
        public DateTime? VremeVracanja {get; set;}

        public required string Status{get; set;}
        
    }
}