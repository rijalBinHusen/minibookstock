import { useIdb } from './localforage';
import { getStockThatAvailable, Stock_masters, changeAvailableStock, updateStockById } from '../composables/StockMaster';
import { loaderMessage, launchForm, closeModalOrDialog } from './launchForm';
import { getNextYearTime } from './dateFormat';

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
      `Melakukan migrasi stock master ${index + 1} dari ${
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
      `Melakukan migrasi stock master ${index + 1} dari ${
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
  summaryDB.setItem("incoming_transaction", {"id":"incoming_transaction","lastId":"INCOMING_TR23090100","total":406})
  summaryDB.setItem("item_orders", {"id":"item_orders","lastId":"ITEM_ORDER_TR23090100","total":4045})
  summaryDB.setItem("items", {"id":"items","lastId":"ITM23080001","total":49})
  summaryDB.setItem("output_transaction", {"id":"output_transaction","lastId":"OUTPUT_TR23090100","total":6552})
  summaryDB.setItem("sales_orders", {"id":"sales_orders","lastId":"SO_23090100","total":1654})
  summaryDB.setItem("stock_master", {"id":"stock_master","lastId":"STOCK_MASTER_23090100","total":933})
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
  closeModalOrDialog();
}
