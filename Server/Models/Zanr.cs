using System.Globalization;

namespace Models
{
    public class Zanr
    {
        public required string Naziv {get; set;}

        public List<Knjiga>? Knjige {get; set;}
    }
}