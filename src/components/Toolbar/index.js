
import $$ from './style.scss';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button } from 'antd';
import ButtonRemove from 'components/ButtonRemove';
import ButtonUpdate from 'components/ButtonUpdate';
import ButtonCreate from 'components/ButtonCreate';

const { Group } = Button;

export default class Toolbar extends Component {
	render() {
		return (
			<div className={$$.container}>
				<Row justify="space-around">
					<Col span={12}>
						<Group>
							<ButtonCreate />
							<ButtonUpdate />
							<ButtonRemove />
						</Group>
					</Col>
					<Col span={12}>
						<Group>
							<Button>高级搜索</Button>
						</Group>
					</Col>
				</Row>
			</div>
		);
	}
}
