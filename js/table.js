'use strict';
//Store the table rows - Team Name, Home Wins, Away Wins, Wins Against same Country, Wins against different country.
var teams = [];

var rawInputData = teamWins; //Get the data from loadData - may need to testing to make sure data always gets loaded before it is put into this variable.


//Grab the data from the loaddata script and fill the teams array
function populateTeams(){
var keys = []; //Array of keys, in this case team names
var values = []; //Array of mapped values. these are in array format, mapped index i = keys[i] in an associative context.
for(var key in rawInputData){
if(rawInputData.hasOwnProperty(key)){
  keys.push(key);//Push to array of keys.
  values.push(rawInputData[key]);//Push value to array of values
}
}

//Deal with splitting the new data we now have access to



};
