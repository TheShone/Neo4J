using System.Text.RegularExpressions;
using Neo4j.Driver;

namespace Controllers;
    [ApiController]
    [Route("[controller]")]
    public class NagradaController:ControllerBase
    {
        private readonly IDriver _driver;
        public NagradaController()
        {
            _driver = GraphDatabase.Driver("neo4j+s://8528ea53.databases.neo4j.io", AuthTokens.Basic("neo4j", "7rPOZqbSx3SRB6Q1rFvG1hcMKcc4qolAKoB--c-px6o"));
        }
        [Route("AddNagrada")]
        [HttpPost]
        public async Task<IActionResult> AddNagrada([FromBody] Nagrada Nagrada)
        {
            try{
                if(Nagrada.Naziv.Length<=0)
                    ModelState.AddModelError("Nagrada","Naziv mora da bude veci od 0");
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                using(var session = _driver.AsyncSession())
                {
                     var result = await session.ExecuteWriteAsync(async tx =>
                    {
                        var query = "CREATE (n:Nagrada) SET n=$nagrada RETURN n";
                        var parameters = new { nagrada=Nagrada };

                        var cursor =  await tx.RunAsync(query, parameters);
                        var resultatList = await cursor.ToListAsync();
                        if(resultatList.Count>0)
                        {
                            var record = resultatList[0];
                            var createdNodeId = record["n"].As<INode>().Id;
                            if (Nagrada.Knjiga != null)
                            {
                                var relationQuery = "MATCH (n:Nagrada), (k:Knjiga) WHERE ID(n) = $nagradaId AND k.Naslov = $naslov MERGE (k)-[:OSVOJILA]->(n)";
                                var relationParameters = new { nagradaId = createdNodeId, naslov = Nagrada.Knjiga.Naslov };
                                await tx.RunAsync(relationQuery, relationParameters);
                            }
                            
                        }
                        
                        return cursor;
                    });
                    if (result != null)
                    {
                        return Ok("Nagrada uspešno dodeljena.");
                    }
                    else
                    {
                        return BadRequest("Neuspešno dodeljivanje nagrade.");
                    }
                }
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [Route("UpdateNagradu/{id}")]
        [HttpPut]
        public async Task<IActionResult> UpdateNagradu(int id,[FromBody]Nagrada Nagrada)
        {
            try{
                if(Nagrada.Naziv.Length<=0)
                    ModelState.AddModelError("Nagrada","Naziv mora da bude veci od 0");
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                using(var session = _driver.AsyncSession())
                {
                    var result = await session.ExecuteWriteAsync(async tx=>{
                        var query="Match (n:Nagrada) WHERE id(n)=$id SET n=$nagrada RETURN n";
                        var parameters=new{id, nagrada=Nagrada};
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
                        return BadRequest("Greska prilikom izmene.");
                    }
                }
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [Route("GetNagradu/{id}")]
        [HttpGet]
        public async Task<IActionResult> GetNagradu(int id)
        {
            try{
                using(var session = _driver.AsyncSession())
                {
                    var result = await session.ExecuteReadAsync(async tx => {
                        var query="Match (n:Nagrada) WHERE id(n)=$id RETURN n";
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
                        return BadRequest("Greska pri pribavljanju Nagrade");
                    }
                }
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [Route("DeleteNagrada/{id}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteNagrada(int id)
        {
            try{
                using(var session =  _driver.AsyncSession())
                {
                    var result = await session.ExecuteWriteAsync(async tx=>{
                        var query = "Match (n:Nagrada) WHERE id(n)=$id delete n";
                        var parameters=new{id};
                        var cursor = await tx.RunAsync(query,parameters);
                        return cursor;
                    });
                    if(result != null)
                    {
                        return Ok("Uspesno obrisano Nagrade");
                    }
                    else
                    {
                        return BadRequest("Doslo je do greske prilikom brisanja nagrade");
                    }
                }
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        } 
    }