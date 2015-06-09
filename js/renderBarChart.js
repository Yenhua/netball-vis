'use strict';

function testScope(){
	 d3.csv("data/2012-Table1.csv", function(data) {
        tableData=data;
        console.log("tableData[0][Score] = " + tableData[0]["Score"]);
        calculateHomeAdvantageTeam();
  });
}