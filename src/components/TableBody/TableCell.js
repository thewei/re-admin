import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class TableCell extends Component {
	static propTypes = {
		children: PropTypes.node,
		renderCell: PropTypes.func,
		extraProps: PropTypes.object,
	};

	render() {
		const { renderCell, extraProps, children, ...other } = this.props;
		if (!renderCell) return <td {...other}>{children}</td>;
		return renderCell(
			extraProps,
			(render) => (render ? <td {...other}>{render()}</td> : null)
		);
	}
}
