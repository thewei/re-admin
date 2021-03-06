
import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import ContextButton from 'components/ContextButton';
import { Modal } from 'antd';
import { isFunction } from 'utils/fp';

export default class ConfirmButton extends Component {
	static propTypes = {
		title: PropTypes.stringOrFunc.isRequired,
		content: PropTypes.stringOrFunc,
		onOk: PropTypes.func,
		okText: PropTypes.string,
		method: PropTypes.string,
	};

	static defaultProps = {
		okText: 'OK',
	};

	_handleClick = (ev, actions) => {
		const { title, content, onOk, okText, method } = this.props;
		ev.preventDefault();
		Modal.confirm({
			title: isFunction(title) ? title(actions.getData()) : title,
			content: isFunction(content) ? content(actions.getData()) : content,
			okText,
			onOk: () => {
				if (onOk) { onOk(actions); }
				if (method) {
					actions.store.call(method, {
						method: 'POST',
						keys: actions.selectedKeys,
					});
				}
			}
		});
	};

	render() {
		const {
			title, content, onOk, okText, method,
			...other
		} = this.props;
		return (
			<ContextButton
				{...other}
				onClick={this._handleClick}
			/>
		);
	}
}
