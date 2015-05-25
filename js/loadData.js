'use strict';

var tableData = [];

function loadTable(){
 
  d3.csv("data/2012-Table1.csv", function(data) {
        tableData=data;
        console.log("tableData[0][Score] = " + tableData[0]["Score"]);
        calculateHomeAdvantageTeam();
  });
  

}

//may need to define enums for these teams for easier sorting in terms of code
//may need to create an additional one for stadiums
var teamWins = {//AUS teams
				//"name":[home wins,away wins,win against same country, win against different country]
				"Adelaide Thunderbirds":[0,0,0,0],
				"Queensland Firebirds":[0,0,0,0],
				"New South Wales Swifts":[0,0,0,0],
				"Melbourne Vixens":[0,0,0,0],
				"West Coast Fever":[0,0,0,0],
				//NZ teams
				"Northern Mystics":[0,0,0,0],
				"Waikato Bay of Plenty Magic":[0,0,0,0],
				"Central Pulse":[0,0,0,0],
				"Canterbury Tactix":[0,0,0,0],
				"Southern Steel":[0,0,0,0]}

var teamID = {//AUS teams
				//"name":[home wins,away wins,win against same country, win against different country]
				"Adelaide Thunderbirds":"AUS1",
				"Queensland Firebirds":"AUS2",
				"New South Wales Swifts":"AUS3",
				"Melbourne Vixens":"AUS4",
				"West Coast Fever":"AUS5",
				//NZ teams
				"Northern Mystics":"NZ1",
				"Waikato Bay of Plenty Magic":"NZ2",
				"Central Pulse":"NZ3",
				"Canterbury Tactix":"NZ4",
				"Southern Steel":"NZ5"}

var scoreArray;
//this function can be adapted for every year
function calculateHomeAdvantageTeam(){
//there are 10 teams, 5 NZ and 5 AUS.
//lets have a data structure of team names to home victories.
//
	for(var i = 0;i<tableData.length;i++){//consider every game that has happened in this year(groups + playoffs)
		var stringScore = tableData[i]["Score"];
		//console.log(stringScore);
		if(stringScore!=""){//if it's not a bye
			scoreArray = stringScore.split(' ');//js doesn't split "-" nicely sometimes...safer to split via whitespace
			var homeScore = parseInt(scoreArray[0]);
			var awayScore = parseInt(scoreArray[2]);

			var teamWon;
			var teamLost;
			if(homeScore>awayScore){
				//home team won
				teamWon = tableData[i]["Home Team"];
				teamLost = tableData[i]["Away Team"];
				// console.log(teamWon)
				teamWins[teamWon][0]++;
			}else{
				teamWon = tableData[i]["Away Team"];
				teamLost = tableData[i]["Home Team"];
				teamWins[teamWon][1]++;
			}
			//console.log(scoreArray);

			var result = checkSameCountry(teamWon,teamLost);
			if(result==true){
				teamWins[teamWon][2]++;
			}else{
				teamWins[teamWon][3]++;
			}
		}
	}//end for

	console.log("Home wins for Melbourne Vixens: " + teamWins["Melbourne Vixens"][0]);
	console.log("Away wins for Melbourne Vixens: " + teamWins["Melbourne Vixens"][1]);
	console.log("Melbourne Vixens has won " + teamWins["Melbourne Vixens"][2] + " against australian teams");
	console.log("Melbourne Vixens has won " + teamWins["Melbourne Vixens"][3] + " against NZ teams");
}

//if same country, return true or false
function checkSameCountry(team1, team2){
	var id1 = teamID[team1];
	var id2 = teamID[team2];
	
	if(id1.indexOf("NZ")!=-1 && id2.indexOf("NZ")!=-1){
		return true;
	}
	else if(id1.indexOf("AUS")!=-1 && id2.indexOf("AUS")!=-1){
		return true;
	}
	else{
		return false;
	}//end if
}