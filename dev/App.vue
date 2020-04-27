<template>
	<v-app>
		<v-content>
			<v-container>
				<v-row>
					<v-col>
						<v-advanced-table :columns="cols" :data="data"></v-advanced-table>
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
				cols: [{text: 'Età', value: 'age', dataType: 'number'}],
				data: [{age: 18}, {age: '25'}]
			}
		}
	}
</script>
