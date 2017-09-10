import React from 'react';
import ReactDOM from 'react-dom';

import Application from './application.js'
import {CookiesProvider} from 'react-cookie';

import './index.css';

ReactDOM.render(
	<CookiesProvider>
		<Application />
	</CookiesProvider>,
	document.getElementById('root')
);
