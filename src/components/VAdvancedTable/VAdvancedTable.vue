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
				fixed-header class="elevation-0" show-select v-model="selected"	multi-sort>

				<template v-slot:item.data-table-select="{ isSelected, select }">
					<v-simple-checkbox :color="color"	:value="isSelected"	@input="select($event)"></v-simple-checkbox>
				</template>

				<template v-slot:header.data-table-select="{ on, props }">
					<v-simple-checkbox :color="color" v-bind="props" v-on="on"></v-simple-checkbox>
				</template>

				<template v-slot:group.header="{ toggle, group, groupBy, items, isOpen }">
					<td :colspan="columns.length + 1" class="text-start">
						<v-btn icon @click="toggle">
							<v-icon>{{isOpen ? 'mdi-minus' : 'mdi-plus'}}</v-icon>
						</v-btn>

						<b>{{ columns.filter(el => el.value === groupBy[0])[0].text }}: {{ group }} ({{ items.length }})</b>

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
						<td	v-for="(item, index) in [{ selectionControls: true }].concat(headers.filter(el => selectedGroupBy !== el.value))" :key="index">
							<v-select
								v-if="item.selectionControls"
								v-model="selectionFilter"
								:items="selectionFilters"
							 	item-text="name" item-value="id" />

							<v-text-field	v-if="item.dataType === 'text' && !item.options" v-model="filters[index - 1]">
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
								v-model="filters[index - 1]"
								clearable
								:small-chips="item.multiple"
								:items="item.options"
								:multiple="item.multiple"
								:item-value="item.optionValue || null"
								:item-text="item.optionValue" />

							<v-autocomplete
								v-if="item.dataType === 'boolean'"
								v-model="filters[index - 1]"
								:items="booleanOptions"
								clearable
								item-value="id" item-text="text" />

							<v-date-range
								v-if="item.dataType === 'date'"
								v-model="filters[index - 1]"
								:format="item.dateFormat"
								label="" />

							<number-filter
								v-if="item.dataType === 'number'"
								v-model="filters[index - 1]" />

							<v-text-field
								v-if="item.dataType === 'array' && !item.options"
								v-model="filters[index - 1]" />

							<v-autocomplete
								v-if="item.dataType === 'array' && item.options"
								v-model="filters[index - 1]"
								clearable
								:items="item.options"
								:multiple="item.multiple"
								:small-chips="item.multiple"
								:item-value="item.optionValue || null"
								:item-text="item.optionValue" />
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
		data: { type: Array, required: true	},
		tableKey: {	type: String,	default: 'id' },
		slots: { type: Array,	default: () => [] },
		expand: {	type: Boolean, default: false },
		outlined: {	type: Boolean, default: false },
		dense: {	type: Boolean, default: false },
		loading: {	type: Boolean, default: false }
	},

	data()
	{
		return {
			filterActive: false,

			selected: [],	headers: [],	allHeaders: [], filters: [], groupByOptions: [],
			selectedGroupBy: null,

			selectionFilter: 0
		}
	},

	watch:
	{
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

			if(column.dataType === 'text')
				column.caseSensitive = true;

			switch (column.dataType)
			{
				case 'text': column.filter = value => this.filterText(value, i, column); break;
				case 'boolean': column.filter = value => this.filterBoolean(value, i); break;
				case 'date': column.filter = value => this.filterDate(value, i, column); break;
				case 'number': column.filter = value => this.filterNumber(value, i); break;
				case 'array': column.filter = value => this.filterArray(value, i, column); break;
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
				{ id: 'no', text: this.translate('no' )}
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
		}
	},

	methods:
	{
		translate(key) {
			return languages[this.$vuetify.lang.current][key]
		},

		exportToExcel(name)	{
			// TODO
		},

		removeElement()
		{
			const length = this.selected.length;

			for (let i = 0; i < length; i++)
			{
				const element = this.selected[i];
				const index = this.data.findIndex(el => el[this.tableKey] === element[this.tableKey]);

				this.data.splice(index, 1);
			}

			this.selected = [];
		},

		filterText(value, filterIndex, column)
		{
			const filterValue = this.filters[filterIndex];

			if (!filterValue)
				return true;

			if (column.multiple)
			{
				if (filterValue.length === 0)
					return true;

				return filterValue.filter(el => el === value).length > 0;
			}

			if (!column.caseSensitive)
				return value.toLowerCase().includes(filterValue.toLowerCase());

			return value.includes(filterValue);
		},

		filterBoolean(value, filterIndex)
		{
			const filterValue = this.filters[filterIndex];

			if(!filterValue)
				return true;

			return value === (filterValue === 'yes');
		},

		filterDate(value, filterIndex, column)
		{
			const filterValue = this.filters[filterIndex];

			if (!filterValue) return true;
			if (!filterValue[1]) return true;

			const start = filterValue[0];
			const end = filterValue[1];
			const target = dayjs(value, column.dateFormat || 'YYYY-MM-DD');

			return target.isBetween(start, end, null, '[]');
		},

		filterNumber(val, filterIndex)
		{
			const { operator, minimum, maximum } = this.filters[filterIndex];

			if(!operator || !val || !minimum || (operator === '<>' && !maximum))
				return true;

			const value = Number(val);
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

		filterArray(value, filterIndex, column)
		{
			const filterValue = this.filters[filterIndex];

			if (!filterValue)
				return true;

			if(filterValue.length === 0)
				return true;

			return value.filter(val =>
			{
				if(column.multiple)
				{
					if(column.objectValue)
						return filterValue.some(el => String(val[column.objectValue]).includes(el));

					return filterValue.some(el => String(val).includes(el));
				}

				if(!column.objectValue)
					return String(val).includes(filterValue);

				if(column.objectValue)
					return String(val[column.objectValue]).includes(filterValue);

			}).length > 0;
		}
	}
}
</script>
