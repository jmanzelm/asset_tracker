const axios = require("axios");
const Plotly = require('plotly')("jmanzelm", "LRrfcOTLoYFHQUGWzNDy");

export async function cashPlot(userId) {
	if (arguments.length !== 1) {
    	throw "Please provide a single ID.";
	}
	if (typeof userId !== "string") {
		throw "The ID must be a string.";
	}
	let response = (await axios.get("http://localhost:3001/holdings/cash/" + userId)).data;
	let start = new Date(response.date * 1000);
	let sAmount = response.startingAmount;
	let cAmount = response.currentAmount;
	let trans = response.transactions;

	let x = [];
	let y = [];
	let today = new Date();
	x.unshift(today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getYear());
	y.unshift(cAmount);
	// go through 4 years of days
	for (let i=0; i<6; i++) {
		today.setDate(today.getDate()-1);
		x.unshift(today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getYear());
		// set value for that day to 0 if before object existed
		if (start > today) {
			y.unshift(0);
			continue;
		}
		// If there was a transaction between the days
		if(trans.length > 0 && Date(trans[trans.length-1].date) > today) {
			// If it's a deposit
			if (trans[trans.length-1].type === "deposit") {
				y.unshift(y[0] - trans[trans.length-1].quantity);
			}
			else {
				y.unshift(y[0] + trans[trans.length-1].quantity);
			}
			trans.pop();
		}
		// no transaction
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

	Plotly.plot('plot', data, layout);
}

export async function singleDebtPlot(userId, debtId) {
	if (arguments.length !== 2) {
    	throw "Please provide a single ID.";
  	}
  	if (typeof userId !== "string" || typeof debtId !== "string") {
    	throw "The IDs must be strings.";
  	}
	let response = await axios.get("http://localhost:3001/holdings/debt/" + userId);
	let found = response.find(function (obj) {
		return obj._id === debtId;
	});
	let start = new Date(found.date * 1000);
	let sAmount = found.startingAmount;
	let cAmount = found.currentAmount;
	let trans = found.transactions;
	let creditor = found.creditor;

	let x = [];
	let y = [];
	let today = new Date();
	x.unshift(today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getYear());
	y.unshift(cAmount);
	for (let i=0; i<1460; i++) {
		today.setDate(today.getDate()-1);
		x.unshift(today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getYear());
		if (start > today) {
			y.unshift(0);
			continue;
		}
		if(trans.length > 0 && Date(trans[trans.length-1].date) > today) {
			if (trans[trans.length-1].type === "add") {
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
		name: creditor,
		marker: { size: 12 }
	};

	var data = [ cash ];

	var layout = {
		title: creditor + " Debt"
	};

	Plotly.plot('plot', data, layout);
}

export async function debtPlot(userId) {
	if (arguments.length !== 1) {
    throw "Please provide a single ID.";
  }
  if (typeof userId !== "string") {
    throw "The ID must be a string.";
  }
	let response = await axios.get("http://localhost:3001/holdings/debt/" + userId);
	let x = [];
	let y = [];
	let today = new Date();
	x.unshift(today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getYear());
	y.unshift(response.reduce(function (total, obj) {return total + obj.currentAmount}));
	for (let i=0; i<1460; i++) {
		today.setDate(today.getDate()-1);
		x.unshift(today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getYear());

		// find the change in the total amount from the day after this one
		y.unshift(y[0] + response.reduce(function (total, obj) {
			if (Date(obj.date * 1000) > today) {
				return -1 * obj.startingAmount;
			}
			if (obj.transactions.length > 0 && Date(obj.transactions[obj.transactions.length-1].date) > today) {
				if (obj.transactions[obj.transactions.length-1].type === "add") {
					return -1 * obj.transactions[obj.transactions.length-1].quantity;
				}
				else {
					obj.transactions[obj.transactions.length-1].quantity;
				}
				obj.transactions.pop();
			}
			else {
				return 0;
			}
		}));
	}
	var cash = {
	  x: x,
	  y: y,
	  mode: 'lines+markers',
	  type: 'scatter',
	  name: 'Debt',
	  marker: { size: 12 }
	};

	var data = [ cash ];

	var layout = {
	  title:'Your Debts'
	};

	Plotly.plot('plot', data, layout);
}

export async function singleStockPlot(userId, stockId) {
	if (arguments.length !== 2) {
    throw "Please provide a single ID.";
  }
  if (typeof userId !== "string" || typeof stockId !== "string") {
    throw "The IDs must be strings.";
  }
	let response = await axios.get("http://localhost:3001/holdings/stock/" + userId);
	let found = response.find(function (obj) {
		return obj._id === stockId;
	});
	let start = new Date(found.date * 1000);
	let sAmount = found.startingAmount;
	let cAmount = found.currentAmount;
	let trans = found.transactions;
	let symbol = found.symbol;

	let data = await axios.get("http://localhost:3001/prices/stock/" + symbol + "/1m");
	let x = [];
	let y = [];
	let today = new Date();
	today.setDate(today.getDate()-1);
	x.unshift(today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getYear());
	y.unshift(cAmount);
	for (let i=0; i<6; i++) {
		today.setDate(today.getDate()-1);
		x.unshift(today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getYear());
		if (start > today) {
			y.unshift(0);
			continue;
		}
		if(trans.length > 0 && Date(trans[trans.length-1].date) > today) {
			if (trans[trans.length-1].type === "add") {
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

	for (let i=0; i<7; i++) {
		y[6-i] *= data[data.length - 1 - i].close;
	}

	var cash = {
	  x: x,
	  y: y,
	  mode: 'lines+markers',
	  type: 'scatter',
	  name: symbol,
	  marker: { size: 12 }
	};

	var plotData = [ cash ];

	var layout = {
	  title: symbol + " Value"
	};

	Plotly.plot('plot', plotData, layout);
}

export async function stockPlot(userId) {
	if (arguments.length !== 1) {
    throw "Please provide a single ID.";
  }
  if (typeof userId !== "string") {
    throw "The ID must be a string.";
  }
	/*let response = await axios.get("http://localhost:3001/holdings/stock/" + userId);

	let data = await //james will tell me

	for (i=0; i<7; i++) {
		for (j=0; j<response.length; j++) {

		}
	}*/
	
		/*x = [];
		y = [];
		today = new Date();
		x.unshift(today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getYear());
		
		var cash = {
		  x: x,
		  y: y,
		  mode: 'lines+markers',
		  type: 'scatter',
		  name: 'Debt',
		  marker: { size: 12 }
		};

		var data = [ cash ];

		var layout = {
		  title:'Your Debts'
		};

		Plotly.plot('plot', data, layout);
	})
	.catch(function (error) {
		throw error;
	});*/
}

export async function singleCryptoPlot(userId, cryptoId) {
	if (arguments.length !== 2) {
    throw "Please provide a single ID.";
  }
  if (typeof userId !== "string" || typeof cryptoId !== "string") {
    throw "The IDs must be strings.";
  }
	let response = await axios.get("http://localhost:3001/holdings/crypto/" + userId);
	let found = response.find(function (obj) {
		return obj._id === cryptoId;
	});
	let start = new Date(found.date * 1000);
	let sAmount = found.startingAmount;
	let cAmount = found.currentAmount;
	let trans = found.transactions;
	let symbol = found.symbol;

	let data = await axios.get("http://localhost:3001/prices/crypto/" + symbol + "/histoday");
	let x = [];
	let y = [];
	let today = new Date();
	today.setDate(today.getDate()-1);
	x.unshift(today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getYear());
	y.unshift(cAmount);
	for (let i=0; i<6; i++) {
		today.setDate(today.getDate()-1);
		x.unshift(today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getYear());
		if (start > today) {
			y.unshift(0);
			continue;
		}
		if(trans.length > 0 && Date(trans[trans.length-1].date) > today) {
			if (trans[trans.length-1].type === "add") {
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

	for (let i=0; i<7; i++) {
		y[6-i] *= data[data.length - 1 - i].close;
	}

	var cash = {
	  x: x,
	  y: y,
	  mode: 'lines+markers',
	  type: 'scatter',
	  name: symbol,
	  marker: { size: 12 }
	};

	var plotData = [ cash ];

	var layout = {
	  title: symbol + " Value"
	};

	Plotly.plot('plot', plotData, layout);
}

export async function cryptoPlot(userId) {
	if (arguments.length !== 1) {
    throw "Please provide a single ID.";
  }
  if (typeof userId !== "string") {
    throw "The ID must be a string.";
  }
	/*axios.get("http://localhost:3001/debt/" + userId)
	.then(function (response) {
		x = [];
		y = [];
		today = new Date();
		x.unshift(today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getYear());
		
		var cash = {
		  x: x,
		  y: y,
		  mode: 'lines+markers',
		  type: 'scatter',
		  name: 'Debt',
		  marker: { size: 12 }
		};

		var data = [ cash ];

		var layout = {
		  title:'Your Debts'
		};

		Plotly.plot('plot', data, layout);
	})
	.catch(function (error) {
		throw error;
	});*/
}