import { getItemById } from "../composables/MasterItems"
import { getStockThatAvailable, Stock_masters } from "../composables/StockMaster"
import ExportToXls from "../utils/ExportToXls"
import { ddmmyyyy, full } from "../utils/dateFormat"
import { loaderMessage } from "../utils/launchForm"

export const startExportMaster = async () => {
    // variable that willl contain result
    const result = []
    // get all stock that available
    await getStockThatAvailable()
    // get item info for each stock
    for(const [indexStock, stock] of Stock_masters.value.entries()) {
      // set message to show in loader
      loaderMessage(`Mengambil ${indexStock} dari ${Stock_masters.value.length} informasi`)
        if(Number(stock?.quantity) > 0) {
            // get item info
            const item = await getItemById(stock?.item_id)
            // push to result
            result.push({
                kode_item: item.kd_item,
                nama_item: item.nm_item,
                quantity: stock?.quantity,
                tanggal_produksi: ddmmyyyy(stock?.product_created, '-')
            })
        }
    }
    ExportToXls(result, `Stock yang tersedia dilapangan tanggal ${full()}`)
}
