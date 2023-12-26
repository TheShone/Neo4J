using System.Text.RegularExpressions;
using Neo4j.Driver;

namespace Controllers;
[ApiController]
[Route("[controller]")]
public class AdminController:ControllerBase
{
    private readonly IDriver _driver;

    public AdminController()
    {
        _driver = GraphDatabase.Driver("neo4j+s://8528ea53.databases.neo4j.io", AuthTokens.Basic("neo4j", "7rPOZqbSx3SRB6Q1rFvG1hcMKcc4qolAKoB--c-px6o"));
    }
    [Route("AddAdmina")]
    [HttpPost]
    public async Task<IActionResult> AddAdmina([FromBody]Admin Admin)
    {
        try{
            if(Admin.Ime.Length<=0)
                ModelState.AddModelError("Ime","Ime mora da ima vecu duzinu od 0");
            if(Admin.Prezime.Length<=0)
                ModelState.AddModelError("Prezime","Prezime mora da ima vecu duzinu od 0");
            if(Admin.KorisnickoIme.Length<=0)
                ModelState.AddModelError("KorisnickoIme","Korisnicko ime mora da ima vecu duzinu od 0");
            if(Admin.Email.Length<=0|| Regex.IsMatch(Admin.Email,@"^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$")==false)
                ModelState.AddModelError("Email","Email ne moze da bude prazan i mora da bude u formatu emaila");
            if(Admin.Sifra.Length<=0)
                ModelState.AddModelError("Sifra","Sifra mora da bude veca od 0");
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            using(var session = _driver.AsyncSession())
            {
                var result = await session.ExecuteWriteAsync( async tx=>{
                    var query = "CREATE (a:Admin  {ime: $ime, prezime: $prezime, korisnickoIme: $korisnickoIme, email:$email, sifra: $sifra, datumRodjenja: $datumRodjenja, slika: $slika}) RETURN a";
                    var parameters= new { ime = Admin.Ime,  prezime= Admin.Prezime, korisnickoIme= Admin.KorisnickoIme, email = Admin.Email, sifra=Admin.Sifra, datumRodjenja=Admin.DatumRodjenja,  slika=Admin.Slika};
                    var cursor = await tx.RunAsync(query,parameters);
                    return cursor;
                });
                if(result!=null)
                {
                    return Ok(result);
                }
                else
                {
                    return BadRequest("Greska prilikom dodavanja Admin");
                }
            }
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [Route("UpdateAdmina/{id}")]
    [HttpPut]
    public async Task<IActionResult> UpdateAdmina(int id,[FromBody] Citalac UpdatedAdmin)
        {
            try{
                if(UpdatedAdmin.Ime.Length<=0)
                    ModelState.AddModelError("Ime","Ime mora da ima vecu duzinu od 0");
                if(UpdatedAdmin.Prezime.Length<=0)
                    ModelState.AddModelError("Prezime","Prezime mora da ima vecu duzinu od 0");
                if(UpdatedAdmin.KorisnickoIme.Length<=0)
                    ModelState.AddModelError("KorisnickoIme","Korisnicko ime mora da ima vecu duzinu od 0");
                if(UpdatedAdmin.Email.Length<=0|| Regex.IsMatch(UpdatedAdmin.Email,@"^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$")==false)
                    ModelState.AddModelError("Email","Email ne moze da bude prazan i mora da bude u formatu emaila");
                if(UpdatedAdmin.Sifra.Length<=0)
                    ModelState.AddModelError("Sifra","Sifra mora da bude veca od 0");
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                using (var session = _driver.AsyncSession())
                {
                    var result = await session.ExecuteWriteAsync(async tx =>
                    {
                        string sifra= BCrypt.Net.BCrypt.HashPassword(UpdatedAdmin.Sifra,10);
                        UpdatedAdmin.Sifra=sifra;
                        var query = "Match (a:Admin) WHERE ID(a) = $id SET a = $updatedAdmin RETURN c";
                        var parameters = new { id,  updatedAdmin=UpdatedAdmin};

                        var cursor =  await tx.RunAsync(query, parameters);
                        return cursor;
                    });
                    if (result != null)
                    {
                        return Ok("Admin uspešno izmenjen.");
                    }
                    else
                    {
                        return BadRequest("Neuspešna izmena admina u bazu.");
                    }
                }
            }
            catch(Exception ex){
                return BadRequest(ex.Message);
            }
        }
    [Route("GetAdmina/{id}")]
    [HttpGet]
    public async Task<IActionResult> GetAdmina(int id)
    {
        try{
            using(var session = _driver.AsyncSession())
            {
                var result = await session.ExecuteWriteAsync( async tx=>{
                    var query = "MATCH (a:Admin) WHERE id(a)=$id RETURN a";
                    var parameters= new {id};
                    var cursor = await tx.RunAsync(query,parameters);
                    var records = await cursor.ToListAsync();
                     if (records.Count > 0)
                    {
                        var record = records[0];
                        var id = record["a"].As<INode>().Id; 
                        var nodeProperties = record["a"].As<INode>().Properties; 
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
                    return BadRequest("Greska prilikom pribavljanju Admina");
                }
            }
        }
        catch(Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    [Route("DeleteAdmin/{id}")]
    [HttpDelete]
    public async Task<IActionResult> DeleteAdmin(int id)
    {
        try{
            using(var session = _driver.AsyncSession())
            {
                var result = await session.ExecuteWriteAsync(async tx=>{
                    var query = "MATCH (a:Admin) WHERE id(a)=$id DELETE a";
                    var parameters=new {id};
                    var cursor=await tx.RunAsync(query,parameters);
                    return cursor.ConsumeAsync(); // Consume the result to get the summary
    
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