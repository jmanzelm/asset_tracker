/**
 *  Login Modal
 *  @author: Taylor He
 * 
 */

import React, { Component } from 'react';
import {
    FormGroup,
    FormControl,
    Modal,
    ControlLabel,
    Button
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
            password: ""
        }
    }

    doLogin() {
        console.log("hey");
        let a = post("http://localhost:3001/login/", {
            username: this.state.username,
            password: this.state.password
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
                <Modal show={true} onHide={this.doLogin}>
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
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.doLogin} type="submit"> Login </Button>
                </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

