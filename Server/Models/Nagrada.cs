using System.Globalization;

namespace Models
{
    public class Nagrada
    {
        [Key]
        public int ID { get; set;}

        public required string Naziv {get; set;}

        public required DateOnly DatumDodeljivanja {get; set;}

        public string? MestoDodeljivanja {get; set;}
        public required Knjiga Knjiga {get; set;}

        
    }
}