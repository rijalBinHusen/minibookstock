import { getStockForBookStock, getStockById } from "../../composables/StockMaster";
import { store as storeIncoming } from "../../composables/Incoming";
import {
  getTotalStockTaken,
  store as storeOutput,
} from "../../composables/Output";
import { useIdb } from "../../utils/localforage";
import { ddmmyyyy, ymdTime } from "../../utils/dateFormat";
import { ref } from "vue";
import { getItemById } from "../../composables/MasterItems"
import {  } from "../../components/parts/Toast.vue"
import ExportToXls from "../../utils/ExportToXls"
import { loaderMessage } from "../../utils/launchForm";

// state
export let state = [];
// date to show
export const date = ref(new Date());
export let nowShift = ref(1)

// result
export const excelReportResultCompared = ref([])

class StockCompared {
  constructor (itemKode, itemName, stockAwal, lpb,  income, bom, other, retur, output, transfer, other2, akhir, source) {
    this.itemKode = itemKode
    this.itemName = itemName
    this.stockAwal = !isNaN(stockAwal) ? stockAwal : 0
    this.lpb = !isNaN(lpb) ? lpb : 0
    this.income = !isNaN(income) ? income : 0
    this.bom = !isNaN(bom) ? bom : 0
    this.other = !isNaN(other) ? other : 0
    this.retur = !isNaN(retur) ? retur : 0
    this.output = !isNaN(output) ? output : 0
    this.transfer = !isNaN(transfer) ? transfer : 0
    this.other2 = !isNaN(other2) ? other2 : 0
    this.akhir = !isNaN(akhir) ? akhir : 0
    this.source = source
  }

  getStockCompared () {
    return {
      "Data": this.source,
      "Item Id": this.itemKode,
      "Nama Lengkap": this.itemName,
      Unit: "Ctn",
      Awal: this.stockAwal,
      Transfer: this.lpb + this.income + this.bom + this.other + this.retur,
      Pemakaian: this.output + this.transfer + this.other2,
      Akhir: this.akhir
    }
  }
}

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
    outputShift4,
    itemName,
    itemKode,
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
    this.stockAwalShift4 = 0
    this.itemName = itemName
    this.itemKode = itemKode
    this.setStockAwal()
  }

  addQuantity(yourNumber) {
    this.quantity = Number(this.quantity) + Number(yourNumber);
    this.setStockAwal()
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
    this.setStockAwalShift1()
    this.setStockAwalShift2()
    this.setStockAwalShift3()
    this.setStockAwalShift4()
  }
  setStockAwalShift1 () {
    const output = this.outputShift1 + this.outputShift2 + this.outputShift3 + this.outputShift4;
    const income = this.incomeShift1 + this.incomeShift2 + this.incomeShift3 + this.incomeShift4;
    this.stockAwalShift1 = this.quantity + output - income;
  }
  setStockAwalShift2 () {
    const output = this.outputShift2 + this.outputShift3 + this.outputShift4;
    const income = this.incomeShift2 + this.incomeShift3 + this.incomeShift4;
    this.stockAwalShift2 = this.quantity + output - income;
  }
  setStockAwalShift3 () {
    const output = this.outputShift3 + this.outputShift4;
    const income = this.incomeShift3 + this.incomeShift4;
    this.stockAwalShift3 = this.quantity + output - income;
  }
  setStockAwalShift4 () {
    const output = this.outputShift4;
    const income = this.incomeShift4;
    this.stockAwalShift4 = this.quantity + output - income;
  }
  getRecordToPrint() {
    return {
      "Kode item": this.itemKode,
      "Nama item": this.itemName,
      "Stock awal 1": this.stockAwalShift1,
      "Produk masuk 1": this.incomeShift1,
      "Produk keluar 1": this.outputShift1,
      "Stock awal 2": this.stockAwalShift2,
      "Produk masuk 2": this.incomeShift2,
      "Produk keluar 2": this.outputShift2,
      "Stock awal 3": this.stockAwalShift3,
      "Produk masuk 3": this.incomeShift3,
      "Produk keluar 3": this.outputShift3,
      "Stock awal 4": this.stockAwalShift4,
      "Produk masuk 4": this.incomeShift4,
      "Produk keluar 4": this.outputShift4,
      "Stock akhir": this.quantity
    }
  }
  getRecordToCompare() {
    const incomeTotal = this.incomeShift1 + this.incomeShift2 + this.incomeShift3 + this.incomeShift4
    const outputTotal = this.outputShift1 + this.outputShift2 + this.outputShift3 + this.outputShift4

    const setStockToClass = new StockCompared(
      this.itemKode, this.itemName, this.stockAwalShift1, 0, incomeTotal, 0, 0, 0, outputTotal, 0, 0, this.quantity, "Aplikasi"
    )

    return setStockToClass.getStockCompared()
  }
}

export const compareWithReport = async (rowObj, lengthRow) => {

  const stateToCompare = [...state]
  
  const recordNotCompared = []
  const recordMatched = []
  const recordNotMached = []

  // looping
  for(let i = 1; i <= lengthRow; i++) {
    // message to loader
    loaderMessage(`Membandingkan record ${i} dari ${lengthRow} `)

    const kdItemExcel = rowObj["A"+i]?.v
    const quantityExcel = rowObj["M"+i]?.v

    const setStockToClass = new StockCompared(
      kdItemExcel, rowObj["B"+i]?.v, rowObj["D"+i]?.v, rowObj["E"+i]?.v, rowObj["F"+i]?.v, 
      rowObj["G"+i]?.v, rowObj["H"+i]?.v, rowObj["I"+i]?.v, rowObj["J"+i]?.v, rowObj["K"+i]?.v, 
      rowObj["L"+i]?.v, rowObj["M"+i]?.v, "Excel"
    )

    if(!isNaN(quantityExcel) && kdItemExcel) {
      // find stock by kd_item
      const findStock = stateToCompare.find((rec) => rec?.itemKode === kdItemExcel)
      if(findStock) {
        // compare the quantity
        if(findStock?.quantity == quantityExcel) {
          recordMatched.push(findStock?.getRecordToCompare())
          recordMatched.push(setStockToClass.getStockCompared())
        } 
        else {
          recordNotMached.push(findStock?.getRecordToCompare())
          recordNotMached.push(setStockToClass.getStockCompared())
        }
      }
      else {
        recordNotCompared.push(setStockToClass.getStockCompared())
      }
      await new Promise((res) => {
        setTimeout(() => {
          res()
        }, 20);
      })
    }
  }

  
  // record not matched
  const recordNotMatchedMarker = new StockCompared('Stock tidak sesuai', 0, '', '','','','','','','','','','')
  excelReportResultCompared.value.push(recordNotMatchedMarker.getStockCompared())
  excelReportResultCompared.value = excelReportResultCompared.value.concat(recordNotMached)
  
  // record matched
  const recordMatchedMarker = new StockCompared('Stock sesuai', '', '', '','','','','','','','','', '')
  excelReportResultCompared.value.push(recordMatchedMarker.getStockCompared())
  excelReportResultCompared.value = excelReportResultCompared.value.concat(recordMatched)

  // record not compared
  const recordNotComparedMarker = new StockCompared('Stock tidak ditemukan', '', '', '','','','','','','','','','')
  excelReportResultCompared.value.push(recordNotComparedMarker.getStockCompared())
  excelReportResultCompared.value = excelReportResultCompared.value.concat(recordNotCompared)

  // filter app stock
  // const appStock = stateToCompare.filter((stockToFilter) => {
  //   const findInRecordNotMatched = recordNotMached.find((rec) => rec?.id === stockToFilter?.id)
  //   const findInRecordMatched = recordMatched.find((rec) => rec?.id === stockToFilter?.id)
  //   if(!findInRecordMatched || !findInRecordNotMatched) {
  //     return stockToFilter
  //   }
  // })

  // console.log(appStock)
}

export async function getBookStock() {
  const dateTime = ymdTime(date.value);
  // function to get stock master >= date to show && <= date to show
  const getStocks = await getStockForBookStock(dateTime);

  const stocks = []
  for  (let rec of getStocks) {
    const itemInfo = await getItemById(rec?.item_id)
    stocks.push(
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
            0,
            itemInfo?.nm_item,
            itemInfo?.kd_item
        )
    )
    }

  const incomeDB = useIdb(storeIncoming);
  const incomes = await incomeDB.getItemsByKeyValue("tanggal", ymdTime(dateTime) );
  for (let incomeLevel1 of incomes) {
    for (let stockMasterId of incomeLevel1.stock_master_ids) {
      const stockMasterDetails = await getStockById(stockMasterId)
      const findRec = stocks.find((rec) => rec?.id === stockMasterId);
      const stockTaken = await getTotalStockTaken(stockMasterId);
      const allQty = stockMasterDetails.quantity + stockTaken.allTaken
      if (findRec) {
        findRec.addIncome(
          incomeLevel1?.shift,
          allQty
        );
      } else {
        const itemInfo = await getItemById(stockMasterDetails?.item_id)
        const stockToPush = new Stock(
          stockMasterId, stockMasterDetails?.available, stockMasterDetails?.available_start, 
          stockMasterDetails?.available_end, stockMasterDetails?.created, incomeLevel1?.id,
          stockMasterDetails?.isTaken, stockMasterDetails?.item_id, stockMasterDetails?.kd_produksi,
          stockMasterDetails?.product_created, stockMasterDetails?.quantity, 0, 0, 0, 0, 0, 0, 0, 0, itemInfo?.nm_item, itemInfo?.kd_item)
        stockToPush.addIncome(incomeLevel1?.shift, allQty)
        stocks.push(stockToPush)
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
    if (findRec && rec?.isFinished) {
      findRec.addQuantity(rec?.quantity);
    }
  });

  // // add output
  outputDate.forEach((rec) => {
    const findRec = stocks.find(
      (recLvl2) => recLvl2?.id === rec?.stock_master_id
    );
    if (findRec && rec?.isFinished) {
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

      if (rec?.incomeShift1) {
        findRec?.addIncome(1, rec?.incomeShift1);
      }
      if (rec?.incomeShift2) {
        findRec?.addIncome(2, rec?.incomeShift2);
      }
      if (rec?.incomeShift3) {
        findRec?.addIncome(3, rec?.incomeShift3);
      }
      if (rec?.incomeShift4) {
        findRec?.addIncome(4, rec?.incomeShift4);
      }
      if (rec?.outputShift1) {
        findRec?.addOutput(1, rec?.outputShift1);
      }
      if (rec?.outputShift2) {
        findRec?.addOutput(2, rec?.outputShift2);
      }
      if (rec?.outputShift3) {
        findRec?.addOutput(3, rec?.outputShift3);
      }
      if (rec?.outputShift4) {
        findRec?.addOutput(4, rec?.outputShift4);
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
          rec?.outputShift4,
          rec?.itemName,
          rec?.itemKode
        )
      );
    }
  });
  state = finalStock.sort(function (a, b) {
    let x = a['itemKode'];
    let y = b['itemKode'];
      if (x < y) {
        return -1;
      }
      if (x > y) {
        return 1;
      }
  });
}

export const printStock = () => {
  const stockToPrint = state.map((rec) => rec?.getRecordToPrint())
  
  ExportToXls(stockToPrint, `Buku stock tanggal ${ddmmyyyy(date.value, '-')}`)
}