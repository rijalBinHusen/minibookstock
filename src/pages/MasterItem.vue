<template>
<!-- tampilkan group dulu -->
<!-- dibawah group baru tampilkan table nya -->
    <div class="grid" v-for="gr in group" :key="gr.id">
        <span class="text-3xl font-bold mt-9 mb-2">
          {{ gr.name_group }}
        </span>
        Hellow owksjdhf
    <Table
      v-if="lists && lists.length > 0"
      :contents="lists(gr.id)"
      :options="['edit']"
      keyData="id"
      :thead="['Kode', 'Name', 'Quantity']"
      :tbody="['item_kode', 'item_name', 'item_qty']"
      v-slot:default="slotProps"
    >
    <Dropdown 
      text="Move to" 
      :options ="[
        {method: master, text: 'GJST', icon: 'times-circle', value: slotProps.prop.id},
        {method: master, text: 'GJST', icon: 'times-circle', value: slotProps.prop.id},
        {method: master, text: 'GJST', icon: 'times-circle', value: slotProps.prop.id},
        {method: master, text: 'GJST', icon: 'times-circle', value: slotProps.prop.id},
        {method: master, text: 'GJST', icon: 'times-circle', value: slotProps.prop.id},
        ]" 
      primary 
      small />
    </Table>
    </div>
</template>

<script>
import Table from "../components/elements/Table.vue";
import Dropdown from "../components/elements/Dropdown.vue";
export default {
    name: "MasterItem",
    components: {
      Table,
      Dropdown,
    },
    methods: {
        lists(group) {
          return this.$store.getters["Item/byGroup"](group)
        },
        master(item) {
          console.log(item);
        }
    },
    computed: {
        group() {
          return this.$store.state.Group.lists;
        },
    },
}
</script>