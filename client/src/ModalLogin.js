/**
 *  Login Modal sends username and password to the server
 *  @author: Taylor He
 * 
 */

import React, { Component } from 'react';
import {
    FormGroup,
    FormControl,
    Modal,
    ControlLabel,
    Button,
    Alert
} from 'react-bootstrap';
import './App.css';
import { post } from './Interface';


export default class ModalLogin extends Component {
    constructor(props, context) {
        super(props, context);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.doLogin = this.doLogin.bind(this);
        this.state = {
            username: "",
            password: "",
            show: true,
            style: "info",
            activity: "",
            alertType: ""
        }
    }

    doLogin() {
        this.setState({
            message: `Attempting login for ${this.state.username}...`,
            "alertType": "info",
            "activity": "logging-in"
        })
        // Post to /login server with username and password
        let a = post("http://localhost:3001/login/", {
            username: this.state.username,
            password: this.state.password
        }).then( (response) => {
            console.log(response);
            if (Object.keys(response.data).length !== 0) {
                this.setState({show: false});
                this.props.storeUserData(response);
            } else {
                this.setState({
                    message: "Failed to login. Please try again",
                    "alertType": "danger",
                    activity: ""
                })
            }
        })
    }

    handleChange(e) {
        this.setState({[e.target.id] : e.target.value});
    }
    handleSubmit(e) {
        e.preventDefault();
        this.doLogin();
    }
    render() {
        return (
            <div className="login">
                <Modal show={this.state.show}>
                <Modal.Header> Login </Modal.Header>
                <Modal.Body>
                <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId='username'>
                        <ControlLabel>Username:</ControlLabel>
                        <FormControl autoFocus type="text" value={this.state.username} onChange={this.handleChange} />
                    </FormGroup>
                    <FormGroup controlId='password'>
                        <ControlLabel>Password:</ControlLabel>
                        <FormControl type="password"  value={this.state.password} onChange={this.handleChange} />
                    </FormGroup>
                </form>
                {this.state.alertType !== "" && 
                    <Alert bsStyle={this.state.alertType}>
                    { this.state.activity ==='logging-in' && <div className='connecting-spinner'/> }
                    { this.state.message }
                    </Alert>}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.doLogin} type="submit"> Login </Button>
                </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

