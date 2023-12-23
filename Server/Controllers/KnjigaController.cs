using System.Text.RegularExpressions;
using Neo4j.Driver;

namespace Controllers;
    [ApiController]
    [Route("[controller]")]
    public class KnjigaController:ControllerBase
    {
        private readonly IDriver _driver;
        public KnjigaController()
        {
            _driver = GraphDatabase.Driver("neo4j+s://8528ea53.databases.neo4j.io", AuthTokens.Basic("neo4j", "7rPOZqbSx3SRB6Q1rFvG1hcMKcc4qolAKoB--c-px6o"));
        }
        [Route("AddKnjigu")]
        [HttpPost]
        public async Task<IActionResult> AddKnjigu([FromBody] Knjiga Knjiga)
        {
            try{
                if(Knjiga.BrojStrana<=0)
                    ModelState.AddModelError("BrojStrana","Broj strana mora da bude veci od 0");
                if(Knjiga.Naslov.Length<=0)
                    ModelState.AddModelError("Naslov","Knjiga mora da ima naslov");
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                using (var session = _driver.AsyncSession())
                {
                    var result = await session.ExecuteWriteAsync(async tx =>
                    {
                        var query = "CREATE (k:Knjiga {naslov: $naslov, brojStrana: $brojSTrana}) RETURN k";
                        var parameters = new { naslov = Knjiga.Naslov,  brojSTrana= Knjiga.BrojStrana };

                        var cursor =  await tx.RunAsync(query, parameters);
                        return cursor;
                    });
                    if (result != null)
                    {
                        return Ok("Knjiga uspešno dodata u bazu.");
                    }
                    else
                    {
                        return BadRequest("Neuspešno dodavanje knjige u bazu.");
                    }
                }
            }
            catch(Exception ex){
                return BadRequest(ex.Message);
            }
        }
    }
