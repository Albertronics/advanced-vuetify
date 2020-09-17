<template>
	<v-container>
		<v-row dense>
			<v-col cols="12" @drop.prevent="addDropFile" @dragover.prevent>
				<input ref="fileUpload" type="file" hidden @input="addDropFile" multiple :accept="acceptedFileTypes">
				<v-btn block :color="color" outlined @click="$refs.fileUpload.click()">{{ translate('add') }}</v-btn>
			</v-col>

			<v-col cols="12">
				<v-simple-table>
					<template v-slot:default>
						<thead>
							<tr>
								<th class="text-left">{{ translate('name') }}</th>
								<th class="text-center">{{ translate('dimension') }}</th>
								<th class="text-center">{{ translate('actions') }}</th>
							</tr>
						</thead>

						<tbody>
							<td align="center" colspan="4" v-if="files.length === 0">{{ translate('noFileAvailable') }}</td>

							<tr v-for="(item, index) in files" :key="item.name">
								<td>{{ item.name }}</td>
								<td align="center">{{ humanFileSize(item.size) }}</td>

								<td align="center">
									<v-btn icon @click="download(index)"><v-icon>mdi-download</v-icon></v-btn>
									<v-btn icon @click="removeFile(index)"><v-icon>mdi-delete</v-icon></v-btn>
								</td>
							</tr>
						</tbody>
					</template>
				</v-simple-table>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
	import { saveAs } from 'file-saver';
	import * as languages from '../../lang'

	export default
	{
		name: 'v-advanced-files-picker',

		props:
		{
			value: { required: true },
			acceptedFileTypes: { type: String, default: null },
			fieldName: { type: String, default: 'attachments' },
			color: { type: String, default: 'primary' }
		},

		data()
		{
			return {
				files: this.value || [],
				formData: null,
			}
		},

		methods:
		{
			translate(key) {
				return languages[this.$vuetify.lang.current][key]
			},

			extensionFromMIME(extension)	{
				return mime.extension(extension)
			},

			humanFileSize(size)
			{
				const thresh = 1000;

				if(Math.abs(size) < thresh)
					return size + ' B';

				const units = ['kB','MB','GB','TB','PB','EB','ZB','YB'];
				let u = -1;

				do
				{
					size /= thresh;
					++u;
				} while(Math.abs(size) >= thresh && u < units.length - 1);

				return size.toFixed(1)+' '+units[u];
			},

			addDropFile(e)
			{
				const rawFiles = (e.target && e.target.files) || (e.dataTransfer && e.dataTransfer.files);
				const newFiles = Array.from(rawFiles);

				this.files = [...this.files, ...newFiles];
			},

			removeFile(index) {
				this.files.splice(index, 1);
			},

			download(index) {
				saveAs(this.files[index].url || this.files[index], this.files[index].name)
			}
		},

		watch:
		{
			value(val, oldVal)
			{
				if(JSON.stringify(val) !== JSON.stringify(oldVal))
					this.file = val || []
			},

			files(val)
			{
				this.formData = new FormData();

				for (let i = 0; i < this.files.length; i++)
				{
					const file = this.files[i];

					if(!file.id)
					{
						this.formData.append(this.fieldName, file, file.name)
					}
					else
					{
						this.formData.append(this.fieldName, { file: file.id })
					}
				}

				this.$emit('input', val)
			},

			formData(val) {
				this.$emit('formData', val);
			}
		},
	}
</script>
