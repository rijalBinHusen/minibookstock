import "fake-indexeddb/auto"
import { describe, it, expect } from 'vitest'
import { createStock, changeAvailableStock, getStockById, changeQuantityStock } from "../src/composables/StockMaster"

let newItemId = null

describe("create master stock", () => {
    it("Should create new master stock", async () => {
    // waiting proses create item and write to indexeddb
        const newItemIdReturned = await createStock("01", "09823123", 982938, 90)
    // expecting the returned id not equal to false
        expect(newItemIdReturned).not.equal(false)
        // push to up
        newItemId = newItemIdReturned.id
    })
})

describe("available must decrement by 5", () => {
    it("Available stock should equal to 85", async () => {
        // waiting proses 
         await changeAvailableStock(newItemId, -5)
        //  find rec the we're change
         const findRec = await getStockById(newItemId)
         // expecting available must 90 -5 = 85    
         expect(findRec.available).equal(85)
    })
})

describe("quantity must decrement by 5", () => {
    it("Quantity stock should equal to 85", async () => {
        // waiting proses 
         await changeQuantityStock(newItemId, -5)
        //  find rec the we're change
         const findRec = await getStockById(newItemId)
         // expecting available must 90 -5 = 85    
         expect(findRec.quantity).equal(85)
         expect(findRec.available).equal(85)
    })
})