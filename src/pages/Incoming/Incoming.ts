import { ref } from 'vue';
// import { getItemById } from "./MasterItems";
import { ymdTime, ddmmyyyy } from '../../utils/dateFormat';
// import set parent function for stock master
import { setStockParent, getStockById } from '../StockMasters/StockMaster';
// master item function
import { Items } from '../MasterItems/MasterItems';
const { getItemById } = Items();
// import localforage function
import { useIdb } from '../../utils/localforage';
// import typep jurnal
import { useJurnalProdukMasuk } from '../Settings/Setting_JurnalId';
// output
import { getTotalStockTaken } from '../Output/Output';
import { loaderMessage } from '../../utils/launchForm';

// the state
export const Incoming_transaction = ref(<IncomingClass[]>[]);

export const dateRecordToShow = ref(new Date());
// store name
export const store = 'incoming_transaction';

const incomedb = useIdb(store)

interface Incoming {
  id: string;
  stock_master_ids: string[];
  paper_id: string;
  tanggal: number
  shift: number;
  diterima: string;
  type: string;
  diserahkan: string;
  catatan: string;
}

class IncomingClass implements Incoming {
  id: string;
  stock_master_ids: string[];
  paper_id: string;
  tanggal: number;
  shift: number;
  diterima: string;
  type: string;
  diserahkan: string;
  catatan: string;

  constructor (id: string, stock_master_ids: string[], paper_id: string, tanggal: number, shift: number, diterima: string, type: string, diserahkan: string, catatan: string) {
    this.id = id;
    this.stock_master_ids = stock_master_ids;
    this.paper_id = paper_id;
    this.tanggal = ymdTime(tanggal);
    this.shift = shift;
    this.diterima = diterima;
    this.type = type
    this.diserahkan = diserahkan
    this.catatan = catatan
  }

  async updateRecord(stock_master_ids: string[], paper_id: string, tanggal: number, shift: number, diterima: string, type: string, diserahkan: string, catatan: string) {
    const keyValueToUpdate = <Incoming>{}
    if(stock_master_ids) {
      // lenght changed
      if(stock_master_ids.length !== this.stock_master_ids.length) {
        keyValueToUpdate.stock_master_ids = stock_master_ids
        this.stock_master_ids = stock_master_ids
      }
      // [1,2,3,4,5] !== [1,2,3,4,6], same length but not same content
      else if(!this.stock_master_ids.every(elm => stock_master_ids.includes(elm))) {
        keyValueToUpdate.stock_master_ids = stock_master_ids
        this.stock_master_ids = stock_master_ids
      }
    }

    if(paper_id && this.paper_id !== paper_id) {
      this.paper_id = paper_id
      keyValueToUpdate.paper_id = paper_id
    }

    if(tanggal && this.tanggal !== tanggal) {
      keyValueToUpdate.tanggal = ymdTime(tanggal)
      this.tanggal = ymdTime(tanggal)
    }

    if(shift && this.shift !== shift) {
      keyValueToUpdate.shift = shift
      this.shift = shift
    }

    if(diterima && this.diterima !== diterima) {
      keyValueToUpdate.diterima = diterima
      this.diterima = diterima
    }

    if(type && this.type !== type) {
      keyValueToUpdate.type = type
      this.type = type
    }

    if(diserahkan && this.diserahkan !== diserahkan) {
      keyValueToUpdate.diserahkan = diserahkan
      this.diserahkan = diserahkan
    }

    if(catatan && this.catatan !== catatan) {
      keyValueToUpdate.catatan = catatan
      this.catatan = catatan
    }
    await incomedb.updateItem(this.id, keyValueToUpdate);
    return;
  }
}
/**
 *
  id string [pk]
  stock_master_ids string
  paper_id string
  tanggal date
  shift number
  diterima string
  type string
  diserahkan string
  catatan string
 */

export const createIncoming = async (
  stock_master_ids: string[],
  paper_id: string,
  tanggal: number,
  shift: number,
  diterima: string,
  type: string,
  diserahkan: string,
  catatan: string
): Promise<string|null> => {
  // initiate new record
  const record = {
    stock_master_ids,
    paper_id,
    tanggal: ymdTime(tanggal),
    shift,
    diterima,
    type,
    diserahkan,
    catatan,
  };
  // save to indexeddb
  const recordInserted = await incomedb.createItem(record);
  if(recordInserted) {
    // // push to state
    Incoming_transaction.value.unshift(new IncomingClass(recordInserted?.id, stock_master_ids, paper_id, tanggal, shift, diterima, type, diserahkan, catatan));
    // set parent for each stock master
    stock_master_ids.forEach((stockId) => {
      setStockParent(stockId, recordInserted?.id);
    });
    // return the whole record
    return recordInserted.id;
  }
};

export const gettingStartedRecord = async (): Promise<void> => {
  // dapatkan last used
  if (!Incoming_transaction.value.length) {
    // initiate idb
    const incomedb = useIdb(store);
    // get all item
    const items = await incomedb.getItems() as Incoming[] | null;
    if(items) {
      Incoming_transaction.value = items.map((item) => new IncomingClass(item.id, item.stock_master_ids, item.paper_id, item.tanggal, item.shift, item.diterima, item.type, item.diserahkan, item.catatan))
    }
  }
  return;
};

export const removeIncomingById = async (id: string): Promise<void> => {
  // initiate idb
  const incomedb = useIdb(store);
  // remove from state
  Incoming_transaction.value = Incoming_transaction.value.filter(
    (rec) => rec.id !== id
  );
  // saveData();
  // remove from indexeddb
  await incomedb.removeItem(id);
  return;
};

// // // export const
// // export const getLastRecord = async () => {
// //   const lastRec = await getRecordOrderByIdDescLimit(table, 1);
// //   return lastRec[0];
// // };

export const getIncomingById = async (id: string):Promise<IncomingClass|null> => {
  if (id) {
    const findRecord = await incomedb.getItem(id) as Incoming|null;
    if(findRecord) {
      const findIncome = new IncomingClass(
        findRecord?.id, 
        findRecord?.stock_master_ids, 
        findRecord?.paper_id, 
        findRecord?.tanggal, 
        findRecord?.shift, 
        findRecord?.diterima, 
        findRecord?.type, 
        findRecord?.diserahkan, 
        findRecord?.catatan
      )
      return findIncome
    }
  }

  return null
};

export const updateIncomingById = async (id: string,
  stock_master_ids: string[],
  paper_id: string,
  tanggal: number,
  shift: number,
  diterima: string,
  type: string,
  diserahkan: string,
  catatan: string): Promise<boolean> => {

  const findRec: IncomingClass|null = Incoming_transaction.value.find( (rec) => rec?.id === id);

  if (findRec) {
    await findRec.updateRecord(stock_master_ids, paper_id, tanggal, shift, diterima, type, diserahkan, catatan)
    return true;
  }

  const item: Incoming| null = await incomedb.getItem(id) as Incoming | null

  if(item) {
    const itemToClass = new IncomingClass(item.id, item.stock_master_ids, item.paper_id, item.tanggal, item.shift, item.diterima, item.type, item.diserahkan, item.catatan)
    await itemToClass.updateRecord(stock_master_ids, paper_id, tanggal, shift, diterima, type, diserahkan, catatan)
    return true
  }

  return false;
};

// export const getStockWithoutParent = () => {
//   gettingStartedRecord();
//   const stock = Incoming_transaction.value.filter(
//     (stock) => !stock?.icoming_parent_id
//   );
//   return stock;
// };

export const incomingTransactionForStockCard = async (startDate: number, finishDate: number, itemId: number) => {
  // result var
  const result = [];
  // get record between date
  const incomes = await incomedb.getItemsByKeyGreaterOrEqualThanAndLowerOrEqualThan('tanggal', startDate, finishDate );
  if(!incomes) {
    return false
  }
  // looping record
  for (let [index, income] of incomes.entries()) {
    // show message
    loaderMessage(
      `Mengambil produk masuk, ${index + 1} dari ${incomes.length}`
    );
    // looping stock child
    for (let stockId of income.stock_master_ids) {
      // get stock info
      const stockInfo = await getStockById(stockId);
      // if item_id === itemI
      if (stockInfo.item_id === itemId) {
        const itemInfo = await getItemById(stockInfo.item_id);
        const stockFinished = await getTotalStockTaken(stockId);
        // map record
        const stockToPush = {
          unix_time: income.tanggal,
          stock_id: stockId,
          tanggal_transaksi: ddmmyyyy(income.tanggal),
          nomor_dokumen: income.paper_id,
          shift: income.shift,
          mutasi: 'Masuk',
          kode_item: itemInfo.kd_item,
          nama_item: itemInfo.nm_item,
          type: income.type,
          tanggal_produk: ddmmyyyy(stockInfo.product_created),
          quantity: stockInfo.quantity + stockFinished.allFinished,
        };
        // push to result
        result.push(stockToPush);
      }
    }
  }
};

export const getRecordByDate = async (): Promise<void> => {
  // initiate idb
  const incomedb = useIdb(store);
  // get income by date
  const items: Incoming[]|null = await incomedb.getItemsByKeyValue('tanggal', ymdTime(dateRecordToShow.value)) as Incoming[] | null;
  if(items) {
    Incoming_transaction.value = items.map((rec) => new IncomingClass(rec.id, rec.stock_master_ids, rec.paper_id, rec.tanggal, rec.shift, rec.diterima, rec.type, rec.diserahkan, rec.catatan))
  }
  // return
  return;
};

export const mapIncomingTransactionWoutItem = async () => {
  const result = [];
  // if the state null
  if (!Incoming_transaction.value || !Incoming_transaction.value.length) {
    return result;
  }
  // use jurnal produk masuk
  const { getJurnalProdukMasukById } = useJurnalProdukMasuk();
  // map all state
  for (const income of Incoming_transaction.value) {
    // get name jurnal
    const jurnal = await getJurnalProdukMasukById(income?.type);
    // push it
    result.push({
      id: income?.id,
      tanggal: ddmmyyyy(income?.tanggal, '-'),
      shift: income?.shift,
      type: jurnal.nama_jurnal,
      paper_id: income?.paper_id,
    });
  }
  return result;
};

export const getIncomingByDateByShift = async (date, shift) => {
  // initiate idb
  const incomedb = useIdb(store);
  // result
  let result = [];
  // use jurnal produk masuk
  const { getJurnalProdukMasukById } = useJurnalProdukMasuk();
  // get income by date
  let records = await incomedb.getItemByTwoKeyValue(
    'tanggal',
    ymdTime(date),
    'shift',
    shift
  );
  if (records) {
    // map all records
    for (const income of records) {
      // get type of incoming
      const incomingType = await getJurnalProdukMasukById(income?.type);
      // map stock master by stock master ids
      for (const id of income?.stock_master_ids) {
        // dontt forget to sum quantity now with stock taken
        const allQuantityThatTaken = await getTotalStockTaken(id);
        // get stock master by id
        const stockMaster = await getStockById(id);
        // get nm_item from based on stockMaster.item_id
        const item = await getItemById(stockMaster?.item_id);
        result.push({
          id: income?.id,
          tanggal: ddmmyyyy(income?.tanggal, '-'),
          shift: income?.shift,
          paper_id: income?.paper_id,
          kd_item: item?.kd_item,
          nm_item: item?.nm_item,
          quantity: stockMaster?.quantity + allQuantityThatTaken.allFinished,
          available: stockMaster?.available,
          product_created: ddmmyyyy(stockMaster?.product_created, '-'),
          type: incomingType.nama_jurnal,
          diserahkan: income?.diserahkan,
          diterima: income?.diterima,
        });
      }
    }
  }
  // return
  return result;
};

export const getIncomeBetweenDate = async (date1, date2) => {
  const incomedb = useIdb(store);
  // get income by date
  const allIncomes =
    await incomedb.getItemsByKeyGreaterOrEqualThanAndLowerOrEqualThan(
      'tanggal',
      date1,
      date2
    );
};
