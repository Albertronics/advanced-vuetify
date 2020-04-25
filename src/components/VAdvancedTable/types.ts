import {DataTableHeader} from "vuetify";

export interface Column extends DataTableHeader
{
	dataType: 'number' | 'text' | 'date' | 'array',
	index: number,
	hidden?: boolean,
	options?: Array<any>
	multiple?: boolean,
	dateFormat?: 'DD/MM/YYYY' | 'DD-MM-YYYY' | 'YYYY-MM-DD' | 'YYYY/MM/DD',
	optionValue?: string,
	optionText?: string,
	caseSensitiveSelector?: boolean,
	caseSensitive?: boolean,
	groupBy?: boolean,
	objectValue?: string
}

export interface SelectionFilter
{
	id: number;
	name: string;
}
