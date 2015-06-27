'use strict';

var tableData = [];
var graphData = [];

function loadTable(arg){

  d3.csv("data/2012-Table1.csv", function(data) {
        tableData=data;
       // console.log("tableData[0][Score] = " + tableData[0]["Score"]);
        calculateHomeAdvantageTeam();

        if(arg=="bar"){
        	graphData = tableData;
        	drawBarChart();//this can be defined anywhere as long as the html page knows it exists
        }
        else if(arg=="table"){
        getData(); //This fills the arrays in the controlTable script
        }

  });


}

//may need to define enums for these teams for easier sorting in terms of code
//may need to create an additional one for stadiums
var teamWins = {//AUS teams
				//"name":[home wins,away wins,win against same country, win against different country,total wins, final placing, goals scored, goals conceded]
				"Adelaide Thunderbirds":[0,0,0,0,0,0,0,0],
				"Queensland Firebirds":[0,0,0,0,0,0,0,0],
				"New South Wales Swifts":[0,0,0,0,0,0,0,0],
				"Melbourne Vixens":[0,0,0,0,0,0,0,0],
				"West Coast Fever":[0,0,0,0,0,0,0,0],
				//NZ teams
				"Northern Mystics":[0,0,0,0,0,0,0,0],
				"Waikato Bay of Plenty Magic":[0,0,0,0,0,0,0,0],
				"Central Pulse":[0,0,0,0,0,0],
				"Canterbury Tactix":[0,0,0,0,0,0,0,0],
				"Southern Steel":[0,0,0,0,0,0,0,0]}

var teamID = {//AUS teams
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

var idVenue = {//each team has a associated home venue, we can access the strings here
				//AUS teams
				"AUS1":"Netball SA Stadium, Adelaide",
				"AUS2":"Brisbane Convention and Exhibition Centre",
				"AUS3":"State Sports Centre, Sydney",
				"AUS4":"Hisense Arena, Melbourne",
				"AUS5":"Challenge Stadium, Perth",
				//NZ teams
				"NZ1":"Trusts Stadium, Auckland",
				"NZ2":"Claudelands Arena, Hamilton",
				"NZ3":"Te Rauparaha Arena, Porirua",
				"NZ4":"CBS Canterbury Arena, Christchurch",
				"NZ5":"Lion Foundation Arena, Dunedin"}

var venueToWins = {}


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

	// console.log("Home wins for Melbourne Vixens: " + teamWins["Melbourne Vixens"][0]);
	// console.log("Away wins for Melbourne Vixens: " + teamWins["Melbourne Vixens"][1]);
	// console.log("Melbourne Vixens has won " + teamWins["Melbourne Vixens"][2] + " against australian teams");
	// console.log("Melbourne Vixens has won " + teamWins["Melbourne Vixens"][3] + " against NZ teams");
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

function calculateStadiumStats(){

	//might be tidier to reparse the array/tableData
	for(var i = 0;i<tableData.length;i++){

	}
}


//Following code is for multiple file reading

var allData = [];//this is a year to tableData object
var yearToWins = [];
var tempObject = [];
var yearIndex = "8";
var filename = "data/200" + yearIndex + "-Table1.csv"
var errorOutput;
var totalFilesRead = 0;
var loadArg;

//this is similar to yearToWins but only for group data
var groupYearToWins = [];



/*The following functions are for loading multiple unknown amounts of csv files
The aim is to allow future data to be added easily
*/
function loadAll(arg){

	var numFiles = countFiles();
	var currentCount = 0;
	var q = queue();
	loadArg = arg;

	while(currentCount<numFiles){//load until we get a error...aka file not found
		try{
			q = q.defer(d3.csv, filename);//append defers for every file
			//console.log(currentCount);
			currentCount++;
		}
		catch(err){//should not happen now we know how many files are there...
			console.log("error, loading more files than found");
			break;

		}
		var yearInt = parseInt(yearIndex);
		yearInt++;
		yearIndex = yearInt.toString();

		if(yearInt>=10){
			filename = "data/20" + yearIndex + "-Table1.csv"
		}
		else{
			filename = "data/200" + yearIndex + "-Table1.csv"
		}

	}
	console.log(currentCount);


	q.await(onDataLoaded);
}



//javascript has a "magical" arguments object which is a list of all arguments passed to this function from queue.js
function onDataLoaded(error){
	var filesRead = arguments.length - 1;//(0th argument is error and should be null)
	var totalFilesRead = filesRead;
	var currentYear = "2008";
	//console.log(filesRead);

	//make a total object
	var totalWins = {};
	var groupTotalWins = {};
	 for(var key in teamWins){
	 		totalWins[key] = [0,0,0,0,0,0,0,0];
	 		groupTotalWins[key] = [0,0,0,0,0,0,0,0];
	 }

	 yearToWins["all"] = totalWins;
	 groupYearToWins["all"] = groupTotalWins;

	//create a object from string file/year to data
	for(var i = 1; i<=filesRead;i++){
		allData[currentYear] = arguments[i];
		var yearInt = parseInt(currentYear);


		var tempWins = {};//team to number of wins for a particular year
		 //now we want year to teamWins objects

		var groupTempWins = {};
	 	for(var key in teamWins){
	 		tempWins[key] = [0,0,0,0,0,0,0,0];
	 		groupTempWins[key] = [0,0,0,0,0,0,0,0];
	 	}
	 	yearToWins[currentYear] = tempWins;
	 	groupYearToWins[currentYear] = groupTempWins;

	 	calculateTableWins(currentYear,allData[currentYear]);

	 	yearInt++;
		currentYear = yearInt.toString();
	 }



	 //console.log(arguments);
	 if(loadArg=="bar"){
        	//console.log(loadArg);
        	initDropMenu();
        	drawBarChart();

      }
   else if(loadArg == "table"){
        console.log("Table is starting to execute");
        initButtons();
        getData(); //Triggers the function for the table to grab the data from this script
      }
}

//Given a data from a table,
function calculateTableWins(year,table){

	var intYear = parseInt(year);

	//very similar to the individual case, parse through every row in the data to identify wins for each team
	for(var i = 0;i<table.length;i++){//consider every game that has happened in this year(groups + playoffs)
		var stringScore = table[i]["Score"];
		if(stringScore!=""){//if it's not a bye
			scoreArray = stringScore.split('-');
			if(scoreArray.length!=2){
				scoreArray = stringScore.split('–');//difference between hypens, the second one is &#8211
			}
			//console.log(scoreArray);

			if(scoreArray[0].indexOf("draw") > -1){
				continue;//skip this game, this is the only draw game that exists in our data
			}


			var homeScore = parseInt(scoreArray[0]);
			var awayScore = parseInt(scoreArray[1]);
			

			var teamWon;
			var teamLost;
			if(homeScore>awayScore){
				//home team won
				teamWon = table[i]["Home Team"];
				teamLost = table[i]["Away Team"];

				yearToWins[year][teamWon][0]++;
				yearToWins[year][teamWon][4]++;//increment total wins
				yearToWins["all"][teamWon][0]++;
				yearToWins["all"][teamWon][4]++;

				if(i<table.length-4){//we only want the group data,not the playoffs
					groupYearToWins[year][teamWon][0]++;
					groupYearToWins[year][teamWon][4]++;
					groupYearToWins["all"][teamWon][0]++;
					groupYearToWins["all"][teamWon][4]++;

					groupYearToWins[year][teamWon][6] = groupYearToWins[year][teamWon][6] + homeScore;//index 6 - goal scored, index 7 - goals conceded
					groupYearToWins[year][teamWon][7] = groupYearToWins[year][teamWon][7] + awayScore;

					groupYearToWins[year][teamLost][6] = groupYearToWins[year][teamLost][6] + awayScore;//index 6 - goal scored, index 7 - goals conceded
					groupYearToWins[year][teamLost][7] = groupYearToWins[year][teamLost][7] + homeScore;
				}
				//teamWins[teamWon][0]++;
			}else{
				teamWon = table[i]["Away Team"];
				teamLost = table[i]["Home Team"];
				yearToWins[year][teamWon][1]++;//increment away
				yearToWins[year][teamWon][4]++;
				yearToWins["all"][teamWon][1]++;//increment total
				yearToWins["all"][teamWon][4]++;

				if(i<table.length-4){
					groupYearToWins[year][teamWon][1]++;
					groupYearToWins[year][teamWon][4]++;
					groupYearToWins["all"][teamWon][1]++;
					groupYearToWins["all"][teamWon][4]++;

					groupYearToWins[year][teamWon][6] = groupYearToWins[year][teamWon][6] + awayScore;//index 6 - goal scored, index 7 - goals conceded
					groupYearToWins[year][teamWon][7] = groupYearToWins[year][teamWon][7] + homeScore;

					groupYearToWins[year][teamLost][6] = groupYearToWins[year][teamLost][6] + homeScore;//index 6 - goal scored, index 7 - goals conceded
					groupYearToWins[year][teamLost][7] = groupYearToWins[year][teamLost][7] + awayScore;

				}
			}//end else
			var result = checkSameCountry(teamWon,teamLost);
			if(result==true){
				yearToWins[year][teamWon][2]++;
				yearToWins["all"][teamWon][2]++;

				if(i<table.length-4){
					groupYearToWins[year][teamWon][2]++;
					groupYearToWins["all"][teamWon][2]++;
				}
				
			}else{
				yearToWins[year][teamWon][3]++;
				yearToWins["all"][teamWon][3]++;
				if(i<table.length-4){
					groupYearToWins[year][teamWon][3]++;
					groupYearToWins["all"][teamWon][3]++;
				}
				
			}


		}
	}//end for

	//placing calculating, start at grand finals and work backwards

	for(var i = table.length-1;i>table.length-5;i--){

		//we can not have a bye for the last 4 games (playoffs)
		var stringScore = table[i]["Score"];
			scoreArray = stringScore.split('-');
			if(scoreArray.length!=2){
				scoreArray = stringScore.split('–');//difference between hypens, the second one is &#8211
			}
			//console.log(scoreArray);


			var homeScore = parseInt(scoreArray[0]);
			var awayScore = parseInt(scoreArray[1]);


			var teamWon;
			var teamLost;


			if(i==table.length-1){//grand finals
				if(homeScore>awayScore){//home team won
					groupYearToWins[year][table[i]["Home Team"]][5] = 1;//first place
					groupYearToWins[year][table[i]["Away Team"]][5] = 2;
				}
				else{//away team won
					groupYearToWins[year][table[i]["Home Team"]][5] = 2;
					groupYearToWins[year][table[i]["Away Team"]][5] = 1;
				}
			}
			else if(i==table.length-2){//loser bracket finals, loser of this becomes 3rd place
				if(homeScore>awayScore){
					groupYearToWins[year][table[i]["Away Team"]][5] = 3;//away team lost
				}
				else{//away team won
					groupYearToWins[year][table[i]["Home Team"]][5] = 3;//home team lost
				}
			}
			else{//here it gets tricky, this game may either be major or minor semifinal, if no teams are eliminated here
					//then the loser of this game may not be 4th place
				var homePlacing = groupYearToWins[year][table[i]["Home Team"]][5];
				var awayPlacing = groupYearToWins[year][table[i]["Away Team"]][5];

				if(homePlacing!=0 && awayPlacing!=0){
					//both teams has a placing already, neither can bet be 4th
				}else{
					if(homePlacing==0){//we can already deduce this team must have came 4th if it has no placing assigned to it
						groupYearToWins[year][table[i]["Home Team"]][5] = 4;
					}else{
						groupYearToWins[year][table[i]["Away Team"]][5] = 4;
					}
				}

			}
			
	}//end for

	//playoff placing has been decided, now to determine everyone else
	var currentPlacing = 5;
	var currentBestWins = -1;
	var currentBestTeam = "";
	var currentBestGoalPercent = -1;

	var curTeamWins = groupYearToWins[year];
	while(currentPlacing<11){

			for(var key in curTeamWins){
				if(curTeamWins[key][5]!=0){
					//already has a placing, don't consider them
				}
				else{
					var curTeamGroupWins = parseInt(curTeamWins[key][4]);
					if(curTeamGroupWins>currentBestWins){
						currentBestWins = curTeamGroupWins;
						currentBestTeam = key;
						currentBestGoalPercent = parseFloat(curTeamWins[key][6]/curTeamWins[key][7]);
					}if(curTeamGroupWins==currentBestWins){
						//same wins, we will have to use goal percentage to break the tie
						var currentGoalPercent = parseFloat(curTeamWins[key][6]/curTeamWins[key][7]);
						if(currentGoalPercent>currentBestGoalPercent){
							//don't need to update best wins, it's the same
							currentBestTeam = key;
							currentBestGoalPercent = currentGoalPercent;
						}
					}

				}
		}


		groupYearToWins[year][currentBestTeam][5] = currentPlacing;

		currentPlacing++;//now find the next best team
		//reset our initial variables
		currentBestWins = -1;
		currentBestTeam = "";
		currentBestGoalPercent = -1;
	}

	for(var key in curTeamWins){
		yearToWins[year][key][5] = groupYearToWins[year][key][5]
	}


}

//totals up all the data from all the tables
function calculateAll(){
	//everything has loaded, now to make a all data entry


}

function countFiles(){

	var year = "8";
	var fname = "data/200" + yearIndex + "-Table1.csv"
	var count = 0;;
	var q = queue();

    //this is a terrible way to find the number of files to read
	while(true){//load until we get a error...aka file not found
		try{
			q = q.defer(d3.csv, fname);//append defers for every filw
			count++;
		}
		catch(err){
			break;

		}
		var yearInt = parseInt(year);
		yearInt++;
		year = yearInt.toString();

		if(yearInt>=10){
			fname = "data/20" + year + "-Table1.csv"
		}
		else{
			fname = "data/200" + year + "-Table1.csv"
		}
	}
	//console.log(count);
	return count;
}
