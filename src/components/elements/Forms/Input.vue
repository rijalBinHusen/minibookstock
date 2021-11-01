<template>
  <div class="form-control">
    <label v-if="label" class="label">
      <span class="label-text">{{ label }}</span>
    </label>
    <div class="relative">
      <input
        :type="type"
        :placeholder="placeholder"
        :class="formTipe"
        @keyup="send($event.target.value)"
        :value="value"
        @keypress.enter="$emit('trig')"
        :ref="ref"
      />
      <button
        v-if="button"
        class="absolute top-0 right-0 rounded-l-none btn btn-primary"
        @click="$emit('trig')"
      >
        {{ button }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Input",
  props: {
    label: String,
    type: {
      type: String,
      default: "text",
    },
    tipe: String,
    placeholder: String,
    small: Boolean,
    button: String,
    value: String,
    ref: String,
  },
  emits: ["send", "trig"],
  methods: {
    send(ev) {
      this.$emit("send", ev);
    },
  },
  computed: {
    formTipe() {
      let className = ["input"];

      if (this.button) className.push("w-full pr-16 input");
      if (this.small) className.push("input-sm");
      if (this.tipe.includes("primary")) className.push("input-primary");
      if (this.tipe.includes("secondary")) className.push("input-secondary");
      if (this.tipe.includes("accent")) className.push("input-accent");
      if (this.tipe.includes("border")) className.push("input-bordered");
      if (this.tipe.includes("large")) className.push("input-large");
      if (this.tipe.includes("small")) className.push("input-sm");
      if (this.tipe.includes("xsmall")) className.push("input-xs");

      return className.join(" ");
    },
  },
};
</script>
