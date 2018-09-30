import React, { Children } from 'react';
import PropTypes from 'utils/PropTypes';
import { pick, flatMap } from 'lodash';
import FrameView from 'containers/FrameView';
import IndexView from 'containers/IndexView';
import LoginView from 'containers/LoginView';
import DataTableView from 'containers/DataTableView';
import NotFoundView from 'containers/NotFoundView';
import Route from 'components/EnhancedRoute';
import {
	CreaterFormDetailView,
	UpdaterFormDetailView,
} from 'containers/FormDetailViews';

export default function NavigatorSchema() {
	return <noscript />;
}

NavigatorSchema.propTypes = {
	basename: PropTypes.string,
	noBreadcrumb: PropTypes.bool,
	noHomeBreadcrumb: PropTypes.bool,
	noUserMenu: PropTypes.bool,
	index: PropTypes.component,
	login: PropTypes.component,
	frame: PropTypes.component,
	dataTable: PropTypes.component,
	dataUpdater: PropTypes.component,
	dataCreater: PropTypes.component,
	notFound: PropTypes.component,
};

NavigatorSchema.defaultProps = {
	basename: '/',
	noBreadcrumb: false,
	noHomeBreadcrumb: false,
	noUserMenu: false,
	index: IndexView,
	login: LoginView,
	frame: FrameView,
	dataTable: DataTableView,
	dataUpdater: UpdaterFormDetailView,
	dataCreater: CreaterFormDetailView,
	notFound: NotFoundView,
};

NavigatorSchema.configuration = {
	name: 'navigator',
	propType: PropTypes.object,
	pipe({ children, ...other }) {
		Object.assign(this, other);

		const {
			dataTable,
			dataUpdater,
			dataCreater,
			index: welcome,
			notFound,
			noBreadcrumb,
		} = this;
		const breadcrumbNameMap = {};

		const sidebarChildren = [];
		const topChildren = [];

		Children.toArray(children).forEach((child) => {
			if (child.props.top) {
				topChildren.push(child);
			} else {
				sidebarChildren.push(child);
			}
		});

		const getMenu = function getMenu(children) {
			const next = function next(child, keyPaths = [], rootPath = '/') {
				const { children, ...props } = child.props;
				let nextRootPath = rootPath;

				props.isInternalPath = !/^https?:\/\//i.test(props.path);

				if (props.path) {
					if (props.isInternalPath) {
						props.path = (rootPath + props.path).replace(/\/\//, '/');
						nextRootPath = props.path;

						const { title: menuTitle, pageTitle } = props;
						const title = pageTitle || menuTitle;
						if (
							!noBreadcrumb &&
							title &&
							(props.table || props.component || props.render)
						) {
							breadcrumbNameMap[props.path] = {
								title,
								routeProps: pick(props, ['path', 'exact', 'strict']),
							};
						}
					}

					props.menuKey = props.path;
				} else {
					props.menuKey = `@${keyPaths.join('-')}`;
				}

				if (children) {
					props.children = Children.map(children, (child, index) =>
						next(child, keyPaths.concat(index), nextRootPath)
					);
				}

				return props;
			};

			return next({ props: { children } }).children;
		};

		const getRoutes = function getRoutes(menus) {
			if (!menus || !menus.length) return [];

			return flatMap(menus, ({ children, ...route }, index) => {
				const props = { key: index, ...route };
				if (children) {
					return getRoutes(children);
				} else {
					const routes = [];
					const { table, path } = props;

					if (!props.component && !props.render) {
						props.component = table ? dataTable : notFound;
					}

					if (table) {
						routes.push(
							<Route
								{...props}
								path={`${path}/update/:key`}
								component={dataUpdater}
							/>,
							<Route
								{...props}
								path={`${path}/create/`}
								component={dataCreater}
							/>
						);
					}

					routes.push(<Route {...props} exact />);
					return routes;
				}
			});
		};

		const getSlashesLength = function getSlashesLength(path) {
			return (path.match(/\//g) || []).length;
		};

		const sidebarMenu = getMenu(sidebarChildren);
		const topMenu = getMenu(topChildren);
		const userRoutes = [...getRoutes(sidebarMenu), ...getRoutes(topMenu)];
		const routes = [
			<Route key="_index" exact path="/" component={welcome} />,
			...userRoutes,
			<Route key="_notFound" component={notFound} />,
		];

		this.menus = sidebarMenu;
		this.topMenu = topMenu;
		this.routes = routes;
		this.breadcrumbNameMap = Object.keys(breadcrumbNameMap)
			.sort((a, b) => getSlashesLength(a) - getSlashesLength(b))
			.reduce((acc, key) => {
				acc[key] = breadcrumbNameMap[key];
				return acc;
			}, {});
		return this;
	},
};
