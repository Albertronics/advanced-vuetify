<template>
	<v-row dense>
		<v-col align-self="center">
			<v-select :label="translate('columns')" v-model="headers" :items="allHeaders" :outlined="outlined" :dense="dense" hide-details :color="color" return-object multiple small-chips />
		</v-col>

		<v-col cols="auto" align-self="center">
			<v-menu offset-y v-if="groupByOptions.length > 0">
				<template v-slot:activator="{ on }">
					<v-btn text :color="color" v-on="on">{{ translate('groupBy') }}</v-btn>
				</template>

				<v-list>
					<v-list-item v-for="item in groupByOptions" :key="item.value"	@click="selectedGroupBy = item.value">
						<v-list-item-title>{{ item.text }}</v-list-item-title>
					</v-list-item>
				</v-list>
			</v-menu>
		</v-col>

		<v-col cols="auto" align-self="center">
			<v-btn text :color="color" @click="filterActive = !filterActive">{{ translate('filter') }}</v-btn>
		</v-col>

		<v-col cols="12" class="mt-4">
			<v-data-table
				:show-expand="expand"	:groupBy="selectedGroupBy" :loading="loading"	@click:row="$emit('rowClicked', $event)"
				:color="color" :headers="headers" :items="filterList"	:item-key="tableKey"
				fixed-header class="elevation-0" :show-select="showSelect" v-model="selected"	multi-sort>

				<template v-slot:item.data-table-select="{ isSelected, select }">
					<v-simple-checkbox :color="color"	:value="isSelected"	@input="select($event)"></v-simple-checkbox>
				</template>

				<template v-slot:header.data-table-select="{ on, props }">
					<v-simple-checkbox :color="color" v-bind="props" v-on="on"></v-simple-checkbox>
				</template>

				<template v-slot:group.summary="item">
					<slot name="expanded-item" :item="item"></slot>
				</template>

				<template v-slot:group.header="{ toggle, group, items, isOpen, headers }">
					<td :colspan="columns.length + 1" class="text-start">
						<v-btn icon @click="toggle">
							<v-icon>{{ isOpen ? 'mdi-minus' : 'mdi-plus' }}</v-icon>
						</v-btn>

						<b>{{ columnGroupedBy.text }}: {{ getGroupByValue(group) }} ({{ items.length }})</b>

						<v-btn icon @click="selectedGroupBy = null">
							<v-icon>mdi-close</v-icon>
						</v-btn>
					</td>
				</template>

				<template v-if="expand" v-slot:expanded-item="{ item }">
					<slot name="expanded-item" :item="item"></slot>
				</template>

				<template	v-for="slot in slots" :slot="`item.${slot}`" slot-scope="item">
					<slot :name="slot" :item="item.item"></slot>
				</template>

				<template v-slot:body.prepend v-if="filterActive">
					<tr>
						<td	v-for="(item, index) in availableColumnFilters" :key="index">
							<v-select
								v-if="item.selectionControls"
								v-model="selectionFilter"
								:color="color"
								:items="selectionFilters"
							 	item-text="name" item-value="id" />

							<v-text-field	v-if="item.dataType === 'text' && !item.options" v-model="filters[item.index]" :color="color">
								<template v-slot:prepend-inner v-if="item.caseSensitiveSelector">
									<v-icon
										@click="item.caseSensitive = !item.caseSensitive; $forceUpdate(); filters.splice()"
										:color="item.caseSensitive ? 'primary' : 'grey'">
										mdi-format-letter-case
									</v-icon>
								</template>
							</v-text-field>

							<v-autocomplete
								v-if="item.dataType === 'text' && item.options"
								v-model="filters[item.index]"
								clearable :color="color"
								:small-chips="item.multiple"
								:items="item.options"
								:multiple="item.multiple"
								:item-value="item.optionValue || null"
								:item-text="item.optionText || item.optionValue" />

							<v-autocomplete
								v-if="item.dataType === 'boolean'"
								v-model="filters[item.index]"
								:items="booleanOptions"
								clearable :color="color"
								item-value="id" item-text="text" />

							<v-date-range
								v-if="item.dataType === 'date'"
								v-model="filters[item.index]"
								:color="color"
								:format="item.dateFormat"
								label="" />

							<number-filter
								v-if="item.dataType === 'number'"
								:color="color"
								v-model="filters[item.index]" />

							<v-text-field
								v-if="item.dataType === 'array' && !item.options"
								:color="color"
								v-model="filters[item.index]" />

							<v-autocomplete
								v-if="item.dataType === 'array' && item.options"
								v-model="filters[item.index]"
								clearable :color="color"
								:items="item.options"
								:multiple="item.multiple"
								:small-chips="item.multiple"
								:item-value="item.optionValue || null"
								:item-text="item.optionText || item.optionValue" />
						</td>
					</tr>
				</template>
			</v-data-table>
		</v-col>
	</v-row>
</template>

<script>
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';
import NumberFilter from './NumberFilter';
import VDateRange from '../VDateRange/VDateRange';
import * as languages from '../../lang';
import zipcelx from 'zipcelx';

dayjs.extend(customParseFormat);
dayjs.extend(isBetween);

function isNumber(number)
{
	if(number !== null)
		return true;

	return !isNaN(Number(number));
}

export default
{
	name: 'v-advanced-table',

	components: {
		VDateRange,
		NumberFilter,
	},

	props:
	{
		color: { type: String, default: 'primary' },
		columns: { type: Array, required: true },
		value: { type: Array, required: true },
		tableKey: {	type: String,	default: 'id' },
		slots: { type: Array,	default: () => [] },
		defaultGroupBy: { type: String, default: null },
		expand: {	type: Boolean, default: false },
		outlined: {	type: Boolean, default: false },
		dense: { type: Boolean, default: false },
		loading: { type: Boolean, default: false },
		showSelect: {	type: Boolean, default: true }
	},

	data()
	{
		return {
			filterActive: false,

			data: this.value,

			selected: [],	headers: [], allHeaders: [], filters: [], groupByOptions: [],
			selectedGroupBy: this.defaultGroupBy,

			selectionFilter: 0
		}
	},

	watch:
	{
		value(val) {
			this.data = val
		},

		data(val) {
			this.$emit('input', val)
		},

		selected(val) {
			this.$emit('selected', val)
		},

		filterActive(val)
		{
			if(!val)
			{
				this.filters = [];

				for (let i = 0; i < this.columns.length; i++)
				{
					const column = this.columns[i];

					if(column.dataType === 'date')
						this.filters.push([]);
					else if(column.dataType === 'number')
						this.filters.push({});
					else
						this.filters.push('');
				}

				this.selectionFilter = this.selectionFilters[0]
			}
		},
	},

	created()
	{
		const length = this.columns.length;

		for (let i = 0; i < length; i++)
		{
			const column = this.columns[i];

			if(column.groupBy)
				this.groupByOptions.push({ value: column.value, text: column.text });

			column.index = i;

			if(column.dataType === 'text')
				column.caseSensitive = true;

			switch (column.dataType)
			{
				case 'text': column.filter = (value, search, item) => this.filterText(value, i, column, item); break;
				case 'boolean': column.filter = (value, search, item) => this.filterBoolean(value, i, column, item); break;
				case 'date': column.filter = (value, search, item) => this.filterDate(value, i, column, item); break;
				case 'number': column.filter = (value, search, item) => this.filterNumber(value, i, column, item); break;
				case 'array': column.filter = (value, search, item) => this.filterArray(value, i, column, item); break;
			}

			if(column.dataType === 'date')
				this.filters.push([]);
			else if(column.dataType === 'number')
				this.filters.push({});
			else
				this.filters.push('');

			if(!column.hidden)
				this.headers.push(column);

			this.allHeaders.push(column)
		}
	},

	computed:
	{
		availableColumnFilters()
		{
			if(this.showSelect)
				return [{ selectionControls: true }].concat(this.headers.filter(el => this.selectedGroupBy !== el.value))

			return this.headers.filter(el => this.selectedGroupBy !== el.value)
		},

		selectionFilters()
		{
			return [
				{ id: 0, name: this.translate('all') },
				{ id: 1, name: this.translate('selected') },
				{ id: 2, name: this.translate('notSelected') }
			]
		},

		booleanOptions()
		{
			return [
				{ id: 'yes', text: this.translate('yes') },
				{ id: 'no', text: this.translate('no' ) }
			]
		},

		filterList()
		{
			switch (this.selectionFilter)
			{
				case 0:	return this.data;
				case 1:	return this.selected;
				case 2:	return this.data.filter(data => this.selected.indexOf(data) === -1);

				default: return this.data;
			}
		},

		columnGroupedBy() {
			return this.columns.filter(el => el.value === this.selectedGroupBy)[0]
		}
	},

	methods:
	{
		// credit: Vuetify's code
		getNestedValue (obj, path, fallback)
		{
			const last = path.length - 1

			if (last < 0) return obj === undefined ? fallback : obj

			for (let i = 0; i < last; i++) {
				if (obj == null) {
					return fallback
				}
				obj = obj[path[i]]
			}

			if (obj == null) return fallback

			return obj[path[last]] === undefined ? fallback : obj[path[last]]
		},

		// credit: Vuetify's code
		getObjectValueByPath (obj, path, fallback)
		{
			if (obj == null || !path || typeof path !== 'string') return fallback
			if (obj[path] !== undefined) return obj[path]
			path = path.replace(/\[(\w+)\]/g, '.$1') // convert indexes to properties
			path = path.replace(/^\./, '') // strip a leading dot

			return this.getNestedValue(obj, path.split('.'), fallback)
		},

		exportToExcel(fileName = 'export')
		{
			if(this.selected.length === 0 || this.headers.length === 0)
				return;

			const excelSheet = [
				this.headers.map(el => ({ value: el.text, type: 'string' }))
			];

			for (let i = 0; i < this.selected.length; i++)
			{
				const tableRow = this.selected[i];
				const excelRow = [];

				for (const column of this.headers)
				{
					if(!column.dataType)
						continue;

					const excelColumn = { type: 'string' };
					const value = this.getObjectValueByPath(tableRow, column.value);

					if (column.dataType === 'array') {
						excelColumn.value = (column.objectValue) ? value.map(el => el[column.objectValue]).join(', ') : value.join(', ');
					}
					else if (column.dataType === 'boolean') {
						excelColumn.value = this.translate(String(value))
					}
					else {
						excelColumn.value = value
					}

					excelRow.push(excelColumn);
				}

				excelSheet.push(excelRow)
			}

			const config = {
				filename: fileName,
				sheet: {
					data: excelSheet
				}
			};

			zipcelx(config);
		},

		updateSelectedRows(data)
		{
			for (let i = 0; i < this.selected.length; i++)
			{
				const rowIndex = this.data.findIndex(el => el[this.tableKey] === this.selected[i][this.tableKey])

				for(const [key, value] of Object.entries(data))
					this.data[rowIndex][key] = value;
			}

			this.data.splice();
			this.selected = [];
		},

		removeSelectedRows()
		{
			this.data = this.data.filter(el => this.selected.findIndex(val => val[this.tableKey] === el[this.tableKey]) === -1)
			this.selected = [];
		},

		translate(key) {
			return languages[this.$vuetify.lang.current][key]
		},

		getGroupByValue(group)
		{
			if(this.columnGroupedBy.dataType === 'boolean')
				return this.translate(group ? 'true' : 'false')

			return group
		},

		filterText(elementValue, filterIndex, column, item)
		{
			const elementToFilterAgainst = (typeof column.computedValue === 'function') ? column.computedValue(item) : elementValue
			const filterValue = this.filters[filterIndex];

			if (!filterValue)
				return true;

			if (column.multiple)
			{
				if (filterValue.length === 0)
					return true;

				return filterValue.filter(el => el === elementToFilterAgainst).length > 0;
			}

			if (!column.caseSensitive)
				return elementToFilterAgainst.toLowerCase().includes(filterValue.toLowerCase());

			return elementToFilterAgainst.includes(filterValue);
		},

		filterBoolean(elementValue, filterIndex, column, item)
		{
			const elementToFilterAgainst = (typeof column.computedValue === 'function') ? column.computedValue(item) : elementValue
			const filterValue = this.filters[filterIndex];

			if(!filterValue)
				return true;

			return elementToFilterAgainst === (filterValue === 'yes');
		},

		filterDate(elementValue, filterIndex, column, item)
		{
			const elementToFilterAgainst = (typeof column.computedValue === 'function') ? column.computedValue(item) : elementValue
			const filterValue = this.filters[filterIndex];

			if (!filterValue) return true;
			if (!filterValue[1]) return true;

			const start = filterValue[0];
			const end = filterValue[1];
			const target = dayjs(elementToFilterAgainst, column.dateFormat || 'YYYY-MM-DD');

			return target.isBetween(start, end, null, '[]');
		},

		filterNumber(elementValue, filterIndex, column, item)
		{
			const elementToFilterAgainst = (typeof column.computedValue === 'function') ? column.computedValue(item) : elementValue

			const { operator, minimum, maximum } = this.filters[filterIndex];

			if(!operator || !minimum || (operator === '<>' && !maximum))
				return true;

			const value = Number(elementToFilterAgainst);
			const min = Number(minimum);
			const max = Number(maximum);

			if(!isNumber(value) || !isNumber(min) || (operator === '<>' && !isNumber(max)))
				return true;

			switch (operator)
			{
				case '<>': return (value >= min) && (value <= max);
				case '<': return min > value;
				case '<=': return min >= value;
				case '>': return min < value;
				case '>=': return min <= value;
				case '=': return min === value;
			}
		},

		filterArray(elementValue, filterIndex, column, item)
		{
			const elementToFilterAgainst = (typeof column.computedValue === 'function') ? column.computedValue(item) : elementValue
			const filterValue = this.filters[filterIndex];

			if (!filterValue)
				return true;

			if(filterValue.length === 0)
				return true;

			return elementToFilterAgainst.filter(el =>
			{
				const value = (column.objectValue) ? String(el[column.objectValue]) : String(el);

				if(column.multiple)
					return filterValue.some(el => value.includes(el));

				return value.includes(filterValue);
			}).length > 0;
		}
	}
}
</script>
