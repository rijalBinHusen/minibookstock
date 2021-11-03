<template>
    <span>Incoming</span>
    <Datatable
        :heads="['tanggal', 'shift', 'item', 'qty']"
        :datanya="lists"
        keydata="id"
        no
        id="table-incoming"
    />
</template>

<script>
import Datatable from "./parts/Datatable.vue";
export default {
    name: "Incoming",
    components: {
        Datatable,
    },
    computed: {
        lists() {
            return this.$store.getters["Mutation/incoming"]
        },
    }
}
</script>