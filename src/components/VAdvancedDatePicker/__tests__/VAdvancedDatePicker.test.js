import { mount } from '@vue/test-utils';
import dayjs from 'dayjs'

import Vue from 'vue'
import Vuetify from 'vuetify';
import { mask } from 'vue-the-mask';

Vue.use(Vuetify);

import VAdvancedDatePicker from '../VAdvancedDatePicker.vue'

function getMountedComponent(Component, propsData)
{
	const vuetify = new Vuetify({
		mocks:
		{
			$vuetify: {
				lang: {
					current: 'en',
					t: (val) => val,
				},
			},
		}
	});

	return mount(Component, {
		vuetify,
		props: propsData,
		directives: { mask }
	});
}

describe('VAdvancedDatePicker', () =>
{
	it('should set today\'s date by default', () =>
	{
		const component = getMountedComponent(VAdvancedDatePicker, { value: null });

		expect(component.vm.$data.date).toBe(dayjs().format('YYYY-MM-DD'));
	})
});
