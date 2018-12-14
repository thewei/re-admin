import React from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'components/Form';
import field from 'hocs/field';
import moment from 'moment';
import { isString, isObject, isFunction } from 'utils/fp';
import renderDate from 'utils/renderDate';

const buildInDefaultProps = {
	inputFilter(val) {
		if (!val) {
		} else if (isObject(val)) {
			return val;
		} else if (isString(val)) {
			return moment(val);
		}
	},
	outputFilter(val) {
		if (!val) {
		} else if (isFunction(val.toISOString)) {
			return val.toISOString();
		} else if (isString(val)) {
			return val;
		}
	},
};

function DatePickerField(props) {
	return (
		<DatePicker defaultValue={undefined} {...props} {...buildInDefaultProps} />
	);
}

/* eslint-disable react/prop-types */
DatePickerField.renderTable = function renderTable(
	{ format, dateFormat },
	{ value }
) {
	return <span>{renderDate(value, format, dateFormat)}</span>;
};

DatePickerField.propTypes = {
	format: PropTypes.string,
	dateFormat: PropTypes.string,
};

DatePickerField.defaultProp = {
	format: 'date',
};

export default field(DatePickerField);
