using System.Globalization;

namespace Models
{
    public class Pisac
    {
        [Key]
        public int ID { get; set;}
        public required string Ime {get; set;}

        public required string Prezime {get; set;}
        [JsonConverter(typeof(DateOnlyConverter))]
        public DateOnly DatumRodjenja {get; set;}
        [JsonConverter(typeof(DateOnlyConverter))]
        public DateOnly? DatumSmrti {get; set;}

        public string? Nacionalnost {get; set;}

        public string? Fotografija {get; set;}

    }
}