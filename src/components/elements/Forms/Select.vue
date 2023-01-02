<template>
  <select
    :id="id"
    :class="selectTipe"
    @change="$emit('selectedd', $event.target.value)"
  >
    <option value=""></option>
    <option 
        v-for="op in options" :key="op" 
        :value="op[value]"
        :selected="op[value] === inSelect"
    >
      {{ op[text] }}
    </option>
  </select>
</template>

<script>
/* Example how to use it
  <Select 
    value="the value that would emit when the text selected"
    text="the text that would show as select option"
    id="yourSelectId"
    class="your additional class"
    options="[
          { id: 'database', title: 'Import database'}, 
          { id: 'salesOrder', title: 'Import outstanding SO'}"
    ]
    size="small"
    @selectedd="event when input select change"
  />
*/
export default {
  name: "Select",
  props: {
    value: String,
    text: String,
    id: String,
    class: String,
    options: {
      type: Object,
      required: true,
    },
      //options = [{key: "string", {key2: "string2"}}]
      // value = "key"
      // text = "key2"
    size: {
      type: String,
    },
    inSelect: String | Number,
  },
  emits: ["selectedd"],
  computed: {
    selectTipe() {
      let className = ["select", "select-bordered"];

      if (this.class) className.push(this.class);
      if (this.size.includes("primary")) className.push("select-primary");
      if (this.size.includes("secondary")) className.push("select-secondary");
      if (this.size.includes("accent")) className.push("select-accent");
      if (this.size.includes("info")) className.push("select-info");
      if (this.size.includes("success")) className.push("select-success");
      if (this.size.includes("warning")) className.push("select-warning");
      if (this.size.includes("error")) className.push("select-error");
      if (this.size.includes("large")) className.push("select-lg");
      if (this.size.includes("small")) className.push("select-sm");
      if (this.size.includes("xsmall")) className.push("select-xs");
      return className.join(" ");
    },
    activated() {
      this.$emit("selectedd", this.options[0][this.value]);
      console.log(this.options[0][this.value]);
      return "";
    },
  },
};
</script>
