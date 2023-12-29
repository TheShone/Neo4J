using System.Text.RegularExpressions;
using Neo4j.Driver;

namespace Controllers;
    [ApiController]
    [Route("[controller]")]
    public class CitalacController:ControllerBase
    {
        private readonly IDriver _driver;
        public CitalacController()
        {
            _driver = GraphDatabase.Driver("neo4j+s://8528ea53.databases.neo4j.io", AuthTokens.Basic("neo4j", "7rPOZqbSx3SRB6Q1rFvG1hcMKcc4qolAKoB--c-px6o"));
        }
        [Route("AddCitaoca")]
        [HttpPost]
        public async Task<IActionResult> AddCitaoca([FromBody] Citalac Citalac)
        {
            try{
                if(Citalac.Ime.Length<=0)
                    ModelState.AddModelError("Ime","Ime mora da ima vecu duzinu od 0");
                if(Citalac.Prezime.Length<=0)
                    ModelState.AddModelError("Prezime","Prezime mora da ima vecu duzinu od 0");
                if(Citalac.KorisnickoIme.Length<=0)
                    ModelState.AddModelError("KorisnickoIme","Korisnicko ime mora da ima vecu duzinu od 0");
                if(Citalac.Email.Length<=0|| Regex.IsMatch(Citalac.Email,@"^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$")==false)
                    ModelState.AddModelError("Email","Email ne moze da bude prazan i mora da bude u formatu emaila");
                if(Citalac.Sifra.Length<=8)
                    ModelState.AddModelError("Sifra","Sifra mora da bude veca od 0");
                if (!ModelState.IsValid)
                    return BadRequest("ModelState");
                using (var session = _driver.AsyncSession())
                {
                    var result = await session.ExecuteWriteAsync(async tx =>
                    {
                        var query1 = "Match (c:Citalac) WHERE c.Email = $email or c.KorisnickoIme=$korisnicko RETURN c";
                        var parameters1 = new { email=Citalac.Email,  korisnicko=Citalac.KorisnickoIme};
                        var cursor1 =  await tx.RunAsync(query1, parameters1);
                        var resultatList= await cursor1.ToListAsync();
                        if(resultatList.Count==0)
                        {
                            string sifra= BCrypt.Net.BCrypt.HashPassword(Citalac.Sifra,10);
                            Citalac.Sifra=sifra;
                            var query = "CREATE (c:Citalac) SET c=$citaoc RETURN c";
                            var parameters = new { citaoc=Citalac};

                            var cursor =  await tx.RunAsync(query, parameters);
                            return cursor;
                        }
                        else
                            return null;
                    });
                    if (result != null)
                    {
                        return Ok("Citalac uspešno dodat u bazu.");
                    }
                    else
                    {
                        return BadRequest("Vec postoji nalog sa tim korisnickim imenom ili emailom");
                    }
                }
            }
            catch(Exception ex){
                return BadRequest(ex.Message);
            }
        }
        [Route("UpdateCitaoca/{id}")]
        [HttpPut]
        public async Task<IActionResult> UpdateCitaoca(int id,[FromBody] Citalac UpdatedCitalac)
        {
            try{
                if(UpdatedCitalac.Ime.Length<=0)
                    ModelState.AddModelError("Ime","Ime mora da ima vecu duzinu od 0");
                if(UpdatedCitalac.Prezime.Length<=0)
                    ModelState.AddModelError("Prezime","Prezime mora da ima vecu duzinu od 0");
                if(UpdatedCitalac.KorisnickoIme.Length<=0)
                    ModelState.AddModelError("KorisnickoIme","Korisnicko ime mora da ima vecu duzinu od 0");
                if(UpdatedCitalac.Email.Length<=0|| Regex.IsMatch(UpdatedCitalac.Email,@"^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$")==false)
                    ModelState.AddModelError("Email","Email ne moze da bude prazan i mora da bude u formatu emaila");
                if(UpdatedCitalac.Sifra.Length<=0)
                    ModelState.AddModelError("Sifra","Sifra mora da bude veca od 0");
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);
                using (var session = _driver.AsyncSession())
                {
                    var result = await session.ExecuteWriteAsync(async tx =>
                    {
                        string sifra= BCrypt.Net.BCrypt.HashPassword(UpdatedCitalac.Sifra,10);
                        UpdatedCitalac.Sifra=sifra;
                        var query = "Match (c:Citalac) WHERE ID(c) = $id SET c = $updatedCitalac RETURN c";
                        var parameters = new { id,  updatedCitalac=UpdatedCitalac};

                        var cursor =  await tx.RunAsync(query, parameters);
                        return cursor;
                    });
                    if (result != null)
                    {
                        return Ok("Citalac uspešno izmenjen.");
                    }
                    else
                    {
                        return BadRequest("Neuspešna izmena citaoca u bazu.");
                    }
                }
            }
            catch(Exception ex){
                return BadRequest(ex.Message);
            }
        }
        [Route("DeleteCitaoca/{id}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteCitaoca(int id)
        {
            try{
                using( var session = _driver.AsyncSession())
                {
                    var result = await session.ExecuteWriteAsync(async tx=>
                    {
                        var query = "Match (c:Citalac) WHERE id(c)=$id delete c";
                        var parameters = new {id};
                        var cursor = await tx.RunAsync(query,parameters);
                        return cursor;
                    });
                    if (result != null)
                    {
                        return Ok("Citalac uspešno obrisan.");
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
        [Route("GetCitaoca/{id}")]
        [HttpGet]
        public async Task<IActionResult> GetCitaoca(int id)
        {
            try{
                using( var session = _driver.AsyncSession())
                {
                    var result = await session.ExecuteReadAsync(async tx=>
                    {
                        var query = "Match (c:Citalac) WHERE id(c)=$id return c";
                        var parameters = new {id};
                        var cursor = await tx.RunAsync(query,parameters);
                        var records = await cursor.ToListAsync(); // Materialize the result
                        if (records.Count > 0)
                        {
                            var record = records[0];
                            var id = record["c"].As<INode>().Id; 
                            var nodeProperties = record["c"].As<INode>().Properties; 
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
    }
