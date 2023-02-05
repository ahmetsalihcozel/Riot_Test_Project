const riotKey = "RGAPI-e6cf3214-1b77-47c5-a1a9-cbc259578d3e"



async function SumByName(sumName,property,server) {

  const link = `https://${server}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${sumName}?api_key=${riotKey}`
  const response = await fetch(link)
  let data = await response.json()

  if        (property == "id")            {
    return data.id

  }else if  (property == "iaccountId")    {
    return data.iaccountId

  }else if  (property == "puuid")         {
    return data.puuid

  }else if  (property == "name")          {
    return data.name

  }else if  (property == "profileIconId") {
    return data.profileIconId

  }else if  (property == "revisionDate")  {
    return data.revisionDate

  }else if  (property == "summonerLevel") {
    return data.summonerLevel
  }else                                   {
    console.log("Property is not valid")
  } 
}



var form = document.querySelector("button")
form.addEventListener("click", summonerSearch)



function summonerSearch(event) {
  event.preventDefault();
  var sumName = document.getElementById("textBox").value;
  console.log(sumName);
  writeHtml("accLevel",sumName);
}
  



function writeHtml(hmtlId,sumName){

  SumByName(sumName,"summonerLevel","tr1").then( result => { return document.getElementById(hmtlId).innerHTML = result } )

}






  
