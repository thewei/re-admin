import styles from './styles';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import routerStore from 'stores/routerStore';
import { Modal, Icon, Menu, Dropdown, Avatar } from 'antd';
import localize from 'hocs/localize';

const { confirm } = Modal;
const { Item } = Menu;

@localize('UserMenu')
export default class UserMenu extends Component {
	static propTypes = {
		localeStore: PropTypes.object.isRequired,
		style: PropTypes.object,
	};

	static contextTypes = {
		authStore: PropTypes.object,
	};

	_handleClick = (ev) => {
		ev.preventDefault();
		const { confirmSignOut, signOut } = this.props.localeStore.data;
		confirm({
			title: confirmSignOut,
			onOk: () => {
				this.context.authStore.logout();
				routerStore.history.replace('/login');
			},
			okText: signOut,
		});
	};

	render() {
		const { style, localeStore } = this.props;
		return (
			<Dropdown
				overlay={
					<Menu>
						<Item>
							<a rel="noopener noreferrer" onClick={this._handleClick} href="#">
								<Icon type="logout" /> {localeStore.data.signOut}
							</a>
						</Item>
					</Menu>
				}
				trigger={['click']}
			>
				<div style={styles.container(style)}>
					<Avatar icon="user" size="small" />
					<span style={styles.text}>Admin</span>
					<Icon type="down" />
				</div>
			</Dropdown>
		);
	}
}
