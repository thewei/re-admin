
export default async function fakeLogin({ username, password }) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (username === 'admin' && password === '123456') {
				resolve({
					accessToken: 'paiBei4uChua8Aipooc9joeS',
					expiresIn: 86400,
				});
			}
			else {
				reject(new Error('username or password is wrong'));
			}
		}, 1000);
	});
}