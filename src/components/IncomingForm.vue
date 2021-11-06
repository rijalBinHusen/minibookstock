<template>
  <div>
    <div
      id="incoming_add_form"
      class="grid rounded justify-items-center m-auto px-2 py-20 bg-base-200"
    >
      <div id="incoming_add_mode" class="grid justify-items-center">
        <Select 
            tipe="primary" 
                :options="[
                    { status: 0, option: 'No paper'},
                    { status: 1, option: 'With paper' }
                ]"
            value="status"
            text="option"
        />
      </div>

      <div id="incoming_add_form" class="grid justify-items-center">
        <div id="incoming_info" class="grid grid-cols-3 gap-4">
          <!-- date picker -->
          <div class="form-control">
            <label for="date-picker" class="label">
              <span class="label-text">Date</span>
            </label>
            <date-picker
              id="date-picker"
              class="input input-outline input-primary input-sm"
              v-model="tanggal"
            ></date-picker>
          </div>
          <!-- end of date picker -->

          <!-- Shift -->
          <div class="form-control">
            <label for="shift" class="label">
              <span class="label-text">Shift</span>
            </label>
            <Select
              @selectedd="shift == $event"
              id="shift"
                :options="[
                    { shift: 1 },
                    { shift: 2 },
                    { shift: 3 },
                ]"
                value="shift"
                text="shift"
              tipe="primary small"
            />
          </div>
          <!-- end of Shift -->

          <!-- Coming from -->
          <Input
            label="Coming from"
            small
            @send="come = $event"
            placeholder="Coming from"
            tipe="primary"
          />
          <!-- End of coming from -->
        </div>

        <div id="incoming_paper" class="grid grid-cols-3 gap-4">
          <Input
            label="Paper id"
            @send="paperId = $event"
            small
            placeholder="Paper id"
            tipe="primary"
          />
          <Input
            label="Hand by"
            @send="handBy = $event"
            small
            placeholder="Hand by"
            tipe="primary"
          />
          <Input
            label="Receive by"
            small
            @send="received = $event"
            placeholder="Receive by"
            tipe="primary"
          />
        </div>

        <div id="incoming_items" class="grid grid-cols-3 gap-4 mb-2">
          <Input
            label="Item"
            @send="item = $event"
            small
            placeholder="Item"
            tipe="primary"
          />
          <Input
            label="Quantity"
            @send="qty = $event"
            small
            placeholder="Quantity"
            tipe="primary"
          />
          <Input
            label="Date"
            @send="tgl = $event"
            small
            placeholder="Date"
            tipe="primary"
          />
        </div>

        <div id="incoming_item_add" class="w-full text-right mb-2">
          <Button type="button" primary @trig="add" value="Add items" small />
        </div>

        <Table
          v-if="items.length > 0"
          :contents="items"
          style="max-height: 200px; overflow: auto"
        />

        <div id="incoming_add_submit" class="w-full">
          <Button type="button" @trig="save" primary value="Submit" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import datePicker from "vue3-datepicker";
import Select from "./elements/Forms/Select.vue";
import Input from "./elements/Forms/Input.vue";
import Button from "./elements/Button.vue";
import Table from "./elements/Table.vue";

export default {
  name: "IncomingForm",
  data() {
    return {
      tanggal: new Date(),
      shift: 1,
      come: "",
      paperId: "",
      handBy: "",
      received: "",
      items: [],
      item: "",
      qty: "",
      tgl: "",
    };
  },
  methods: {
    save() {
      this.$store.dispatch("Incoming/append", {
        tanggal: this.tanggal,
        shift: this.shift,
        come: this.come,
        paperId: this.paperId,
        handBy: this.handBy,
        received: this.received,
        items: this.items,
      });
    },
    add() {
      if (this.item && this.qty && this.tgl)
        this.items.unshift({
          item: this.item,
          qty: this.qty,
          tgl: this.tgl,
        });
    },
  },
  components: {
    Select,
    Input,
    Button,
    Table,
    datePicker,
  },
};
</script>
