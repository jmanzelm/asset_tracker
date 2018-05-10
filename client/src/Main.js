import React, { Component } from 'react';
import {
    Nav,
    NavItem,
    NavDropdown,
    MenuItem,
    FormControl,
    Table,
    OverlayTrigger,
    Popover
} from 'react-bootstrap';
import Select from 'react-select';
import axios from 'axios';
import "react-select/dist/react-select.css";
import './App.css';
import ModalLogin from './ModalLogin';




export default class Main extends Component {
    constructor(props, context) {
        super(props, context);
        this.handleNavSelect = this.handleNavSelect.bind(this);
        this.makeNavbar = this.makeNavbar.bind(this);
        this.state = {
            input: ""
        }
        // console.log(getUserById('3'))
    }

    componentWillMount() {

    }

    handleNavSelect() {
        this.setState({
            tab: ""
        });
    }

    makeNavbar() {
        return <Nav bsStyle="pills" stacked activeKey={1} >
            <NavItem eventKey={1} href="/home">
                Stocks
            </NavItem>
            <NavItem eventKey={2} href="/crypto">
                Cryptocurrencies
            </NavItem>
            <NavItem eventKey={3} href="/cash">
                Cash
            </NavItem>
            <NavItem eventKey={4} href="/debts">
                Debts
            </NavItem>
        </Nav>;
    }
    render() {
        return (
            <div>
            	<ModalLogin />
                <div>
                    <h3 id="asset-tracker-name">Asset Tracker</h3>
                </div>
                <div class="search">
                    <FilterTextBox applyFilter={t => this.setState({ filter: t })} />
                </div>
                <div>
                    <div class="navbar">
                        {this.makeNavbar()}
                    </div>
                    <div>
                        <AssetTable />
                    </div>
                </div>
            </div>
        )
    }
}

class FilterTextBox extends Component {
    constructor(props, context) {
        super(props, context);
        this.handleChange = this.handleChange.bind(this);

        let init_val = "";
        // Initialize the filter text box based on the query string
        this.state = {
            current_text: init_val
        };
        this.last_run_filter = init_val;

        props.applyFilter(this.last_run_filter);
    }
    handleChange(val) {
        this.setState({ current_text: val.value })
    }

    onFilterChange = evt => {
        this.setState({ current_text: evt.target.value });
    };

    onFilterKey = evt => {
        if (evt.charCode === 13) {
            this.last_run_filter = this.state.current_text;
            this.props.applyFilter(this.last_run_filter);
        }
    };

    onFilterDown = evt => {
        if (evt.keyCode === 27) {
            this.setState({ current_text: this.last_run_filter });
        }
    };


    getTickerOptions() {
        // let s = apicall.get()
        let s = [];
        let options = [];
        for (let i = 0; i < s.length; i++) {
            options.push({
                label: s.Name,
                value: s.Value
            })
        }
        return [{ value: 'one', label: 'APPL' },
        { value: 'two', label: 'GOOG' }];
    }

    render() {
        return (<Select
            clearable={false}
            name="form-field-name"
            value={this.state.current_text}
            onChange={this.handleChange}
            options={this.getTickerOptions()}
        />)
        return (
            <FormControl
                autoFocus
                type="text"
                placeholder="Search Ticker Symbol"
                className={this.state.current_text === this.last_run_filter ? "filter-active" : "filter-inactive"}
                value={this.state.current_text}
                onChange={this.onFilterChange}
                onKeyPress={this.onFilterKey}
                onKeyDown={this.onFilterDown}

            />
        );
    }
}


class AssetTable extends Component {
    // Props needed: the assets to filter
    constructor(props, context) {
        super(props, context);
        this.detailsPopover = <Popover id="popover-positioned-right">
            Apple (AAPL)
            Shares: <br/>
            Price: <br/>
            Value: <br/>
            Total Gain: <br/>
            Add Shares: <br/>
            <FormControl
                autoFocus
                type="text"
                placeholder="amount of shares"
            />
        </Popover>
    }

    makeAssetRows() {
        let values = [];


        return <tr>{values}</tr>
    }
    l

    makeAssetTable() {
        let tableRows = [];
        for (let i = 0; i < 10; i++) {
            tableRows.push(<OverlayTrigger rootClose trigger="click" placement="right" overlay={this.detailsPopover}>
                <tr>
                    <td> {i} </td>
                    <td> {i} shares </td>
                    <td> $ {i} </td>
                    <td> $ {i*i} </td>
                    <td> +/- {i} % </td>
                </tr>
            </OverlayTrigger>)
        }
        return <Table className="table asset-table" bordered hover>
            <thead>
                <tr>
                    <th> Symbol </th>
                    <th> Quantity </th>
                    <th> Price </th>
                    <th> Value </th>
                    <th> + / - </th>

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
