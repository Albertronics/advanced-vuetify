import * as components from './components'

const AdvancedVuetify =
{
  install(Vue, options = {})
	{
    for (const componentName in components)
    {
      const component = components[componentName];
      Vue.component(component.name, component)
    }
  }
};

export default AdvancedVuetify

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(AdvancedVuetify)
}
