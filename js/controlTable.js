'use strict';
var data = [];//This contains raw wins data directly from loadData



//This function is made to be called from loadData
//It gets the wins data for each team every year, and stores it in this script.
function getData(){
  data = yearToWins; //pulls yearToWins - is essentially a 3D array containing
  console.log("data is loaded to controlTable");
}


function splitData(arg){

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


//Function to create buttons in index based on how many years of data are given to this script
function accountForFuture(){
  //Psuedo-Code
  //Starting from '2008' iterate along until null is reached.
  //Increment a count each time an iteration is done AND the current iteration is NOT null.
  //Based on how high the count is, we know how many years of data we have
  //IF the number is higher than 6 (2008-2013 which we will always have)
  //Add number-6 extra buttons, and call them by the year which they represent (2013 + number-6+i), where i = number- 6 + how many buttons have been added
}


//This function is planned to sort the data of a specific year into order by wins before it gets printed in the table.
function sortData(){

}
