import { summary } from '../../utils/summaryIdb';
import { ref } from 'vue';
// import { getItemById } from "./MasterItems";
import { ymdTime, ddmmyyyy } from '../../utils/dateFormat';
// store name
const store = 'vehicles';
// generator id
import { generateId } from '../../utils/GeneratorId';
// import set parent function for stock master
import { setStockParent, getStockById } from '../../composables/StockMaster';
// master item function
import { getItemById } from './MasterItems';
// import localforage function
import { useIdb } from '../../utils/localforage';
// import typep jurnal
import { useJurnalProdukMasuk } from './Setting_JurnalId';

// the state
export const vehicles = ref([]);

export const dateRecordToShow = ref(new Date());

/**
 *
  Table vehicles {
  id string
  no_do string
  no_so string
  register number
  start number
  finished number
  plat_no string
  customer string
  output_transaction_ids string
}
 */

class Vehicle {
  constructor(
    id,
    tanggal,
    shift,
    nomor_do,
    nomor_so,
    register,
    start,
    finished,
    plat_no,
    customer
  ) {
    this.id = id;
    this.nomor_do = nomor_do;
    this.nomor_so = nomor_so;
    this.register = register;
    this.start = start;
    this.finished = finished;
    this.plat_no = plat_no;
    this.customer = customer;
    this.tanggal = tanggal;
    this.shift = shift;
  }
}

class Vechicles {
  #state = [];
  #db = useIdb('vehilces');
  constructor() {}

  async createVehicle(
    tanggal,
    shift,
    nomor_do,
    nomor_so,
    register,
    start,
    finished,
    plat_no,
    customer
  ) {
    if (
      !nomor_do &&
      !nomor_so &&
      !register &&
      !start &&
      !finished &&
      !plat_no &&
      !customer &&
      !tanggal &&
      !shift
    ) {
      return false;
    }
    const newRec = await this.#db.createItem({
      tanggal,
      shift,
      nomor_do,
      register,
      start,
      finished,
      plat_no,
      customer,
    });
    if (newRec) {
      this.#state.push(
        new Vehicle(
          newRec?.id,
          tanggal,
          shift,
          nomor_do,
          nomor_so,
          register,
          start,
          finished,
          plat_no,
          customer
        )
      );
    }
  }
}

export const createVehilces = async (
  output_transaction_ids,
  nomor_do,
  nomor_so,
  register,
  start,
  finished,
  plat_no,
  customer
) => {
  // initiate idb
  const db = await useIdb(store);
  // get last id
  const summaryRecord = await summary(store);
  // generate next id
  const nextId = summaryRecord?.lastUpdated
    ? generateId(summaryRecord?.lastUpdated?.lastId)
    : generateId('VEHICLE_TR22030000');
  // initiate new record
  const record = {
    created: new Date().getTime(),
    id: nextId,
    output_transaction_ids,
    nomor_do,
    nomor_so,
    register,
    start,
    finished,
    plat_no,
    customer,
  };
  // // push to state
  vehicles.value.unshift(record);
  // // update summary
  await summaryRecord.updateSummary(nextId);
  // // save tolocalstorage
  // saveData();
  // save to indexeddb
  await db.setItem(nextId, record);
  // set vehicle id for each stock output
  //   stock_master_ids.forEach((stockId) => {
  //     setStockParent(stockId, nextId);
  //   });
  // return the whole record
  return record;
};

// export const gettingStartedRecord = async () => {
//   // dapatkan last used
//   if (!vehicles.value.length) {
//     // initiate idb
//     const db = await useIdb(store);
//     // get all item
//     const item = await db.getItems();
//     vehicles.value = item ? item : [];
//   }
//   return;
// };

export const removeVehicleById = async (id) => {
  // initiate idb
  const db = await useIdb(store);
  // remove from state
  vehicles.value = vehicles.value.filter((rec) => rec.id !== id);
  // saveData();
  // remove from indexeddb
  await db.removeItem(id);
  return;
};

export const getVehicleById = async (id) => {
  // initiate idb
  const db = await useIdb(store);
  // find stock
  const findVehicle = await db.getItem(id);
  return findVehicle
    ? findVehicle
    : {
        nomor_do: 'Not found',
        nomor_so: 'Not found',
        register: 'Not found',
        start: 'Not found',
        finished: 'Not found',
        plat_no: 'Not found',
        customer: 'Not found',
      };
};

export const updateVehicleById = async (id, keyValueToUpdate) => {
  // initiate idb
  const db = await useIdb(store);
  // update the state
  vehicles.value = vehicles.value.map((item) => {
    return item?.id == id ? { ...item, ...keyValueToUpdate } : item;
  });
  // update in idb
  db.updateItem(id, keyValueToUpdate);
  // saveData();
  return;
};

// export const incomingTransactionMapped = async () => {
//   const result = [];
//   // if the state null
//   if (!vehicles.value || !vehicles.value.length) {
//     return result;
//   }
//   // map all state
//   for (const income of vehicles.value) {
//     // map stock master by stock master ids
//     for (const id of income?.stock_master_ids) {
//       // get stock master by id
//       const stockMaster = await getStockById(id);
//       // get nm_item from based on stockMaster.item_id
//       const item = await getItemById(stockMaster?.item_id);
//       result.push({
//         id: income?.id,
//         tanggal: ddmmyyyy(income?.tanggal, "-"),
//         shift: income?.shift,
//         paper_id: income?.paper_id,
//         nm_item: item?.nm_item,
//         quantity: stockMaster?.quantity,
//         available: stockMaster?.available,
//         product_created: ddmmyyyy(stockMaster?.product_created, "-"),
//       });
//     }
//   }
//   return result;
// };

export const getAllDataToBackup = async () => {
  // initiate idb
  const db = await useIdb(store);
  // get all data
  const allData = await db.getItems();
  // return the result
  return { store, data: allData ? allData : null };
};

export const getRecordByDate = async () => {
  // initiate idb
  const db = await useIdb(store);
  // get income by date
  vehicles.value = await db.getItemsByKeyValue(
    'tanggal',
    ymdTime(dateRecordToShow.value)
  );
  // return
  return;
};

// export const mapIncomingTransactionWoutItem = async () => {
//   const result = [];
//   // if the state null
//   if (!vehicles.value || !vehicles.value.length) {
//     return result;
//   }
//   // use jurnal produk masuk
//   const { getJurnalProdukMasukById } = useJurnalProdukMasuk();
//   // map all state
//   for (const income of vehicles.value) {
//     // get name jurnal
//     const jurnal = await getJurnalProdukMasukById(income?.type);
//     // push it
//     result.push({
//       id: income?.id,
//       tanggal: ddmmyyyy(income?.tanggal, "-"),
//       shift: income?.shift,
//       type: jurnal.nama_jurnal,
//       paper_id: income?.paper_id,
//     });
//   }
//   return result;
// };
