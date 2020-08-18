<template>
	<v-form v-model="valid">
		<v-text-field
				v-model="date" v-mask="dateMask" persistent-hint
				@input="changed = true"
				:hint="day" :placeholder="format" :label="label"
				:color="color" :outlined="outlined" :dense="dense"
				:rules="rules" append-icon="mdi-calendar" @click:append="dialogPicker = true" />

		<v-dialog ref="dialog" v-model="dialogPicker" :return-value.sync="date" persistent width="290px">
			<v-date-picker v-model="dialogPickerDate" :first-day-of-week="firstDayOfWeek" :min="minDate" :max="maxDate">
				<v-spacer></v-spacer>
				<v-btn text :color="color" @click="dialogPicker = false">{{ translate('cancel') }}</v-btn>
				<v-btn text :color="color" @click="$refs.dialog.save(date)">{{ translate('ok') }}</v-btn>
			</v-date-picker>
		</v-dialog>
	</v-form>
</template>

<script>
	import { mask } from 'vue-the-mask';
	import dayjs from 'dayjs'
	import customParseFormat from 'dayjs/plugin/customParseFormat'
	import(`dayjs/locale/it`);
	import(`dayjs/locale/en`);
	dayjs.extend(customParseFormat);

	import * as languages from '../../lang'

	export default
	{
		name: 'v-advanced-date-picker',

		directives: { mask },

		props:
		{
			value: { required: true },

			firstDayOfWeek: {
				type: String,
				default: '0',
				validator: (value) => ['0', '1', '2', '3', '4', '5', '6'].indexOf(value) !== -1
			},

			format: {
				type: String,
				default: 'YYYY-MM-DD',
				validator: (value) => ['DD/MM/YYYY', 'DD-MM-YYYY', 'YYYY-MM-DD', 'YYYY/MM/DD'].indexOf(value) !== -1
			},

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

			onlyFuture: { type: Boolean, default: false },
			onlyPast: { type: Boolean, default: false },
			showDay: { type: Boolean, default: false }
		},

		data()
		{
			return {
				validFormats: ['DD/MM/YYYY', 'DD-MM-YYYY', 'YYYY-MM-DD', 'YYYY/MM/DD'],
				masks: ['##/##/####', '##-##-####', '####-##-##', '####/##/##'],

				date: null, changed: false,

				dialogPicker: false,
				valid: false
			};
		},

		watch:
		{
			value:
			{
				immediate: true,
				handler(val) {
					this.date = val ? dayjs(val, this.inputFormat).format(this.format) : dayjs().format(this.format);
				}
			},

			date:
			{
				immediate: true,
				handler(val)
				{
					if(val)
					{
						const formattedDate = dayjs(val, this.changed ? this.format : this.inputFormat).format(this.outputFormat)
						const valid = this.isValidDate(formattedDate, this.outputFormat);

						if(valid)
							this.$emit('input', formattedDate);
					}
				}
			},

			day(val) {
				this.$emit('weekDay', val);
			},

			valid:
			{
				immediate: true,
				handler(val)
				{
					if (this.mandatory)	{
						this.$emit('valid', val);
					}
				}
			}
		},

		computed:
		{
			minDate() {
				return this.onlyFuture ? new Date().toJSON() : null
			},

			maxDate() {
				return this.onlyPast ? new Date().toJSON() : null
			},

			dialogPickerDate:
			{
				get: function ()
				{
					const date = dayjs(this.date, this.format);

					if(date.isValid())
						return date.format(this.validFormats[2]);

					return null
				},

				set: function(val) {
					this.date = dayjs(val, this.validFormats[2]).format(this.format)
				}
			},

			dateMask() {
				return this.masks[this.validFormats.indexOf(this.format)];
			},

			day()
			{
				if (!this.showDay || !this.date) {
					return '';
				}

				return dayjs(this.date, this.format).locale(this.$vuetify.lang.current).format('dddd');
			},

			rules()
			{
				const rules = [
					v => (!!v ? this.isValidDate(v) : true) || 'Data non valida'
				];

				if (this.mandatory)	{
					rules.push(v => !!v || 'Campo necessario');
				}

				if (this.onlyFuture) {
					rules.push(v => !dayjs(v, this.format).isBefore(dayjs(), 'day') || 'Data nel passato');
				}

				if(this.onlyPast) {
					rules.push(v => !dayjs(v, this.format).isAfter(dayjs(), 'day') || 'Data nel futuro');
				}

				return rules;
			}
		},

		methods:
		{
			daysInMonth (m, y)
			{
				switch (m)
				{
					case 1: return (y % 4 === 0 && y % 100) || y % 400 === 0 ? 29 : 28;
					case 8 : case 3 : case 5 : case 10 : return 30;

					default :	return 31
				}
			},

			isValidDate (date, fromFormat = this.format)
			{
				const commonFormatDate = dayjs(date, fromFormat).format('YYYY-MM-DD');

				if(commonFormatDate.toString() === 'Invalid Date')
					return false;

				let [y, m, d] = commonFormatDate.split('-');

				m = parseInt(m, 10) - 1;
				d = parseInt(d, 10);
				y = parseInt(y, 10);

				return m >= 0 && m < 12 && d > 0 && d <= this.daysInMonth(m, y);
			},

			translate (key) {
				return languages[this.$vuetify.lang.current][key]
			}
		}
	};
</script>
