<template>
	<v-row dense>
		<v-col :cols="operator !== '<>' ? 12 : 6">
			<v-text-field v-model="minimum" :color="color" :placeholder="operator === '<>' ? translate('min') : null" type="number">
				<template v-slot:prepend>
					<v-menu offset-y>
						<template v-slot:activator="{ on }">
							<v-btn icon v-on="on">
								<v-icon>{{ icon }}</v-icon>
							</v-btn>
						</template>

						<v-list>
							<v-list-item v-for="(operator, index) in operators" :key="index" @click="operatorClick(index)">
								<v-list-item-title>{{ operator }}</v-list-item-title>
							</v-list-item>
						</v-list>
					</v-menu>
				</template>
			</v-text-field>
		</v-col>

		<v-col v-if="operator === '<>'" cols="6">
			<v-text-field v-model="maximum" :color="color" :placeholder="translate('max')" type="number"></v-text-field>
		</v-col>
	</v-row>
</template>

<script>
import * as languages from '../../lang';

export default
{
	name: "number-filter",

	props:
	{
		value: { required: true },
		color: { type: String, default: 'primary' }
	},

	data()
	{
		return {
			minimum: null, maximum: null,

			operator: '=',
			operators: ['=', '<', '>', '<=', '>=', '<>'],

			icon: 'mdi-equal',
			icons: ['mdi-equal', 'mdi-less-than', 'mdi-greater-than', 'mdi-less-than-or-equal', 'mdi-greater-than-or-equal', 'mdi-unfold-more-vertical']
		};
	},

	watch:
	{
		operator(val) {
			this.$emit('input', { operator: val, minimum: this.minimum, maximum: this.maximum });
		},

		minimum(val) {
			this.$emit('input', { operator: this.operator, minimum: val, maximum: this.maximum });
		},

		maximum(val) {
			this.$emit('input', { operator: this.operator, minimum: this.minimum, maximum: val });
		}
	},

	methods:
	{
		operatorClick(index)
		{
			this.operator = this.operators[index];
			this.icon = this.icons[index];
		},

		translate(key) {
			return languages[this.$vuetify.lang.current][key]
		},
	}
};
</script>
