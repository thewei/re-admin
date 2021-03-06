import styles from './styles';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import localize from 'hocs/localize';
import Pagination from 'components/Pagination';

@localize('TableBody')
@observer
export default class TableFooter extends Component {
	static propTypes = {
		localeStore: PropTypes.object.isRequired,
		store: PropTypes.shape({
			total: PropTypes.number,
			size: PropTypes.number.isRequired,
			query: PropTypes.object.isRequired,
		}),
	};

	_handlePageChange = (parameter) => {
		const { store } = this.props;
		const { useCursor } = store;
		const query = { ...store.query };
		if (useCursor) {
			query.cursor = parameter;
			store.setQueryWithCursor(query);
		} else {
			query.page = parameter;
			store.setQuery(query);
		}
	};

	render() {
		const { props: { store, localeStore } } = this;
		const { total, size, query } = store;
		const current = +query.page || 1;
		return (
			<div style={styles.footer}>
				{(total || total === 0) && (
					<p style={styles.total}>
						{localeStore.data.total}: {total}
					</p>
				)}
				<Pagination
					style={styles.pagination}
					current={current}
					total={total}
					pageSize={size}
					store={store}
					onChange={this._handlePageChange}
				/>
			</div>
		);
	}
}
