import { useIdb } from './localforage';
import { getStockThatAvailable, Stock_masters, changeAvailableStock, updateStockById } from '../composables/StockMaster';
import { loaderMessage, launchForm, closeModalOrDialog } from './launchForm';
import { getNextYearTime } from './dateFormat';
import { gettingStartedRecord as getMasterItems, updateItemById, Master_items } from "../composables/MasterItems"

const currentVersion = 2;

// function to migration to 1
async function migrationToV1() {
  // launch loader
  launchForm('Loader');
  // in this migration we're only need to get stock quantity > 1.
  // the stock available we're set as = stock?.quantity + stock?.allFinished - stock?.allTaken
  // that will handle by function changeavailable in stock master
  await getStockThatAvailable();
  // waiting for 3 second until the state complete
  await new Promise((res) => {
    setTimeout(() => {
      res();
    }, 3000);
  });

  for (let [index, stock] of Stock_masters.value.entries()) {
    // show messsage to loader
    loaderMessage(
      `Melakukan migrasi ke versi 1, stock master ${index + 1} dari ${
        Stock_masters.value.length
      }`
    );

    await changeAvailableStock(stock?.id);
  }
}

// function to migration to 2
async function migrationToV2() {
  // launch loader
  launchForm('Loader');
  // in this migration we're only need to get stock quantity > 1.
  // we will add available_end value in each stock that not contain it.
  await getStockThatAvailable();
  // waiting for 3 second until the state complete
  await new Promise((res) => {
    setTimeout(() => {
      res();
    }, 3000);
  });

  for (let [index, stock] of Stock_masters.value.entries()) {
    // show messsage to loader
    loaderMessage(
      `Melakukan migrasi ke versi 2, stock master ${index + 1} dari ${
        Stock_masters.value.length
      }`
    );
    
    if(!stock?.available_end) {
      await updateStockById(stock?.id, { available_end: getNextYearTime() })
    }
    // 
  }

  // changing the error summary
  const summaryDB = useIdb("summary")
  const incoming = await summaryDB.getItem("incoming_transaction")
  // if incoming null or incominglastid <=8
  if(!incoming || (incoming?.lastId && incoming?.lastId.length <= 8 )) {
    summaryDB.setItem("incoming_transaction", {"id":"incoming_transaction","lastId":"","total":406})
  }

  const itemOrders = await summaryDB.getItem("item_orders")
  // if itemOrders null or itemOrderslastid <=8
  if(!itemOrders || (itemOrders?.lastId && itemOrders?.lastId.length <= 8 )) {
    summaryDB.setItem("item_orders", {"id":"item_orders","lastId":"","total":4045})
  }
  
  const items = await summaryDB.getItem("items")
  // if items null or itemslastid <=8
  if(!items || (items?.lastId && items?.lastId.length <= 8 )) {
    summaryDB.setItem("items", {"id":"items","lastId":"","total":49})
  }

  const outputs = await summaryDB.getItem("output_transaction")
  // if outputs null or outputslastid <=8
  if(!outputs || (outputs?.lastId && outputs?.lastId.length <= 8 )) {
    summaryDB.setItem("output_transaction", {"id":"output_transaction","lastId":"","total":6552})
  }

  const salesOrders = await summaryDB.getItem("sales_orders")
  // if salesOrders null or salesOrderslastid <=8
  if(!salesOrders || (salesOrders?.lastId && salesOrders?.lastId.length <= 8 )) {
    summaryDB.setItem("sales_orders", {"id":"sales_orders","lastId":"","total":1654})
  }

  const stockMasters = await summaryDB.getItem("stock_master")
  // if stockMasters null or stockMasterslastid <=8
  if(!stockMasters || (stockMasters?.lastId && stockMasters?.lastId.length <= 8 )) {
    summaryDB.setItem("stock_master", {"id":"stock_master","lastId":"","total":933})
  }
}

class DatabaseVersion {
  #db = useIdb('database_version');
  #keyDocument = 'current_version';

  constructor() {
    this.currentDbVersion = currentVersion;
  }

  async setVersion(yourVersion) {
    await this.#db.setItem(this.#keyDocument, {
      id: this.#keyDocument,
      version: yourVersion,
    });
  }

  async getCurrentDatabaseVersion() {
    const ver = await this.#db.getItem(this.#keyDocument);
    return ver?.version;
  }
}

async function migrationToV3() {
  launchForm('Loader');
  // in this migration we're gonna add sort_item number in each master item
  // get all item
  await getMasterItems()
  // add sort_item value
  for ( let [index, item] of Master_items.value.entries() ) {
    loaderMessage(`Menambahkan nomor urut pada item, ${index} dari ${Master_items.value.length} item`)
    await updateItemById(item?.id, false, false, false, false, false, index + 1)
  }
}

export async function CheckMigration() {
  const dbVersion = new DatabaseVersion();

  const nowVersion = await dbVersion.getCurrentDatabaseVersion();

  // noversion
  const nothing = isNaN(nowVersion);
  if (nothing || nowVersion < 1) {
    await migrationToV1();
    await dbVersion.setVersion(1);
    CheckMigration();
    return;
  }
  
  if (nowVersion < 2) {
    await migrationToV2();
    await dbVersion.setVersion(2);
    CheckMigration();
    return;
  }
  
  if (nowVersion < 3) {
    await migrationToV3();
    await dbVersion.setVersion(3);
    CheckMigration();
    return;
  }
  closeModalOrDialog();
}
