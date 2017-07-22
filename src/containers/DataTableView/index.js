
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import panelsStore from 'stores/panelsStore';
import routerStore from 'stores/routerStore';
import { omit, isEqual } from 'lodash';
import { parse } from 'utils/qs';

import TableBody from 'components/TableBody';
import TableQuery from 'components/TableQuery';
import ActionModal from 'components/ActionModal';
import Toolbar from 'components/Toolbar';

@observer
export default class DataTableView extends Component {
	static propTypes = {
		location: PropTypes.shape({
			query: PropTypes.object,
			pathname: PropTypes.string,
			search: PropTypes.string,
		}),
		table: PropTypes.string.isRequired,
		title: PropTypes.node,
		pageTitle: PropTypes.node,
		header: PropTypes.func,
		footer: PropTypes.func,
	};

	static childContextTypes = {
		store: PropTypes.object,
	};

	static contextTypes = {
		appConfig: PropTypes.object,
		DataStore: PropTypes.func.isRequired,
	};

	getChildContext() {
		return {
			store: this.state.store,
		};
	}

	componentWillMount() {
		const { table } = this.props;
		const { DataStore } = this.context;
		this.state = {
			...this._getDataNodes(table),
			store: DataStore.get(table),
		};
	}

	componentWillReceiveProps({ table }) {
		const { DataStore } = this.context;
		if (this.props.table !== table) {
			this.setState({
				...this._getDataNodes(table),
				store: DataStore.get(table),
			});
		}
	}

	componentDidMount() {
		this._fetch();
	}

	componentDidUpdate({ location: prevLocation }) {
		const { pathname, search } = this.props.location;

		if (location === prevLocation) { return; }

		if (prevLocation.pathname !== pathname) {
			this._fetch();
		}
		else if (prevLocation.search !== search) {
			const blackList = ActionModal.omitPaths;
			const prevQuery = omit(parse(prevLocation.search), blackList);
			const nextQuery = omit(routerStore.location.query, blackList);
			if (!isEqual(prevQuery, nextQuery)) {
				this._fetch();
			}
		}
	}

	_fetch() {
		const { query, search } = routerStore.location;
		this.state.store.fetch(query, search);
	}

	_getDataNodes(table) {
		const { appConfig } = this.context;
		const { data } = appConfig.tables[table];

		return {
			form: data
				.filter(({ props }) => !props.shouldHideInForm)
				.map((child, index) => {
					const {
						props: { formComponent: Comp, ...other },
						key,
					} = child;
					return Comp ? (
						<Comp {...other} key={key || index} />
					) : child
					;
				}),
			query: data
				.filter(({ props }) => props.shouldShowInQuery)
				.map((child, index) => {
					const {
						props: { queryComponent: Comp, ...other },
						key,
					} = child;
					return Comp ? (
						<Comp {...other} key={key || index} />
					) : child
					;
				}),
		};
	}

	render() {
		const {
			props: {
				table,
				title,
				pageTitle,
				header: Header,
				footer: Footer,
			},
			state: {
				store,
				form,
				query,
			},
		} = this;

		const hasQueryFields = !!query.length;

		return (
			<div>
				<h1>{pageTitle || title || table}</h1>

				{Header && <Header store={store} />}

				{hasQueryFields && panelsStore.isShowQuery &&
					<TableQuery>{query}</TableQuery>
				}

				<Toolbar hasQueryFields={hasQueryFields} />

				<TableBody store={store} />

				{Footer && <Footer store={store} />}

				<ActionModal store={store}>
					{form}
				</ActionModal>
			</div>
		);
	}
}
