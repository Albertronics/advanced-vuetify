<template>
	<v-form v-model="valid">
		<v-text-field
			type="date" v-model="date" :min="minDate" :max="maxDate"
			:hint="showDay ? day : null" :label="label" persistent-hint
			:color="color" :outlined="outlined" :dense="dense" :rules="rules"	:disabled="disabled" />
	</v-form>
</template>

<script>
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import(`dayjs/locale/it`);
import(`dayjs/locale/en`);
dayjs.extend(customParseFormat);

export default
{
	name: 'v-advanced-date-picker',

	props:
	{
		value: { required: true },

		inputFormat: {
			type: String,
			default: 'YYYY-MM-DD',
			validator: (value) => ['DD/MM/YYYY', 'DD-MM-YYYY', 'YYYY-MM-DD', 'YYYY/MM/DD'].indexOf(value) !== -1
		},

		outputFormat: {
			type: String,
			default: 'YYYY-MM-DD',
			validator: (value) => ['DD/MM/YYYY', 'DD-MM-YYYY', 'YYYY-MM-DD', 'YYYY/MM/DD'].indexOf(value) !== -1
		},

		label: { type: String },
		color: { type: String, default: 'primary' },
		mandatory: { type: Boolean, default: false },
		outlined: { type: Boolean, default: false },
		dense: { type: Boolean, default: false },
		disabled: { type: Boolean, default: false },

		onlyFuture: { type: Boolean, default: false },
		onlyPast: { type: Boolean, default: false },
		showDay: { type: Boolean, default: false }
	},

	data()
	{
		return {
			date: this.value ? dayjs(this.value, this.inputFormat).format('YYYY-MM-DD') : null,
			valid: false,
		};
	},

	watch:
	{
		value(val)
		{
			const oldOutputFormattedDate = dayjs(val, 'YYYY-MM-DD').format(this.outputFormat)

			if(val === oldOutputFormattedDate || oldOutputFormattedDate === 'Invalid Date')
				return

			this.date = val ? dayjs(val, this.inputFormat).format('YYYY-MM-DD') : null
		},

		date(val)
		{
			const outputFormattedDate = dayjs(val, 'YYYY-MM-DD').format(this.outputFormat)

			if(outputFormattedDate !== 'Invalid Date')
				this.$emit('input', outputFormattedDate)
		},

		day(val) {
			this.$emit('weekDay', val);
		},

		valid(val)
		{
			if (this.mandatory)
				this.$emit('valid', val);
		}
	},

	computed:
	{
		minDate() {
			return this.onlyFuture ? dayjs().format('YYYY-MM-DD') : null
		},

		maxDate() {
			return this.onlyPast ? dayjs().format('YYYY-MM-DD') : null
		},

		day()
		{
			if(!this.date)
				return ''

			return dayjs(this.date, 'YYYY-MM-DD').locale(this.$vuetify.lang.current).format('dddd');
		},

		rules()
		{
			const rules = [];

			if (this.mandatory)
				rules.push(v => !!v || 'Campo necessario');

			if (this.onlyFuture)
				rules.push(v => !dayjs(v, 'YYYY-MM-DD').isBefore(dayjs(), 'day') || 'Data nel passato');

			if(this.onlyPast)
				rules.push(v => !dayjs(v, 'YYYY-MM-DD').isAfter(dayjs(), 'day') || 'Data nel futuro');

			return rules;
		}
	}
};
</script>
