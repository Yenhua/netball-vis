'use strict';
//Store the table rows - Team Name, Home Wins, Away Wins, Wins Against same Country, Wins against different country.
var teams = [];



//Grab the data from the loaddata script and fill the teams array
function populateTeams(){
var rawInputData = teamWins; //Get the data from loadData - may need to testing to make sure data always gets loaded before it is put into this variable.
var keys = []; //Array of keys, in this case team names
var values = []; //Array of mapped values. these are in array format, mapped index i = keys[i] in an associative context.
for(var key in rawInputData){
if(rawInputData.hasOwnProperty(key)){
  keys.push(key);//Push to array of keys.
  values.push(rawInputData[key]);//Push value to array of values
}
}

//Deal with splitting the new data we now have access to
for(var i = 0; i < keys.length; i++){
  var team = {name: keys[i], home: values[i][0], away: values[i][1], same: values[i][2], different: values[i][3]};
  teams.push(team);

}
console.log(teams);
drawTable();
};


//Draws the table after the data has been filled
function drawTable(){
var columns = [ //Set up all the column formatting and naming
  {head: 'Team Name', cl: 'title', html: function(row){return r.name;} },
  {head: 'Home Wins', cl: 'num', html: function(row){return r.home;} },
  {head: 'Away Wins', cl: 'num', html: function(row){return r.away;} },
  {head: 'Same Country Wins', cl: 'num', html: function(row){return r.same;} },
  {head: 'Different Country Wins', cl: 'num', html: function(row){return r.different;} }
];

//Start drawing the table
var table = d3.select('body')
.append('table');

//Create Header
table.append('thead')
.append('tr')
.selectAll('th')
.data(columns)
.enter()
.append('th')
.attr('class', function(d){return d.cl} )
.text(function(d){return d.head;} );




};
