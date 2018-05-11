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


class AssetDetailsPopover extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            input: ""
        }
    }

    render() {
        return <Popover id="popover-positioned-right">
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
        this.COL_DEF = [
            "Ticker",
            "Quantity",
            "Price Per Share",
            "Value",
            "+/-"
        ]
        this.activeKeyMap = {
            Stocks: "holdings/stocks",
            Cryptocurrencies: "holdings/crypto",
            Cash: "holdings/cash",
            Debt: "holdings/debt"

        }
        
    }

    onPopoverSubmit() {
        // Tommy do this
    }

    makeAssetRows() {
        let values = [];
        return <tr>{values}</tr>
    }


    makeAssetTable() {

        let objects1 = get(`https://localhost:3001/${this.props.activeKey}/${this.props.userid}`)
        let objects = [
            {   
                _id: 2,
                symbol: "AAPL",
                transactions:  [
                            {
                                type: "Purchase",
                                quantity: 2,
                                date: new Date()
                            }
                        ],
                startingAmount: 0,
                currentAmount: 2,
                type: "Stocks"
            },
        ]
        let prices = {}
        for (let i = 0; i < objects.length; i++) {
            // api call
            prices[objects[i].symbol] = "3.12"
        }
        let tableRows = [

        ];
        for (let i = 0; i < objects.length; i++) {
            tableRows.push(
            <OverlayTrigger rootClose trigger="click" 
                    placement="right" 
                    overlay={ <AssetDetailsPopover onSubmit={this.onPopoverSubmit} />}>
                <tr>
                    <td> {objects[i].symbol} </td>
                    <td> {objects[i].currentAmount} shares </td>
                    <td> $ {prices[objects[i].symbol]} </td>
                    <td> $ {prices[objects[i].symbol] * objects[i].currentAmount} </td>
                    <td> +/- {i} % </td>
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
