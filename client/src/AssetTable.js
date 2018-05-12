import React, { Component } from 'react';
import {
    Nav,
    NavItem,
    NavDropdown,
    MenuItem,
    FormControl,
    Table,
    Button,
    OverlayTrigger,
    Popover
} from 'react-bootstrap';
import Select from 'react-select';
import { post, get } from './Interface';
import "react-select/dist/react-select.css";
import './App.css';
import axios from 'axios';


class AssetDetailsPopover extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            input: ""
        }
    }

    render() {
        return <Popover id="popover-trigger-focus" {...this.props}>
            Shares: <br/>
            Price: <br/>
            Value: <br/>
            Total Gain: <br/>
            Add Shares: <br/>
            <FormControl
                autoFocus
                value={this.state.input}
                type="text"
                placeholder="Enter amount of shares"
            /> <Button onSubmit={this.props.onSubmit}>Buy</Button>
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
        // 
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
        console.log("res", res)
        let newPrices = {};
        for (let i = 0; i < res.data.length; i++) {
            let toSet = (await axios.get(`http://localhost:3001/prices/${type}/${res.data[i].symbol}`))
            // console.log("ts", toSet);
            newPrices[res.data[i].symbol] = toSet.data[this.accessPriceToken[nextProps.activeKey]];
        }
        // console.log("Setting state", newPrices);
        this.setState({
            objects: res.data,
            prices: newPrices
        }, () => console.log("prices", this.state.prices));

    }

    async componentWillReceiveProps(nextProps) {
        await this.getTableData(nextProps);
    }

    onPopoverSubmit() {
        // Tommy do this
    }

    makeAssetRows() {
        let values = [];
        return <tr>{values}</tr>
    }


    makeAssetTable() {
        
        
        // let objects1 = get(`https://localhost:3001/${this.props.activeKey}/${this.props.userid}`)
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
        // let prices = {}
        // console.log('objs', objects)
        // for (let i = 0; i < objects.length; i++) {
        //     // api call
        //     prices[objects[i].symbol] = get(`http://localhost:3001/prices/stock/${objects[i].symbol}`)
        // }

        let tableRows = [];
        console.log(objects);
        for (let i = 0; i < objects.length; i++) {
            tableRows.push(
            <OverlayTrigger rootClose trigger="click" 
                    placement="right" 
                    overlay={ <AssetDetailsPopover onSubmit={this.onPopoverSubmit} {...this.props} />}>
                <tr>
                    <td> {objects[i].symbol} </td>
                    <td> {objects[i].currentAmount} shares </td>
                    <td> ${this.state.prices[objects[i].symbol]} </td>
                    <td> ${this.state.prices[objects[i].symbol] * objects[i].currentAmount} </td>
                </tr>
            </OverlayTrigger>)
        }
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
    render() {
        return <div> {this.makeAssetTable()} </div>
    }
}
