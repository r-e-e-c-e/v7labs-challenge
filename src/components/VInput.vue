
<script setup lang="ts">
import type { SelectOption } from "@/types";
import { ref } from "vue";
import CloseIcon from "./icons/CloseIcon.vue";
import ChevronDownIcon from "./icons/ChevronDownIcon.vue";

type InputType = "text" | "select";

const props = defineProps<{
  label?: string;
  name?: string;
  placeholder?: string;
  type?: InputType;
  options?: SelectOption[];
  required?: boolean;
  modelValue?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

defineExpose({ focus });

const inputRef = ref<HTMLInputElement | HTMLSelectElement | null>(null);

function focus() {
  inputRef.value?.focus();
}

function onInputChange(event: Event) {
  const target = event.target as HTMLInputElement | HTMLSelectElement;
  emit("update:modelValue", target.value);
}
</script>

<template>
  <label class="field">
    <div class="input-label" v-if="props.label">
      {{ props.label }} <span v-if="props.required" class="required">*</span>
    </div>
    <div class="input">
      <input
        v-if="!props.type || props.type === 'text'"
        type="text"
        ref="inputRef"
        :name="props.name"
        :placeholder="placeholder"
        :value="props.modelValue"
        @input="onInputChange"
        autocomplete="off"
        data-test="text-input"
      />
      <select
        v-else-if="props.type === 'select'"
        ref="inputRef"
        :name="props.name"
        :value="props.modelValue"
        @change="onInputChange"
        data-test="select-input"
      >
        <option disabled selected :value="null">
          {{ props.placeholder || "Select an option..." }}
        </option>
        <option
          v-for="option in props.options || []"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <div class="append">
        <button
          class="clear"
          v-if="props.modelValue"
          @click="() => emit('update:modelValue', '')"
        >
          <CloseIcon />
        </button>
        <div class="select-chevron" v-if="props.type === 'select'">
          <ChevronDownIcon />
        </div>
      </div>
    </div>
  </label>
</template>

<style lang="scss" scoped>
label.field {
  display: flex;
  flex-direction: column;
  position: relative;

  .input-label {
    color: hsl(0 0 100% / 80%);
    font-weight: 800;
    letter-spacing: -0.5px;
    margin-bottom: 0.6rem;
    transition: var(--transition);
  }

  .input {
    display: flex;
    position: relative;

    .append {
      position: absolute;
      right: 0.5rem;
      top: 50%;
      translate: 0 -50%;
      display: flex;
      align-items: center;
      gap: 0.3rem;

      &:empty {
        display: none;
      }
    }

    button.clear {
      display: grid;
      place-items: center;
      width: 32px;
      aspect-ratio: 1 / 1;
      border-radius: 3px;
      border: none;
      background: hsl(0 0 100% / 10%);
      transition: var(--transition);

      svg {
        fill: hsl(0 0 100% / 80%);
        width: 16px;
        aspect-ratio: 1 / 1;
        transition: var(--transition);
      }

      &:hover {
        background: white;

        svg {
          fill: blue;
        }
      }
    }

    .select-chevron {
      svg {
        fill: white;
      }
    }
  }

  input[type="text"],
  select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    min-height: 48px;
    border: 2px solid hsl(0 0 100% / 20%);
    padding: 0 1rem;
    border-radius: 2px;
    background: #222;
    color: white;
    transition: var(--transition);
    flex: 1 1 auto;

    &:hover {
      border-color: hsl(0 0 100% / 32%);
    }
  }

  &:hover {
    cursor: pointer;

    .input-label {
      color: hsl(0 0 100% / 100%);
    }
  }

  &:focus-within {
    .input-label {
      color: hsl(0 0 100% / 100%);
    }

    input[type="text"],
    select {
      outline: none;
      border-color: white;
    }
  }

  .required {
    color: rgb(255, 53, 53);
  }
}
</style>