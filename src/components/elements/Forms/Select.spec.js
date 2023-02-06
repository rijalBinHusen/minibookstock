import { mount } from '@vue/test-utils';
import Select from './Select.vue';

{
  /* <Select
    value="the value that would emit when the text selected"
    text="the text that would show as select option"
    id="yourSelectId"
    class="your additional class"
    options="[
          { id: 'database', title: 'Import database'},
          { id: 'salesOrder', title: 'Import outstanding SO'}"
    ]
    size="small"
    @selectedd="event when input select change"
  /> */
}

test('setSelected demo', async () => {
  // mount component and set the props
  const wrapper = mount(Select, {
    props: {
      value: 'id',
      text: 'Select your options',
      options: [
        { id: 'database', title: 'Import database' },
        { id: 'salesOrder', title: 'Import outstanding SO' },
      ],
      size: 'small',
    },
  });

  // get all option
  const options = wrapper.find('select').findAll('option');
  // set option
  await options.at(1).setSelected();
  // the option sshould equal to
  expect(wrapper.find('option:checked').element.value).toBe('database');
});
