import { flushPromises, mount } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import { describe, it, expect, beforeEach } from 'vitest';
import {
  useJurnalProdukKeluar,
  useJurnalProdukMasuk,
} from '../composables/Setting_JurnalId';
import {
  createItem,
  Master_items,
  getItemById,
} from '../composables/MasterItems';
import IncomingForm from './IncomingForm.vue';
import { createStore } from "vuex"
import mainStore from "../store/index"

// create value for mocking jurnal produk masuk
describe('create jurnal produk massuk', () => {
  it('Should create new record', async () => {
    const jurnalName = faker.datatype.string(12);
    const jurnalName2 = faker.datatype.string(13);
    // initiate func
    const jurnalProdukMasuk = useJurnalProdukMasuk();
    // waiting proses create record and write to indexeddb
    // const newItemIdReturned =
    await jurnalProdukMasuk.createJurnalProdukMasuk(jurnalName);
    await jurnalProdukMasuk.createJurnalProdukMasuk(jurnalName2);
    // // find the object from indexeddb by id
    // const getData = await getItemById(newItemIdReturned);
    // // expecting data that we got match with original record
    // expect(getData.kd_item).equal(record.kd_item);
    // check state
    expect(jurnalProdukMasuk.Jurnal_produk_masuk.value.length).equal(2);
    // state [0] must be equal jurnalName
    expect(jurnalProdukMasuk.Jurnal_produk_masuk.value[0]?.nama_jurnal).equal(
      jurnalName2
    );
  });
});
// create value for mocking master item
describe('create master item', () => {
  it('Should create new item', async () => {
    for (let i = 0; i < 10; i++) {
      const kdItem = faker.datatype.string(12);
      const nmItem = faker.datatype.string(10);
      const ageItem = 7;
      // waiting proses create item and write to indexeddb
      const newItemIdReturned = await createItem(
        kdItem,
        nmItem,
        false,
        false,
        ageItem
      );
      // find the object from indexeddb by id
      const getData = await getItemById(newItemIdReturned);
      // expecting data that we got match with original record
      expect(getData.kd_item).equal(kdItem);
    }
    // state length must be 10
    expect(Master_items.value.length).equal(10);
  });
});

describe('Create new incoming product', () => {
  // Mocking the vuex store
  const store = createStore({
    state() {
      return {
        form: null,
        dialogMessage: null,
        dialogType: null,
      }
    }
  })
  // mount the component
  const wrapper = mount(IncomingForm, {
    global: {
      plugins: [store]
    }
  });
  // catch all form element
  const datePicker = wrapper.find('#date-picker-incoming');
  const shift = wrapper.find('#shift');
  const typeDoc = wrapper.find('#type');
  const paper = wrapper.find('#form-paper-id');
  const diserahkan = wrapper.find('#form-diserahkan');
  const penerima = wrapper.find('#form-penerima');
  const submit = wrapper.find('#submit-incoming');
  const productCrud = wrapper.find('#stock_master');

  it('detecting all form that we need', () => {
    // detecting all form element must be exists
    expect(datePicker.exists()).toBe(true);
    expect(shift.exists()).toBe(true);
    expect(typeDoc.exists()).toBe(true);
    expect(paper.exists()).toBe(true);
    expect(diserahkan.exists()).toBe(true);
    expect(penerima.exists()).toBe(true);
    expect(submit.exists()).toBe(true);
    expect(productCrud.exists()).toBe(true);
  });

  it('Fill the form and value must be equal', async () => {
    // variable to insert to form
    const varPaper = faker.datatype.string(30);
    const varDiserahkan = faker.datatype.string(30);
    const varPenerima = faker.datatype.string(30);
    // fill all form element
    // set paper and trigger keyup so the variable setted to ref variable
    paper.setValue(varPaper);
    paper.trigger('keyup.alt');
    // set diserahkan and trigger keyup so the variable setted to ref variable
    diserahkan.setValue(varDiserahkan);
    diserahkan.trigger('keyup.alt');
    // set paper and trigger keyup so the variable setted to ref variable
    penerima.setValue(varPenerima);
    penerima.trigger('keyup.alt');
    // get all option in type
    const typeDocOptions = wrapper.find('#type').findAll('option');
    const jurl = useJurnalProdukMasuk()
    await jurl.gettingJurnalProdukMasukRecord()
    expect(jurl.Jurnal_produk_masuk.value.length).toBe(2)
    console.log(typeDocOptions)
    // expect the option > 0
    expect(typeDocOptions.length).equal(2)
    // set type value
    await typeDocOptions.at(1).setSelected();
    // wait until dom updated
    await flushPromises();
    // the value of form element must be equal
    expect(paper.element.value).toBe(varPaper);
    expect(diserahkan.element.value).toBe(varDiserahkan);
    expect(penerima.element.value).toBe(varPenerima);
    // expect the select element
    expect(wrapper.find('option:checked')).toBe(typeDocOptions[1]);

    // fill the product componet 3x
    // all product in list must be equal
  });
  // click submit button
  // the stock master state length must be equal 3
  // the incoming state length must be equal 1
});
