const axios = require("axios");

async function cashPlot(userId) {
	if (arguments.length !== 1) {
    throw "Please provide a single ID.";
  }
  if (typeof userId !== "string") {
    throw "The ID must be a string.";
  }
	axios.get("http://localhost:3001/cash/" + userId)
	.then(function (response) {
		start = new Date(response.date * 1000);
		sAmount = response.startingAmount;
		cAmount = response.currentAmount;
		trans = response.trans;

		x = [];
		y = [];
		today = new Date();
		x.unshift(today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getYear());
		y.unshift(cAmount);
		for (i=0; i<6; i++) {
			today.setDate(today.getDate()-1);
			x.unshift(today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getYear());
			if (start > today) {
				y.unshift(0);
				continue;
			}
			if(trans.length > 0 && Date(trans[trans.length-1].date) > today) {
				if (trans[trans.length-1].type === "deposit") {
					y.unshift(y[0] - trans[trans.length-1].quantity);
				}
				else {
					y.unshift(y[0] + trans[trans.length-1].quantity);
				}
				trans.pop();
			}
			else {
				y.unshift(y[0]);
			}
		}

		var cash = {
		  x: x,
		  y: y,
		  mode: 'lines+markers',
		  type: 'scatter',
		  name: 'Cash',
		  marker: { size: 12 }
		};

		var data = [ cash ];

		var layout = {
		  title:'Your Cash'
		};

		Plotly.newPlot('plot', data, layout);
	})
	.catch(function (error) {
		throw error;
	});
}

module.exports = {
	cashPlot
}