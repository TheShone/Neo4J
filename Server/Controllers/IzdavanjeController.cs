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
        [Route("AddIzdavanje/{idCitaoca}/{idKnjige}")]
        [HttpPost]
        public async Task<IActionResult> AddIzdavanje(int idCitaoca,int idKnjige,[FromBody] Izdavanje Izdavanje)
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
                            var relationQuery = "MATCH (i:Izdavanje), (k:Knjiga) WHERE id(i) = $izdavanjeId AND id(k) = $id MERGE (k)-[:IZDATA]->(i)";
                            var relationParameters = new { izdavanjeId = createdNodeId, id =idKnjige };
                            await tx.RunAsync(relationQuery, relationParameters);
                        
                        
                            var relationQuery1 = "MATCH (i:Izdavanje), (c:Citalac) WHERE id(i) = $izdavanjeID AND id(c) = $id MERGE (i)-[:IZNAJMLJENA_OD_STRANE]->(c)";
                            var relationParameters1 = new { izdavanjeID = createdNodeId, id = idCitaoca };
                            await tx.RunAsync(relationQuery1, relationParameters1);
                            
                            
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
        [Route("GetIznajmljenihKnjigaZaCitaoca/{id}")]
        [HttpGet]
        public async Task<IActionResult> GetIznajmljenihKnjigaZaCitaoca(int id)
        {
            try
            {
                using (var session = _driver.AsyncSession())
                {
                    var result = await session.ExecuteReadAsync(async tx =>
                    {
                        var query = "MATCH (i:Izdavanje)-[:IZNAJMLJENA_OD_STRANE]->(c:Citalac), (k:Knjiga)-[:IZDATA]->(i) WHERE id(c)=$id return i,k";
                        var parameters = new { id };
                        var cursor = await tx.RunAsync(query, parameters);
                        var records = await cursor.ToListAsync();

                        var iznajme = new List<Dictionary<string, object>>();
                        foreach (var record in records)
                        {
                            var iznajmeNode = record["i"].As<INode>();
                            var knjigaNode = record["k"].As<INode>();

                            var iznajmeProperties = iznajmeNode.Properties;
                            var knjigaProperties = knjigaNode.Properties;

                            var recenzijaDictionary = new Dictionary<string, object>(iznajmeProperties)
                            {
                                { "id", iznajmeNode.Id },
                                { "knjigaId",knjigaNode.Id},
                                { "knjiga", knjigaProperties }
                            };

                            iznajme.Add(recenzijaDictionary);
                        }

                        return iznajme;
                    });

                    if (result != null)
                    {
                        return Ok(result);
                    }
                    else
                    {
                        return BadRequest("Greska pri pribavljanju recenzija za knjigu");
                    }
                }
            }
            catch (Exception ex)
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
                        var query = "Match (i:Izdavanje)-[r]-() WHERE id(i)=$id delete i,r";
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