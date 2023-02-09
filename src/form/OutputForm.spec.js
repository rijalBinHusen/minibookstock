import { describe, expect, it } from 'vitest';
import OutputForm from './OutputForm.vue';
import { faker } from '@faker-js/faker';
import { useJurnalProdukKeluar } from '../composables/Setting_JurnalId';
import {
  createItem,
  getItemById,
  gettingStartedRecord as getItems,
} from '../composables/MasterItems';
import { createStock, getStockById } from '../composables/StockMaster';
import { createStore } from 'vuex';
import { flushPromises, mount } from '@vue/test-utils';

// create value for mocking jurnal produk keluar
describe('Create new record for stock keluar', () => {
  // create jurnal
  it('Should create new rercord for jurnal produk keluar', async () => {
    // mocking string for jurnal produk keluar
    const jurnalName = faker.datatype.string(10);
    const jurnalName2 = faker.datatype.string(12);
    // initiate func
    const jurnalProdKeluar = useJurnalProdukKeluar();
    // create new record
    await jurnalProdKeluar.createJurnalProdukKeluar(jurnalName);
    await jurnalProdKeluar.createJurnalProdukKeluar(jurnalName2);
    // check state
    expect(jurnalProdKeluar.Jurnal_produk_keluar.value.length).equal(2);
    // state [0] must equal jurnalName
    expect(jurnalProdKeluar.Jurnal_produk_keluar.value[1].nama_jurnal).equal(
      jurnalName
    );
  });
  let masterItemId = null;
  // create new item
  it('Should create new record for master item', async () => {
    // fake data for input
    const kdItem = faker.datatype.string(12);
    const nmItem = faker.datatype.string(10);
    const ageItem = 7;
    // create new item
    const newItemReturned = await createItem(
      kdItem,
      nmItem,
      false,
      false,
      ageItem
    );
    // set
    masterItemId = newItemReturned;
    // get daata
    const getData = await getItemById(newItemReturned);
    // must be equal
    expect(getData.kd_item).equal(kdItem);
  });
  let stockMasterId = null;
  const stockQty = faker.datatype.number({ min: 100 });
  // create stock
  it('Should create new master stock', async () => {
    // waiting proses create item and write to indexeddb
    const newItemIdReturned = await createStock(
      masterItemId,
      '120938',
      '10-29381-23',
      stockQty
    );
    // expecting the returned id not equal to false
    expect(newItemIdReturned).not.equal(false);
    // push to up
    stockMasterId = newItemIdReturned.id;
    // get stock by id
    const getData = await getStockById(stockMasterId);
    // expect qty
    expect(getData?.quantity).equal(stockQty);
  });
  // working with component
  it('Create new Output qty', async () => {
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
    const wrapper = mount(OutputForm, {
      global: {
        plugins: [store],
      },
    });
    // get jrnl produ kmasuk
    await useJurnalProdukKeluar().gettingJurnalProdukKeluarRecord();
    await getItems();
    await flushPromises();
    // catch form
    const datePicker = wrapper.find('#date-picker-output');
    const salesOrder = wrapper.find('#input-sales-order');
    const customer = wrapper.find('#form-customer');
    const typeDoc = wrapper.find('#type');
    // expect form exists
    expect(datePicker.exists()).equal(true);
    expect(salesOrder.exists()).equal(true);
    expect(customer.exists()).equal(true);
    expect(typeDoc.exists()).equal(true);

    // fill the form
    const varSalesOrder = faker.datatype.string(10);
    const varCustomer = faker.datatype.string(12);
    salesOrder.setValue(varSalesOrder);
    salesOrder.trigger('keyup.alt');
    customer.setValue(varCustomer);
    customer.trigger('keyup.alt');
    // fill type doc form
    const typeDocOptions = typeDoc.findAll('option');
    // typedocoption must be 3, included null option
    expect(typeDocOptions.length).equal(3);
    // set selected
    await typeDocOptions.at(1).setSelected();
    // await dom updated
    await flushPromises();
    // FORM TO ADD OR remove item
    const itemInput = wrapper.find('#input-item-output');
    const items = wrapper.find('#item').findAll('option');
    itemInput.setValue(items[0].element.value);
    itemInput.trigger('keyup.alt');
    // waiting dom updated
    await flushPromises();
    const itemDateProduct = wrapper.find('#tanggal-produksi');
    const itemDates = itemDateProduct.findAll('option');
    await itemDates.at(1).setSelected();
    await flushPromises();

    const itemQtyOutput = wrapper.find('#quantity');
    const maxQtyElm = wrapper.find('#max-quantity');
    const maxQty = maxQtyElm.element.innerHTML.replace(/[^\d]/g, '');
    const outputQty = faker.datatype.number({ max: Number(maxQty) });
    itemQtyOutput.setValue(outputQty);
    itemQtyOutput.trigger('keypup.alt');
    await flushPromises();

    const itemSubmit = wrapper.find('#button-add-item');
    await itemSubmit.trigger('click');
    // waiting until item component finished submit the product
    await new Promise((res) => {
      setTimeout(() => {
        res();
      }, 3000);
    });
    // waiting dom updated
    await flushPromises();

    // expect form must be empty after submit
    expect(itemInput.element.value).equal('');
    const itemDateProductAfterSubmit = wrapper.find('#tanggal-produksi');
    expect(itemDateProductAfterSubmit.exists()).equal(false);
    const itemQtyOutputAfterSubmit = wrapper.find('#quantity');
    expect(itemQtyOutputAfterSubmit.exists()).equal(false);

    // const qtyStockRemaining = Number(maxQty) - outputQty

    // //
  });
}, 20000);
