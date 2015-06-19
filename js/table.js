'use strict';
//Store the table rows - Team Name, Home Wins, Away Wins, Wins Against same Country, Wins against different country.
var teams = [];
var table;


//Grab the data from the loaddata script and fill the teams array
function populateTeams(inputData){
var rawInputData = inputData; //Get the data from loadData - may need to testing to make sure data always gets loaded before it is put into this variable.
var keys = []; //Array of keys, in this case team names
var values = []; //Array of mapped values. these are in array format, mapped index i = keys[i] in an associative context.
teams = []; //Make sure the teams array is clear every time this is called again.
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
console.log(teams[1]);
d3.select('body').selectAll('table').remove();
drawTable();
};


function welcomeText(){
//Will spawn the welcome text on the page
//Looks quite good if an SVG canvas of 200x200 is appended to the body.
//goes just above the graph. Could put a title/team logos there
}







//Draws the table after the data has been filled
function drawTable(){
var columns = [ //Set up all the column formatting and naming
  {head: 'Team Name', cl: 'title', html: ƒ('name') },
  {head: 'Home Wins', cl: 'num', html: ƒ('home') },
  {head: 'Away Wins', cl: 'num', html: ƒ('away') },
  {head: 'Same Country Wins', cl: 'num', html: ƒ('same') },
  {head: 'Different Country Wins', cl: 'num', html: ƒ('different') }
];

//Make sure the 'body' of the html page is clear before appending something to it


//Start drawing the table
table = d3.select('body')
.append('table');

//Create Header of table
table
.append('thead')
.append('tr')
.selectAll('th')
.data(columns)
.enter()
.append('th')
.attr('class', ƒ('cl') )
.text(ƒ('head'));

//Create body of table -- Untested so far
table.append('tbody')
.selectAll('tr')
.data(teams).enter()
.append('tr')
.selectAll('td')
.data(function(row, i) {
//Evaluate column objects against the current row
return columns.map(function(c) {
//Compute cell values
var cell = {};
d3.keys(c).forEach(function(k) {
   cell[k] = typeof c[k] == 'function' ? c[k](row,i) : c[k];
   });
   return cell;
});
}).enter()
.append('td')
.html(ƒ('html'))
.attr('class', ƒ('cl'));
};
