import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';


/**
 *  Plots the investments and cash graph
 */

export class PlotGraph extends Component {
    constructor(props, context) {
        super(props, context);
        this.singleCryptoPlot = this.singleCryptoPlot.bind(this);
        this.state = {};
    }
    async componentWillReceiveProps(nextProps) {
        await this.singleCryptoPlot(nextProps.userid, "BTC");
    }
    async cashPlot(userId) {
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
        x.unshift(today.toLocaleDateString());
        y.unshift(cAmount);
        // go through 4 years of days
        for (let i=0; i<6; i++) {
            today.setDate(today.getDate()-1);
            x.unshift(today.toLocaleDateString());
            // set value for that day to 0 if before object existed
            if (start > today) {
                y.unshift(0);
                continue;
            }
            // If there was a transaction between the days
            if(trans.length > 0 && trans[trans.length-1].date > today / 1000) {
                // If it's a deposit
                if (trans[trans.length-1].type === "deposit") {
                    y.unshift(y[0] - trans[trans.length-1].qty);
                }
                else {
                    y.unshift(y[0] + trans[trans.length-1].qty);
                }
                trans.pop();
            }
            // no transaction
            else {
                y.unshift(y[0]);
            }
        }

        let cash = {
            x: x,
            y: y,
            mode: 'lines+markers',
            type: 'scatter',
            name: 'Cash',
            marker: { size: 12 }
        };

        let data = [ cash ];
        this.setState({plotData: data});
    }

    cashPlotLayout() {
        let layout = {
            title:'Your Cash'
        };
        return layout;
    }

    async singleDebtPlot(userId, debtName) {
        if (arguments.length !== 2) {
            throw "Please provide a user ID and a debt ID.";
        }
        if (typeof userId !== "string" || typeof debtName !== "string") {
            throw "The IDs must be strings.";
        }
        let response = (await axios.get("http://localhost:3001/holdings/debt/" + userId)).data;
        let found = response.find(function (obj) {
            return obj.creditor === debtName;
        });
        let start = new Date(found.date * 1000);
        let sAmount = found.startingAmount;
        let cAmount = found.currentAmount;
        let trans = found.transactions;
        let creditor = found.creditor;

        let x = [];
        let y = [];
        let today = new Date();
        x.unshift(today.toLocaleDateString());
        y.unshift(cAmount);
        for (let i=0; i<6; i++) {
            today.setDate(today.getDate()-1);
            x.unshift(today.toLocaleDateString());
            if (start > today) {
                y.unshift(0);
                continue;
            }
            if(trans.length > 0 && trans[trans.length-1].date > today / 1000) {
                if (trans[trans.length-1].type === "add") {
                    y.unshift(y[0] - trans[trans.length-1].qty);
                }
                else {
                    y.unshift(y[0] + trans[trans.length-1].qty);
                }
                trans.pop();
            }
            else {
                y.unshift(y[0]);
            }
        }

        let debt = {
            x: x,
            y: y,
            mode: 'lines+markers',
            type: 'scatter',
            name: creditor,
            marker: { size: 12 }
        };

        let data = [ debt ];
        this.setState({plotData: data});
    }

    async singleCryptoPlot(userId, cryptoId) {
        if (arguments.length !== 2) {
            throw "Please provide a single ID.";
        }
        if (typeof userId !== "string" || typeof cryptoId !== "string") {
            throw "The IDs must be strings.";
        }
        let response = (await axios.get("http://localhost:3001/holdings/crypto/" + userId)).data;
        let found = response.find(function (obj) {
            return obj._id === cryptoId;
        });
        let start = new Date(found.date * 1000);
        let sAmount = found.startingAmount;
        let cAmount = found.currentAmount;
        let trans = found.transactions;
        let symbol = found.symbol;

        let x = [];
        let y = [];
        let today = new Date();
        x.unshift(today.toLocaleDateString());
        y.unshift(cAmount);
        for (let i=0; i<1460; i++) {
            today.setDate(today.getDate()-1);
            x.unshift(today.toLocaleDateString());
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

        let debt = {
            x: x,
            y: y,
            mode: 'lines+markers',
            type: 'scatter',
            name: symbol,
            marker: { size: 12 }
        };

        let data = [ debt ];
    }

    singleDebtPlotLayout() {
        let layout = {
            title: "Debt"
        };
        return layout;
    }

    async debtPlot(userId) {
        if (arguments.length !== 1) {
            throw "Please provide a single ID.";
        }
        if (typeof userId !== "string") {
            throw "The ID must be a string.";
        }
        let response = (await axios.get("http://localhost:3001/holdings/debt/" + userId)).data;
        let x = [];
        let y = [];
        let today = new Date();

        x.unshift(today.toLocaleDateString());
        y.unshift(response.reduce(function (total, obj) {return total + obj.currentAmount}, 0));
        for (let i=0; i<6; i++) {
            today.setDate(today.getDate()-1);
            x.unshift(today.toLocaleDateString());

            // find the change in the total amount from the day after this one
            y.unshift(y[0] + response.reduce(function (total, obj) {
                if (Date(obj.date * 1000) > today) {
                    return -1 * obj.startingAmount;
                }
                if (obj.transactions.length > 0 && obj.transactions[obj.transactions.length-1].date > today / 1000) {
                    if (obj.transactions[obj.transactions.length-1].type === "add") {
                        return -1 * obj.transactions[obj.transactions.length-1].qty;
                    }
                    else {
                        obj.transactions[obj.transactions.length-1].qty;
                    }
                    obj.transactions.pop();
                }
                else {
                    return 0;
                }
            }, 0));
        }
        let debts = {
            x: x,
            y: y,
            mode: 'lines+markers',
            type: 'scatter',
            name: 'Debt',
            marker: { size: 12 }
        };

        let data = [ debts ];
        this.setState({plotData: data});
    }

    debtPlotLayout() {
        let layout = {
            title: "Your Debts"
        };
        return layout;
    }

    async singleStockPlot(userId, stockName) {
        if (arguments.length !== 2) {
            throw "Please provide a user ID and a stock ID.";
        }
        if (typeof userId !== "string" || typeof stockName !== "string") {
            throw "The IDs must be strings.";
        }
        let response = (await axios.get("http://localhost:3001/holdings/stock/" + userId)).data;
        console.log(response);
        let found = response.find(function (obj) {
            return obj.symbol === stockName;
        });
        console.log(found);
        let start = new Date(found.date * 1000);
        let sAmount = found.startingAmount;
        let cAmount = found.currentAmount;
        let trans = found.transactions;
        let symbol = found.symbol;

        let data = (await axios.get("http://localhost:3001/prices/stock/" + symbol + "/1m")).data;
        let x = [];
        let y = [];
        let today = new Date();
        today.setDate(today.getDate()-1);
        x.unshift(today.toLocaleDateString());
        y.unshift(cAmount);
        for (let i=0; i<6; i++) {
            today.setDate(today.getDate()-1);
            x.unshift(today.toLocaleDateString());
            if (start > today) {
                y.unshift(0);
                continue;
            }
            if(trans.length > 0 && trans[trans.length-1].date > today / 1000) {
                if (trans[trans.length-1].type === "add") {
                    y.unshift(y[0] - trans[trans.length-1].qty);
                }
                else {
                    y.unshift(y[0] + trans[trans.length-1].qty);
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

        let stock = {
            x: x,
            y: y,
            mode: 'lines+markers',
            type: 'scatter',
            name: symbol,
            marker: { size: 12 }
        };

        let dataVal = [ stock ];
        this.setState({plotData: dataVal});
    }

    singleStockPlotLayout() {
        let layout = {
            title: "Stock Value"
        };
        return layout;
    }

    async singleCryptoPlot(userId, cryptoName) {
        if (arguments.length !== 2) {
            throw "Please provide a user ID and a crypto ID.";
        }
        if (typeof userId !== "string" || typeof cryptoName !== "string") {
            throw "The IDs must be strings.";
        }
        let response = (await axios.get("http://localhost:3001/holdings/crypto/" + userId)).data;
        let found = response.find(function (obj) {
            return obj.symbol === cryptoName;
        });
        let start = new Date(found.date * 1000);
        let sAmount = found.startingAmount;
        let cAmount = found.currentAmount;
        let trans = found.transactions;
        let symbol = found.symbol;

        let data = (await axios.get("http://localhost:3001/prices/crypto/" + symbol + "/histoday")).data;
        let x = [];
        let y = [];
        let today = new Date();
        today.setDate(today.getDate()-1);
        x.unshift(today.toLocaleDateString());
        y.unshift(cAmount);
        for (let i=0; i<6; i++) {
            today.setDate(today.getDate()-1);
            x.unshift(today.toLocaleDateString());
            if (start > today) {
                y.unshift(0);
                continue;
            }
            if(trans.length > 0 && trans[trans.length-1].date > today / 1000) {
                if (trans[trans.length-1].type === "add") {
                    y.unshift(y[0] - trans[trans.length-1].qty);
                }
                else {
                    y.unshift(y[0] + trans[trans.length-1].qty);
                }
                trans.pop();
            }
            else {
                y.unshift(y[0]);
            }
        }

        console.log(data);
        for (let i=0; i<7; i++) {
            y[6-i] *= data[data.length - 1 - i].close;
        }

        let crypto = {
            x: x,
            y: y,
            mode: 'lines+markers',
            type: 'scatter',
            name: symbol,
            marker: { size: 12 }
        };

        let dataVal = [ crypto ];
        this.setState({plotData: dataVal});
    }

    singleCryptoPlotLayout() {
        let layout = {
            title: "Crypto Value"
        };
        return layout;
    }

    render() {
        return (<div className="reactPlot"> <Plot data={this.state.plotData}
                layout={this.singleCryptoPlotLayout()} />
        </div>)
    }

}