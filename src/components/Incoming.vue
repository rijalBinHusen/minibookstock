<template>
    <div class="grid mx-2 gap-2">
        <span class="flex">
            <span class="text-3xl">Incoming</span>
            <date-picker class="ml-2 bg-base-200 p-2 rounded     " v-model="tanggal"></date-picker>
        </span>
        <datatable
            :heads="['tanggal', 'shift', 'nameItem', 'qty']"
            :datanya="lists"
            keydata="id"
            no
            id="table-incoming"
            option
            v-slot:default="slotProps"
        >

      <Button
        primary
        
        value="Detail"
        type="button"
        small
        class="ml-2"
        :datanya="slotProps.prop.parent"
        @trig="detail($event)"
      />
        </datatable>
    </div>
</template>

<script>
import datePicker from "vue3-datepicker";
import Datatable from "./parts/Datatable.vue";
import Button from "./elements/Button.vue";

export default {
    name: "Incoming",
    data() {
        return {
            tanggal: new Date(),
        }
    },
    components: {
        Datatable,
        datePicker,
        Button,
    },
    methods: {
        detail(id) {
            window.location.href = "#my-modal"
            this.$store.commit("form", {
                form: "IncomingForm",
                document: id
            }); 
            // this.$store.state.form                  
        },
    },
    computed: {
        lists() {
            return this.$store.getters["Mutation/incoming"](this.tanggal.getDate())
        },
    }
}
</script>