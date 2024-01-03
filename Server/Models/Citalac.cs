using System.Globalization;

namespace Models
{
    public class Citalac
    {
        public required string Ime {get; set;}
        public required string Prezime{get; set;}
        public required string KorisnickoIme{get;set;}
        public required string Email{get;set;}
        public required string Sifra{get; set;}

        public string? BrojTelefona {get;set;}

        public DateOnly DatumRodjenja{get; set;}

        public string? Slika {get; set;}

        public List<Knjiga>? Knjige {get; set;}
        

        
    }
}