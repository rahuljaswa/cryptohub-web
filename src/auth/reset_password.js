import React from 'react';

import {Button, FormControl, FormGroup, HelpBlock} from 'react-bootstrap';
import {FetchAuthHeaders, HandleFetchErrors, HandleFetchAuthHeaders, ValidateEmail} from '../helpers.js'
import {Link} from 'react-router-dom'
import {withCookies} from 'react-cookie';

import './auth.css';

class ResetPasswordForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			email_valid: false,
			errors: []
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		const target = event.target;

		this.setState({
			[target.name]: target.value
		}, () => {
			this.validateForm();
		});
	}

	handleSubmit(event) {
		event.preventDefault();	

		const errors = []
		if (!this.state.email_valid) {
			errors.push('Invalid email address');
		}

		this.setState({
			errors: errors
		}, () => {
			if (errors.length === 0) {
				const { cookies } = this.props;
				fetch('https://cryptohub.herokuapp.com/api/v1/auth/password', {
					method: 'POST',
					headers: FetchAuthHeaders(cookies),
					body: JSON.stringify({
						email: this.state.email
					})
				})
				.then(HandleFetchErrors)
				.then(function(response) {
					HandleFetchAuthHeaders(response, cookies);
				})
				.catch(function(error) {
					console.log(error);
				});			
			}
		});
	}

	validateForm() {
		this.setState({
			email_valid: ValidateEmail(this.state.email)
		})
	}

	render() {
		const errorItems = this.state.errors.map((error, i) =>
			<li key={i}>{error}</li>
			);
		
		return (
			<div className="auth-form reset-password">
				<h2>Reset Password</h2>
				<ul className="errors">{errorItems}</ul>
				<form onSubmit={this.handleSubmit}>
					<FormGroup>
						<FormControl type="email" name="email" placeholder="Email" value={this.state.email} onChange={this.handleChange} />
						<HelpBlock>Remembered your password? <Link to="/login">Login instead</Link>. Don't have an account? <Link to="/sign-up">Register now</Link>.</HelpBlock>
					</FormGroup>
					<Button type="submit" value="Submit">Request Password Reset</Button>
				</form>
			</div>
			);
	}
}

export default withCookies(ResetPasswordForm);
