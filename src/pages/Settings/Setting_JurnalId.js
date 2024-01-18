import { ref } from "vue";
// import localforage function
import { useIdb } from "../../utils/localforage"

export const useJurnalProdukMasuk = () => {
  // store name
  const store = "jurnal_prduk_masuk";
  // the state
  const Jurnal_produk_masuk = ref([]);
  // create jurnal
  const createJurnalProdukMasuk = async (nama_jurnal) => {
    // initiate store
    const incomejurnaldb = await useIdb(store)// get last id
    // initiate new record
    const record = { nama_jurnal };
    // insert into indexeddb
    const recordInserted = await incomejurnaldb.createItem(record)
    // // push to state
    Jurnal_produk_masuk.value.unshift(recordInserted);

    return recordInserted?.id;
  };
  // get jurnal produk masuk
  const gettingJurnalProdukMasukRecord = async () => {
    // initiate store
    const incomejurnaldb = await useIdb(store)
    // dapatkan last used < 1 minggu
    if (!Jurnal_produk_masuk.value.length) {
      // get item
      const item = await incomejurnaldb.getItems();
      Jurnal_produk_masuk.value = item ? item : [];
    }
  };

  const getJurnalProdukMasukById = async (id) => {
    // initiate store
    const incomejurnaldb = await useIdb(store)
    const findRecord = await incomejurnaldb.getItem(id)
    // console.log(findRecord)
    return findRecord
      ? findRecord
      : {
          id: "Not found",
          nama_jurnal: "Not found",
        };
  };

  const updateJurnalProdukMasukById = async (id, keyValueToUpdate) => {
    // initiate store
    const incomejurnaldb = await useIdb(store)
    // update in state
    Jurnal_produk_masuk.value = Jurnal_produk_masuk.value.map((jurnal) => {
      return jurnal?.id == id ? { ...jurnal, ...keyValueToUpdate } : jurnal;
    });
    // update in db
    await incomejurnaldb.updateItem(id, keyValueToUpdate)

    return;
  };

  const getAllDataToBackup = async () => {
    // initiate store
    const incomejurnaldb = await useIdb(store)
    // get all data
    const allData = await incomejurnaldb.getItems()
    // return the result
    return { store, data: allData ? allData : null }
  }

  return {
    Jurnal_produk_masuk,
    createJurnalProdukMasuk,
    getJurnalProdukMasukById,
    updateJurnalProdukMasukById,
    gettingJurnalProdukMasukRecord,
    getAllDataToBackup
  };
};

export const useJurnalProdukKeluar = () => {
  // store name
  const store = "jurnal_prduk_keluar";
  // the state
  const Jurnal_produk_keluar = ref([]);
  // create jurnal
  const createJurnalProdukKeluar = async (nama_jurnal) => {
    // initiate store
    const outjurnaldb = await useIdb(store)
    // initiate new record
    const record = { nama_jurnal };
    // insert to idb
    const recordInserted = await outjurnaldb.createItem(record)
    // // push to state
    Jurnal_produk_keluar.value.unshift(recordInserted);

    return recordInserted?.id;
  };
  // get jurnal produk masuk
  const gettingJurnalProdukKeluarRecord = async () => {
    // initiate store
    const outjurnaldb = await useIdb(store)
    // dapatkan last used < 1 minggu
    if (!Jurnal_produk_keluar.value.length) {
      // get item
      // const item = localStorage.getItem(store);
      const item = await outjurnaldb.getItems();
      Jurnal_produk_keluar.value = item ? item : [];
    }
  };

  const getJurnalProdukKeluarById = async (id) => {
    // initiate store
    const outjurnaldb = await useIdb(store)
    const findRecord = await outjurnaldb.getItem(id)
    // console.log(findRecord)
    return findRecord
      ? findRecord
      : {
          id: "Not found",
          nama_jurnal: "Not found",
        };
  };

  const updateJurnalProdukKeluarById = async (id, keyValueToUpdate) => {
    // initiate store
    const outjurnaldb = await useIdb(store)
    // update state
    Jurnal_produk_keluar.value = Jurnal_produk_keluar.value.map((jurnal) => {
      return jurnal?.id == id ? { ...jurnal, ...keyValueToUpdate } : jurnal;
    });
    // update db
    await outjurnaldb.updateItem(id, keyValueToUpdate);
    // saveData();
    return;
  };
  
  const getAllDataToBackup = async () => {
    // initiate store
    const outjurnaldb = await useIdb(store)
    // get all data
    const allData = await outjurnaldb.getItems()
    // return the result
    return { store, data: allData ? allData : null }
  }

  return {
    Jurnal_produk_keluar,
    createJurnalProdukKeluar,
    getJurnalProdukKeluarById,
    updateJurnalProdukKeluarById,
    gettingJurnalProdukKeluarRecord,
    getAllDataToBackup
  };
};
