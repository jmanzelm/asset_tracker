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
        this.toggleNavKey = this.toggleNavKey.bind(this);
        this.state = {
            input: "",
            activeKey: "Stocks"
        }
    }

    toggleNavKey(eventKey, event) {
    	event.preventDefault();
    	this.setState({
    		activeKey: eventKey
    	})
    }

    render() {
        return (
            <div>
            	<ModalLogin />
                <div>
                    <h3 id="asset-tracker-name">Asset Tracker</h3>
                </div>
                <div className="search">
                    <FilterTextBox applyFilter={t => this.setState({ filter: t })} />
                </div>
                <div>
                    <AssetNavbar activeKey={this.state.activeKey} toggleNavKey={this.toggleNavKey}/>
                    <div>
                        <AssetTable activeKey={this.state.activeKey}/>
                    </div>
                </div>
            </div>
        )
    }
}

/**
 *	Handles table view select
 */
class AssetNavbar extends Component {
	constructor(props, context) {
        super(props, context);
        this.handleNavSelect = this.handleNavSelect.bind(this);
        this.makeNavbar = this.makeNavbar.bind(this);
        this.navItems = [
        	"Stocks",
        	"Cryptocurrencies",
        	"Cash",
        	"Debt"
        ];
    }

    handleNavSelect(eventKey, event) {
    	this.props.toggleNavKey(eventKey, event);
    	return;
    }

	makeNavbar() {
        return <Nav bsStyle="pills" stacked activeKey={this.props.activeKey} >
        	{this.navItems.map((itemName) => {
        		return <NavItem eventKey={itemName} onSelect={this.handleNavSelect} >
        			{itemName}
        		</NavItem>
        	})}
        </Nav>;
    }
    render() {
    	return <div class="navbar">
                        {this.makeNavbar()}
                    </div>
    }

}

/**
 *	Handles Filter
 */
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
        return [
        { value: 'one', label: 'APPL' },
        { value: 'two', label: 'GOOG' }
        ];
    }

    render() {
        return (<Select
            clearable={false}
            name="form-field-name"
            value={this.state.current_text}
            onChange={this.handleChange}
            options={this.getTickerOptions()}
        />)
    }
}


class AssetTable extends Component {
    // Props needed: the assets to filter
    constructor(props, context) {
        super(props, context);
        this.detailsPopover = <Popover id="popover-positioned-right">
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

    makeAssetTable() {
        let tableRows = [];
        for (let i = 0; i < 10; i++) {
            tableRows.push(
            <OverlayTrigger rootClose trigger="click" placement="right" overlay={this.detailsPopover}>
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
