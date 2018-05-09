import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import hoist, { extractRef } from 'hoc/hoist';
import joinKeys from 'utils/joinKeys';
import withModalStore from 'hoc/withModalStore';
import * as Actions from 'constants/Actions';

// Notice that this `Action` is NOT Redux or MobX action.
export default function withActions(WrappedComponent) {
	@hoist(WrappedComponent)
	@withModalStore()
	@observer
	class WithActions extends Component {
		static propTypes = {
			modalStore: PropTypes.object.isRequired,
		};

		static contextTypes = {
			store: PropTypes.object.isRequired,
			tableRowKey: PropTypes.string,
		};

		componentWillMount() {
			const { tableRowKey } = this.context;
			if (tableRowKey) {
				this._selectedKeys = [tableRowKey];
			}
		}

		getSelectedKeys() {
			const { tableRowKey, store } = this.context;
			return tableRowKey ? [tableRowKey] : store.selectedKeys;
		}

		getSelectedKeysString = () => {
			return joinKeys(this.getSelectedKeys());
		};

		open = (name, options) => {
			this.props.modalStore.setState({
				keys: joinKeys(this.getSelectedKeys()),
				...options,
				name,
			});
		};

		openCreaterModal = (options = {}) => {
			options.keys = options.keys || '';
			this.open(Actions.CREATE, options);
		};

		openUpdaterModal = (options = {}) => {
			const { select, ...config } = options;
			if (select && select.length) {
				config.select = select.join(',');
			}
			this.open(Actions.UPDATE, config);
		};

		openRefModal = (options = {}) => {
			const {
				table,
				title,
				noQuery,
				fetch = 'fetch',
				save = 'request',
				width = 880,
			} = options;
			const config = { table, title, fetch, save, width };
			if (noQuery) config.noQuery = '✓';
			this.open(Actions.REF, config);
		};

		_getData = () => {
			const selectedKeys = this.getSelectedKeys();
			return this.context.store.getData(selectedKeys[0]);
		};

		render() {
			const { props: { modalStore, ...props }, context: { store } } = this;
			return (
				<WrappedComponent
					{...extractRef(props)}
					actions={{
						store,
						open: this.open,
						openCreaterModal: this.openCreaterModal,
						openUpdaterModal: this.openUpdaterModal,
						openRefModal: this.openRefModal,
						selectedKeys: this._selectedKeys || this.context.store.selectedKeys,
						getSelectedKeysString: this.getSelectedKeysString,
						getData: this._getData,
					}}
				/>
			);
		}
	}

	return WithActions;
}
