<template>
  <div class="w-full mb-2 border" :style="style">
    <table :id="id" class="table w-full h-full table-compact">
      <thead>
        <tr>
          <th>No</th>
          <th v-for="head in thead" :key="head">
            {{ head }}
          </th>
          <th v-if="options">options</th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="hover"
          v-for="(content, index) in contents"
          :key="content[thead[0]]"
        >
          <th>{{ index + 1 }}</th>
          <td v-for="val in tbody" :key="content[val]">{{ content[val] }}</td>
          <td v-if="options">
            <Button
              v-if="options.includes('edit')"
              primary
              value="Edit"
              type="button"
              small
              :datanya="content[keyData]"
              @trig="$emit('edit', $event)"
            />
            <slot :prop="content"></slot>
            <Button
              v-if="options.includes('delete')"
              secondary
              value="hapus"
              type="button"
              small
              :datanya="content[keyData]"
              @trig="$emit('deleteRec', $event)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Button from "./Button.vue";
/**
 how to use it?
<Table
  keyData="Key that would you accept when button clicked"
  style="put your css style here"
  contents="array of object that would show in table"
  options="button that would show in table, ['edit', 'deleteRec']"
  thead="array of string for table header"
  tbody="array of string desribe your key content"
/>
 *  */
export default {
  name: "Table",
  props: {
    keyData: String,
    style: Object,
    contents: {
      type: Object,
      required: true,
    },
    options: Array,
    thead: {
      type: Array,
      required: true,
    },
    tbody: {
      type: Array,
      required: true,
    },
    id: String,
  },
  emits: ["edit", "deleteRec"],
  components: {
    Button,
  },
};
</script>
