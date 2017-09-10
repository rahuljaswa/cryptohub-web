import React from 'react';

import Assets from './pages/assets.js'
import IcoCalendar from './pages/ico-calendar.js'
import Portfolio from './pages/portfolio.js'
import Watchlist from './pages/watchlist.js'

import LoginForm from './auth/login.js';
import ResetPasswordForm from './auth/reset_password.js';
import RegistrationForm from './auth/registration.js';

import {BrowserRouter, Route} from 'react-router-dom'
import {Navbar, Nav, NavItem} from 'react-bootstrap';
import {Logout} from './helpers.js'
import {withCookies} from 'react-cookie';

class Application extends React.Component {
	constructor(props) {
		super(props);

		this.toggle = this.toggle.bind(this);
		this.handleLogout = this.handleLogout.bind(this);
	}

	componentWillMount() {
		const { cookies } = this.props;
		console.log(cookies.getAll());

		this.state = {
			isOpen: false,
			loggedIn: cookies.get('access-token') ? true : false
		};
	}

	handleLogout(e) {
		e.preventDefault();

		const { cookies } = this.props;

		this.setState({
			loggedIn: false
		}, () => {
			Logout(cookies);
		});	
	}

	toggle() {
		this.setState({
			isOpen: !this.state.isOpen
		});
	}

	render() {
		let login = null;
		let logout = null;
		if(this.state.loggedIn) {
			logout = <NavItem onClick={this.handleLogout}>Logout</NavItem>;
		} else {
			login = <NavItem href="/login">Login</NavItem>;
		}

		return (
			<BrowserRouter>
				<div>
					<Navbar inverse>
						<Navbar.Header>
							<Navbar.Brand>
								<a href="/">Cryptohub</a>
							</Navbar.Brand>
							<Navbar.Toggle />
						</Navbar.Header>
						<Navbar.Collapse>
							<Nav>
								<NavItem href="/assets">Assets</NavItem>
								<NavItem href="/ico-calendar">ICO Calendar</NavItem>
								<NavItem href="/portfolio">Portfolio</NavItem>
								<NavItem href="/watchlist">Watchlist</NavItem>
							</Nav>

							<Nav pullRight>
								{login}
								{logout}
							</Nav>
						</Navbar.Collapse>
					</Navbar>

					<div className="container">
						<Route exact path="/" component={Assets}/>

						<Route path="/sign-up" component={RegistrationForm}/>
						<Route path="/reset-password" component={ResetPasswordForm}/>
						<Route path="/login" component={LoginForm}/>

						<Route path="/assets" component={Assets}/>
						<Route path="/ico-calendar" component={IcoCalendar}/>
						<Route path="/portfolio" component={Portfolio}/>
						<Route path="/watchlist" component={Watchlist}/>
					</div>
				</div>
			</BrowserRouter>
		);
	}
}

export default withCookies(Application);
