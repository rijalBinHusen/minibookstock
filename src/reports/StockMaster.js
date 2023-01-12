import { getItemById } from "../composables/MasterItems"
import { getStockThatAvailable, Stock_masters } from "../composables/StockMaster"
import ExportToXls from "../utils/ExportToXls"
import { ddmmyyyy, full } from "../utils/dateFormat"

export const startExportMaster = async () => {
    // variable that willl contain result
    const result = []
    // get all stock
    await getStockThatAvailable()
    // get all stock that quantity > 0
    for(const stock of Stock_masters.value) {
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
    ExportToXls(result, `Semua stock yang tersedia dilapangan tanggal ${full()}`)
}
