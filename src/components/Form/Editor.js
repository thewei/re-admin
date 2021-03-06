import React, { Component } from 'react';
import PropTypes from 'utils/PropTypes';
import getDefaultEditorFormats from 'utils/getDefaultEditorFormats';
import createComponent from './createComponent';
import EditorContext from 'contexts/Editor';
import Quill from 'react-quill';
import EditorToolbar from 'components/EditorToolbar';

const formats = getDefaultEditorFormats();

class QuillEditorEnhancer extends Component {
	static propTypes = {
		containerStyle: PropTypes.object,
		containerClassName: PropTypes.string,
		toolbar: PropTypes.node,
		modules: PropTypes.object,
		formats: PropTypes.array,
		innerRef: PropTypes.func,
	};

	static defaultProps = {
		modules: {},
		toolbar: <EditorToolbar />,
		formats,
	};

	constructor(props) {
		super(props);

		const { modules } = props;
		modules.toolbar = {
			container: '.editor-toolbar',
			...modules.toolbar,
		};
		this.modules = modules;
	}

	state = {
		editor: {},
	};

	saveRef = (ref) => {
		const { innerRef } = this.props;
		this.reactQuillRef = ref;
		if (this.state.editor !== ref) this.setState({ editor: ref });
		if (innerRef) innerRef(ref);
	};

	render() {
		const {
			props: {
				containerClassName,
				containerStyle,
				toolbar,
				innerRef,
				formats,
				...other
			},
			state: { editor },
			modules,
		} = this;
		return (
			<EditorContext.Provider value={editor}>
				<div className={containerClassName} style={containerStyle}>
					{toolbar}
					<Quill
						{...other}
						modules={modules}
						formats={formats}
						ref={this.saveRef}
					/>
				</div>
			</EditorContext.Provider>
		);
	}
}

export default createComponent(QuillEditorEnhancer, {
	displayName: 'Editor',
	getValueFromChangeEvent(value) {
		return value;
	},
});
