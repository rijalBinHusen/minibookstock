import { flushPromises, mount } from '@vue/test-utils';
import { faker } from '@faker-js/faker';
import { describe, it, expect, beforeEach, test } from 'vitest';
import { useJurnalProdukMasuk } from '@/pages/Settings/Setting_JurnalId';
import SelectTypeDocument from './SelectTypeDocument.vue';

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

test('Set selected element', async () => {
  const wrapper = mount(SelectTypeDocument, {
    props: {
      jurnal: 'masuk',
    },
  });
  // get all jrnl first
  const jrnl = useJurnalProdukMasuk();
  await jrnl.gettingJurnalProdukMasukRecord();
  // get all option
  const options = wrapper.find('select').findAll('option');
  // set option
  await options.at(1).setSelected();
  // the option sshould equal to
  expect(wrapper.find('option:checked').element.value).toBe(
    jrnl.Jurnal_produk_masuk.value[0]?.id
  );
});
