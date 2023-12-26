using System.Text.RegularExpressions;
using Neo4j.Driver;

namespace Controllers;
    [ApiController]
    [Route("[controller]")]
    public class IzdavanjeController:ControllerBase
    {
        private readonly IDriver _driver;
        public IzdavanjeController()
        {
            _driver = GraphDatabase.Driver("neo4j+s://8528ea53.databases.neo4j.io", AuthTokens.Basic("neo4j", "7rPOZqbSx3SRB6Q1rFvG1hcMKcc4qolAKoB--c-px6o"));
        }
        [Route("AddIzdavanje")]
        [HttpPost]
        public async Task<IActionResult> AddIzdavanje([FromBody] Izdavanje Izdavanje)
        {
            try{
                using(var session = _driver.AsyncSession())
                {
                     var result = await session.ExecuteWriteAsync(async tx =>
                    {
                        var query = "CREATE (i:Izdavanje) SET i=$izdavanje RETURN i";
                        var parameters = new { izdavanje=Izdavanje };

                        var cursor =  await tx.RunAsync(query, parameters);
                        var resultatList = await cursor.ToListAsync();
                        if(resultatList.Count>0)
                        {
                            var record = resultatList[0];
                            var createdNodeId = record["i"].As<INode>().Id;
                            if (Izdavanje.Knjiga != null)
                            {
                                var relationQuery = "MATCH (i:Izdavanje), (k:Knjiga) WHERE ID(i) = $izdavanjeId AND k.Naslov = $naslov MERGE (k)-[:IZDATA]->(i)";
                                var relationParameters = new { izdavanjeId = createdNodeId, naslov = Izdavanje.Knjiga.Naslov };
                                await tx.RunAsync(relationQuery, relationParameters);
                            }
                            if(Izdavanje.Citalac!= null)
                            {
                                var relationQuery = "MATCH (i:Izdavanje), (c:Citalac) WHERE ID(k) = $izdavanjeID AND c.Email = $email MERGE (i)-[:IZNAJMLJENA_OD_STRANE]->(c)";
                                var relationParameters = new { izdavanjeID = createdNodeId, email = Izdavanje.Citalac.Email };
                                await tx.RunAsync(relationQuery, relationParameters);
                            }
                            
                        }
                        
                        return cursor;
                    });
                    if (result != null)
                    {
                        return Ok("Izdavanje uspešno kreirano.");
                    }
                    else
                    {
                        return BadRequest("Neuspešno iznajmljivanje.");
                    }
                }
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [Route("UpdateIzdavanje/{id}")]
        [HttpPut]
        public async Task<IActionResult> UpdateKnjigu(int id,[FromBody]Izdavanje Izdavanje)
        {
            try{
                
                using(var session = _driver.AsyncSession())
                {
                    var result = await session.ExecuteWriteAsync(async tx=>{
                        var query="Match (i:Izdavanje) WHERE id(i)=$id SET i=$izdavanje RETURN i";
                        var parameters=new{id, izdavanje=Izdavanje};
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
        [Route("GetIzdavanje/{id}")]
        [HttpGet]
        public async Task<IActionResult> GetIzdavanje(int id)
        {
            try{
                using(var session = _driver.AsyncSession())
                {
                    var result = await session.ExecuteReadAsync(async tx => {
                        var query="Match (i:Izdavanje) WHERE id(i)=$id RETURN i";
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
                        return BadRequest("Greska pri pribavljanju Izdavanja");
                    }
                }
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [Route("DeleteIzdavanje/{id}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteIzdavanje(int id)
        {
            try{
                using(var session =  _driver.AsyncSession())
                {
                    var result = await session.ExecuteWriteAsync(async tx=>{
                        var query = "Match (i:Izdavanje) WHERE id(i)=$id delete i";
                        var parameters=new{id};
                        var cursor = await tx.RunAsync(query,parameters);
                        return cursor;
                    });
                    if(result != null)
                    {
                        return Ok("Uspesno obrisano Izdavanje");
                    }
                    else
                    {
                        return BadRequest("Doslo je do greske prilikom brisanja izdavanja");
                    }
                }
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        } 
    }