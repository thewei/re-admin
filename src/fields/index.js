
const context = require.context('fields', true, /\w\/index\.js$/);
context.keys().map((modulePath) => {
	const [, moduleName] = modulePath.split('/');
	const result = context(modulePath);
	const component = result.default || result;
	exports[moduleName] = component;
});
