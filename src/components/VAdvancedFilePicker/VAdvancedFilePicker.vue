<template>
	<v-container class="pa-0">
		<v-row dense>
			<v-col cols="12" @drop.prevent="addDropFile" @dragover.prevent>
				<input ref="fileUpload" type="file" hidden @input="addDropFile" :accept="acceptedFileTypes">

				<v-text-field :color="color" :label="label" @click="$refs.fileUpload.click()" @click:clear="file = null" clearable :outlined="outlined" :dense="dense" :value="fileName" readonly :append-icon="appendIcon" @click:append="download">
					<template v-if="avatarColor" v-slot:prepend>
						<v-avatar :color="avatarColor" size="18"></v-avatar>
					</template>
				</v-text-field>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
	import { saveAs } from 'file-saver';

	export default
	{
		name: 'v-advanced-file-picker',

		props:
		{
			value: { required: true },
			acceptedFileTypes: { type: String, default: null },
			fieldName: { type: String, default: 'attachment' },
			color: { type: String, default: 'primary' },
			label: { type: String, default: 'File' },
			dense: { type: Boolean, default: false },
			outlined: { type: Boolean, default: false },
			avatarColor: { type: String, default: null }
		},

		data()
		{
			return {
				file: this.value,
				formData: null,
			}
		},

		computed:
		{
			appendIcon() {
				return this.file ? 'mdi-download' : ''
			},

			fileName()
			{
				if(!this.file)
					return '';

				return `${this.file.name} (${this.humanFileSize(this.file.size)})`
			}
		},

		methods:
		{
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

			addDropFile(e) {
				this.file = (e.target && e.target.files[0]) || (e.dataTransfer && e.dataTransfer.files[0]);
			},

			download() {
				saveAs(this.file.url || this.file, this.file.name)
			}
		},

		watch:
		{
			value(val, oldVal)
			{
				if(JSON.stringify(val) !== JSON.stringify(oldVal))
					this.file = val
			},

			file(val)
			{
				this.formData = new FormData();

				if(val)
				{
					if(!val.id)
						this.formData.append(this.fieldName, val, val.name);
					else
						this.formData.append(this.fieldName, { file: val.id })
				}

				this.$emit('input', val)
			},

			formData(val) {
				this.$emit('formData', val);
			}
		},
	}
</script>
