const riotKey = "RGAPI-41939e1d-5411-4a55-9c9c-a6dd4dc2c468"
var form = document.querySelector("button")
form.addEventListener("click", summonerSearch)





//----------------C-O-N-T-R-O-L-L-E-R-S----------------//

/*
if (gameType == "RankedSolo") {
    
} else if (gameType == "RankedFlex") {

} else {
  alert("Geçerli bir oyun tipip seçiniz: -RankedFlex- veya -RankedSolo-")
}
*/






//-----------------//MAIN-LOADER//-----------------//
function summonerSearch(event) {
  event.preventDefault();

  //--Function--Inputs--//
  const server = "tr1"
  const sumName = document.getElementById("textBox").value;

  //--Promises--//
  summonerPromise = SumByName(sumName,server)
  rankPromise = leagueV4(sumName,server)
  matchIdPromise = MatchIdsBypuuids(sumName,server,"gameType")
  matchDataPromise = getMatchData(matchIdPromise)

  //--HTML--Writers--//
  summonerPromise.then( summoner => { return document.getElementById("accName").innerHTML = summoner.name } )
  summonerPromise.then( summoner => { return document.getElementById("accLevel").innerHTML = summoner.summonerLevel } )
  rankPromise.then( ranked => { return document.getElementById("accRank").innerHTML = ranked.flex.rank } )
  rankPromise.then( ranked => { return document.getElementById("accTier").innerHTML = ranked.flex.tier } )
  summonerPromise.then( summoner => {return document.getElementById("sumIcon").src=`http://ddragon.leagueoflegends.com/cdn/${summoner.latestVersion}/img/profileicon/${summoner.profileIconId}.png`})
  
  matchDataPromise.then( matchDatas => { return console.log(matchDatas)})


  matchDataPromise.then( async function matchDat(matchDatas) {

    console.log(matchDatas[0].info.gameDuration)

    players = []
    
    for(var i=0; i < 10; i++){
      var newDiv = document.createElement('div');
      newDiv.id = 'r'+i;
      newDiv.className = 'historyBox';

      newDiv.classList.add('row')
      document.getElementById('matchHistory').appendChild(newDiv);

      for(var j=0; j < 10; j++){

        let infoGame = {
          "kills": matchDatas[i].info.participants[j].kills,
          "deaths": matchDatas[i].info.participants[j].deaths,
          "assists": matchDatas[i].info.participants[j].assists,
          "summonerName": matchDatas[i].info.participants[j].summonerName,
          "championName": matchDatas[i].info.participants[j].championName,
        }
        
        if (infoGame.summonerName == sumName){

          var champImg = document.createElement('champImg');
          
          champImg.src =`http://ddragon.leagueoflegends.com/cdn/13.3.1/img/champion/${infoGame.championName}.png`
          console.log(infoGame.championName)
          document.getElementById('r'+i).innerHTML = `<img src=\"${champImg.src}" class="champIcon"> Kills: ${infoGame.kills} / Deaths: ${infoGame.deaths} / Assists: ${infoGame.assists}`
          document.getElementById('r'+i).appendChild(champImg);
        }

      }      

    }


  } )




}

//----------------F-U-N-C-T-I-O-N-S----------------//

async function SumByName(sumName,server) {

  const link = `https://${server}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${sumName}?api_key=${riotKey}`
  const response = await fetch(link)
  let data = await response.json()

  const versLink = `https://ddragon.leagueoflegends.com/api/versions.json`
  const latestVersion = await fetch(versLink).then( result => { return result.json() } ).then( result => { return result[0] } )


  return {id: data.id,
          accountId: data.accountId,
          puuid: data.puuid, 
          name: data.name, 
          profileIconId: data.profileIconId,
          revisionDate: data.revisionDate,
          summonerLevel: data.summonerLevel,
          latestVersion: latestVersion
         }
} 

async function leagueV4(sumName,server) {

  const linkSummoner = `https://${server}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${sumName}?api_key=${riotKey}`
  const responseSummoner = await fetch(linkSummoner)
  let dataSummoner = await responseSummoner.json()

  const linkRank = `https://tr1.api.riotgames.com/lol/league/v4/entries/by-summoner/${dataSummoner.id}?api_key=${riotKey}`
  const responseRank = await fetch(linkRank)
  let dataRank = await responseRank.json()

  return {flex: dataRank[0],
          solo: dataRank[1]
         }  
}

async function MatchIdsBypuuids(sumName,server,gameType) {

  const startTime = Math.trunc(new Date().getTime() / 1000) - (24 * 60 * 60)
  const endTime = Math.trunc(new Date().getTime() / 1000)

  summonerPromise = SumByName(sumName,server)
  
  data = summonerPromise.then( async function summoner(summoner) { 
  
  linkMatchId = `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${summoner.puuid}/ids?
  startTime=${startTime}&endTime=${endTime}&queue=440&type=ranked&start=0&count=20&api_key=${riotKey}` 
  const response = await fetch(linkMatchId)
  let data = await response.json()

  return data
  } )

  return data

}

async function getMatchData(matchIdPromise) {

  matches = 
  matchIdPromise.then( async function matchesArray(array) {

    const len = array.length
    var matchLinks = []
    var matchDatas = []

    for(var i = 0; i < len; i++) {
        matchLinks[i] = `https://europe.api.riotgames.com/lol/match/v5/matches/${array[i]}?api_key=${riotKey}` 
        const linkmatch = matchLinks[i]
        const responsematch = await fetch(linkmatch)
        let data = await responsematch.json()
      
        matchDatas[i] = data

      }

    return matchDatas

  })

  return matches

}

function getLatestVersion() {
  const link = `https://ddragon.leagueoflegends.com/api/versions.json`
  const latestVersion = fetch(link).then( result => { return result.json() } ).then( result => { return result[0] } )
  return latestVersion
}

function writeHtml(hmtlId,promt) {
    document.getElementById(hmtlId).innerHTML = promt
}



// tüm ikonlar için geçerli bir fonksiyon yap


  
