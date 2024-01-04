using System.Globalization;

namespace Models
{
    public class Knjiga
    {
        [Key]
        public int ID { get; set;}
        public required string Naslov {get; set;}

        public required int BrojStrana {get; set;}

        public required Zanr Zanr {get; set;}

        public  required Izdavac Izdavac{get; set;}

        public  required Pisac Pisac{get; set;}

        public int BrojnoStanje {get; set;}

        public List<Citalac>? Citaoci{get; set;}

        public List<Recenzija>? Recenzije{get; set;}

        public List<Nagrada>? Nagrade{get; set;}

        public List<Izdavanje>? Izdata{get; set;}

    }
}