<template>
	<v-menu v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="290px">
		<template v-slot:activator="{ on }">
			<v-text-field :value="dateRangeText" :label="label" :color="color" readonly v-on="on" :outlined="outlined" :dense="dense" @click:clear="dates = []" clearable></v-text-field>
		</template>

		<v-date-picker :color="color" range v-model="dates" first-day-of-week="1"></v-date-picker>
	</v-menu>
</template>

<script>
import dayjs from 'dayjs'

export default
{
	name: 'v-date-range',

	props:
	{
		color: { type: String, default: 'primary' },
		value: { type: Array, required: true },
		outlined: { type: Boolean, default: false },
		dense: { type: Boolean, default: false },
		format: { type: String, default: 'YYYY-MM-DD', validator: (value) => [ 'DD/MM/YYYY', 'DD-MM-YYYY', 'YYYY-MM-DD', 'YYYY/MM/DD' ].indexOf(value) !== -1 },
		outputFormat: { type: String, default: 'YYYY-MM-DD', validator: (value) => [ 'DD/MM/YYYY', 'DD-MM-YYYY', 'YYYY-MM-DD', 'YYYY/MM/DD' ].indexOf(value) !== -1 },
		label: { type: String }
	},

	data() {
		return {
			menu: false,
			dates: this.value || []
		}
	},

	computed:
	{
		dateRangeText()
		{
			if (!this.value)
				return '';

			const formattedRange = [];

			for (let index = 0; index < this.value.length; index++)
				formattedRange[index] = dayjs(this.value[index]).format(this.format);

			return formattedRange.join(' - ')
		}
	},

	watch:
	{
		value(val, oldVal)
		{
			if(JSON.stringify(val) === JSON.stringify(oldVal))
				return

			this.dates = val || []
		},

		dates(val)
		{
			const formattedRange = [];

			for (let index = 0; index < val.length; index++)
				formattedRange[index] = dayjs(val[index]).format(this.outputFormat);

			this.$emit('input', formattedRange);
		}
	}
}
</script>
