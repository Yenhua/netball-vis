'use strict';
var data = [];//This contains raw wins data directly from loadData



//This function is made to be called from loadData
//It gets the wins data for each team every year, and stores it in this script.
function getData(){
  data = yearToWins; //pulls yearToWins - is essentially a 3D array containing
  console.log("data is loaded to controlTable");
}


function splitData(arg){

//we can delete the intro text here
//it is the second div in the document
d3.selectAll("div:nth-child(2)").remove();


// console.log(data[2011]);
var year = parseInt(arg); //This is the year, corresponding to the button that was clicked on.

var newDataSet = [];


var currentPlacing = 1;
while(currentPlacing!=11){
for(var key in data[arg]){
	if(data[arg][key][5] == currentPlacing){
		newDataSet[key] = data[arg][key]
		currentPlacing++;
	}
}

}




populateTeams(newDataSet);//Call the function in the table script to start the process of drawing the table.
}



