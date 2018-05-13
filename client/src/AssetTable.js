import React, { Component } from 'react';
import {
    FormControl,
    Table,
    Button,
    OverlayTrigger,
    Popover
} from 'react-bootstrap';
// import Select from 'react-select';
// import { post, get } from './Interface';
import "react-select/dist/react-select.css";
import './App.css';
import axios from 'axios';
import {FilterTextBox} from './Main';
import format from 'date-fns/format';


class AssetDetailsPopover extends Component {
    constructor(props, context) {
        super(props, context);
        this.setPriceData = this.setPriceData.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.activeKeyMap = {
            Stocks: "stock",
            Cryptocurrencies: "crypto"
        }
        this.DATE_FORMAT = 'YYYYMMDD';
        this.state = {
            input: "",
            diff: 0
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setPriceData(nextProps);
    }

    handleChange(e) {
        this.setState({input: e.target.value})
    }

    // this function sets price states and calculates differences
    async setPriceData() {
        console.log(this.props)
        let formattedDate = format(this.props.o.date * 1000, this.DATE_FORMAT);
        console.log(formattedDate);
        if (this.activeKeyMap[this.props.activeKey] === "stock") {
            let pa = `http://localhost:3001/prices/stock/${this.props.o.symbol}/${formattedDate}`;
            let priceAcquired = await axios.get(pa);
            console.log(pa)
            let priceNow = await axios.get(`http://localhost:3001/prices/stock/${this.props.o.symbol}/`)
            let diff = priceNow.data.close - priceAcquired.data.close;
            console.log("pricenow", priceNow);
            console.log("priceAc", priceAcquired)
            console.log(diff);

            this.setState({diff: diff})
        }
       
    }

    render() {
        console.log("props",this.props)
        return <Popover id="popover-trigger-focus" {...this.props}>
            Price Acquired: {this.state.diff}<br/>
            Total Gain: <br/>
        </Popover>
    }
}

export default class AssetTable extends Component {
    // Props needed: the assets to filter
    constructor(props, context) {
        super(props, context);
        this.onPopoverSubmit = this.onPopoverSubmit.bind(this);
        this.makeAssetTable = this.makeAssetTable.bind(this);
        this.getTableData = this.getTableData.bind(this);
        this.COL_DEF = [
            "Ticker",
            "Quantity",
            "Price Per Share",
            "Value"
        ]
        // Maps the activeKey state to the proper route
        this.activeKeyMap = {
            Stocks: "stock",
            Cryptocurrencies: "crypto",
            Cash: "cash",
            Debt: "debt",
            objects: []
        }
        // The name of the price data field on API calls
        this.accessPriceToken = {
            Stocks: "close",
            Cryptocurrencies: "price"
        }
        this.state = {
            objects: [],
            prices: {}
        };

    }
    // On receiving new props, asynchronously make API calls for populating table.
    async getTableData(nextProps) {
        let type = this.activeKeyMap[nextProps.activeKey];
        const res = await axios.get(`http://localhost:3001/holdings/${type}/${nextProps.userid}/`);
        if (type === "crypto" || type === "stock") {
            console.log(res)
            let transactions = res.data ? res.data : []
            let newPrices = {}
            for (let i = 0; i < transactions.length; i++) {
                let toSet = (await axios.get(`http://localhost:3001/prices/${type}/${transactions[i].symbol}`))
                // console.log("ts", toSet);
                newPrices[transactions[i].symbol] = toSet.data[this.accessPriceToken[nextProps.activeKey]];
            }
            this.setState({
                objects: transactions,
                prices: newPrices
            }, () => {
                let totalAssetValue = 0;
                let objects = this.state.objects;
                for (let i = 0; i < objects.length; i++) {
                    totalAssetValue += (this.state.prices[objects[i].symbol] * objects[i].currentAmount)
                }
                this.setState({totalAssetValue: this.roundTwoDecimals(totalAssetValue)});
            });
        } else if (type === "cash"){
            let currVal = res.data.currentAmount;
            this.setState({totalAssetValue: this.roundTwoDecimals(currVal ? currVal : 0)})
        } else if (type === "debt") {
            let currVal = await axios.get(`http://localhost:3001/holdings/${type}/total/${nextProps.userid}/`);
            console.log(currVal);
            this.setState({totalAssetValue: this.roundTwoDecimals(currVal.data.totalDebt ? currVal.data.totalDebt : 0)})
        }
        
        // console.log("Setting state", newPrices);

       

    }

    async componentWillReceiveProps(nextProps) {
        await this.getTableData(nextProps);
    }

    onPopoverSubmit() {
        // Tommy do this
    }

    roundTwoDecimals(n) {
        return n.toFixed(2);
    }

    makeAssetTable() {
        // let objects = [
        //     {
        //         _id: 2,
        //         symbol: "AAPL",
        //         transactions:  [
        //                     {
        //                         type: "Purchase",
        //                         quantity: 2,
        //                         date: new Date()
        //                     }
        //                 ],
        //         startingAmount: 0,
        //         currentAmount: 2,
        //         type: "Stocks"
        //     },
        // ]

        let objects = this.state.objects;

        let tableRows = [];
        // console.log(objects);
        for (let i = 0; i < objects.length; i++) {
            tableRows.push(
            <OverlayTrigger rootClose trigger="click"
                placement="right"
                overlay={
                    <AssetDetailsPopover
                        onSubmit={this.onPopoverSubmit}
                        {...this.props}
                        o={objects[i]}/>
                }
            >
                <tr>
                    <td> {objects[i].symbol} </td>
                    <td> {objects[i].currentAmount} shares </td>
                    <td> ${this.roundTwoDecimals(this.state.prices[objects[i].symbol])} </td>
                    <td> ${this.roundTwoDecimals(this.state.prices[objects[i].symbol] * objects[i].currentAmount)} </td>
                </tr>
            </OverlayTrigger>)
        }

        let type = this.activeKeyMap[this.props.activeKey]
        if (type === "crypto" || type === "stock") {
            return <Table className="table asset-table" bordered hover>
                <thead>
                    <tr>
                        {this.COL_DEF.map((header) => { return <th>{header}</th>})}
                    </tr>
                </thead>
                <tbody>
                    {tableRows}
                </tbody>
            </Table>
        }
    }

    render() {
        return <div>
            <div className="filtertextbox">
                <FilterTextBox activeKey={this.props.activeKey} userid={this.props.userid}/>
            </div>
            <div className="total-asset-value">
            <p>Total value for all {this.props.activeKey}: ${this.state.totalAssetValue}</p>
            </div>
            <br />
            {this.makeAssetTable()}
        </div>
    }
}
