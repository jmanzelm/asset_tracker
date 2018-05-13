import React, { Component } from 'react';
import {
    FormControl,
    Button,
    FormGroup
} from 'react-bootstrap';
import axios from 'axios';
import './App.css';


export class CashDebtForm extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			cashInput: "",
			debtInput: "",

		}
	}
	handleCashChange(e) {
		this.setState({cashInput: e.target.value})
	}
	render() {
		return (<div> 
			Enter a Cash Amount. Negative amounts mean withdrawal, positive means deposit.
			<FormControl type="number" 
				value={this.state.cashInput}
            	onChange={this.handleCashChange} />
            <br />
            Enter a Debt Amount.
			<FormControl type="number" 
				value={this.state.cashInput}
            	onChange={this.handleDebtChange} />
            <FormControl type="text"
				value={this.state.cashInput}
            	onChange={this.handleChange} />
		</div>)
	}
}