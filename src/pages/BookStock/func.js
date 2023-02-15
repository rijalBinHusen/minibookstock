import { store as storeStockMaster } from "../../composables/StockMaster"
import { store as storeIncoming } from "../../composables/Incoming"
import { store as storeOutput } from "../../composables/Output"
import { useIdb } from "../../utils/localforage"

// state
// date to show

export function getBookStock () {
    // function to get stock master >= date to show && <= date to show
    const db = useIdb(storeStockMaster)
    db.getItemsByKeyGreaterOrEqualThanAndLowerOrEqualThan()
}
// 