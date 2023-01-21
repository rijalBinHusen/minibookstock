import "fake-indexeddb/auto"
import { useIdb } from "../src/utils/localforage"
import { describe, it, expect } from 'vitest'

describe("We can store a record to indexeddb and retrieve the record", () => {

    it("Should retrieve a record from indexeddb", async () => {
        const db = await useIdb('test')
        // initialize object that we would to store
            const record = { id: "1", name: 'Bill', age: 47 }
        // waiting proses store object to indexeddb
            await db.setItem(record.id, record)
        // find the object from indexeddb by id
            const getData = await db.getItem(record.id)
        // expecting data that we got match with original record
            expect(getData).toMatchObject(record)
        })
    })