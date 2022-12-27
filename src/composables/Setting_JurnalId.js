import { idb } from "../utils/localbase";
import { summary } from "../utils/summaryIdb";
import { ref } from "vue";
// store name
const store = "jurnal_prduk_masuk";
// // create an instance
const dbjurnals = async () => await idb(store);
// generator id
import { generateId } from "../utils/GeneratorId";
// // import { dayPlusOrMinus } from "../utils/dateFormat";

// the state
export const Jurnal_produk_masuk = ref([]);

export const createJurnalProdukMasuk = async (nama_jurnal) => {
  // get last id
  const lastRecord = await summary(store);
  // generate next id
  const nextId = lastRecord?.lastUpdated
    ? generateId(lastRecord?.lastUpdated?.lastId)
    : generateId("j_income_22030000");
  // initiate new record
  const record = {
    id: nextId,
    nama_jurnal
  };
  // // insert into indexeddb
  await dbjurnals.setData(nextId, record);
  // // update summary
  // await summary.updateSummary(nextId);
  lastRecord.updateSummary(nextId);
  // // push to state
  Jurnal_produk_masuk.value.unshift(record);

  return nextId;
};

export const gettingStartedRecord = async () => {
  // dapatkan last used < 1 minggu
  if (!Jurnal_produk_masuk.value.length) {
    Jurnal_produk_masuk.value = await dbjurnals.getAllDataOrderByIdDesc();
  }
};

// // // export const removeVehicle = async (id) => {
// // //   const res = await removeRecord(table, "id", id);
// // //   if (res) {
// // //     Jurnal_produk_masuk.value = Jurnal_produk_masuk.value.filter((veh) => veh.id !== id);
// // //   }
// // //   return;
// // // };

// // // export const
// // export const getLastRecord = async () => {
// //   const lastRec = await getRecordOrderByIdDescLimit(table, 1);
// //   return lastRec[0];
// // };

export const getJurnalProdukMasukById = async (id) => {
  const res = await dbjurnals.getdataByKey(id);
  // console.log(res[0]);
  return res
    ? res
    : {
        id: "Not found",
        nama_jurnal: "Not found",
      };
};

export const updateJurnalProdukMasukById = async (id, keyValueToUpdate) => {
  await dbjurnals.updateDataById(id, keyValueToUpdate);
  Jurnal_produk_masuk.value = Jurnal_produk_masuk.value.map((jurnal) => {
    return jurnal?.id == id ? { ...jurnal, ...keyValueToUpdate } : jurnal;
  });
  return;
};
