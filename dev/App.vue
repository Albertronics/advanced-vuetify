<template>
	<v-app>
		<v-content>
			<v-container>
				<v-row>
					<v-col cols="12">
						<v-btn @click="$set(customer, 'birthDate1', '24/07/2020')">Change</v-btn>
					</v-col>

					<v-col>
						{{ customer.birthDate1 }}
						<v-advanced-date-picker v-model="customer.birthDate1" format="DD/MM/YYYY" input-format="DD/MM/YYYY" output-format="DD/MM/YYYY"/>
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
					birthDate1: '30/10/2000',
					birthDate2: '2000-10-30',
					birthDate3: '30-10-2000',
				}
			}
		}
	}
</script>
