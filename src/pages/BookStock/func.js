import { getStockForBookStock } from "../../composables/StockMaster";
import { store as storeIncoming } from "../../composables/Incoming";
import {
  getTotalStockTaken,
  store as storeOutput,
} from "../../composables/Output";
import { useIdb } from "../../utils/localforage";
import { ymdTime } from "../../utils/dateFormat";
import { ref, reactive } from "vue";

// state
export let state = reactive([]);
// date to show
export const date = ref(new Date());

class Stock {
  constructor(
    id,
    available,
    available_start,
    available_end,
    created,
    incoming_parent_id,
    isTaken,
    item_id,
    kd_produksi,
    product_created,
    quantity,
    incomeShift1,
    incomeShift2,
    incomeShift3,
    incomeShift4,
    outputShift1,
    outputShift2,
    outputShift3,
    outputShift4
  ) {
    this.id = id;
    this.available = available;
    this.available_start = available_start;
    this.available_end = available_end;
    this.created = created;
    this.incoming_parent_id = incoming_parent_id;
    this.isTaken = isTaken;
    this.item_id = item_id;
    this.kd_produksi = kd_produksi;
    this.product_created = product_created;
    this.quantity = quantity;
    this.incomeShift1 = incomeShift1;
    this.incomeShift2 = incomeShift2;
    this.incomeShift3 = incomeShift3;
    this.incomeShift4 = incomeShift4;
    this.outputShift1 = outputShift1;
    this.outputShift2 = outputShift2;
    this.outputShift3 = outputShift3;
    this.outputShift4 = outputShift4;
    this.stockAwalShift1 = 0;
    this.stockAwalShift2 = 0;
    this.stockAwalShift3 = 0;
  }

  addQuantity(yourNumber) {
    this.quantity = this.quantity + yourNumber;
  }

  addIncome(shift, yourNumber) {
    switch (shift) {
      case 1:
        this.incomeShift1 = this.incomeShift1 + yourNumber;
        break;
      case 2:
        this.incomeShift2 = this.incomeShift2 + yourNumber;
        break;
      case 3:
        this.incomeShift3 = this.incomeShift3 + yourNumber;
        break;
      case 4:
        this.incomeShift4 = this.incomeShift4 + yourNumber;
        break;
    }
    this.setStockAwal();
  }

  addOutput(shift, yourNumber) {
    switch (shift) {
      case 1:
        this.outputShift1 = this.outputShift1 + yourNumber;
        break;
      case 2:
        this.outputShift2 = this.outputShift2 + yourNumber;
        break;
      case 3:
        this.outputShift3 = this.outputShift3 + yourNumber;
        break;
      case 4:
        this.outputShift4 = this.outputShift4 + yourNumber;
        break;
    }
    this.setStockAwal();
  }

  setStockAwal() {
    this.stockAwalShift1 =
      this.quantity +
      this.outputShift1 +
      this.outputShift2 +
      this.outputShift3 +
      this.outputShift4 -
      this.incomeShift1 -
      this.incomeShift2 -
      this.incomeShift3 -
      this.incomeShift4;
    this.stockAwalShift2 =
      this.quantity +
      this.outputShift2 +
      this.outputShift3 +
      this.outputShift4 -
      this.incomeShift2 -
      this.incomeShift3 -
      this.incomeShift4;
    this.stockAwalShift3 =
      this.quantity +
      this.outputShift3 +
      this.outputShift4 -
      this.incomeShift3 -
      this.incomeShift4;
  }
}

export async function getBookStock() {
  const dateTime = ymdTime(date.value);
  // function to get stock master >= date to show && <= date to show
  const getStocks = await getStockForBookStock(dateTime);

  const stocks = getStocks.map(
    (rec) =>
      new Stock(
        rec?.id,
        rec?.available,
        rec?.available_start,
        rec?.available_end,
        rec?.created,
        rec?.icoming_parent_id,
        rec?.isTaken,
        rec?.item_id,
        rec?.kd_produksi,
        rec?.product_created,
        rec?.quantity,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      )
  );

  const incomeDB = useIdb(storeIncoming);
  const incomes = await incomeDB.getItemsByKeyValue(
    "tanggal",
    ymdTime(dateTime)
  );
  for (let incomeLevel1 of incomes) {
    for (let stockMasterId of incomeLevel1.stock_master_ids) {
      const findRec = stocks.find((rec) => rec?.id === stockMasterId);
      if (findRec) {
        const stockTaken = await getTotalStockTaken(stockMasterId);
        findRec.addIncome(
          incomeLevel1?.shift,
          findRec?.quantity + stockTaken.allTaken
        );
      }
    }
  }

  const outputDB = useIdb(storeOutput);
  const outputMoreThanDate = await outputDB.getItemsByKeyGreaterThan(
    "tanggal",
    dateTime
  );
  const outputDate = await outputDB.getItemsByKeyValue(
    "tanggal",
    ymdTime(dateTime)
  );

  // // sum quantity
  outputMoreThanDate.forEach((rec) => {
    const findRec = stocks.find(
      (recLv2) => recLv2?.id === rec?.stock_master_id
    );
    if (findRec) {
      findRec.addQuantity(rec?.quantity);
    }
  });

  // // add output
  outputDate.forEach((rec) => {
    const findRec = stocks.find(
      (recLvl2) => recLvl2?.id === rec?.stock_master_id
    );
    if (findRec) {
      findRec.addOutput(rec?.shift, rec?.quantity);
    }
  });

  const finalStock = [];

  stocks.forEach((rec) => {
    const findRec = finalStock.find(
      (recLvl2) => recLvl2?.item_id === rec?.item_id
    );
    if (findRec) {
      findRec?.addQuantity(rec?.quantity);
      if (findRec?.incomeShift1) {
        findRec?.addIncome(1, findRec?.incomeShift1);
      }
      if (findRec?.incomeShift2) {
        findRec?.addIncome(2, findRec?.incomeShift2);
      }
      if (findRec?.incomeShift3) {
        findRec?.addIncome(3, findRec?.incomeShift3);
      }
      if (findRec?.incomeShift4) {
        findRec?.addIncome(4, findRec?.incomeShift4);
      }
      if (findRec?.outputShift1) {
        findRec?.addIncome(1, findRec?.outputShift1);
      }
      if (findRec?.outputShift2) {
        findRec?.addIncome(2, findRec?.outputShift2);
      }
      if (findRec?.outputShift3) {
        findRec?.addIncome(3, findRec?.outputShift3);
      }
      if (findRec?.outputShift4) {
        findRec?.addIncome(4, findRec?.outputShift4);
      }
    } else {
      finalStock.push(
        new Stock(
          rec?.id,
          rec?.available,
          rec?.available_start,
          rec?.available_end,
          rec?.created,
          rec?.incoming_parent_id,
          rec?.isTaken,
          rec?.item_id,
          rec?.kd_produksi,
          rec?.product_created,
          rec?.quantity,
          rec?.incomeShift1,
          rec?.incomeShift2,
          rec?.incomeShift3,
          rec?.incomeShift4,
          rec?.outputShift1,
          rec?.outputShift2,
          rec?.outputShift3,
          rec?.outputShift4
        )
      );
    }
  });
  state.values = finalStock;
  console.log(finalStock);

  // let groupStockByItemId = []

  // stocks.forEach((recLevel1) => {
  //     const findIndex = groupStockByItemId.findIndex((recLevel2) => recLevel2?.item_id == recLevel1?.item_id)
  //     if(findIndex > -1) {
  //         groupStockByItemId[findIndex].quantity = groupStockByItemId[findIndex].quantity + recLevel1.quantity
  //     } else {
  //         groupStockByItemId.push(recLevel1)
  //     }
  // })
}
//
