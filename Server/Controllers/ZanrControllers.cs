using System.Text.RegularExpressions;
using Neo4j.Driver;

namespace Controllers;
    [ApiController]
    [Route("[controller]")]
    public class ZanrController:ControllerBase
    {
        private readonly IDriver _driver;
        public ZanrController()
        {
            _driver = GraphDatabase.Driver("neo4j+s://8528ea53.databases.neo4j.io", AuthTokens.Basic("neo4j", "7rPOZqbSx3SRB6Q1rFvG1hcMKcc4qolAKoB--c-px6o"));
        }

        [Route("AddZanr")]
        [HttpPost]
        public async Task<IActionResult> AddZanr([FromBody]Zanr Zanr)
        {
            try{
                if(Zanr.Naziv.Length<=0)
                    ModelState.AddModelError("Naziv","Zanr mora da ima vecu duzinu od 0");
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                using(var session = _driver.AsyncSession())
                {
                    var result = await session.ExecuteWriteAsync(async tx=>{
                        var query = "CREATE (z:Zanr) SET z=$zanr return z";
                        var parameters= new {zanr=Zanr};
                        var cursor = await tx.RunAsync(query,parameters);
                        return cursor;
                    });
                    if(result!=null)
                    {
                        return Ok("Uspesno dodat Zanr");
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
        [Route("UpdateZanr/{id}")]
        [HttpPut]
        public async Task<IActionResult> UpdateZanr(int id,[FromBody] Zanr Zanr)
        {
            try{
                if(Zanr.Naziv.Length<=0)
                    ModelState.AddModelError("Naziv","Zanr mora da ima vecu duzinu od 0");
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                using(var session = _driver.AsyncSession())
                {
                    var result = await session.ExecuteWriteAsync(async tx=>{
                        var query = "MATCH (z:Zanr) WHERE id(z) = $id SET z=$zanr return z";
                        var parameters= new {id,zanr=Zanr};
                        var cursor = await tx.RunAsync(query,parameters);
                        return cursor;
                    });
                    if(result!=null)
                    {
                        return Ok("Uspesno izmenjen Zanr");
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
    [Route("GetZanr/{id}")]
    [HttpGet]
    public async Task<IActionResult> GetZanr(int id)
    {
        try{
            using(var session = _driver.AsyncSession())
            {
                var result = await session.ExecuteWriteAsync( async tx=>{
                    var query = "MATCH (z:Zanr) WHERE id(z)=$id RETURN z";
                    var parameters= new {id};
                    var cursor = await tx.RunAsync(query,parameters);
                    var records = await cursor.ToListAsync();
                     if (records.Count > 0)
                    {
                        var record = records[0];
                        var id = record["z"].As<INode>().Id; 
                        var nodeProperties = record["z"].As<INode>().Properties; 
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
                    return BadRequest("Greska prilikom pribavljanju Zanra");
                }
            }
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [Route("DeleteZanr/{id}")]
    [HttpDelete]
    public async Task<IActionResult> DeleteZanr(int id)
    {
        try{
            using(var session = _driver.AsyncSession())
            {
                var result = await session.ExecuteWriteAsync(async tx=>{
                    var query = "MATCH (z:Zanr)-[r]-() WHERE id(z)=$id DELETE z,r";
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
    [Route("GetZanre")]
    [HttpGet]
    public async Task<IActionResult> GetZanre()
    {
        try{
            using(var session = _driver.AsyncSession())
            {
                var result = await session.ExecuteWriteAsync( async tx=>{
                    var query = "MATCH (z:Zanr) RETURN z";
                    var cursor = await tx.RunAsync(query);
                    var records = await cursor.ToListAsync();
                    var resultData = new List<object>();
                    foreach (var record in records)
                    {
                        var node = record["z"].As<INode>();
                        var id = node.Id;
                        var nodeProperties = node.Properties;
                        var resultObject = new
                        {
                            id,
                            Naziv = nodeProperties["Naziv"]
                        };
                        resultData.Add(resultObject);
                    }
                    return resultData;
                    
                });
                if(result!=null)
                {
                    return Ok(result);
                }
                else
                {
                    return BadRequest("Greska prilikom pribavljanju Zanra");
                }
            }
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}