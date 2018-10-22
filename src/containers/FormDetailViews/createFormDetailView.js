import styles from './styles';
import React, { Component } from 'react';
import { createRef } from 'utils/reactPolyfill';
import PropTypes from 'utils/PropTypes';
import { observer } from 'mobx-react';
import warning from 'warning';
import withTable from 'hocs/withTable';
import withIssuer from 'hocs/withIssuer';
import withStore from 'hocs/withStore';
import { Submit } from 'components/Form';
import FormBody from 'components/FormBody';
import joinKeys from 'utils/joinKeys';
import { CREATER } from 'utils/Issuers';
import { message } from 'antd';
import ModalProvider from 'components/ModalProvider';

export default function createFormDetailView(title, issuer, displayName) {
	@withIssuer({ issuer })
	@withTable({ syncLocation: true, type: 'detail' })
	@withStore({ prop: 'contextStore' })
	@observer
	class FormDetailView extends Component {
		static displayName = displayName;

		static propTypes = {
			contextStore: PropTypes.object.isRequired,
			computedMatch: PropTypes.object.isRequired,
			store: PropTypes.object,
			save: PropTypes.string,
			title: PropTypes.node,
			header: PropTypes.func,
			footer: PropTypes.func,
		};

		static defaultProps = {
			title,
		};

		state = {
			isValid: true,
			isSubmitting: false,
			isPristine: true,
		};

		formRef = createRef();

		constructor(props) {
			super(props);

			const { store: currentStore, contextStore } = props;
			const store = currentStore || contextStore;
			const selectedKeys = (props.computedMatch.params.key || '').split(',');
			this._isCreater = issuer === CREATER;
			if (this._isCreater) this._createrValue = {};
			else store.setSelectedKeys(selectedKeys);
		}

		_handleChange = () => {
			if (this.state.isPristine) {
				this.setState({ isPristine: false });
			}
		};

		_handleValidChange = (isValid) => {
			this.isValid = isValid;
			this.setState({ isValid });
		};

		_handleSubmit = async (body) => {
			this.setState({ isSubmitting: true });
			const { props } = this;
			const store = props.store || props.contextStore;
			const { computedMatch, save } = props;
			const selectedKeys = (computedMatch.params.key || '').split(',');
			const url = joinKeys(selectedKeys);
			const method = save || (issuer === CREATER ? 'create' : 'update');
			try {
				await store.call(method, {
					...props,
					url,
					body,
					refresh: false,
					throwError: true,
				});
				this.setState({ isSubmitting: false, isPristine: true });

				// TODO: should add locale support
				message.info('Success!');
			} catch (err) {
				this.setState({ isSubmitting: false });
				message.error('Failed!');
				warning(false, err.message);
			}
		};

		render() {
			const {
				props: {
					store: currentStore,
					contextStore,
					header: Header,
					footer: Footer,
				},
				state: { isValid, isSubmitting, isPristine },
				_isCreater,
			} = this;
			const store = currentStore || contextStore;
			return (
				<ModalProvider>
					<div style={styles.container}>
						{Header ? <Header title={title} store={store} /> : <h1>{title}</h1>}

						<FormBody
							ref={this.formRef}
							value={_isCreater ? this._createrValue : store.getData()}
							store={store}
							onSubmit={this._handleSubmit}
							onChange={this._handleChange}
							onValidChange={this._handleValidChange}
							layout="vertical"
							footer={
								<Submit
									disabled={isPristine || !isValid || isSubmitting}
									type="primary"
									size="large"
									loading={isSubmitting}
								>
									Save
								</Submit>
							}
						/>
						{Footer && <Footer store={store} />}
					</div>
				</ModalProvider>
			);
		}
	}

	return FormDetailView;
}
