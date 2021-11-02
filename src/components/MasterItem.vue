<template>
<!-- tampilkan group dulu -->
<!-- dibawah group baru tampilkan table nya -->
    <div class="grid" v-for="gr in group" :key="gr.id">
        <span class="text-3xl font-bold mt-9 mb-2">
          {{ gr.name_group }}
        </span>
    <Table
      v-if="lists && lists.length > 0"
      :contents="lists(gr.id)"
      :options="['edit']"
      keyData="id"
      :thead="['Kode', 'Name']"
      :tbody="['item_kode', 'item_name']"
    >
    </Table>
    </div>
</template>

<script>
import Table from "./elements/Table.vue";
export default {
    name: "MasterItem",
    components: {
      Table,
    },
    methods: {
        lists(group) {
          console.log(group)
          return this.$store.getters["Item/byGroup"](group)
        },
    },
    computed: {
        group() {
          return this.$store.state.Group.lists;
        },
    },
}
</script>