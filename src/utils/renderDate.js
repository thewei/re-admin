import moment from 'moment';

const DefaultDateFormat = 'YYYY-MM-DD';
const DefaultTimeFormat = 'hh:mm:ss';
const DefaultDateTimeFormat = 'YYYY-MM-DD hh:mm:ss';

export default function renderDate(date, formFormat, displayFormat) {
	let format;
	if (displayFormat) format = displayFormat;
	else if (formFormat === 'time') format = DefaultTimeFormat;
	else if (formFormat === 'dateTime') format = DefaultDateTimeFormat;
	else format = DefaultDateFormat;
	return moment(new Date(date)).format(format);
}
