import { observable, action } from 'mobx';

const localeStore = observable({
	LoginForm: {
		usernamePlaceholder: 'User',
		passwordPlaceholder: 'Password',
		login: 'Login',
	},

	CreateButton: {
		label: 'Create',
	},

	RefButton: {
		label: 'Reference',
	},

	RemoveButton: {
		label: 'Remove',
		multiLabel: 'Batch Remove',
		title: 'Are you absolutely sure to remove?',
		content: 'This operation cannot be undone!',
	},

	ClearSortButton: {
		label: 'Reset Sorting',
	},

	TableQuery: {
		search: 'Search',
		reset: 'Reset',
		resetOrder: 'Reset Sorting',
	},

	TableBody: {
		total: 'Total',
	},

	TableQuerySwitch: {
		label: 'Search',
	},

	UpdateButton: {
		label: 'Update',
		multiLabel: 'Batch Update',
	},

	UserMenu: {
		confirmSignOut: 'Are you sure to sign out?',
		signOut: 'Sign out',
	},

	ActionsField: {
		label: 'Actions',
	},

	ArrayOf: {
		addButtonLabel: 'Add item',
	},

	requests: {
		failed: 'Failed',
		fetchFailed: 'Load failed',
		createFailed: 'Create failed',
		updateFailed: 'Update failed',
		removeFailed: 'Remove failed',
		loginFailed: 'Login failed',
		loginSuccess: 'Login success',
		invalidToken: 'Invalid auth token',
	},

	set: action.bound(function setLocale(values) {
		Object.assign(this, values);
	}),
});

export default localeStore;
