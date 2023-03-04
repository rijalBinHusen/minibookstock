import "fake-indexeddb/auto"
import { useIdb } from "../src/utils/localforage"
import { describe, it, expect } from 'vitest'
import { faker } from "@faker-js/faker"

describe("We can store a record to indexeddb and retrieve the record", () => {
    let wasInsertedId = null
    it("Should retrieve a record from indexeddb", async () => {
        const db = useIdb('test')
        for(let i = 0; i < 100; i++) {
            // initialize object that we would to store
            const record = { name: faker.datatype.string(13), age: faker.datatype.number({ min: 12 }) }
            // waiting proses store object to indexeddb
            const inserted = await db.createItem(record)
            // console.log(`Operation ${i} inserted with Id ${inserted.id}, the Id was ${wasInsertedId}`)
            // find the object from indexeddb by id
            const getData = await db.getItem(inserted.id)
            // expecting data that we got match with original record
            expect(getData).toMatchObject(record)
            // make sure that the id is different
            expect(wasInsertedId).not.equal(inserted.id)
            // set wasInsertedId variable
            wasInsertedId = inserted.id
        }
    })
}, 100000)