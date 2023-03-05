import "fake-indexeddb/auto";
import { describe, it, expect, test } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import MasterItem from "./MasterItem.vue";
import { faker } from "@faker-js/faker";
import { Master_items } from "../composables/MasterItems";

describe("Click submit button ", async () => {
  // mount component
  let wrapper = mount(MasterItem);
  // new record
  const kd_item = faker.datatype.string(5);
  const nm_item = faker.datatype.string(15);
  const age_item = faker.datatype.number({ max: 12 }) + "";
  const sort_item = faker.datatype.number();
  // form item master
  const formKdItem = wrapper.find("#form-kd_item");
  const formNmItem = wrapper.find("#form-nm_item");
  const formAgeItem = wrapper.find("#form-age_item");
  const formSortItem = wrapper.find("#form-sort_item");
  // function to set form
  async function setFormValue(kdItem, nmItem, ageItem, sortItem) {
    // set value kd_item value
    await formKdItem.setValue(kdItem);
    // triggering form using key up, so the value emitted to parent
    await formKdItem.trigger("keyup.alt");
    // set value nm_item value
    await formNmItem.setValue(nmItem);
    // triggering form using key up, so the value emitted to parent
    await formNmItem.trigger("keyup.alt");
    // set value age_item value
    await formAgeItem.setValue(ageItem);
    // triggering form using key up, so the value emitted to parent
    await formAgeItem.trigger("keyup.alt");
    // set value sort item value
    await formSortItem.setValue(sortItem);
    // triggering form using key up, so the value emitted to parent
    await formSortItem.trigger("keyup.alt");
  }

  // function to waiting
  function timeMs() {
    return new Promise((res) => {
      setTimeout(() => {
        res();
      }, 2000);
    });
  }

  // testing create item
  it("Create new record", async () => {
    // set value form
    await setFormValue(kd_item, nm_item, age_item, sort_item);
    // waiting dom updated
    await flushPromises();

    // the value of from must be equal
    expect(formNmItem.element.value).toBe(nm_item);
    expect(formKdItem.element.value).toBe(kd_item);
    expect(formAgeItem.element.value).toBe(age_item);
    expect(Number(formSortItem.element.value)).toBe(sort_item);
    // trigger click button submit
    await wrapper.find("#form_item").trigger("submit");
    // await wrapper.find('#submit-master-item').trigger('click');

    // wait for a little while, we hope the component finished create new item
    await timeMs();

    // wait until dom updated
    await flushPromises();
    // it('Value in form must be null after submitted', () => {
    expect(formNmItem.element.value).toBe("");
    expect(formKdItem.element.value).toBe("");
    expect(formAgeItem.element.value).toBe("");
    expect(formSortItem.element.value).toBe("");
  });

  it("Detecting table that contain lists of item after create new item", async () => {
    // });
    // detecting text in table
    // table-master-item-row-0-column-0
    const table_kd_item = wrapper.find("#table-master-item-row-0-column-0");
    // table-master-item-row-0-column-1
    const table_nm_item = wrapper.find("#table-master-item-row-0-column-1");
    // table-master-item-row-0-column-2
    const table_age_item = wrapper.find("#table-master-item-row-0-column-2");
    // table-master-item-row-0-column-3
    const table_sort_item = wrapper.find("#table-master-item-row-0-column-3");

    // it('Value in table must equal to new record variable', async () => {
    // detecting datatable
    expect(table_kd_item.exists()).equal(true);
    expect(table_kd_item.text()).equal(kd_item);
    expect(table_nm_item.text()).equal(nm_item);
    expect(table_age_item.text()).equal(age_item);
    expect(Number(table_sort_item.text())).equal(sort_item);
    // record in state must be 1
    expect(Master_items.value.length).equal(1);
  });
  // variable to update item
  const kd_item_update = faker.datatype.string(5);
  const nm_item_update = faker.datatype.string(15);
  const age_item_update = faker.datatype.number({ max: 12 }) + "";
  const sort_item_update = faker.datatype.number() + "";
  // testing to edit item
  it("Testing edit item", async () => {
    // detecting edit button
    const btnEdit = wrapper.find("#btn-edit-row-0");
    // click btn edit
    await btnEdit.trigger("click");
    // wait for a little while, we hope the component finished fill the form
    await timeMs();
    // wait dom updated
    await flushPromises();
    // detecting form must be equal
    expect(formNmItem.element.value).toBe(nm_item);
    expect(formKdItem.element.value).toBe(kd_item);
    expect(formAgeItem.element.value).toBe(age_item);
    expect(formSortItem.element.value).toBe(sort_item + "");
    // update form
    await setFormValue(
      kd_item_update,
      nm_item_update,
      age_item_update,
      sort_item_update
    );
    await flushPromises();
    // detecting form must be equal to new variable
    expect(formNmItem.element.value).toBe(nm_item_update);
    expect(formKdItem.element.value).toBe(kd_item_update);
    expect(formAgeItem.element.value).toBe(age_item_update);
    expect(formSortItem.element.value).toBe(sort_item_update);
    // trigger click button submit
    await wrapper.find("#form_item").trigger("submit");
    // await wrapper.find('#submit-master-item').trigger('click');

    // wait for a little while, we hope the component finished create new item
    await timeMs(100);

    // wait until dom updated
    await flushPromises();
    // it('Value in form must be null after submitted', () => {
    expect(formNmItem.element.value).toBe("");
    expect(formKdItem.element.value).toBe("");
    expect(formAgeItem.element.value).toBe("");
    expect(formSortItem.element.value).toBe("");
  });

  it("Detecting table that contain lists of item after update item", async () => {
    // });
    // detecting text in table
    // table-master-item-row-0-column-0
    const table_kd_item = wrapper.find("#table-master-item-row-0-column-0");
    // table-master-item-row-0-column-1
    const table_nm_item = wrapper.find("#table-master-item-row-0-column-1");
    // table-master-item-row-0-column-2
    const table_age_item = wrapper.find("#table-master-item-row-0-column-2");
    // table-master-item-row-0-column-3
    const table_sort_item = wrapper.find("#table-master-item-row-0-column-3");

    // it('Value in table must equal to new record variable', async () => {
    // detecting datatable
    expect(table_kd_item.exists()).equal(true);
    expect(table_kd_item.text()).equal(kd_item_update);
    expect(table_nm_item.text()).equal(nm_item_update);
    expect(table_age_item.text()).equal(age_item_update);
    expect(table_sort_item.text()).equal(sort_item_update);
    // record in state must be 1
    expect(Master_items.value.length).equal(1);
  });
});
