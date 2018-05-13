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
<<<<<<< HEAD
		transactions = response.transactions;
=======
		trans = response.transactions;
>>>>>>> 007af91c6e55eee818617c69e4f0e5cfa14d76b9

		x = [];
		y = [];
		today = new Date();
		x.unshift(today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getYear());
		y.unshift(cAmount);
		// go through 4 years of days
		for (i=0; i<6; i++) {
			today.setDate(today.getDate()-1);
			x.unshift(today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getYear());
			// set value for that day to 0 if before object existed
			if (start > today) {
				y.unshift(0);
				continue;
			}
<<<<<<< HEAD
			if(transactions.length > 0 && Date(transactions[transactions.length-1].date) > today) {
				if (transactions[transactions.length-1].type === "deposit") {
					y.unshift(y[0] - transactions[transactions.length-1].quantity);
=======
			// If there was a transaction between the days
			if(trans.length > 0 && Date(trans[trans.length-1].date) > today) {
				// If it's a deposit
				if (trans[trans.length-1].type === "deposit") {
					y.unshift(y[0] - trans[trans.length-1].quantity);
>>>>>>> 007af91c6e55eee818617c69e4f0e5cfa14d76b9
				}
				else {
					y.unshift(y[0] + transactions[transactions.length-1].quantity);
				}
				transactions.pop();
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

		Plotly.newPlot('plot', data, layout);
	})
	.catch(function (error) {
		throw error;
	});
}

async function singleDebtPlot(userId, debtId) {
	if (arguments.length !== 2) {
    throw "Please provide a single ID.";
  }
  if (typeof userId !== "string" || typeof debtId !== "string") {
    throw "The IDs must be strings.";
  }
	axios.get("http://localhost:3001/debt/" + userId)
	.then(function (response) {
		found = response.find(function (obj) {
			return obj._id === debtId;
		});
		start = new Date(found.date * 1000);
		sAmount = found.startingAmount;
		cAmount = found.currentAmount;
		trans = found.transactions;
		creditor = found.creditor;

		x = [];
		y = [];
		today = new Date();
		x.unshift(today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getYear());
		y.unshift(cAmount);
		for (i=0; i<1460; i++) {
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

		Plotly.newPlot('plot', data, layout);
	})
	.catch(function (error) {
		throw error;
	});
}

async function debtPlot(userId) {
	if (arguments.length !== 1) {
    throw "Please provide a single ID.";
  }
  if (typeof userId !== "string") {
    throw "The ID must be a string.";
  }
	axios.get("http://localhost:3001/debt/" + userId)
	.then(function (response) {
		x = [];
		y = [];
		today = new Date();
		x.unshift(today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getYear());
		y.unshift(response.reduce(function (total, obj) {return total + obj.currentAmount}));
		for (i=0; i<1460; i++) {
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

		Plotly.newPlot('plot', data, layout);
	}
	.catch(function (error) {
		throw error;
	});
}

async function singleStockPlot(userId, stockId) {
	if (arguments.length !== 2) {
    throw "Please provide a single ID.";
  }
  if (typeof userId !== "string" || typeof stockId !== "string") {
    throw "The IDs must be strings.";
  }
	axios.get("http://localhost:3001/stock/" + userId)
	.then(function (response) {
		found = response.find(function (obj) {
			return obj._id === stockId;
		});
		start = new Date(found.date * 1000);
		sAmount = found.startingAmount;
		cAmount = found.currentAmount;
		trans = found.transactions;
		symbol = found.symbol;

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
		  name: symbol,
		  marker: { size: 12 }
		};

		var data = [ cash ];

		var layout = {
		  title: symbol + " Value"
		};

		Plotly.newPlot('plot', data, layout);
	})
	.catch(function (error) {
		throw error;
	});
}

async function stockPlot(userId) {
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

		Plotly.newPlot('plot', data, layout);
	})
	.catch(function (error) {
		throw error;
	});*/
}

async function singleCryptoPlot(userId, cryptoId) {
	if (arguments.length !== 2) {
    throw "Please provide a single ID.";
  }
  if (typeof userId !== "string" || typeof cryptoId !== "string") {
    throw "The IDs must be strings.";
  }
	axios.get("http://localhost:3001/crypto/" + userId)
	.then(function (response) {
		found = response.find(function (obj) {
			return obj._id === cryptoId;
		});
		start = new Date(found.date * 1000);
		sAmount = found.startingAmount;
		cAmount = found.currentAmount;
		trans = found.transactions;
		symbol = found.symbol;

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
		  name: symbol,
		  marker: { size: 12 }
		};

		var data = [ cash ];

		var layout = {
		  title: symbol + " Value"
		};

		Plotly.newPlot('plot', data, layout);
	})
	.catch(function (error) {
		throw error;
	});
}

async function cryptoPlot(userId) {
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

		Plotly.newPlot('plot', data, layout);
	})
	.catch(function (error) {
		throw error;
	});*/
}

module.exports = {
	cashPlot,
	singleDebtPlot,
	debtPlot,
	singleStockPlot,
	stockPlot,
	singleCryptoPlot,
	cryptoPlot
}