<template>
	<v-app>
		<v-content>
			<v-container>
				<v-row>
					<v-col cols="12">
						<v-btn @click="$refs.table.exportToExcel()">Esporta</v-btn>
					</v-col>

					<v-col>
						<v-advanced-table :show-select="false" ref="table" v-model="data" :columns="cols"></v-advanced-table>
					</v-col>
				</v-row>
			</v-container>
		</v-content>
	</v-app>
</template>

<script>
	import VAdvancedTable from '../src/components/VAdvancedTable/VAdvancedTable';
	export default
	{
		components: { VAdvancedTable },

		data()
		{
			return {
				cols: [
					{ text: 'ID', value: 'id', dataType: 'number' },
					{ text: 'Attivo', value: 'active', dataType: 'boolean', groupBy: true },
					{ text: 'Data', value: 'date', dataType: 'date', groupBy: true, dateFormat: 'DD/MM/YYYY' }
				],

				data: [
					{
						id: 0,
						active: true,
						date: '10/04/2020 11:30'
					},

					{
						id: 1,
						active: false,
						date: '10/04/2020 12:30'
					},

					{
						id: 2,
						active: false,
						date: '12/04/2020 13:25'
					}
				]
			}
		}
	}
</script>
