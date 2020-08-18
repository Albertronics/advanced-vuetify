<template>
	<v-app>
		<v-content>
			<v-container>
				<v-row>
					<v-col cols="12">
						<v-btn @click="$set(customer, 'birthDate', '24/07/2020')">Change</v-btn>
						<v-btn @click="$set(customer, 'birthDate', null)">Change to null</v-btn>
					</v-col>

					<v-col cols="2">
						{{ customer.birthDate }}

						<v-advanced-date-picker
							only-future show-day
							v-model="customer.birthDate"
							outlined dense mandatory inputFormat="DD/MM/YYYY"
							label="Data" />
					</v-col>
				</v-row>
			</v-container>
		</v-content>
	</v-app>
</template>

<script>
	import VAdvancedDatePicker from '../src/components/VAdvancedDatePicker/VAdvancedDatePicker';
	export default
	{
		components: { VAdvancedDatePicker },

		data()
		{
			return {
				customer: {
					birthDate: null
				}
			}
		}
	}
</script>
