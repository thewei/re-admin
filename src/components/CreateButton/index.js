import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import ContextButton from 'components/ContextButton';
import { isFunction } from 'lodash';
import localize from 'hocs/localize';
import routerStore from 'stores/routerStore';

@localize('CreateButton')
export default class CreateButton extends Component {
	static propTypes = {
		localeStore: PropTypes.object.isRequired,
		table: PropTypes.string,
		label: PropTypes.stringOrFunc,
		title: PropTypes.stringOrFunc,
		save: PropTypes.string,
		noRouter: PropTypes.bool,
	};

	static defaultProps = {
		save: 'create',
		noRouter: false,
	};

	_handleClick = (ev, refs) => {
		ev.preventDefault();
		const { props } = this;
		const { openCreaterModal, getSelectedKeysString, getData, store } = refs;
		const { title, label, table, save, localeStore, noRouter } = props;
		const getTitle = title || localeStore.localizeProp(label, 'label');
		const params = {
			title: isFunction(getTitle) ? getTitle(getData()) : getTitle,
			save,
		};

		if (table) {
			params.keys = getSelectedKeysString();
			params.table = table;
		}

		routerStore.push('/articles/create/');
		// openCreaterModal(params, { router: !noRouter });
	};

	render() {
		const { title, table, save, localeStore, noRouter, ...other } = this.props;
		return (
			<ContextButton
				onClick={this._handleClick}
				{...localeStore.localize(other)}
			/>
		);
	}
}
