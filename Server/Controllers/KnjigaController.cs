using System.Text.RegularExpressions;
using Microsoft.VisualBasic;
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
        [Route("UpdateKnjiga/{id}")]
        [HttpPut]
        public async Task<IActionResult> UpdateKnjigu(int id,[FromBody]Knjiga Knjiga)
        {
            try{
                if(Knjiga.BrojStrana<=0)
                    ModelState.AddModelError("BrojStrana","Broj strana mora da bude veci od 0");
                if(Knjiga.Naslov.Length<=0)
                    ModelState.AddModelError("Naslov","Knjiga mora da ima naslov");
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                    using(var session = _driver.AsyncSession())
                    {
                        var result = await session.ExecuteWriteAsync(async tx=>{
                            var query="Match (k:Knjiga) WHERE id(k)=$id SET c=$knjiga RETURN c";
                            var parameters=new{id, knjiga=Knjiga};
                            var cursor = await tx.RunAsync(query,parameters);
                            var record = cursor.ToListAsync();
                            return record;
                        });
                         if (result != null)
                        {
                            return Ok(result);
                        }
                        else
                        {
                            return BadRequest("Neuspešno brisanje citaoca.");
                        }
                        }
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [Route("GetKnjigu")]
        [HttpGet]
        public async Task<IActionResult> GetKnjigu(int id)
        {
            try{
                using(var session = _driver.AsyncSession())
                {
                    var result = await session.ExecuteReadAsync(async tx => {
                        var query="Match (k:Knjiga) WHERE id(k)=$id RETURN k";
                        var parameters=new{id};
                        var cursor = await tx.RunAsync(query,parameters);
                        var record = cursor.ToListAsync();
                        return record;
                    });
                    if(result != null)
                    {
                        return Ok(result);
                    }
                    else
                    {
                        return BadRequest("Greska pri izmeni Knjige");
                    }
                }
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [Route("DeleteKnjigu/{id}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteKnjigu(int id)
        {
            try{
                using(var session =  _driver.AsyncSession())
                {
                    var result = await session.ExecuteWriteAsync(async tx=>{
                        var query = "Match (k:Knjiga) WHERE id(k)=$id delete k";
                        var parameters=new{id};
                        var cursor = await tx.RunAsync(query,parameters);
                        return cursor;
                    });
                    if(result != null)
                    {
                        return Ok("Uspesno obrisana Knjiga");
                    }
                    else
                    {
                        return BadRequest("Doslo je do greske prilikom brisanja knjige");
                    }
                }
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        } 

    }
