<template>
	<v-app>
		<v-content>
			<v-container>
				<v-row>
					<v-col>
						<v-advanced-table v-model="data" :columns="headers"></v-advanced-table>
					</v-col>
				</v-row>
			</v-container>
		</v-content>
	</v-app>
</template>

<script>
import VAdvancedTable from '@/components/VAdvancedTable/VAdvancedTable';
export default
{
	components: {VAdvancedTable},
	data()
	{
		return {
			data: [{date: '30/10/2000'}],
			headers: [
				{ dataType: 'date', value: 'date', text: 'Data', dateFormat: 'DD/MM/YYYY' }
			]
		}
	}
}
</script>
