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
import AssetTable from './AssetTable';



export default class Main extends Component {
    constructor(props, context) {
        super(props, context);
        this.toggleNavKey = this.toggleNavKey.bind(this);
        this.storeUserData = this.storeUserData.bind(this);
        this.state = {
            activeKey: "Stocks"
        }
    }

    storeUserData(d) {
    	this.setState(d.data, () => {console.log(this.state)});
    }
    toggleNavKey(eventKey, event) {
    	event.preventDefault();
    	this.setState({
    		activeKey: eventKey
    	})
    }

    render() {
    	let modalLogin = <ModalLogin storeUserData={this.storeUserData}/>
                
        return (
            <div>
           		{modalLogin}
            	<div>
                    <h3 id="asset-tracker-name">Asset Tracker</h3>
                </div>
                <div className="search">
                    <FilterTextBox applyFilter={t => this.setState({ filter: t })} />
                </div>
                <div>
                    <AssetNavbar activeKey={this.state.activeKey} toggleNavKey={this.toggleNavKey}/>
                    <div>
                        <AssetTable activeKey={this.state.activeKey} userid={this.state._id}/>
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
