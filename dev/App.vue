<template>
	<v-app>
		<v-content>
			<v-container>
				<v-row>
					<v-col cols="12">
						<v-btn @click="data.splice(1, 1)">Elimina</v-btn>
					</v-col>

					<v-col>
						<v-advanced-table ref="table" v-model="data" :columns="cols"></v-advanced-table>
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
		components: {VAdvancedTable},
		data()
		{
			return {
				cols: [
					{text: 'ID', value: 'id', dataType: 'number'},
					{text: 'Attivo', value: 'active', dataType: 'boolean',groupBy: true}
				],

				data: [
					{
						id: 0,
						active: true
					},

					{
						id: 1,
						active: false
					},

					{
						id: 2,
						active: false
					}
				]
			}
		}
	}
</script>
