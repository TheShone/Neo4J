using System.Globalization;

namespace Models
{
    public class Zanr
    {
        [Key]
        public int ID { get; set;}

        public required string Naziv {get; set;}
    }
}