import moment from 'moment'

export function prettyDate (dateString) {
	return moment(dateString, 'YYYY-M-D HH:mm').fromNow()
}

export function wordCount (string) {
	return string.split(' ').length
}