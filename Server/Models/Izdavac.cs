using System.Globalization;

namespace Models
{
    public class Izdavac
    {
        public required string Naziv {get; set;}

        public string?  Adresa{get; set;}

        public string? KontaktTelefon{get; set;}

        public string? Email{get; set;}

        public List<Knjiga>? ObjavljeneKnjige {get;set;}
    }
}