using System.Globalization;

namespace Models
{
    public class Izdavanje
    {
        public DateTime VremeIzdavanja {get; set;}
        
        public DateTime? VremeVracanja {get; set;}

        public required string Status{get; set;}
        public required Knjiga Knjiga {get; set;}

        public required Citalac Citalac {get; set;}

        
    }
}