import 'fake-indexeddb/auto'
import { mount, shallowMount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, test } from "vitest";
import AppVue from "../src/App.vue";
import Vuex from "vuex"

const wrapper = shallowMount(AppVue)
wrapper.use(Vuex)

describe('Mutation', () => {
    let store;
    let mutations;

    beforeEach(() => {
        mutations = { MUTATION: jest.fn() }

        store = new Vuex.Store({ mutations })
    })

    test('Does wrapper exists', () => {
        expect(wrapper.exists()).toBe(true)
    })

    // test('Detect all svg icon', () => {
    //     const icon = wrapper.findAll('svg.icon')
    //     expect(icon).toHaveLength(3)
    // })

    // test('Click svg icon in new folder to launch the modal', async () => {
    //     // get a button that contain action new folder
    //     const icon = wrapper.find('svg.new-folder')
    //     // triger the button
    //     await icon.trigger('click')
    //     // find the modal
    //     // const modal = wrapper.find('#myModal')
    //     // expect the modal show
    //     expect(wrapper.find('#myModal').exists()).toBe(true)
    //     // console.log(wrapper)
    // })

    // test('Close modal by clock close icon', async () => {
    //     // get a button that contain action new folder
    //     const icon = wrapper.find('.close-modal-icon')
    //     // triger the button
    //     await icon.trigger('click')
    //     // find the modal
    //     // const modal = wrapper.find('#myModal')
    //     // expect the modal show
    //     expect(wrapper.find('#myModal').exists()).toBe(false)
    //     // console.log(wrapper)
    // })

    // test('Create new folder', async () => {
    //     // open the modal
    //     // get a button that contain action new folder
    //     const icon = wrapper.find('svg.new-folder')
    //     // triger the button
    //     await icon.trigger('click')
    //     // find the input text on modal
    //     const inputtext = wrapper.find('#name-to-input')
    //     // fill the input
    //     await inputtext.setValue('Side job')
    //     // trigger the create folder function
    //     await inputtext.trigger('keydown.enter')
    //     // All svg icon must be 3
    //     expect(wrapper.find('svg.icon')).toHaveLength(4)
    //     // console.log(wrapper)
    // })

    // const btn = wrapper
})