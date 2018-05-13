import React, { Component } from 'react';
import {
    Nav,
    NavItem,
    NavDropdown,
    MenuItem,
    Form,
    FormControl,
    Table,
    OverlayTrigger,
    Popover,
    Button,
    FormGroup,
    Modal,
    ControlLabel
} from 'react-bootstrap';
import Select from 'react-select';
import axios from 'axios';
import "react-select/dist/react-select.css";
import './App.css';
import ModalLogin from './ModalLogin';
import AssetTable from './AssetTable';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import {PlotGraph} from './PlotGraph';


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
                    <FilterTextBox applyFilter={t => this.setState({ filter: t })} activeKey={this.state.activeKey} userid={this.state._id}/>
                </div>
                <div>
                    <PlotGraph userid={this.state._id} />
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
        this.verifyAsset = this.verifyAsset.bind(this);
        this.handleModalChange = this.handleModalChange.bind(this);
        this.handleDayChange = this.handleDayChange.bind(this);
        this.submitModal = this.submitModal.bind(this);
        this.activeKeyMap = {
            Stocks : "stock",
            Cryptocurrencies: "crypto",

        }
        let init_val = "";
        // Initialize the filter text box based on the query string
        this.state = {
            current_text: init_val,
            date: new Date()
        };
        this.last_run_filter = init_val;

        props.applyFilter(this.last_run_filter);
    }

    // async componentDidUpdate(prevProps, prevState) {
    //     this.setState({validationState: await this.getValidationState()})
    // }
    handleChange(val) {
        if (val.target.current_text !== this.state.current_text) {
            this.setState({
                current_text: val.target.value,
                validationState: null
            })
        }
    }

    async submitModal() {
        await axios({
          method: 'post',
          url: "http://localhost:3001/holdings/investment/" + this.props.userid,
          data: {
            symbol: this.state.current_text,
            startingAmount: this.state.amount,
            type: this.activeKeyMap[this.props.activeKey],
            date: this.state.date
          }
        });
    }
    handleModalChange(e) {
        this.setState({[e.target.id] : e.target.value > 0 ? e.target.value : 0});
    }
    handleDayChange(d) {
        this.setState({date: d})
    }
    // async componentWillUpdate(nextProps, nextState) {
    //     await this.getValidationState(nextProps, nextState);
    // }
    async verifyAsset() {
        let a = await axios.get(`http://localhost:3001/prices/${this.activeKeyMap[this.props.activeKey]}/${this.state.current_text}`);
        if (a.data && Object.keys(a.data).length !== 0 && a.data !== "U") {
            console.log("returning success", a)
            this.setState({
                validationState: "success",
                showAssetAdd: true
            })
            // this.setState({validationState: "success"})
            return 'success'
        } else {
            this.setState({validationState: "error"})
            return 'error'
        }
        // this.setState({validationState: "error"})

        console.log(a);
    }



    render() {
        // {this.getValidationState()}
        // {cashPlot();}
        return (
            <div>

            <div id="plot"> </div>
        <FormGroup validationState={this.state.validationState}>
        <FormControl
            disabled={["crypto", "stock"].indexOf(this.activeKeyMap[this.props.activeKey]) === -1}
            name="form-field-name"
            value={this.state.current_text}
            onChange={this.handleChange}
            placeholder={"Search for a " + this.activeKeyMap[this.props.activeKey] + " ticker"}
        />
        <FormControl.Feedback />
        <Button disabled={["crypto", "stock"].indexOf(this.activeKeyMap[this.props.activeKey]) === -1} onClick={this.verifyAsset}>Buy or Sell Asset</Button>
        </FormGroup>
        {this.state.validationState === "success" &&
            <Modal show={this.state.showAssetAdd}>
            <Modal.Header> 
                <button type="button" className="close" aria-hidden="true" onClick={() => {this.setState({showAssetAdd: !this.state.showAssetAdd})}}>&times;</button>
                <h4>{this.state.current_text.toUpperCase()} </h4>
            </Modal.Header>
                <Modal.Body>
                <form onSubmit={this.handleModalSubmit}>
                    <FormGroup className="input-modal">
                        <ControlLabel>Amount:</ControlLabel>
                        <FormControl className="input-modal-amount" autoFocus type="number" value={this.state.amount} onChange={this.handleModalChange} />
                    </FormGroup>
                    <FormGroup controlId='date' className="input-modal">
                        <ControlLabel>Choose Date:</ControlLabel>
                        <DayPickerInput dayPickerProps={{ disabledDays: {after: new Date()} }} placeholder={this.state.date.toLocaleDateString()} onDayChange={this.handleDayChange} />
                    </FormGroup>
                    <FormGroup controlId='action' className="input-modal">
                        <ControlLabel className="input-modal-action-name">Action:</ControlLabel>
                        <FormControl componentClass="select" placeholder="Buy" className="input-modal-action">
                            <option value="Buy">Buy</option>
                            <option value="Sell">Sell</option>
                        </FormControl>
                    </FormGroup>
                </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => {this.setState({showAssetAdd: !this.state.showAssetAdd})}} type="submit"> Close </Button>
                    <Button onClick={this.submitModal} type="submit"> Submit </Button>
                </Modal.Footer>
            </Modal>
        }

        </div>)
    }
}
