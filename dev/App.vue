<template>
	<v-app>
		<v-content>
			<v-container>
				<v-row>
					<v-col>
						<v-advanced-table v-model="customers" :columns="headers"></v-advanced-table>
					</v-col>
				</v-row>
			</v-container>
		</v-content>
	</v-app>
</template>

<script>
	import VAdvancedDatePicker from '../src/components/VAdvancedDatePicker/VAdvancedDatePicker';
	import VAdvancedTable from '@/components/VAdvancedTable/VAdvancedTable';
	export default
	{
		components: {VAdvancedTable, VAdvancedDatePicker },

		data()
		{
			return {
				headers: [
					{ dataType: 'number', value: 'credits', text: 'Punti' }
				],
				customers: [
					{ id: 0, credits: 25 },
					{ id: 1, credits: 35 },
					{ id: 2, credits: 0 }
				]
			}
		}
	}
</script>
