using System.Text.RegularExpressions;
using Neo4j.Driver;

namespace Controllers;
    [ApiController]
    [Route("[controller]")]
    public class RecenzijaController:ControllerBase
    {
        private readonly IDriver _driver;
        public RecenzijaController()
        {
            _driver = GraphDatabase.Driver("neo4j+s://8528ea53.databases.neo4j.io", AuthTokens.Basic("neo4j", "7rPOZqbSx3SRB6Q1rFvG1hcMKcc4qolAKoB--c-px6o"));
        }
        [Route("AddRecenzija/{idCitaoca}/{idKnjige}")]
        [HttpPost]
        public async Task<IActionResult> AddRecenzija(int idCitaoca,int idKnjige,[FromBody] Recenzija Recenzija)
        {
            try{
                using(var session = _driver.AsyncSession())
                {
                     var result = await session.ExecuteWriteAsync(async tx =>
                    {
                        var query = "CREATE (r:Recenzija) SET r=$recenzija RETURN r";
                        var parameters = new { recenzija=Recenzija };

                        var cursor =  await tx.RunAsync(query, parameters);
                        var resultatList = await cursor.ToListAsync();

                        if(resultatList.Count>0)
                        {
                            var record = resultatList[0];
                            var createdNodeId = record["r"].As<INode>().Id;
                            
                            var relationQuery = "MATCH (r:Recenzija), (k:Knjiga) WHERE id(r) = $recenzijaId AND id(k) = $id MERGE (k)-[:OCENJEN_SA]->(r)";
                            var relationParameters = new { recenzijaId = createdNodeId, id=idKnjige };
                            await tx.RunAsync(relationQuery, relationParameters);
                            
                            
                            var relationQuery1 = "MATCH (r:Recenzija), (c:Citalac) WHERE id(r) = $recenzijaId AND id(c) = $id MERGE (r)-[:OCENJENA_OD_STRANE]->(c)";
                            var relationParameters1 = new { recenzijaId = createdNodeId, id=idCitaoca };
                            await tx.RunAsync(relationQuery1, relationParameters1);
                            
                            
                        }
                        
                        return cursor;
                    });
                    if (result != null)
                    {
                        return Ok("Recenzija uspešno kreirana.");
                    }
                    else
                    {
                        return BadRequest("Neuspešno dodavanje recenzije.");
                    }
                }
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [Route("GetRecenzijeZaKnjigu/{idKnjige}")]
        [HttpGet]
        public async Task<IActionResult> GetRecenzijeZaKnjigu(int idKnjige)
        {
            try
            {
                using (var session = _driver.AsyncSession())
                {
                    var result = await session.ExecuteReadAsync(async tx =>
                    {
                        var query = "MATCH (r:Recenzija)-[:OCENJENA_OD_STRANE]->(c:Citalac), (k:Knjiga)-[:OCENJEN_SA]->(r) WHERE id(k)=$idKnjige return r,c";
                        var parameters = new { idKnjige };
                        var cursor = await tx.RunAsync(query, parameters);
                        var records = await cursor.ToListAsync();

                        var recenzije = new List<Dictionary<string, object>>();
                        foreach (var record in records)
                        {
                            var recenzijaNode = record["r"].As<INode>();
                            var citalacNode = record["c"].As<INode>();

                            var recenzijaProperties = recenzijaNode.Properties;
                            var citalacProperties = citalacNode.Properties;

                            var recenzijaDictionary = new Dictionary<string, object>(recenzijaProperties)
                            {
                                { "id", recenzijaNode.Id },
                                { "citalac", citalacProperties }
                            };

                            recenzije.Add(recenzijaDictionary);
                        }

                        return recenzije;
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
        [Route("UpdateRecenzija/{id}")]
        [HttpPut]
        public async Task<IActionResult> UpdateRecenzija(int id,[FromBody]Recenzija Recenzija)
        {
            try{
                
                using(var session = _driver.AsyncSession())
                {
                    var result = await session.ExecuteWriteAsync(async tx=>{
                        var query="Match (r:Recenzija) WHERE id(r)=$id SET r=$recenzija RETURN r";
                        var parameters=new{id, recenzija=Recenzija};
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
        [Route("GetRecenziju/{id}")]
        [HttpGet]
        public async Task<IActionResult> GetRecenziju(int id)
        {
            try{
                using(var session = _driver.AsyncSession())
                {
                    var result = await session.ExecuteReadAsync(async tx => {
                        var query="Match (r:Recenzija) WHERE id(r)=$id RETURN r";
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
                        return BadRequest("Greska pri pribavljanju recenzije");
                    }
                }
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [Route("DeleteRecenziju/{id}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteRecenziju(int id)
        {
            try{
                using(var session =  _driver.AsyncSession())
                {
                    var result = await session.ExecuteWriteAsync(async tx=>{
                        var query = "Match (k:Recenzija)-[r]-() WHERE id(k)=$id delete k,r";
                        var parameters=new{id};
                        var cursor = await tx.RunAsync(query,parameters);
                        return cursor;
                    });
                    if(result != null)
                    {
                        return Ok("Uspesno obrisano recenzije");
                    }
                    else
                    {
                        return BadRequest("Doslo je do greske prilikom brisanja recenzije");
                    }
                }
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        } 
    }