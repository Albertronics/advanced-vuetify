<template>
	<v-app>
		<v-content>
			<v-container>
				<v-row>
					<v-btn @click="date = '17/09/2020'"></v-btn>
					{{ date }}
					<v-col>
						<v-advanced-date-picker v-model="date" input-format="DD/MM/YYYY" outlined dense label="Data"/>
					</v-col>
				</v-row>
			</v-container>
		</v-content>
	</v-app>
</template>

<script>
import VAdvancedDatePicker from '@/components/VAdvancedDatePicker/VAdvancedDatePicker';
export default
{
	components: {VAdvancedDatePicker},
	data()
	{
		return {
			date: '30/10/2000'
		}
	}
}
</script>
