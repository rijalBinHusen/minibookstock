import { getItemById } from "../composables/MasterItems"
import { getStockMasterByItemId } from "../composables/StockMaster"
import ExportToXls, {} from "../utils/ExportToXls"

export const stockCard = async (item_id, tanggal_start, tanggal_finished) => {

    // get all transaction
    const allTransaction = await getStockMasterByItemId(item_id)
    // get item info
    const itemInfo = await getItemById(item_id)
    // export as excel
    ExportToXls(allTransaction, `Kartu stock ${itemInfo.nm_item}`)
    // console.log(allTransaction)
}