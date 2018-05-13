import React, { Component } from 'react';
import {
    FormControl,
    Button,
    FormGroup
} from 'react-bootstrap';
import axios from 'axios';
import './App.css';
import DayPickerInput from 'react-day-picker/DayPickerInput'


export class CashDebtForm extends Component {
	constructor(props, context) {
		super(props, context);
		this.handleCashChange = this.handleCashChange.bind(this);
		this.handleDebtChange = this.handleDebtChange.bind(this);
		this.handleDebtorChange = this.handleDebtorChange.bind(this);
		this.handleDayChange = this.handleDayChange.bind(this);
		this.postDebt = this.postDebt.bind(this);
		this.postCash = this.postCash.bind(this);
		this.state = {
			cashInput: 0,
			debtAmountInput: 0,
			debtorInput: "",
			cashDate: new Date(),
			debtDate: new Date()
		}
	}
	async postCash() {
		if (this.state.cashInput === 0) {
			alert("Cash cannot be 0")
			return;
		}
		let type = this.state.cashInput > 0 ? "deposit" : "withdraw";

		await axios({
			method: "post",
			url: `http://localhost:3001/holdings/cash/${type}/${this.props.userid}`,
          	data: {
	            amount: Math.abs(Number(this.state.cashInput)),
	            date: Math.floor(this.state.cashDate.getTime() / 1000)
	        }
		});
	}
	async postDebt() {
		if (this.state.debtAmountInput <= 0 || this.state.debtorInput === "") {
			alert("Debt amount must be positive and creditor cannot be empty")
		}
		await axios({
			method: "post",
			url: `http://localhost:3001/holdings/debt/${this.props.userid}`,
          	data: {
	            amount: Number(this.state.debtAmountInput),
	            creditor: this.state.debtorInput,
	            date: Math.floor(this.state.cashDate.getTime() / 1000)
	        }
		});
	}
	handleCashChange(e) {
		this.setState({cashInput: e.target.value})
	}
	handleDebtChange(e) {
		this.setState({debtAmountInput: e.target.value})
	}
	handleDebtorChange(e) {
		this.setState({debtorInput: e.target.value})
	}
	handleDayChange(d, type) {
		let stateName = `${type}Date`;
		this.setState({[stateName]: d})
	}
	render() {
		return (<div className="cash-debt"> 
			<br />
			<hr />
			Enter a Cash Amount. Negative amounts mean withdrawal, positive means deposit.
			<FormControl type="number" 
				value={this.state.cashInput}
            	onChange={this.handleCashChange} />
            Enter the cash date
            <DayPickerInput 
				placeholder={this.state.cashDate.toLocaleDateString()}
				value={this.state.cashDate}
            	onDayChange={(d) => this.handleDayChange(d, "cash")} />
            <Button onClick={this.postCash}> Submit Cash </Button>
            <hr />

            Enter a Debt Amount.
			<FormControl type="number" 
				value={this.state.debtAmountInput}
            	onChange={this.handleDebtChange} />
            Enter the creditor's name
            <FormControl type="text"
				value={this.state.debtorInput}
            	onChange={this.handleDebtorChange} />
            Enter the debt date
			<DayPickerInput 
				placeholder={this.state.debtDate.toLocaleDateString()}
				value={this.state.debtDate}
            	onDayChange={(d) => this.handleDayChange(d, "debt")} />
            <Button onClick={this.postDebt}> Submit Debt </Button>
		</div>)
	}
}