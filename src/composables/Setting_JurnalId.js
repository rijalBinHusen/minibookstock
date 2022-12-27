import { summary } from "../utils/summaryIdb";
import { ref } from "vue";
// store name
const store = "jurnal_prduk_masuk";
// // create an instance
// generator id
import { generateId } from "../utils/GeneratorId";
// // import { dayPlusOrMinus } from "../utils/dateFormat";

const saveData = () => {
  localStorage.setItem(store, JSON.stringify(Jurnal_produk_masuk.value))
}

// the state
export const Jurnal_produk_masuk = ref([]);

export const createJurnalProdukMasuk = async (nama_jurnal) => {
  // get last id
  const summaryRecord = await summary(store);
  // generate next id
  const nextId = summaryRecord?.lastUpdated
    ? generateId(summaryRecord?.lastUpdated?.lastId)
    : generateId("j_income_22030000");
  // initiate new record
  const record = {
    id: nextId,
    nama_jurnal
  };
  // // push to state
  Jurnal_produk_masuk.value.unshift(record);
  // // update summary
  // await summary.updateSummary(nextId);
  await summaryRecord.updateSummary(nextId);
  // // insert into localstorage
  saveData()

  return nextId;
};

export const gettingStartedRecord = async () => {
  // dapatkan last used < 1 minggu
  if (!Jurnal_produk_masuk.value.length) {
    // get item
    const item = localStorage.getItem(store)
    Jurnal_produk_masuk.value = item ? JSON.parse(item) : [] ;
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
  const findRecord = Jurnal_produk_masuk.value.find((id) => id == id)
  // console.log(res[0]);
  return findRecord
    ? findRecord
    : {
        id: "Not found",
        nama_jurnal: "Not found",
      };
};

export const updateJurnalProdukMasukById = async (id, keyValueToUpdate) => {
  Jurnal_produk_masuk.value = Jurnal_produk_masuk.value.map((jurnal) => {
    return jurnal?.id == id ? { ...jurnal, ...keyValueToUpdate } : jurnal;
  });
  saveData()
  return;
};
