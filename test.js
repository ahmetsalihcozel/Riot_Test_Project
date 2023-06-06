const riotKey = "RGAPI-e376f1b4-8d60-49be-a4fe-13d50d3072b7"
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

    players = []
    
    for(var i=0; i < 10; i++){
      var newDiv = document.createElement('div');
      newDiv.id = 'r'+i;
      newDiv.className = 'historyBox';
      newDiv.classList.add('row')
      newDiv.classList.add('matchHistoryStyle')
      document.getElementById('matchHistory').appendChild(newDiv);

      for(var j=0; j < 10; j++){

        let infoGame = {
          "kills": matchDatas[i].info.participants[j].kills,
          "deaths": matchDatas[i].info.participants[j].deaths,
          "assists": matchDatas[i].info.participants[j].assists,
          "summonerName": matchDatas[i].info.participants[j].summonerName,
          "championName": matchDatas[i].info.participants[j].championName,
          "item0": matchDatas[i].info.participants[j].item0,
          "item1": matchDatas[i].info.participants[j].item1,
          "item2": matchDatas[i].info.participants[j].item2,
          "item3": matchDatas[i].info.participants[j].item3,
          "item4": matchDatas[i].info.participants[j].item4,
          "item5": matchDatas[i].info.participants[j].item5,
          "item6": matchDatas[i].info.participants[j].item6,
        }
        
        if (infoGame.summonerName == sumName){

          var champImg = document.createElement('champImg');
          champImg.src =`http://ddragon.leagueoflegends.com/cdn/13.3.1/img/champion/${infoGame.championName}.png`

          var item0 = document.createElement('item0');
          var item1 = document.createElement('item1');
          var item2 = document.createElement('item2');
          var item3 = document.createElement('item3');
          var item4 = document.createElement('item4');
          var item5 = document.createElement('item5');
          var item6 = document.createElement('item6');
          item0.src = `http://ddragon.leagueoflegends.com/cdn/13.3.1/img/item/${infoGame.item0 = (infoGame.item0 == 0) ? 7050 : infoGame.item0}.png`
          item1.src = `http://ddragon.leagueoflegends.com/cdn/13.3.1/img/item/${infoGame.item1 = (infoGame.item1 == 0) ? 7050 : infoGame.item1}.png`
          item2.src = `http://ddragon.leagueoflegends.com/cdn/13.3.1/img/item/${infoGame.item2 = (infoGame.item2 == 0) ? 7050 : infoGame.item2}.png`
          item3.src = `http://ddragon.leagueoflegends.com/cdn/13.3.1/img/item/${infoGame.item3 = (infoGame.item3 == 0) ? 7050 : infoGame.item3}.png`
          item4.src = `http://ddragon.leagueoflegends.com/cdn/13.3.1/img/item/${infoGame.item4 = (infoGame.item4 == 0) ? 7050 : infoGame.item4}.png`
          item5.src = `http://ddragon.leagueoflegends.com/cdn/13.3.1/img/item/${infoGame.item5 = (infoGame.item5 == 0) ? 7050 : infoGame.item5}.png`
          item6.src = `http://ddragon.leagueoflegends.com/cdn/13.3.1/img/item/${infoGame.item6 = (infoGame.item6 == 0) ? 7050 : infoGame.item6}.png`

          document.getElementById('r'+i).innerHTML = `
            <div id="champIconDiv" class="col-3">
              <img src=\"${champImg.src}" class="champIcon">
            </div>
            <div id="matchInfo" class="col-9">
              <div id="kdaRow" class="row">
                <p> K/D/A:  ${infoGame.kills} / ${infoGame.deaths} / ${infoGame.assists} </p>
              </div>
              <div id="itemIconRow" class="row">
                <img src=\"${item0.src}" class="itemIcon">
                <img src=\"${item1.src}" class="itemIcon">
                <img src=\"${item2.src}" class="itemIcon">
                <img src=\"${item3.src}" class="itemIcon">
                <img src=\"${item4.src}" class="itemIcon">
                <img src=\"${item5.src}" class="itemIcon">
                <img src=\"${item6.src}" class="itemIcon">
              </div>
            </div>         
          `




          document.getElementById('r'+i).classList.add("navBarText")

          
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


  
