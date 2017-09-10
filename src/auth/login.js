import React from 'react';

import { Button, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';
import { FetchAuthHeaders, HandleFetchErrors, HandleFetchAuthHeaders, ValidateEmail, ValidatePassword } from '../helpers.js'
import { Link } from 'react-router-dom'
import { withCookies } from 'react-cookie';

import './auth.css';

class LoginForm extends React.Component {
	constructor(props) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentWillMount() {
		this.state = {
			email: '',
			password: '',
			email_valid: false,
			password_valid: false,
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

		this.setState({
			errors: errors
		}, () => {
			if (errors.length === 0) {
				const { cookies } = this.props;

				fetch('https://cryptohub.herokuapp.com/api/v1/auth/sign_in', {
						method: 'POST',
						headers: FetchAuthHeaders(cookies),
						body: JSON.stringify({
							email: this.state.email,
							password: this.state.password
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
			password_valid: ValidatePassword(this.state.password)
		})
	}

	render() {
		const errorItems = this.state.errors.map((error, i) =>
			<li key={i}>{error}</li>
			);
		
		return (
			<div className="auth-form login">
				<h2>Login</h2>
				<ul className="errors">{errorItems}</ul>
				<form onSubmit={this.handleSubmit}>
					<FormGroup>
						<FormControl type="email" name="email" placeholder="Email" value={this.state.email} onChange={this.handleChange} />
					</FormGroup>
					<FormGroup>
						<FormControl type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.handleChange} />
						<HelpBlock>Don't have an acccount? <Link to="/sign-up">Register now</Link>. Forgot your password? <Link to="/reset-password">Reset your password.</Link></HelpBlock>
					</FormGroup>
					<Button type="submit" value="Submit">Login</Button>
				</form>
			</div>
			);
	}
}

export default withCookies(LoginForm);
