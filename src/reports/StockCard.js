import { getStockMasterByItemId } from "../composables/StockMaster"

export const stockCard = async (item_id, tanggal_start, tanggal_finished) => {

    // get all stock master based on item id
    const incoming = await getStockMasterByItemId(item_id)
    // get all output based on stock master
    console.log(incoming)
    // sorting by id

    // export as excel
}