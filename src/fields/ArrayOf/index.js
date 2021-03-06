import styles from './styles';
import React, { Component, Children, cloneElement } from 'react';
import PropTypes from 'utils/PropTypes';
import field from 'hocs/field';
import { Form, Button, Icon } from 'antd';
import { ArrayOf as FormArrayOf } from 'react-form-mobx';
import localize from 'hocs/localize';

const { Item } = Form;

@field
@localize('ArrayOf')
export default class ArrayOf extends Component {
	static propTypes = {
		name: PropTypes.string,
		children: PropTypes.node,
		wrapperStyle: PropTypes.object,
		addButtonLabel: PropTypes.node,
		localeStore: PropTypes.object.isRequired,
	};

	static renderTable(props, { text = [] }) {
		return text.join(',');
	}

	_createRemoveHandler = (remove, name) => (ev) => {
		ev.preventDefault();
		remove(name);
	};

	render() {
		const {
			children,
			name,
			addButtonLabel,
			wrapperStyle,
			localeStore,
			...other
		} = this.props;

		const child = Children.only(children);

		return (
			<FormArrayOf name={name}>
				{(names, { push, remove }) => (
					<Item {...other} style={wrapperStyle}>
						{names.map((name) => (
							<div style={styles.item} key={name}>
								{cloneElement(child, { name })}
								<a href="#" onClick={this._createRemoveHandler(remove, name)}>
									<Icon style={styles.icon} type="minus-circle-o" />
								</a>
							</div>
						))}
						<Button type="dashed" onClick={push} style={styles.button}>
							<Icon type="plus" />{' '}
							{localeStore.localizeProp(addButtonLabel, 'addButtonLabel')}
						</Button>
					</Item>
				)}
			</FormArrayOf>
		);
	}
}
