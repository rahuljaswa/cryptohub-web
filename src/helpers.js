export function HandleFetchErrors(response) {
	if (!response.ok) {
		console.log(response.statusText);
	}
	return response;
}

export function HandleFetchAuthHeaders(response, cookies) {
	cookies.set('token-type', response.headers.get('token-type'), {path: '/'});
	cookies.set('access-token', response.headers.get('access-token'), {path: '/'});
	cookies.set('client', response.headers.get('client'), {path: '/'});
	cookies.set('uid', response.headers.get('uid'), {path: '/'});
	cookies.set('expiry', response.headers.get('expiry'), {path: '/'});
	return response;
}

export function FetchAuthHeaders(cookies) {
	return {
		'Accept': 'application/json',
		'Content-type': 'application/json',
		'token-type': cookies.get('token-type'),
		'access-token': cookies.get('access-token'),
		'client': cookies.get('client'),
		'expiry': cookies.get('expiry'),
		'uid': cookies.get('uid')
	}
}

export function Logout(cookies) {
	cookies.remove('token-type');
	cookies.remove('access-token');
	cookies.remove('client');
	cookies.remove('uid');
	cookies.remove('expiry');
}

export function ValidateEmail(email_string) {
	return (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(email_string));
}

export function ValidatePassword(password_string) {
	return password_string.length >= 7;
}
