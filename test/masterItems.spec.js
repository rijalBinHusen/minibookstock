import "fake-indexeddb/auto"
import { createItem, getItemById, updateItemById, getItemIdByKdItem, getAllDataToBackup } from "../src/composables/MasterItems"
import { describe, it, expect } from 'vitest'

let newItemId = null
// new record
const kd_item = "kode";
const nm_item = "itemnya fsldfjoier";
const age = 7;
// update record
const newKd_item = "123123123";
const newNm_item = "jika aaa";
const newAge = 9
describe("create master item", () => {
    it("Should create new item", async () => {
        // waiting proses create item and write to indexeddb
            const newItemIdReturned = await createItem(kd_item, nm_item, false, false, age)
        // find the object from indexeddb by id
            const getData = await getItemById(newItemIdReturned)
        // expecting data that we got match with original record
            expect(getData.kd_item).equal(kd_item)
            // write to up
            newItemId = newItemIdReturned
        })
    })

    describe("update master item", () => {
        it("Should create new item", async () => {
            // waiting proses update item and write to indexeddb
                await updateItemById(newItemId, { kd_item: newKd_item, nm_item: newNm_item, age: newAge })
            // find the object from indexeddb by id
                const getData = await getItemById(newItemId)
            // expecting data that we got match with update record
                expect(getData.kd_item).equal(newKd_item)
                expect(getData.nm_item).equal(newNm_item)
                expect(getData.age).equal(newAge)
            })
        })

    describe("get item by kode", () => {
        it("item id must equal", async () => {
            // find the object from indexeddb by id
                const getData = await getItemIdByKdItem(newKd_item)
            // expecting data that we got match with update record
                expect(getData.id).equal(newItemId)
                expect(getData.nm_item).equal(newNm_item)
                expect(getData.age).equal(newAge)
            })
        })