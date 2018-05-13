import React, { Component } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';


/**
 *  Plots the investments and cash graph
 */

export class PlotGraph extends Component {
    constructor(props, context) {
        super(props, context);
        this.cashPlot = this.cashPlot.bind(this);
        this.state = {};
    }
    async componentWillReceiveProps(nextProps) {
        await this.cashPlot(nextProps.userid);
    }
    async cashPlot(userId) {
        if (arguments.length !== 1) {
            throw "Please provide a single ID.";
        }
        if (typeof userId !== "string") {
            throw "The ID must be a string.";
        }
        let response = (await axios.get("http://localhost:3001/holdings/cash/" + userId)).data;
        console.log(response);
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

    async singleDebtPlot(userId, debtId) {
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
            name: creditor,
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

    render() {
        return <Plot data={this.state.plotData}
                layout={this.cashPlotLayout()} />
    }

}