import { ref } from 'vue';
// item function
import { Items, type Item } from '../MasterItems/MasterItems';
const { getItemById, getItemByKdItem, createItem} = Items();
import { loaderMessage } from '../../utils/launchForm';
// date formatter
import { ddmmyyyy, ymdTime, getNextYearTime, time, dayPlusOrMinus, JSToExcelDate } from '../../utils/dateFormat';
// store name
export const store = 'stock_master';
// incoming function
import { createIncoming, getIncomingById } from '../Incoming/Incoming';
// conver excel date to javascript date
import excelToJSDate from '../../utils/ExcelDateToJs';
// import local forage
import { useIdb } from '../../utils/localforage';
import { getTotalStockTaken } from '../Output/Output';
import { useJurnalProdukMasuk } from '../Settings/Setting_JurnalId';


const stockdb = useIdb(store);

interface StockMaster {
  created: number
  id: string
  item_id: string
  kd_produksi: string
  product_created: number
  incoming_parent_id: string
  quantity: number
  isTaken: boolean
  available: number
  available_end: number
}

interface StockMasterMapped extends StockMaster {
  item_name: string,
  kd_item: string
  product_created_format: string,
}

interface DateStockMaster {
  id: string
  product_created: string
  origin_product_created: number
}


type StockValueUpdate = {
  [K in keyof StockMaster]?:  StockMaster[K];
}

// the state
export const Stock_masters = ref(<StockMasterMapped[]>[]);

  function stockMaster() {

    async function createStock (item_id: string, kd_produksi: string, product_created: number, quantity: number, available_start: number, incoming_parent_id: string): Promise<string> {
      // initiate new record
      const record = <StockMaster>{
        item_id,
        kd_produksi,
        product_created,
        quantity: Number(quantity),
        available: Number(quantity),
        available_start,
        isTaken: false,
        available_end: getNextYearTime(),
        created: ymdTime(),
        incoming_parent_id,
        id: "",
      };
      // save to indexeddb
      const insertedRecord = await stockdb.createItem(record);

      if(insertedRecord) {
        // map record and push to state
        const recordMaped = await documentsMapper([{...record, id: insertedRecord.id}]);
        Stock_masters.value.unshift(recordMaped[0]);
        return insertedRecord.id;
      }
    };

    async function removeStockById (id: string): Promise<void> {
      await stockdb.removeItem(id);
      // remove from state
      Stock_masters.value = Stock_masters.value.filter((rec) => rec.id !== id);
    };

    async function getStockById (id: string): Promise<StockMasterMapped> {
      
      const findStock = await stockdb.getItem<StockMaster>(id);

      if(findStock) {
        
        const stockMapped = documentsMapper([findStock])
        return stockMapped[0]
      }
      
      return {
            item_id: "",
            kd_produksi: "Not found",
            product_created: 0,
            quantity: 0,
            available: 0,
            available_end: 0,
            created: 0,
            id: "",
            incoming_parent_id: "",
            isTaken: true,
            item_name: "Tidak ditemukan",
            kd_item: "",
            product_created_format: "",
          };
    };

    async function updateStockById (id: string, keyValueToUpdate: StockValueUpdate): Promise<boolean> {
      // update database
      const isUpdated = await stockdb.updateItem(id, keyValueToUpdate);

      if(!isUpdated) return false;

      const newRec = await stockdb.getItem<StockMaster>(id);
      const findIndexRec = Stock_masters.value.findIndex((rec) => rec?.id === id);
      
      if (findIndexRec > -1) {
        // map new rec and update state
        const newRecMapped = await documentsMapper([newRec]);
        Stock_masters.value.splice(findIndexRec, 1, newRecMapped[0]);
      }

      return true;
    };

    async function documentsMapper (stocks: StockMaster[]): Promise<StockMasterMapped[]> {
      
      const itemsFounded = <Item[]>[];
      let result = <StockMasterMapped[]>[];

      for(let stock of stocks) {

        let findItem = itemsFounded.find(item => item.id === stock.item_id);

        if(!findItem) {

          findItem = await getItemById(stock?.item_id);
          if(findItem) itemsFounded.push(findItem);
        }

        result.push({
          ...stock,
          item_name: findItem?.nm_item,
          kd_item: findItem?.kd_item,
          product_created_format: ddmmyyyy(stock?.product_created, '-'),
        });
      }

      return result;
    };

    async function setStockParent (stockId: string, incoming_parent_id: string) {
      
      await updateStockById(stockId, { incoming_parent_id });
    };

    async function  getStockThatAvailable (): Promise<StockMasterMapped[]> {
      
      // show message to loader
      loaderMessage('Mendapatkan seluruh stock master');

      const stockAvailable = await stockdb.getItemsByKeyGreaterThan<StockMaster>('available', 0);
      const stockMapped = documentsMapper(stockAvailable);
      
      return stockMapped;
    };

    async function getAvailableDateByItemId (item_id: string): Promise<DateStockMaster[]>{
      
      const result = <DateStockMaster[]>[];

      const stocks = await getStockThatAvailable();

      stocks.forEach((stock) => {
        // if availabel and item_id == item_id
        if (stock?.item_id == item_id) {

          const product_created = `# ${stock.product_created_format} | ${stock?.kd_produksi}`;
          result.push({
            id: stock?.id,
            product_created,
            origin_product_created: stock.product_created,
          });
        }
      });
      // sorting the result
      return result.sort((a, b) => a['origin_product_created'] - b['origin_product_created']);
    };

    async function changeAvailableStock (id_stock: string) {
      
      const getStock = await getStockById(id_stock);
      // get all taken in output transaction
      const stockTaken = await getTotalStockTaken(id_stock);
      // full quantity (quantity now + stock all finished) - all taken in output
      const available = getStock?.quantity + stockTaken.allFinished - stockTaken.allTaken;
      const isTaken = Number(getStock?.quantity) != available;
      
      if (available >= 0) {
        // new item save to database
        const keyValueToUpdate = { available, isTaken };
        await updateStockById(id_stock, keyValueToUpdate);
        return true;
      } 
      
      else {
        // show in alert message
        alert(`Item ${getStock.item_name} tidak dapat dimasukkan karena ketersediaan stock kurang dari permintaan`);
        return false;
      }
    };
    
    async function markStockAsTaken (id: string): Promise<void>{
      
      await updateStockById(id, { isTaken: true });
    };

    async function changeQuantityById (idStock: string): Promise<void> {
      
      const getStock = await getStockById(idStock)
      // get all output
      const quantityOutput = await getTotalStockTaken(idStock)
      const quantityOrigin = getStock?.available + quantityOutput.allTaken
      
      // decrement or increment quantity
      const quantity = quantityOrigin - quantityOutput.allFinished;
      // available_end ate, if quantity 0 set to now, else next year
      const available_end = quantity == 0 ? time() : getNextYearTime();
      const keyValueToUpdate = { quantity, available_end };
      // update stock
      await updateStockById(idStock, keyValueToUpdate);
    };

    async function getStockMasterByItemId (itemId: string): Promise<StockMasterMapped[]> {
      // get data from db based on item id
      const allStock = await stockdb.getItemsByKeyValue<StockMaster>('item_id', itemId);
      
      const stockMapped = await documentsMapper(allStock);
      return stockMapped;
    };

    async function getSlowMovingItems () {
      
      const day14Before = dayPlusOrMinus(false, -14);
      const stocks = await stockdb.getItemsByKeyThatValueLowerAndEqualThan<StockMaster>('product_created', day14Before);
      
      // use jurnal produk masuk
      const { getJurnalProdukMasukById } = useJurnalProdukMasuk();
      // filter
      const result = [];
      // looping it
      for (let [index, stock] of stocks.entries()) {

        loaderMessage(`Menerjemahkan menjadi slow moving ${index} dari ${Stock_masters.value.length}`);
        if (time(stock?.product_created) <= day14Before) {
          // incoming details
          const incomingDetails = await getIncomingById(stock?.incoming_parent_id);
          // jurnal type
          const jurnalInfo = await getJurnalProdukMasukById(incomingDetails?.type);
          // push to result
          result.push({
            ...stock,
            tanggal_transfer: JSToExcelDate(incomingDetails.tanggal),
            asal_produk: jurnalInfo.nama_jurnal,
          });
        }
      }
      // return result;
      return result;
    };
  }


export const getAllDataToBackup = async () => {
  
  const allData = await stockdb.getItems();
  return { store, data: allData ? allData : null };
};

// export const createStockAwal = async (
//   kode_item,
//   nama_item,
//   umur_product,
//   quantity,
//   tanggal_produksi
// ) => {
//   // convert excel date to javascript date
//   const date = excelToJSDate(tanggal_produksi);
//   // cari dulu itemnya sudah ada atau belum
//   const isItemExists = await getItemByKdItem(kode_item);
//   // jika ada langsung input ke master
//   if (isItemExists?.id) {
//     // create new stock
//     const stock = await createStock(
//       isItemExists.id,
//       'stock awal',
//       ymdTime(date),
//       quantity
//     );
//     // create incoming record
//     const incoming = await createIncoming(
//       [stock.id],
//       nama_item,
//       ymdTime(),
//       1,
//       'stock awal',
//       'stock awal',
//       'stock awal',
//       null
//     );
//     // set parent stock
//     await setStockParent(stock.id, incoming.id);
//   } else {
//     // jika belum ada buat item baru
//     // create new item, this will return only id
//     const item = await createItem(
//       kode_item,
//       nama_item,
//       null,
//       ymdTime(),
//       Number(umur_product)
//     );
//     // create new stock
//     const stock = await createStock(item, 'stock awal', date, quantity);
//     // create incoming record
//     const incoming = await createIncoming(
//       [stock.id],
//       nama_item,
//       ymdTime(),
//       1,
//       'stock awal',
//       'stock awal',
//       'stock awal',
//       null
//     );
//     // set parent stock
//     await setStockParent(stock.id, incoming.id);
//   }
// };


// export const getStockByIdForIncomingForm = async (id) => {
//   // initiate idb
//   const stockdb = useIdb(store);
//   // get all output
//   const allOutput = await getTotalStockTaken(id);
//   // find stock
//   const findStock = await stockdb.getItem(id);
//   return findStock
//     ? { ...findStock, quantity: findStock?.quantity + allOutput.allFinished }
//     : {
//         item_id: 'Not found',
//         kd_produksi: 'Not found',
//         product_created: 'Not found',
//         quantity: 'Not found',
//       };
// };

// export const mapStockForStockMaster = async () => {
//   const result = [];
//   // id: stock?.id,
//   // kd_item: item?.kd_item,
//   // nm_item: item?.nm_item,
//   // kd_produksi: stock?.kd_produksi,
//   // product_created: ddmmyyyy(stock?.product_created, '-'),
//   // quantity: stock?.quantity,
//   for (const stock of Stock_masters.value) {
//     const item = await getItemById(stock?.item_id);
//     result.push({
//       id: stock?.id,
//       kd_item: item?.kd_item,
//       nm_item: item?.nm_item,
//       kd_produksi: stock?.kd_produksi,
//       product_created: ddmmyyyy(stock?.product_created, '-'),
//       quantity: stock?.quantity,
//       incoming_parent_id: stock?.icoming_parent_id,
//     });
//   }
//   return result;
// };

// export const updateQuantity = async (id, yourNumberPlusOrMinus) => {
//   // detecting if keyvalue has own property quantity, change the available too
//   // get all output
//   const getOutput = await getTotalStockTaken(id);
//   // 1. Total Stock quantity = (quantity + total output isFinished=true )
//   //  it means Now Quantity = quantity - total output isFinished=true
//   const quantity = Number(yourNumberPlusOrMinus) - getOutput.allFinished;
//   // 2. Total Stock available = (quantity + total output isFinished=true|false )
//   // it means available = total quantity - total output isFinished=true|false
//   const available = Number(yourNumberPlusOrMinus) - Number(getOutput.allTaken);
//   // update with the available property
//   await updateStockById(id, { quantity, available });
//   // return
//   return;
// };


export const getSummaryStockMaster = async () => {
  // incoming type
  const { getJurnalProdukMasukById } = useJurnalProdukMasuk();
  // get all available item first
  await getStockThatAvailable();
  // variable that wuold contain result
  let result = [];
  // loop the state
  for (let [index, stock] of Stock_masters.value.entries()) {
    // show message to loader
    loaderMessage(
      `Menerjemahkan menjadi summary stock, ${index} dari ${Stock_masters.value.length} stock`
    );
    // get incoming details
    const incomingDetails = await getIncomingById(stock?.icoming_parent_id);
    // get incoming type info
    const incomingType = await getJurnalProdukMasukById(incomingDetails.type);
    // find index by kd_item in result variable is that exists
    let findIndex = result.findIndex((res) => res?.kd_item == stock.kd_item);
    // if exists, add total_quantity, details, product_dates
    if (findIndex > -1) {
      // total_quantity,
      // result[1].total_quantity = 300 + 700
      result[findIndex].total_quantity =
        result[findIndex].total_quantity + stock?.quantity;
      // details, 300 ctn ( Masuk gudang 27-Jan-2022 Nomor dokumen 03938 Transfer dari produksi)
      result[findIndex].details =
        result[findIndex].details +
        '\r\n' +
        stock?.quantity +
        ` Masuk ${ddmmyyyy(incomingDetails.tanggal, '-')}, Dokumen ${
          incomingDetails?.paper_id
        }`;
      // product_dates, | 300=27-01-23
      result[findIndex].product_dates =
        result[findIndex].product_dates +
        '\r\n' +
        stock?.quantity +
        `=(${stock?.product_created_format} #${incomingType.nama_jurnal})`;
    } else {
      // push to result variable
      // <!-- kd_item, item_name, total_quantity, details, product_dates -->
      result.push({
        kd_item: stock?.kd_item,
        item_name: stock?.item_name,
        total_quantity: stock?.quantity,
        details:
          stock?.quantity +
          ` Masuk ${ddmmyyyy(incomingDetails.tanggal, '-')}, Dokumen ${
            incomingDetails?.paper_id
          }`,
        product_dates:
          stock?.quantity +
          `=(${stock?.product_created_format} #${incomingType.nama_jurnal})`,
      });
    }
  }
  return result;
};

// export class StockToOutput {
//   #localStock = [];
//   constructor() {
//     // if state null
//     if (!Stock_masters.value.length) {
//       alert(
//         'Stock belum tersedia, silahkan mengunjungi stock master untuk mengambil data dari database'
//       );
//       return false;
//     }
//     this.#localStock = JSON.parse(JSON.stringify(Stock_masters.value));
//   }

//   itemThatAvailable() {
//     // get item that available not null
//     let isItemTaken = [];
//     // result of item
//     let result = [];
//     for (const stock of this.#localStock) {
//       if (stock?.available > 0 && !isItemTaken.includes(stock?.item_id)) {
//         isItemTaken.push(stock?.item_id);
//         result.push({
//           item_id: stock?.item_id,
//           kd_item: stock?.kd_item,
//           nm_item: stock?.item_name,
//         });
//       }
//     }
//     return result;
//   }

//   getAvailableDateByItem(item_id) {
//     const result = [];
//     this.#localStock.forEach((stock) => {
//       // if availabel and item_id == item_id
//       if (stock?.item_id == item_id && stock?.available > 0) {
//         // product create as number
//         const product_created_as_number =
//           typeof stock?.product_created === 'string'
//             ? new Date(stock?.product_created).getTime()
//             : stock?.product_created;
//         result.push({
//           id: stock?.id,
//           product_created:
//             '#' +
//             ddmmyyyy(product_created_as_number, '-') +
//             ' | ' +
//             stock?.kd_produksi,
//           origin_product_created: product_created_as_number,
//         });
//       }
//     });
//     // sorting the result
//     return result.sort(
//       (a, b) => a['origin_product_created'] - b['origin_product_created']
//     );
//     // return result;
//   }

//   getAvailableStock(stockId) {
//     const findStock = this.#localStock.find((rec) => rec?.id == stockId);

//     return findStock?.available;
//   }

//   pickAvailableStock(stockId, yourNumber) {
//     // console.log('your number to pick', yourNumber);
//     // find index record first
//     const indexRecord = this.#localStock.findIndex(
//       (rec) => rec?.id === stockId
//     );
//     if (indexRecord > -1) {
//       // get the record by index
//       const record = this.#localStock[indexRecord];
//       // initiate new available stock
//       const newAvailableStock = record?.available - yourNumber;
//       // if new available >= 0 update state
//       if (newAvailableStock >= 0) {
//         this.#localStock[indexRecord] = {
//           ...record,
//           available: newAvailableStock,
//         };
//         return true;
//       }
//       alert('Ketersediaan stock tidak cukup');
//       return false;
//     }
//     alert('Stock tidak ditemukan');
//     return false;
//   }

//   isAvailablePickedByNumber(stockId, yourNumber) {
//     // find index record first
//     const indexRecord = this.#localStock.findIndex(
//       (rec) => rec?.id === stockId
//     );
//     if (indexRecord > -1) {
//       // get the record by index
//       const record = { ...this.#localStock[indexRecord] };
//       // initiate new available stock
//       const newAvailableStock = record?.available - yourNumber;
//       // if new available >= 0
//       if (newAvailableStock >= 0) {
//         return true;
//       }
//       alert('Ketersediaan stock tidak cukup');
//       return false;
//     }
//     alert('Stock tidak ditemukan');
//     return false;
//   }

//   pickStockByItemAndQty(item_id, yourQuantity) {
//     // console.log('your quantity: ', yourQuantity)
//     const dateAvailable = this.getAvailableDateByItem(item_id);
//     // console.log('date available: ', dateAvailable);
//     const result = [];
//     let quantityLeft = yourQuantity;
//     if(dateAvailable.length) {
//       dateAvailable.forEach((stock) => {
//         if (quantityLeft > 0) {
//           // get available first
//           const available = this.getAvailableStock(stock.id);
//           // onsole.log('available stock', available);
//           // new available
//           // available - yourQuantity (50 - 100)
//           const availableAfterPick = available - quantityLeft;
//           // quantity
//           const quantityOutput =
//             availableAfterPick >= 0 ? quantityLeft : available;
//           // set quantity left
//           quantityLeft = quantityLeft - quantityOutput;
//           // onsole.log('quantity left: ', quantityLeft);
//           result.push({ stock_master_id: stock?.id, quantity: quantityOutput });
//           // decrement avaialable
//           this.pickAvailableStock(stock?.id, quantityOutput)
//           // console.log(this.getAvailableStock(stock?.id))
//         }
//       });
//       if (quantityLeft > 0) {
//         // get item name
//         const itemDetails = this.#localStock.find(
//           (rec) => rec?.item_id == item_id
//         );
//         // show on modal element
//         alert(`Stock ${itemDetails?.item_name} kurang dari ketersediaan!`);
//       }
//     } else {
//       alert('Item tidak ditemukan')
//       return;
//     }
//     return result;
//   }
// }

export const getStockForBookStock = async (date) => {
  const db = useIdb(store)
  const stock = await db.getItemsGreatEqualLowEqual('available_end', date, 'available_start', date)
  return stock
}