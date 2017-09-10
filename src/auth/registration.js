import React from 'react';

import {Button, FormControl, FormGroup, HelpBlock} from 'react-bootstrap';
import {FetchAuthHeaders, HandleFetchErrors, HandleFetchAuthHeaders, ValidateEmail, ValidatePassword} from '../helpers.js'
import {Link} from 'react-router-dom'
import {withCookies} from 'react-cookie';

import './auth.css';

class RegistrationForm extends React.Component {
	constructor(props) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentWillMount() {
		this.state = {
			email: '',
			password: '',
			password_confirmation: '',
			email_valid: false,
			password_valid: false,
			password_confirmation_valid: false,
			errors: []
		};
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
		if (!this.state.password_valid) {
			errors.push('Password must be 7 characters or more')
		}
		if (!this.state.password_confirmation_valid) {
			errors.push('Passwords don\'t match');
		}

		this.setState({
			errors: errors
		}, () => {
			if (errors.length === 0) {
				event.preventDefault();

				const { cookies } = this.props;
				
				fetch('https://cryptohub.herokuapp.com/api/v1/auth/', {
					method: 'POST',
					headers: FetchAuthHeaders(cookies),
					body: JSON.stringify({
						email: this.state.email,
						password: this.state.password,
						password_confirmation: this.state.password_confirmation,
						confirm_success_url: '/'
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
			email_valid: ValidateEmail(this.state.email),
			password_valid: ValidatePassword(this.state.password),
			password_confirmation_valid: (this.state.password === this.state.password_confirmation)
		})
	}

	render() {
		const errorItems = this.state.errors.map((error, i) =>
			<li key={i}>{error}</li>
			);
		
		return (
			<div className="auth-form register">
				<h2>Register</h2>
				<ul className="errors">{errorItems}</ul>
				<form onSubmit={this.handleSubmit}>
					<FormGroup>
						<FormControl type="email" name="email" placeholder="Email" value={this.state.email} onChange={this.handleChange} />
					</FormGroup>
					<FormGroup>
						<FormControl type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.handleChange} />
						<HelpBlock color="muted">Passwords must be 7 characters or longer.</HelpBlock>
					</FormGroup>
					<FormGroup>
						<FormControl type="password" name="password_confirmation" placeholder="Confirm Password" value={this.state.password_confirmation} onChange={this.handleChange} />
						<HelpBlock>Already registered? <Link to="/login">Login instead</Link>. Forgot your password? <Link to="/reset-password">Reset your password</Link></HelpBlock>.
					</FormGroup>
					<Button type="submit" value="Submit">Register</Button>
				</form>
			</div>
			);
	}
}

export default withCookies(RegistrationForm);
