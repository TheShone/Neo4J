using System.Text.RegularExpressions;
using Neo4j.Driver;

namespace Controllers;
    [ApiController]
    [Route("[controller]")]
    public class IzdavacController:ControllerBase
    {
        private readonly IDriver _driver;
        public IzdavacController()
        {
            _driver = GraphDatabase.Driver("neo4j+s://8528ea53.databases.neo4j.io", AuthTokens.Basic("neo4j", "7rPOZqbSx3SRB6Q1rFvG1hcMKcc4qolAKoB--c-px6o"));
        }

        [Route("AddIzdavaca")]
        [HttpPost]
        public async Task<IActionResult> AddIzdavaca([FromBody]Izdavac Izdavac)
        {
            try{
                 if(Izdavac.Naziv.Length<=0)
                    ModelState.AddModelError("Naziv","Naziv mora da ima vecu duzinu od 0");
                if(Izdavac.Adresa?.Length<=0)
                    ModelState.AddModelError("Adresa","Adresa mora da ima vecu duzinu od 0");
                if(Izdavac.KontaktTelefon?.Length<=0)
                    ModelState.AddModelError("KontaktTelefon","KontaktTelefon mora da ima vecu duzinu od 0");
                if(Izdavac.Email?.Length<=0|| Regex.IsMatch(Izdavac.Email!,@"^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$")==false)
                    ModelState.AddModelError("Email","Email ne moze da bude prazan i mora da bude u formatu emaila");
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                using(var session = _driver.AsyncSession())
                {
                    var result = await session.ExecuteWriteAsync(async tx=>{
                        var query = "CREATE (i:Izdavac) SET i=$izdavac return i";
                        var parameters= new {izdavac=Izdavac};
                        var cursor = await tx.RunAsync(query,parameters);
                        return cursor;
                    });
                    if(result!=null)
                    {
                        return Ok("Uspesno dodat Izdavac");
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
        [Route("UpdateIzdavaca/{id}")]
        [HttpPut]
        public async Task<IActionResult> UpdateIzdavaca(int id,[FromBody] Izdavac Izdavac)
        {
            try{
                 if(Izdavac.Naziv.Length<=0)
                    ModelState.AddModelError("Naziv","Naziv mora da ima vecu duzinu od 0");
                if(Izdavac.Adresa?.Length<=0)
                    ModelState.AddModelError("Adresa","Adresa mora da ima vecu duzinu od 0");
                if(Izdavac.KontaktTelefon?.Length<=0)
                    ModelState.AddModelError("KontaktTelefon","KontaktTelefon mora da ima vecu duzinu od 0");
                if(Izdavac.Email?.Length<=0|| Regex.IsMatch(Izdavac.Email!,@"^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$")==false)
                    ModelState.AddModelError("Email","Email ne moze da bude prazan i mora da bude u formatu emaila");
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                using(var session = _driver.AsyncSession())
                {
                    var result = await session.ExecuteWriteAsync(async tx=>{
                        var query = "MATCH (i:Izdavac) WHERE id(i) = $id SET i=$izdavac return i";
                        var parameters= new {id,izdavac=Izdavac};
                        var cursor = await tx.RunAsync(query,parameters);
                        return cursor;
                    });
                    if(result!=null)
                    {
                        return Ok("Uspesno izmenjen Izdavac");
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
    [Route("GetIzdavaca/{id}")]
    [HttpGet]
    public async Task<IActionResult> GetIzdaca(int id)
    {
        try{
            using(var session = _driver.AsyncSession())
            {
                var result = await session.ExecuteWriteAsync( async tx=>{
                    var query = "MATCH (i:Izdavac) WHERE id(i)=$id RETURN i";
                    var parameters= new {id};
                    var cursor = await tx.RunAsync(query,parameters);
                    var records = await cursor.ToListAsync();
                     if (records.Count > 0)
                    {
                        var record = records[0];
                        var id = record["i"].As<INode>().Id; 
                        var nodeProperties = record["i"].As<INode>().Properties; 
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
                    return BadRequest("Greska prilikom pribavljanju Izdavaca");
                }
            }
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [Route("GetIzdavace")]
    [HttpGet]
    public async Task<IActionResult> GetIzdavace()
    {
        try{
            using(var session = _driver.AsyncSession())
            {
                var result = await session.ExecuteWriteAsync( async tx=>{
                    var query = "MATCH (i:Izdavac) RETURN i";
                    var cursor = await tx.RunAsync(query);
                    var records = await cursor.ToListAsync();
                    var resultData = new List<object>();
                    foreach (var record in records)
                    {
                        var node = record["i"].As<INode>();
                        var id = node.Id; 
                        var nodeProperties = node.Properties; 
                        var resultObject = new
                        {
                            Id=id,
                            Naziv=nodeProperties["Naziv"],
                            Adresa=nodeProperties["Adresa"],
                            KontaktTelefon=nodeProperties["KontaktTelefon"],
                            Email=nodeProperties["Email"]
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
                    return BadRequest("Greska prilikom pribavljanju Izdavaca");
                }
            }
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [Route("DeleteIzdavac/{id}")]
    [HttpDelete]
    public async Task<IActionResult> DeleteIzdavac(int id)
    {
        try{
            using(var session = _driver.AsyncSession())
            {
                var result = await session.ExecuteWriteAsync(async tx=>{
                    var query = "MATCH (i:Izdavac) WHERE id(i)=$id NODETACH DELETE i";
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