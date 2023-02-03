import 'fake-indexeddb/auto';
import { describe, it, expect, test } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import MasterItem from './MasterItem.vue';
import { faker } from '@faker-js/faker';
import { Master_items } from '../composables/MasterItems';

describe('Click submit button ', async () => {
  it('Create new record', async () => {
    // mount component
    let wrapper = mount(MasterItem);

    // new record
    const kd_item = faker.datatype.string(5);
    const nm_item = faker.datatype.string(15);
    const age_item = faker.datatype.number({ max: 12 });
    // set kd_item value
    const formKdItem = wrapper.find('#form-kd_item');
    await formKdItem.setValue(kd_item);
    // triggering form using key up, so the value emitted to parent
    await formKdItem.trigger('keyup.alt');
    // set nm_item value
    const formNmItem = wrapper.find('#form-nm_item');
    await formNmItem.setValue(nm_item);
    // triggering form using key up, so the value emitted to parent
    await formNmItem.trigger('keyup.alt');
    // set age_item value
    const formAgeItem = wrapper.find('#form-age_item');
    await formAgeItem.setValue(age_item);
    // triggering form using key up, so the value emitted to parent
    await formAgeItem.trigger('keyup.alt');

    expect(formNmItem.element.value).toBe(nm_item);
    expect(formKdItem.element.value).toBe(kd_item);
    expect(formAgeItem.element.value).toBe(age_item + '');
    // trigger click button submit
    await wrapper.find('#form_item').trigger('submit');
    // await wrapper.find('#submit-master-item').trigger('click');

    // Assert payload is correct
    // const expectedPayload = { kd_item, nm_item, age_item };
    // expect(wrapper.emitted('formSubmitted')).toMatchObject(expectedPayload);
    // await wrapper.vm.handleSubmit();

    // // wait until dom updated
    // await flushPromises();
    // // it('Value in form must be null after submitted', () => {
    // expect(formNmItem.element.value).toBe('');
    // expect(formKdItem.element.value).toBe('');
    // expect(formAgeItem.element.value).toBe('');
    // // });
    // // detecting text in table
    // // table-master-item-row-0-column-0
    // const table_kd_item = wrapper.find('#table-master-item-row-0-column-0');
    // // table-master-item-row-0-column-1
    // const table_nm_item = wrapper.find('#table-master-item-row-0-column-1');
    // // table-master-item-row-0-column-2
    // const table_age_item = wrapper.find('#table-master-item-row-0-column-2');

    // // it('Value in table must equal to new record variable', async () => {
    // // detecting datatable
    // expect(table_kd_item.exists()).equal(true);
    // expect(table_kd_item.text()).equal(kd_item);
    // expect(table_nm_item.text()).equal(nm_item);
    // expect(table_age_item.text()).equal(age_item);
    // expect(Master_items.value.length).equal(1);
    // });
  });
});
