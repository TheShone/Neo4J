using System.Globalization;

namespace Models
{
    public class Recenzija
    {
        [Key]
        public int ID { get; set;}
        public int Ocena{get;set;}
        public string? Komentar{get; set;}

    }
}