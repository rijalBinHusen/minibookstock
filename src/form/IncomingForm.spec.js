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
  gettingStartedRecord as getAllItems,
} from '../composables/MasterItems';
import IncomingForm from './IncomingForm.vue';
import { createStore } from 'vuex';

// create value for mocking jurnal produk masuk
describe('create new record stock income', () => {
  it('Should create new record produk masuk', async () => {
    const jurnalName = faker.datatype.string(12);
    const jurnalName2 = faker.datatype.string(13);
    // initiate func
    const jurnalProdukMasuk = useJurnalProdukMasuk();
    // waiting proses create record and write to indexeddb
    // const newItemIdReturned =
    await jurnalProdukMasuk.createJurnalProdukMasuk(jurnalName);
    await jurnalProdukMasuk.createJurnalProdukMasuk(jurnalName2);
    // check state
    expect(jurnalProdukMasuk.Jurnal_produk_masuk.value.length).equal(2);
    // state [0] must be equal jurnalName
    expect(jurnalProdukMasuk.Jurnal_produk_masuk.value[0]?.nama_jurnal).equal(
      jurnalName2
    );
  });
  // create value for mocking master item
  it('Should create new master item item', async () => {
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

  it('Create new incoming product', async () => {
    // Mocking the vuex store
    const store = createStore({
      state() {
        return {
          form: null,
          dialogMessage: null,
          dialogType: null,
        };
      },
    });
    // mount the component with the vuex store as plugins
    const wrapper = mount(IncomingForm, {
      global: {
        plugins: [store],
      },
    });
    // getting all jurnal produk masuk first
    const jrnl = useJurnalProdukMasuk();
    await jrnl.gettingJurnalProdukMasukRecord();
    // get all item in database
    await getAllItems();
    // expect master item state mustbe not 0
    expect(Master_items.value.length).not.equal(0);

    // await dom updated
    await flushPromises();
    // catch all form element
    const datePicker = wrapper.find('#date-picker-incoming');
    const shift = wrapper.find('#shift');
    const typeDoc = wrapper.find('#type');
    const paper = wrapper.find('#form-paper-id');
    const diserahkan = wrapper.find('#form-diserahkan');
    const penerima = wrapper.find('#form-penerima');
    const submit = wrapper.find('#submit-incoming');
    const productCrud = wrapper.find('#stock_master');
    // incoming product crud form
    const formQty = wrapper.find('#form-input-incoming-quantity');
    const formItem = wrapper.find('#form-input-incoming-item');
    const formKdProd = wrapper.find('#form-input-incoming-kd-produksi');
    const formSubmitProd = wrapper.find('#submit-incoming-item');
    // });
    // await new Promise((res) => {
    //   setTimeout(() => {
    //     res();
    //   }, 4000);
    // });
    // detecting all form element must be exists
    expect(datePicker.exists()).toBe(true);
    expect(shift.exists()).toBe(true);
    expect(typeDoc.exists()).toBe(true);
    expect(paper.exists()).toBe(true);
    expect(diserahkan.exists()).toBe(true);
    expect(penerima.exists()).toBe(true);
    expect(submit.exists()).toBe(true);
    expect(productCrud.exists()).toBe(true);
    expect(formQty.exists()).toBe(true);
    expect(formKdProd.exists()).toBe(true);
    expect(formSubmitProd.exists()).toBe(true);
    expect(formItem.exists()).toBe(true);
    // the length of state jurnal produk masuk length must be 2
    expect(jrnl.Jurnal_produk_masuk.value.length).toBe(2);

    // variable to insert to form
    const varPaper = faker.datatype.string(30);
    const varDiserahkan = faker.datatype.string(30);
    const varPenerima = faker.datatype.string(30);
    // fill all form element
    // set paper and trigger keyup so the variable setted to ref variable
    paper.setValue(varPaper);
    paper.trigger('keyup.alt');
    // fill diserahkan and trigger keyup so the variable setted to ref variable
    diserahkan.setValue(varDiserahkan);
    diserahkan.trigger('keyup.alt');
    // fill paper and trigger keyup so the variable setted to ref variable
    penerima.setValue(varPenerima);
    const typeDocOptions = wrapper.find('#type').findAll('option');

    // expect the option must be 3, with the null option
    expect(typeDocOptions.length).equal(3);
    // set type value
    await typeDocOptions.at(1).setSelected();
    // wait until dom updated
    await flushPromises();
    // the value of form element must be equal
    expect(paper.element.value).toBe(varPaper);
    expect(diserahkan.element.value).toBe(varDiserahkan);
    expect(penerima.element.value).toBe(varPenerima);
    // expect the select element
    expect(typeDoc.find('option:checked').element.value).toBe(
      jrnl.Jurnal_produk_masuk.value[0]?.id
    );

    // variable to input item
    const varQty = faker.datatype.number({ min: 10 }) + '';
    const varKdProd = faker.datatype.string(6);

    // create new product incoming
    // fill the form
    // get all option of item
    const items = wrapper.find('#item').findAll('option');
    // console.log(items);
    // fill the item from and trigger key up
    // console.log(items[0].element.value);
    const varItem = items[0].element.value;
    formItem.setValue(varItem);
    await formItem.trigger('keyup.alt');

    // waiting until the component set the item
    await new Promise((res) => {
      setTimeout(() => {
        res();
      }, 5000);
    });
    // waiting until dom updated
    await flushPromises();
    // fill the quantity form and trigger key up
    formQty.setValue(varQty);
    formQty.trigger('keyup.alt');
    // fill kode produksi form and trigger key up
    formKdProd.setValue(varKdProd);
    formKdProd.trigger('keyup.alt');
    // all product in list must be equal
    expect(formItem.element.value).equal(varItem);
    expect(formKdProd.element.value).equal(varKdProd);
    expect(formQty.element.value).equal(varQty);
    // trigger submit
    await formSubmitProd.trigger('click');
    // waiting until item component finished submit the product
    await new Promise((res) => {
      setTimeout(() => {
        res();
      }, 5000);
    });
    // wait until dom updated
    await flushPromises();
    // detect form must be null
    expect(formItem.element.value).equal('');
  });
  // click submit button
  // the stock master state length must be equal 3
  // the incoming state length must be equal 1
}, 20000);
