import "fake-indexeddb/auto"
import { createItem, getItemById, updateItemById, getItemIdByKdItem, getAllDataToBackup } from "../src/composables/MasterItems"
import { describe, it, expect } from 'vitest'

let newItemId = null

const records = [
    { 
        kd_item: "kode", nm_item: "itemnya fsldfjoier", age: 7,
        newKd_item : "123123123", newNm_item : "jika aaa", newAge : 9
    },
    { 
        kd_item: "sdjfoieur", nm_item: "skdjfwoieur", age: 7,
        newKd_item : "skdjfwiuerwoiur", newNm_item : "sdfuo74239487", newAge : 9
    },
    { 
        kd_item: "sldkjfwiur", nm_item: "0293812l3kjdsfdf", age: 7,
        newKd_item : "sldkjfwper8w0e9r8", newNm_item : "sldkfjwir", newAge : 9
    },
    { 
        kd_item: "aqerwer", nm_item: "skdjfsl;dnc,zmnclkjsdf", age: 7,
        newKd_item : "sdkfjjsldkfjwpoeriu", newNm_item : "sdkfhowieur", newAge : 9
    },
    { 
        kd_item: "sldkfjwoieur", nm_item: "skdfj,mcmdjwoiuer", age: 7,
        newKd_item : "lsdkjfcmnvbskdfj", newNm_item : "sldkjf0983409234", newAge : 9
    },
    { 
        kd_item: "lksdjfpwoeirwer", nm_item: "0w98r423 nkjflsdfj", age: 7,
        newKd_item : "sldjfpw984023984", newNm_item : "sdlkfweiur", newAge : 9
    },
    { 
        kd_item: "sdkfj0w9er80w9e", nm_item: "lsdkjfowiuer8weur", age: 7,
        newKd_item : "sldkfjwper023984", newNm_item : "sldfjwpeo9r80293894", newAge : 9
    },
    { 
        kd_item: "sdlkjfpweruwioeur", nm_item: "skdfjwoieurwoeiur", age: 7,
        newKd_item : "sdlf09834984848", newNm_item : "sdkfncnc", newAge : 9
    },
]

for( const record of records)  {
    describe("create master item", () => {
    it("Should create new item", async () => {
        // waiting proses create item and write to indexeddb
            const newItemIdReturned = await createItem(record.kd_item, record.nm_item, false, false, record.age)
        // find the object from indexeddb by id
            const getData = await getItemById(newItemIdReturned)
        // expecting data that we got match with original record
            expect(getData.kd_item).equal(record.kd_item)
            // write to up
            newItemId = newItemIdReturned
        })
    })

    describe("update master item", () => {
        it("Should create new item", async () => {
            // waiting proses update item and write to indexeddb
                await updateItemById(newItemId, { kd_item: record.newKd_item, nm_item: record.newNm_item, age_item: record.newAge })
            // find the object from indexeddb by id
                const getData = await getItemById(newItemId)
            // expecting data that we got match with update record
                expect(getData.kd_item).equal(record.newKd_item)
                expect(getData.nm_item).equal(record.newNm_item)
                expect(getData.age_item).equal(record.newAge)
            })
        })

    describe("get item by kode", () => {
        it("item id must equal", async () => {
            // find the object from indexeddb by id
                const getData = await getItemIdByKdItem(record.newKd_item)
            // expecting data that we got match with update record
                expect(getData.id).equal(newItemId)
                expect(getData.nm_item).equal(record.newNm_item)
                expect(getData.age_item).equal(record.newAge)
            })
        })
}