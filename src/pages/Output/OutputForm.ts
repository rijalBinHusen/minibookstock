
import { store as masterItemStoreName, getItemById } from "../../composables/MasterItems";
import { store as MasterStockStoreName } from "../../composables/StockMaster";
import { useIdb } from "../../utils/localforage";
import { ddmmyyyy } from '../..//utils/dateFormat';
import { stockOutput } from  "./Output";

export interface StockMaster {
    id: string
    item_id: string,
    kd_produksi: string,
    product_created: number,
    quantity: number,
    available: number,
    available_start: number,
    isTaken: boolean,
    available_end: number
    itemName: string
    kodeItem: string
}

export interface MasterItem {
  id: string
  kd_item: string,
  nm_item: string,
  division: string,
  last_used: number,
  age_item: number
}

export interface AvailableDate {
  id: string
  product_created: string
  origin_product_created: number
}

const masterItemDb = useIdb(masterItemStoreName);
const masterStockDb = useIdb(MasterStockStoreName);

export class StockToOutput {
    #localStock = <StockMaster[]>[];
    #items = <MasterItem[]>[];
    constructor() {
        this.getMasterStocks();
    }
  
    itemThatAvailable(): StockMaster[] {
      // get item that available not null
      let isItemTaken = <string[]>[];
      // result of item
      let result = <StockMaster[]>[];
      for (const stock of this.#localStock) {
        if (stock?.available > 0 && !isItemTaken.includes(stock.item_id)) {
          isItemTaken.push(stock?.item_id);
          result.push(stock);
        }
      }
      return result;
    }
  
    getAvailableDateByKodeItem(kodeItem: string) {
      
      const result = <AvailableDate[]>[];
      this.#localStock.forEach((stock) => {
        // if availabel and item_id == item_id
        if (stock?.kodeItem == kodeItem && stock?.available > 0) {
          // product create as number
          const product_created_as_number =
            typeof stock?.product_created === 'string'
              ? new Date(stock?.product_created).getTime()
              : stock?.product_created;
          result.push({
            id: stock?.id,
            product_created:
              '#' +
              ddmmyyyy(product_created_as_number, '-') +
              ' | ' +
              stock?.kd_produksi,
            origin_product_created: product_created_as_number,
          });
        }
      });
      // sorting the result
      return result.sort(
        (a, b) => a['origin_product_created'] - b['origin_product_created']
      );
      // return result;
    }
  
    getAvailableStock(stockId: string) {
      const findStock = this.#localStock.find((rec) => rec?.id == stockId);
  
      return findStock?.available || 0;
    }
  
    pickAvailableStock(stockId:string, yourNumber:number) {
      // console.log('your number to pick', yourNumber);
      // find index record first
      const indexRecord = this.#localStock.findIndex((rec) => rec?.id === stockId);

      if (indexRecord > -1) {
        // get the record by index
        const record = this.#localStock[indexRecord];
        // initiate new available stock
        const newAvailableStock = record?.available - yourNumber;
        // if new available >= 0 update state
        if (newAvailableStock >= 0) {
          this.#localStock[indexRecord] = {
            ...record,
            available: newAvailableStock,
          };
          return true;
        }
        alert('Ketersediaan stock tidak cukup');
        return false;
      }
      alert('Stock tidak ditemukan');
      return false;
    }
  
    isAvailablePickedByNumber(stockId: string, yourNumber: number) {
      // find index record first
      const indexRecord = this.#localStock.findIndex(
        (rec) => rec?.id === stockId
      );
      if (indexRecord > -1) {
        // get the record by index
        const record = { ...this.#localStock[indexRecord] };
        // initiate new available stock
        const newAvailableStock = record?.available - yourNumber;
        // if new available >= 0
        if (newAvailableStock >= 0) {
          return true;
        }
        alert('Ketersediaan stock tidak cukup');
        return false;
      }
      alert('Stock tidak ditemukan');
      return false;
    }
  
    pickStockByItemAndQty(kodeItem: string, yourQuantity: number) {
      // console.log('your quantity: ', yourQuantity)
      const dateAvailable = this.getAvailableDateByKodeItem(kodeItem);
      // console.log('date available: ', dateAvailable);
      const result = <{ stock_master_id: string, quantity:number}[]>[];
      let quantityLeft = yourQuantity;
      dateAvailable.forEach((stock) => {
        if (quantityLeft > 0) {
          // get available first
          const available = this.getAvailableStock(stock.id);
          // onsole.log('available stock', available);
          // new available
          // available - yourQuantity (50 - 100)
          const availableAfterPick = available - quantityLeft;
          // quantity
          const quantityOutput =
            availableAfterPick >= 0 ? quantityLeft : available;
          // set quantity left
          quantityLeft = quantityLeft - quantityOutput;
          // onsole.log('quantity left: ', quantityLeft);
          result.push({ stock_master_id: stock?.id, quantity: quantityOutput });
          // decrement avaialable
          this.pickAvailableStock(stock?.id, quantityOutput)
          // console.log(this.getAvailableStock(stock?.id))
        }
      });
      if (quantityLeft > 0) {
        // get item name
        const itemDetails = this.#localStock.find(
          (rec) => rec?.kodeItem == kodeItem
        );
        
        getItemById(itemDetails?.item_id).then((res) => {

            // show on modal element
            alert(`Stock ${res?.item_name} kurang dari ketersediaan!`);
        })
      }
      return result;
    }

    async getMasterStocks() {

        const getAllStocks = await masterStockDb.getItemsByKeyGreaterThan("available", 0) as StockMaster[];
        this.#items = await masterItemDb.getItems() as MasterItem[];

        for(let stock of getAllStocks) {
          const findItem = this.#items.find((item) => item.id === stock.item_id);
          this.#localStock.push({
            ...stock, itemName: findItem?.nm_item || "Not found", kodeItem: findItem?.kd_item || "Not found"
          })
        }
    }

    getItemByKodeItem(kodeItem: string): MasterItem {
      
      const findItem = this.#items.find((item) => item.kd_item === kodeItem);

      if(findItem) {
        return findItem
      }

      return {
        age_item: 0,
        division: "",
        id: "",
        kd_item: "",
        last_used: 0,
        nm_item: "",
      }
    }

    getStockMasterById(stockId: string): StockMaster {

      const findStock = this.#localStock.find((stock) => stock.id === stockId);

      if(findStock) return findStock;

      return {
        available: 0,
        available_end: 0,
        available_start: 0,
        id: "",
        isTaken: true,
        item_id: "",
        itemName: "",
        kd_produksi: "",
        kodeItem: "",
        product_created: 0,
        quantity: 0
      }
    }
  }