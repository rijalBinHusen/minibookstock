import { summary } from "../utils/summaryIdb";
import { ref } from "vue";
// // create an instance
// generator id
import { generateId } from "../utils/GeneratorId";
// // import { dayPlusOrMinus } from "../utils/dateFormat";

export const useJurnalProdukMasuk = () => {
  // store name
  const store = "jurnal_prduk_masuk";
  // the state
  const Jurnal_produk_masuk = ref([]);
  // create jurnal
  const createJurnalProdukMasuk = async (nama_jurnal) => {
    // get last id
    const summaryRecord = await summary(store);
    // generate next id
    const nextId = summaryRecord?.lastUpdated
      ? generateId(summaryRecord?.lastUpdated?.lastId)
      : generateId("j_income_22030000");
    // initiate new record
    const record = {
      id: nextId,
      nama_jurnal,
    };
    // // push to state
    Jurnal_produk_masuk.value.unshift(record);
    // // update summary
    // await summary.updateSummary(nextId);
    await summaryRecord.updateSummary(nextId);
    // // insert into localstorage
    saveData();

    return nextId;
  };
  // get jurnal produk masuk
  const gettingJurnalProdukMasukRecord = async () => {
    // dapatkan last used < 1 minggu
    if (!Jurnal_produk_masuk.value.length) {
      // get item
      const item = localStorage.getItem(store);
      Jurnal_produk_masuk.value = item ? JSON.parse(item) : [];
    }
  };

  const getJurnalProdukMasukById = (id) => {
    gettingJurnalProdukMasukRecord();
    const findRecord = Jurnal_produk_masuk.value.find((rec) => rec?.id == id);
    // console.log(findRecord)
    return findRecord
      ? findRecord
      : {
          id: "Not found",
          nama_jurnal: "Not found",
        };
  };

  const updateJurnalProdukMasukById = async (id, keyValueToUpdate) => {
    Jurnal_produk_masuk.value = Jurnal_produk_masuk.value.map((jurnal) => {
      return jurnal?.id == id ? { ...jurnal, ...keyValueToUpdate } : jurnal;
    });
    saveData();
    return;
  };
  const saveData = () => {
    localStorage.setItem(store, JSON.stringify(Jurnal_produk_masuk.value));
  };

  return {
    Jurnal_produk_masuk,
    createJurnalProdukMasuk,
    getJurnalProdukMasukById,
    updateJurnalProdukMasukById,
    gettingJurnalProdukMasukRecord,
  };
};

export const useJurnalProdukKeluar = () => {
  // store name
  const store = "jurnal_prduk_keluar";
  // the state
  const Jurnal_produk_keluar = ref([]);
  // create jurnal
  const createJurnalProdukKeluar = async (nama_jurnal) => {
    // get last id
    const summaryRecord = await summary(store);
    // generate next id
    const nextId = summaryRecord?.lastUpdated
      ? generateId(summaryRecord?.lastUpdated?.lastId)
      : generateId("j_output_22030000");
    // initiate new record
    const record = {
      id: nextId,
      nama_jurnal,
    };
    // // push to state
    Jurnal_produk_keluar.value.unshift(record);
    // // update summary
    // await summary.updateSummary(nextId);
    await summaryRecord.updateSummary(nextId);
    // // insert into localstorage
    saveData();

    return nextId;
  };
  // get jurnal produk masuk
  const gettingJurnalProdukKeluarRecord = async () => {
    // dapatkan last used < 1 minggu
    if (!Jurnal_produk_keluar.value.length) {
      // get item
      const item = localStorage.getItem(store);
      Jurnal_produk_keluar.value = item ? JSON.parse(item) : [];
    }
  };

  const getJurnalProdukKeluarById = (id) => {
    gettingJurnalProdukKeluarRecord();
    const findRecord = Jurnal_produk_keluar.value.find((rec) => rec?.id == id);
    // console.log(findRecord)
    return findRecord
      ? findRecord
      : {
          id: "Not found",
          nama_jurnal: "Not found",
        };
  };

  const updateJurnalProdukKeluarById = async (id, keyValueToUpdate) => {
    Jurnal_produk_keluar.value = Jurnal_produk_keluar.value.map((jurnal) => {
      return jurnal?.id == id ? { ...jurnal, ...keyValueToUpdate } : jurnal;
    });
    saveData();
    return;
  };
  const saveData = () => {
    localStorage.setItem(store, JSON.stringify(Jurnal_produk_keluar.value));
  };

  return {
    Jurnal_produk_keluar,
    createJurnalProdukKeluar,
    getJurnalProdukKeluarById,
    updateJurnalProdukKeluarById,
    gettingJurnalProdukKeluarRecord,
  };
};
