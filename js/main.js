var apiKey = '0922477c-c691-402f-bcd3-3d3c0e365cbc';
var summonerName = "";
var summonerRegion = "";
//Queries api.pvp.net for summoner ID from username, continues to rankingLookup() if name field is not empty.
function summonerLookup() {
    summonerName = $("#username").val();
    summonerRegion = $("#region").val();
    //constructs URL for querying Riot server for summonerID
    var summonerUrl = 'https://' + summonerRegion + '.api.pvp.net/api/lol/' + summonerRegion + '/v1.4/summoner/by-name/' + summonerName + '?api_key=' + apiKey;
    if (summonerName !== "") {
        $.get(summonerUrl, function (data) {
            var formattedName = summonerName.replace(" ", "").toLowerCase().trim(); //reformats summoner name to match format in returned data
            var summonerLevel = data[formattedName].summonerLevel; //gets summonerLevel
            var summonerID = data[formattedName].id; //gets summonerID
            document.getElementById("summonerName").innerHTML = summonerName; //pushes summonerName back to table
            document.getElementById("summonerLevel").innerHTML = summonerLevel; //pushes summonerLevel to table
            document.getElementById("summonerID").innerHTML = summonerID; //pushes summonerID to table
            rankingLookup(summonerID); //continues on to look up ranked stats
        }, "json");
    }
}
//Queries api.pvp.net for ranked statistics of summonerID obtained in summonerLookup()
function rankingLookup(summonerID) {
    //constructs URL for querying Riot server for ranked stats
    var rankingUrl = 'https://' + summonerRegion + '.api.pvp.net/api/lol/' + summonerRegion + '/v2.5/league/by-summoner/' + summonerID + '/entry?api_key=' + apiKey;
    var rank = "";
    var stringID = String(summonerID); //reformats summonerID to match format of returned data
    var winRateString = "";
    $.get(rankingUrl, function (data) {
        var summonerTier = data[stringID][0].tier;
        var summonerDivision = data[stringID][0].entries[0].division;
        var summonerLeaguePoints = data[stringID][0].entries[0].leaguePoints;
        rank = summonerTier + " " + summonerDivision + ", " + String(summonerLeaguePoints) + " LP"; //concats data to display rank
        document.getElementById("summonerRank").innerHTML = rank; //pushes rank to table
        var wins = data[stringID][0].entries[0].wins;
        var losses = data[stringID][0].entries[0].losses;
        var winRate = Math.round(wins / (wins + losses) * 1000) / 10; //calculates win rate
        document.getElementById("summonerWins").innerHTML = String(wins); //pushes wins to table
        document.getElementById("summonerLosses").innerHTML = String(losses); //pushes losses to table
        document.getElementById("summonerWinRate").innerHTML = (String(winRate) + "%"); //pushes win rate to table
    }, "json");
}
