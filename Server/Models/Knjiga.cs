using System.Globalization;

namespace Models
{
    public class Knjiga
    {
        [Key]
        public int ID { get; set;}
        public required string Naslov {get; set;}

        public required int BrojStrana {get; set;}

    }
}