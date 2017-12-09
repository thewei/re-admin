
import 'antd/dist/antd.less';
import './reset.scss';
import React, { Component } from 'react';
import {
	Admin, Title, API, Auth, Upload, Navigator, Menu, Modal,
	Toolbar, CreateButton, ContextButton,
} from '../src';
import testTable from './tables/test';
import helloTable from './tables/hello';

export default class App extends Component {
	render() {
		return (
			<Admin>
				<Title>上帝的看板</Title>

				<Navigator>
					<Menu icon="bulb" title="菜单一" path="/" exact />
					<Menu
						icon="bulb"
						title="菜单二"
						table="test"
						path="/test"
						pageTitle="测试数据表"
					/>
					<Menu icon="bulb" title="菜单三">
						<Menu icon="bulb" title="2.1" path="/fork" exact />
						<Menu icon="bulb" title="2.2">
							<Menu icon="bulb" title="3.1">
								<Menu
									icon="bulb"
									title="4.1"
									table="hello"
									path="/hello"
									toolbar={() => (
										<Toolbar
											left={<CreateButton />}
											right={
												<ContextButton
													onClick={(ev, { request }) => {
														ev.preventDefault();
														request({
															name: 'custom',
															title: 'My Custom Modal',
														});
													}}
													label="自定义弹框"
												/>
											}
										/>
									)}
								/>
							</Menu>
						</Menu>
					</Menu>
				</Navigator>

				<API
					baseURL="/api"
					count={5}
					accessTokenName="accessToken"
					accessTokenLocation="query"
					sortKey="s"
					orderKey="o"
					descValue="-1"
					ascValue="1"
				/>

				<Auth basePath="auth" loginPath="login" getUserPath="getUser" />

				<Upload
					imagePath="/api/upload/image"
					filePath="/api/upload/file"
				/>

				<Modal name="custom" component={() => (<span>custom modal</span>)} />

				{testTable}
				{helloTable}

			</Admin>
		);
	}
}
