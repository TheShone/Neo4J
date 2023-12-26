using System.Text.RegularExpressions;
using Neo4j.Driver;

namespace Controllers;
    [ApiController]
    [Route("[controller]")]
    public class PisacController:ControllerBase
    {
        private readonly IDriver _driver;
        public PisacController()
        {
            _driver = GraphDatabase.Driver("neo4j+s://8528ea53.databases.neo4j.io", AuthTokens.Basic("neo4j", "7rPOZqbSx3SRB6Q1rFvG1hcMKcc4qolAKoB--c-px6o"));
        }

        [Route("AddPisca")]
        [HttpPost]
        public async Task<IActionResult> AddPisca([FromBody]Pisac Pisac)
        {
            try{
                if(Pisac.Ime.Length<=0)
                    ModelState.AddModelError("Ime","Ime mora da ima vecu duzinu od 0");
                if(Pisac.Prezime?.Length<=0)
                    ModelState.AddModelError("Prezime","Prezime mora da ima vecu duzinu od 0");
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                using(var session = _driver.AsyncSession())
                {
                    var result = await session.ExecuteWriteAsync(async tx=>{
                        var query = "CREATE (p:Pisac) SET p=$pisac return p";
                        var parameters= new {pisac=Pisac};
                        var cursor = await tx.RunAsync(query,parameters);
                        return cursor;
                    });
                    if(result!=null)
                    {
                        return Ok("Uspesno dodat Pisac");
                    }
                    else
                    {
                        return BadRequest("Doslo do greske!");
                    }
                }
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [Route("UpdatePisca/{id}")]
        [HttpPut]
        public async Task<IActionResult> UpdatePisca(int id,[FromBody] Pisac Pisac)
        {
            try{
                if(Pisac.Ime.Length<=0)
                    ModelState.AddModelError("Ime","Ime mora da ima vecu duzinu od 0");
                if(Pisac.Prezime?.Length<=0)
                    ModelState.AddModelError("Prezime","Prezime mora da ima vecu duzinu od 0");
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                using(var session = _driver.AsyncSession())
                {
                    var result = await session.ExecuteWriteAsync(async tx=>{
                        var query = "MATCH (p:Pisac) WHERE id(p) = $id SET p=$pisac return p";
                        var parameters= new {id,pisac=Pisac};
                        var cursor = await tx.RunAsync(query,parameters);
                        return cursor;
                    });
                    if(result!=null)
                    {
                        return Ok("Uspesno izmenjen Pisac");
                    }
                    else
                    {
                        return BadRequest("Doslo do greske!");
                    }
                }
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    [Route("GetPisca/{id}")]
    [HttpGet]
    public async Task<IActionResult> GetPisca(int id)
    {
        try{
            using(var session = _driver.AsyncSession())
            {
                var result = await session.ExecuteWriteAsync( async tx=>{
                    var query = "MATCH (p:Pisac) WHERE id(p)=$id RETURN p";
                    var parameters= new {id};
                    var cursor = await tx.RunAsync(query,parameters);
                    var records = await cursor.ToListAsync();
                     if (records.Count > 0)
                    {
                        var record = records[0];
                        var id = record["p"].As<INode>().Id; 
                        var nodeProperties = record["p"].As<INode>().Properties; 
                        var resultDictionary = new Dictionary<string, object>(nodeProperties)
                        {
                            { "id", id }
                        };

                        return resultDictionary;
                    }
                    else
                    {
                        return null; 
                    }
                    
                });
                if(result!=null)
                {
                    return Ok(result);
                }
                else
                {
                    return BadRequest("Greska prilikom pribavljanju Pisca");
                }
            }
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [Route("DeletePisac/{id}")]
    [HttpDelete]
    public async Task<IActionResult> DeletePisac(int id)
    {
        try{
            using(var session = _driver.AsyncSession())
            {
                var result = await session.ExecuteWriteAsync(async tx=>{
                    var query = "MATCH (p:Pisac) WHERE id(p)=$id DELETE p";
                    var parameters=new {id};
                    var cursor=await tx.RunAsync(query,parameters);
                    return cursor.ConsumeAsync(); 
    
                });
                
                if(result != null)
                {
                    return Ok("Uspesno obrisan");
                }
                else
                {
                    return BadRequest("Doslo je do greske");
                }
            }
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    }