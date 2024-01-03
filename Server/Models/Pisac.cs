using System.Globalization;

namespace Models
{
    public class Pisac
    {
        public required string Ime {get; set;}

        public required string Prezime {get; set;}

        public DateOnly DatumRodjenja {get; set;}

        public DateOnly? DatumSmrti {get; set;}

        public string? Nacionalnost {get; set;}

        public string? Fotografija {get; set;}

        public List<Knjiga>? Knjige {get; set;}
    }
}