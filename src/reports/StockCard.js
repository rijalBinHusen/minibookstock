import { getItemById } from '../composables/MasterItems';
import { getStockMasterByItemId } from '../composables/StockMaster';
import { getIncomingById } from '../composables/Incoming';
import { ddmmyyyy } from '../utils/dateFormat';
import { useJurnalProdukMasuk } from '../composables/Setting_JurnalId';
import {
  getOutputByStockMasterId,
  getTotalStockTaken,
} from '@/pages/Output/Output';
import ExportToXls from '../utils/ExportToXls';
import { loaderMessage } from '../utils/launchForm';
import { useIdb } from '../utils/localforage';

export const stockCard = async (item_id, tanggal_start, tanggal_finished) => {
  // use jurnal produk masuk
  const { getJurnalProdukMasukById } = useJurnalProdukMasuk();
  // get item info
  const itemInfo = await getItemById(item_id);
  // temproray result
  let tempRes = [];
  // show message to loader
  loaderMessage('Mengambil stock master');
  // get all stock master
  const stockMasters = await getStockMasterByItemId(item_id);
  // loop all stock masters
  for (const [index, stock] of stockMasters.entries()) {
    // show message to loader
    loaderMessage(
      `Mengambil stock master ${index} dari ${stockMasters.length}`
    );
    // get info icoming_parent_id
    const incomingInfo = await getIncomingById(stock?.icoming_parent_id);
    // get name jurnal
    const jurnalInfo = await getJurnalProdukMasukById(incomingInfo.type);
    // get total stock taken in output
    const stockTaken = await getTotalStockTaken(stock?.id);
    // push incoming
    tempRes.push({
      unix_time: incomingInfo?.tanggal,
      stock_id: stock?.id,
      tanggal_transaksi: ddmmyyyy(incomingInfo?.tanggal, '-'),
      nomor_dokumen: incomingInfo?.paper_id,
      shift: incomingInfo?.shift,
      mutasi: 'Masuk',
      kode_item: itemInfo.kd_item,
      nama_item: itemInfo.nm_item,
      type: jurnalInfo?.nama_jurnal,
      tanggal_produk: ddmmyyyy(stock?.product_created, '-'),
      quantity: stock?.quantity + stockTaken?.allFinished,
    });
    // get all output by stock master id
    const allOutput = await getOutputByStockMasterId(stock?.id);
    if (allOutput.length) {
      tempRes = tempRes.concat(allOutput);
    }
  }
  // filter temproray result
  const filterTempResult = tempRes.filter(
    (res) => res.unix_time >= tanggal_start && res.unix_time <= tanggal_finished
  );
  // sort result
  const sortFilterResult = filterTempResult.sort(
    (a, b) => a['unix_time'] - b['unix_time']
  );
  // export as excel
  ExportToXls(
    sortFilterResult,
    `Kartu stock ${itemInfo.nm_item} ${ddmmyyyy(
      tanggal_start,
      '-'
    )} sampai dengan ${ddmmyyyy(tanggal_finished, '-')}`
  );
};

export const stockCard2 = async (item_id, tanggal_start, tanggal_finished) => {
  // use jurnal produk masuk
  const { getJurnalProdukMasukById } = useJurnalProdukMasuk();
  // get item info
  const itemInfo = await getItemById(item_id);
  // temproray result
  let tempRes = [];
  // show message to loader
  loaderMessage('Mengambil stock master');
  // initiate incomedb
  const incomedb = await useIdb('income');
  // get all income between date
  // loop all income, loop stock child, pick when item id === item_id

  // get all stock master
  const stockMasters = await getStockMasterByItemId(item_id);
  // loop all stock masters
  for (const [index, stock] of stockMasters.entries()) {
    // show message to loader
    loaderMessage(
      `Mengambil stock master ${index} dari ${stockMasters.length}`
    );
    // get info icoming_parent_id
    const incomingInfo = await getIncomingById(stock?.icoming_parent_id);
    // get name jurnal
    const jurnalInfo = await getJurnalProdukMasukById(incomingInfo.type);
    // get total stock taken in output
    const stockTaken = await getTotalStockTaken(stock?.id);
    // push incoming
    tempRes.push({
      unix_time: incomingInfo?.tanggal,
      stock_id: stock?.id,
      tanggal: ddmmyyyy(incomingInfo?.tanggal, '-'),
      nomor_dokumen: incomingInfo?.paper_id,
      shift: incomingInfo?.shift,
      mutasi: 'Masuk',
      kode_item: itemInfo.kd_item,
      nama_item: itemInfo.nm_item,
      type: jurnalInfo?.nama_jurnal,
      tanggal_produk: ddmmyyyy(stock?.product_created, '-'),
      quantity: stock?.quantity + stockTaken?.allFinished,
    });
    // get all output by stock master id
    const allOutput = await getOutputByStockMasterId(stock?.id);
    if (allOutput.length) {
      tempRes = tempRes.concat(allOutput);
    }
  }
  // filter temproray result
  const filterTempResult = tempRes.filter(
    (res) => res.unix_time >= tanggal_start && res.unix_time <= tanggal_finished
  );
  // sort result
  const sortFilterResult = filterTempResult.sort(
    (a, b) => a['unix_time'] - b['unix_time']
  );
  // export as excel
  ExportToXls(
    sortFilterResult,
    `Kartu stock ${itemInfo.nm_item} ${ddmmyyyy(
      tanggal_start,
      '-'
    )} sampai dengan ${ddmmyyyy(tanggal_finished, '-')}`
  );
};
