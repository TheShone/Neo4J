using System.Globalization;

namespace Models
{
    public class Nagrada
    {

        public required string Naziv {get; set;}

        public required DateOnly DatumDodeljivanja {get; set;}

        public string? MestoDodeljivanja {get; set;}
        public required Knjiga Knjiga {get; set;}

        
    }
}