<template>
  <button :id="id" v-if="type === 'button'" :class="className" @click="trigger">
    <slot></slot>
    {{ value }}
  </button>

  <a :id="id" v-if="type === 'link'" :href="href" :class="className" @click="trigger">
    <slot></slot>
    {{ value }}
  </a>
</template>

<script>

/**
 * How to use it?
 *
    <Button
        primary | secondary | accent
        value="Your value of your button"
        type="button | link"
        small | or just remove that parameter
        class="ml-2" | Your class to add to button component
        @trig="renderRecord" the event when the button clicken or triggered
    />
 */

export default {
  name: "Button",
  props: {
    datanya: String,
    success: Boolean,
    primary: Boolean,
    secondary: Boolean,
    accent: Boolean,
    ghost: Boolean,
    value: String,
    type: {
      type: String,
      required: true,
    },
    class: String,
    href: String,
    icon: String,
    outline: Boolean,
    small: Boolean,
    id: String,
  },
  emits: ["trig"],
  methods: {
    trigger() {
      this.$emit("trig", this.datanya);
    },
  },
  computed: {
    className() {
      let classList = [];
      if (this.type == "button") classList.push("btn");
      if (this.small) classList.push("btn-sm");
      if (this.primary) classList.push("btn-primary");
      if (this.secondary) classList.push("btn-secondary");
      if (this.accent) classList.push("btn-accent");
      if (this.ghost) classList.push("btn-ghost");
      if (this.outline) classList.push("btn-outline");
      if (this.success) classList.push("btn-success");
      if (this.class) classList.push(this.class);

      return classList.join(" ");
    },
  },
};
</script>
