import "fake-indexeddb/auto"
import { describe, it, expect } from 'vitest'
import { faker } from "@faker-js/faker"
import { createItem, getItemById, updateItemById, getItemIdByKdItem, getAllDataToBackup } from "../src/composables/MasterItems"
import { createStock, changeAvailableStock, getStockById, changeQuantityStock } from "../src/composables/StockMaster"
import { createIncoming, updateIncomingById, getIncomingById } from "../src/composables/Incoming"
import { createOutput, markAsFinished, markAsUnFinished, removeOutputById, changeQuantityOutput } from "../src/composables/Output"

const variableSaved = {
    newItemId: null,
    newStockId: null,
    newIncomingId: null,
    newOutputId: null,
    newQuantityStock: null,
    newAvailableStock: null,
}

for(let i = 0; i < 10; i++)  {
    // item kode for item master
    const item_kode = faker.datatype.string(10)
    // item name
    const item_name = faker.name.firstName()
    // item age
    const item_age = faker.datatype.number({ min: 1, max: 12 })
    // item master
    describe("create master item", () => {
    it("Should create new item", async () => {
        // waiting proses create item and write to indexeddb
            const newItemIdReturned = await createItem(item_kode, item_name, false, false, item_age)
        // find the object from indexeddb by id
            const getData = await getItemById(newItemIdReturned)
        // expecting data that we got match with original record
            expect(getData.kd_item).equal(item_kode)
            // write to up, item id
            variableSaved.newItemId = newItemIdReturned
        })
    })

    // new item varable for update
    const new_kd_item = faker.datatype.string(10)
    // nm_item
    const new_nm_item = faker.name.firstName("male")
    // age item
    const new_age_item = faker.datatype.number({ min:1, max: 12 })

    describe("update master item", () => {
        it("Should create new item", async () => {
            // waiting proses update item and write to indexeddb
                await updateItemById(variableSaved.newItemId, { kd_item: new_kd_item, nm_item: new_nm_item, age_item: new_age_item })
            // find the object from indexeddb by id
                const getData = await getItemById(variableSaved.newItemId)
            // expecting data that we got match with update record
                expect(getData.kd_item).equal(new_kd_item)
                expect(getData.nm_item).equal(new_nm_item)
                expect(getData.age_item).equal(new_age_item)
            })
        })

    describe("get item by kode", () => {
        it("item id must equal", async () => {
            // find the object from indexeddb by id
                const getData = await getItemIdByKdItem(new_kd_item)
            // expecting data that we got match with update record
                expect(getData.id).equal(variableSaved.newItemId)
                expect(getData.nm_item).equal(new_nm_item)
                expect(getData.age_item).equal(new_age_item)
            })
        })
    // end of item master
    // stock master
    const kd_produk = faker.datatype.string(12)
    const date_past = faker.date.past(10)
    const date_produk = date_past.getTime()
    const quantity = faker.datatype.number({ min: 250, max: 15000 })
    describe("create master stock", () => {
        it("Create and expect quantity equal", async () => {
            // set saved variable
            variableSaved.newQuantityStock = quantity
            variableSaved.newAvailableStock = quantity
        // waiting proses create item and write to indexeddb
            const newStockIdReturned = await createStock(variableSaved.newItemId, kd_produk, date_produk, quantity)
        // expecting the returned id not equal to false
            expect(newStockIdReturned).not.equal(false)
            expect(newStockIdReturned).not.equal(null)
            // push to up
            variableSaved.newStockId = newStockIdReturned.id
            // get stock by id
            const stock = await getStockById(newStockIdReturned.id)
            expect(stock.quantity).equal(quantity)
            expect(stock.available).equal(quantity)

            
        })
    })

    const decrement_available = - faker.datatype.number({ min:10, max: quantity })
    const result_of_decrement = quantity + decrement_available
    // update available
    describe(`available now must be equal to ${quantity} ${decrement_available} = ${result_of_decrement}`, () => {
        it(`Available stock should equal to ${result_of_decrement}`, async () => {
            // waiting proses 
             await changeAvailableStock(variableSaved.newStockId, decrement_available)
            //  find rec the we're change
             const findRec = await getStockById(variableSaved.newStockId)
             // expecting available must 90 -5 = 85    
             expect(findRec.available).equal(result_of_decrement)
            //  save  to variable saved
            variableSaved.newAvailableStock = result_of_decrement
        })
    })
    
    describe(`quantity must be equal to ${variableSaved.newQuantityStock} ${decrement_available}`, () => {
        it(`Quantity stock should equal to ${result_of_decrement}`, async () => {
            // waiting proses 
             await changeQuantityStock(variableSaved.newStockId, decrement_available)
            //  find rec the we're change
             const findRec = await getStockById(variableSaved.newStockId)
             // expecting available must 90 -5 = 85    
             expect(findRec.quantity).equal(result_of_decrement)
             expect(findRec.available).equal(result_of_decrement)
            //  save to up, new quantity
             variableSaved.newQuantityStock = result_of_decrement
        })
    })
    // end stock master
    // incoming
    const incoming_paper = faker.datatype.string(20)
    const incoming_date_model = faker.date.past(1)
    const incoming_date = incoming_date_model.getTime()
    const incoming_type = faker.datatype.string(11)
    const incoming_shift = faker.datatype.number({ min: 1, max: 3})
    const incoming_receiver = faker.name.firstName("male")
    const incoming_sender = faker.name.firstName("male")
    describe("Create new incoming record", () => {
        it("Should return not null", async () => {
            // waiting proses 
             const income = await createIncoming([variableSaved.newStockId], incoming_paper, incoming_date, incoming_shift, incoming_receiver, incoming_type, incoming_sender, false)
            //  save to variable
            variableSaved.newIncomingId = income.id
            // expect
             expect(income).not.equal(null)
        })
    })
    // update incoming
    const newVariableIncoming = {
        paper_id: faker.datatype.string(30),
        diterima: faker.name.firstName("female"),
        type: faker.datatype.string(13),
        diserahkan: faker.name.firstName('female'),
    }
    describe("Update incoming record", () => {
        it("Should equal to new variable", async () => {
            // waiting proses 
            await updateIncomingById(variableSaved.newIncomingId, newVariableIncoming)
            //  get incoming by id
            const incomingRec = await getIncomingById(variableSaved.newIncomingId)
            // expect not equal to old
            expect(incomingRec.diserahkan).not.equal(incoming_sender)
             expect(incomingRec.diterima).not.equal(incoming_receiver)
             expect(incomingRec.paper_id).not.equal(incoming_paper)
             expect(incomingRec.type).not.equal(incoming_type)
            // expect equal to new
             expect(incomingRec.diserahkan).equal(newVariableIncoming.diserahkan)
             expect(incomingRec.diterima).equal(newVariableIncoming.diterima)
             expect(incomingRec.paper_id).equal(newVariableIncoming.paper_id)
             expect(incomingRec.type).equal(newVariableIncoming.type)
        })
    })
    // end of incoming
    // output

    const output_paper = faker.datatype.string(20)
    const output_date_model = faker.date.past(1)
    const output_date = output_date_model.getTime()
    const output_type = faker.datatype.string(11)
    const output_shift = faker.datatype.number({ min: 1, max: 3})
    const output_quantity = faker.datatype.number({ min: 10, max: result_of_decrement})
    describe(`Create new output record quantity ${output_quantity}, available stock is ${result_of_decrement}`, () => {
        it("Should return not null", async () => {
            // waiting proses 
             const output = await createOutput(output_date, output_type, output_shift, output_paper, variableSaved.newStockId, output_quantity, output_paper)
            //  save to variable
            variableSaved.newOutputId = output.id
            // expect
             expect(output).not.equal(null)
            //  send to variable saved
            variableSaved.newOutputId = output.id
        })
    })

    // check available of stock
    // it must be equal to new new available stock - output quantity
    const availableStockAfterOutput = result_of_decrement - output_quantity
    describe("Check available stock", () => {
        it(`Available stock must be equal to ${result_of_decrement} - ${output_quantity} = ${availableStockAfterOutput}`, async () => {
            //  find rec the we're change
             const findRec = await getStockById(variableSaved.newStockId)
             // expecting available must 90 -5 = 85    
             expect(findRec.available).equal(availableStockAfterOutput)
        })
    })
    
    // mark as finished
    describe("Mark output as finished", () => {
        it("Should return not null", async () => {
            // waiting proses 
             const output = await markAsFinished(variableSaved.newOutputId)
            // expect
             expect(output).not.equal(false)
        })
    })

    // check quantity stock
    // it must be equal to new quantity stock - output quantity
    describe(`quantity must be equal to ${variableSaved.newQuantityStock} - ${output_quantity} = ${availableStockAfterOutput}`, () => {
        it(`Quantity stock should equal to ${availableStockAfterOutput}`, async () => {
            //  find rec that we're change
             const findRec = await getStockById(variableSaved.newStockId)
             // expecting available must 90 -5 = 85    
             expect(findRec.quantity).equal(availableStockAfterOutput)
             expect(findRec.available).equal(availableStockAfterOutput)
        })
    })

    // mark as un finished
    describe("Mark output as unfinished", () => {
        it("Should return not null", async () => {
            // waiting proses 
             const output = await markAsUnFinished(variableSaved.newOutputId)
            // expect
             expect(output).not.equal(false)
        })
    })

    // check quantity stock it must be equal to new quantity stock

    describe(`quantity must be equal to ${variableSaved.newQuantityStock}`, () => {
        it(`Quantity stock should equal`, async () => {
            //  find rec that we're change
             const findRec = await getStockById(variableSaved.newStockId)
             // expecting available must 90 -5 = 85    
             expect(findRec.quantity).equal(variableSaved.newQuantityStock)
        })
    })

    // update to new quantity and other variable
    const new_output_quantity = faker.datatype.number({ max: result_of_decrement})
    describe(`Update quantity output`, () => {
        it(`Quantity output must be equal to ${new_output_quantity}`, async () => {
            //  find rec that we're change
             const updateOutput = await changeQuantityOutput(variableSaved.newOutputId, new_output_quantity)
             // expecting available must 90 -5 = 85    
             expect(updateOutput).not.equal(false)
        })
    })

    // check available stock, it must be equal to new available stock - new quantity output
    const availableStockAfterUpdateOutput = result_of_decrement - new_output_quantity
    describe("Check available stock after update output with new quantity", () => {
        it(`Available stock must be equal to ${result_of_decrement} - ${new_output_quantity} = ${availableStockAfterUpdateOutput}`, async () => {
            //  find rec the we're change
             const findRec = await getStockById(variableSaved.newStockId)
             // expecting available must 90 -5 = 85    
             expect(findRec.available).equal(availableStockAfterUpdateOutput)
        })
    })

    // mark as finished
    describe("Mark output as finished", () => {
        it("Should return not null", async () => {
            // waiting proses 
             const output = await markAsFinished(variableSaved.newOutputId)
            // expect
             expect(output).not.equal(false)
        })
    })

    // check quantity stock, it must be equal to new quantity stock - new quantity output
    describe(`quantity must be equal to ${result_of_decrement} - ${new_output_quantity} = ${availableStockAfterUpdateOutput}`, () => {
        it(`Quantity stock should equal to ${availableStockAfterUpdateOutput}`, async () => {
            //  find rec that we're change
             const findRec = await getStockById(variableSaved.newStockId)
             // expecting available must 90 -5 = 85    
             expect(findRec.quantity).equal(availableStockAfterUpdateOutput)
             expect(findRec.available).equal(availableStockAfterUpdateOutput)
        })
    })    

    // mark as un finished
    describe("Mark output as unfinished", () => {
        it("Should return not null", async () => {
            // waiting proses 
                const output = await markAsUnFinished(variableSaved.newOutputId)
            // expect
                expect(output).not.equal(false)
        })
    })

    // check quantity stock, it must be equal to new quantity stock
    describe(`quantity must be equal to ${variableSaved.newQuantityStock}`, () => {
        it(`Quantity stock should equal`, async () => {
            //  find rec that we're change
             const findRec = await getStockById(variableSaved.newStockId)
             // expecting available must 90 -5 = 85    
             expect(findRec.quantity).equal(variableSaved.newQuantityStock)
        })
    })

    // remove output
    describe("Mark output as unfinished", () => {
        it("Should return not null", async () => {
            // waiting proses 
                const output = await removeOutputById(variableSaved.newOutputId)
            // expect
                expect(output).not.equal(false)
        })
    })

    // check available stock, it must be equal to new available stock
    describe(`quantity must be equal to ${variableSaved.newQuantityStock}`, () => {
        it(`Quantity stock should equal`, async () => {
            //  find rec that we're change
             const findRec = await getStockById(variableSaved.newStockId)
             // expecting available must 90 -5 = 85    
             expect(findRec.available).equal(variableSaved.newAvailableStock)
        })
    })
    
}