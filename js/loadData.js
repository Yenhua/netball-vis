'use strict';

var tableData = [];
var graphData = [];

function loadTable(arg){

  d3.csv("data/2012-Table1.csv", function(data) {
        tableData=data;
        console.log("tableData[0][Score] = " + tableData[0]["Score"]);
        calculateHomeAdvantageTeam();
        
        if(arg=="bar"){
        	graphData = tableData;
        	drawBarChart();//this can be defined anywhere as long as the html page knows it exists
        }
        else if(arg=="table"){
        populateTeams(); //This fills the arrays in the table script
        }

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

	//create a object from string file/year to data
	for(var i = 1; i<=filesRead;i++){
		allData[currentYear] = arguments[i];
		var yearInt = parseInt(currentYear);
		

		var tempWins = {};//team to number of wins for a particular year
		 //now we want year to teamWins objects
	 	for(var key in teamWins){
	 		tempWins[key] = [0,0,0,0];
	 	}
	 	yearToWins[currentYear] = tempWins;

	 	calculateTableWins(currentYear,allData[currentYear]);

	 	yearInt++;
		currentYear = yearInt.toString();
	 }

	 
	 console.log(arguments);
	 if(loadArg=="bar"){
        	console.log(loadArg);
        	initDropMenu();
        	drawBarChart();

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


			var homeScore = parseInt(scoreArray[0]);
			var awayScore = parseInt(scoreArray[1]);


			var teamWon;
			var teamLost;
			if(homeScore>awayScore){
				//home team won
				teamWon = table[i]["Home Team"];
				teamLost = table[i]["Away Team"];
				
				yearToWins[year][teamWon][0]++;
				//teamWins[teamWon][0]++;
			}else{
				teamWon = table[i]["Away Team"];
				teamLost = table[i]["Home Team"];
				yearToWins[year][teamWon][1]++;
			}
			//console.log(scoreArray);

			var result = checkSameCountry(teamWon,teamLost);
			if(result==true){
				yearToWins[year][teamWon][2]++;
			}else{
				yearToWins[year][teamWon][3]++;
			}
		}
	}//end for
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
	console.log(count);
	return count;
}
