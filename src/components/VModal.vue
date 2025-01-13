<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue";
import CloseIcon from "./icons/CloseIcon.vue";

const props = defineProps<{
  heading?: string;
  onShow?: Function;
}>();

const emit = defineEmits<{
  close: [];
}>();

defineExpose({
  closeModal,
});

const isVisible = ref(false);

onMounted(() => {
  showModal();
});

const dialogRef = ref<HTMLDialogElement | null>(null);
const modalContentRef = ref<HTMLDivElement | null>(null);

function showModal() {
  dialogRef.value?.showModal();
  isVisible.value = true;

  nextTick(() => {
    if (props.onShow) props.onShow();

    // Focus first input if content has a form
    const formEl = dialogRef.value?.querySelector("form");
    if (formEl) {
      const firstInputEl = formEl.querySelector<HTMLElement>(
        "input, textarea, select, [tabindex]:not([tabindex='-1'])"
      );
      firstInputEl?.focus();
    }
  });
}

function closeModal() {
  isVisible.value = false;
  emit("close");
}

function onBackdropClick(event: MouseEvent) {
  if (event.target === dialogRef.value) {
    emit("close");
  }
}
</script>

<template>
  <dialog
    class="modal"
    ref="dialogRef"
    :class="{ visible: isVisible }"
    @close="emit('close')"
    @click="onBackdropClick"
    data-test="modal"
  >
    <Transition name="fade-slide">
      <div
        ref="modalContentRef"
        class="modal-content"
        v-if="isVisible"
        data-test="modal-content"
      >
        <header
          class="modal-header"
          v-if="props.heading"
          data-test="modal-header"
        >
          <h1 class="modal-heading">{{ props.heading }}</h1>
          <button
            class="close-btn"
            @click="emit('close')"
            data-test="close-button"
          >
            <CloseIcon />
          </button>
        </header>

        <main class="modal-body" data-test="modal-body">
          <slot></slot>
        </main>
      </div>
    </Transition>
  </dialog>
</template>

<style lang="scss">
.modal {
  all: unset; /* Resets all default browser styles */
  display: none;
  user-select: text;

  &.visible {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
  }

  .modal-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: auto;

    background: hsl(0deg 0% 0% / 50%);
    backdrop-filter: blur(8px);
    box-shadow: 0 14px 30px rgb(0 0 0 / 20%);

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 1rem;
      padding-bottom: 1rem;
      padding-left: var(--modal-padding);
      padding-right: var(--modal-padding);
      position: relative;

      .modal-heading {
        font-size: 1.6rem;
        color: white;
      }

      .close-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 42px;
        aspect-ratio: 1 / 1;
        border: 2px solid hsl(0 30% 70% / 0%);
        border-width: 0 0 2px 2px;
        background: transparent;
        position: absolute;
        top: 0;
        right: 0;
        border-radius: 0 0 0 3px;
        transition: var(--transition);

        svg {
          height: 20px;
          width: auto;
          aspect-ratio: 1 / 1;
          fill: hsl(0 0 100% / 80%);
          transition: var(--transition);
        }

        &:hover {
          background: hsl(0 100% 70% / 10%);
          border-color: hsl(0 30% 70% / 100%);

          svg {
            fill: hsl(0 70% 78%);
          }
        }

        &:focus-visible {
          outline: none;
          background: hsl(0 100% 70% / 10%);
          border-color: hsl(0 30% 70% / 100%);

          svg {
            fill: white;
            filter: drop-shadow(0 3px 2px hsl(0 0 0% / 60%));
          }
        }
      }
    }

    .modal-body {
      padding: var(--modal-padding);
      padding-top: 0;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      justify-self: flex-end;
      padding-left: var(--modal-padding);
      padding-right: var(--modal-padding);
      flex: 1 1 auto;
      align-items: flex-end;
      padding: 0;

      button.modal-action {
        flex: 1 1 auto;
        min-height: 60px;
        letter-spacing: 2px;
        font-weight: 900;
        margin-top: var(--modal-padding);
        background: none;
        border: 0;
        border-top: 2px solid hsl(0 0 100% / 10%);
        color: white;
        text-shadow: var(--text-shadow);
      }
    }
  }

  &::backdrop {
    background: rgb(0 0 0 / 0);
    transition: all 0.3s ease;
  }

  &.visible::backdrop {
    background: var(--modal-background-color);
  }
}

@media (min-width: 768px) {
  .modal.visible {
    padding-top: clamp(30px, calc(1.5vw + 6vh), 80px);
    padding-bottom: 80px;
    display: flex;
    justify-content: center;
    overflow-y: scroll;

    .modal-content {
      min-width: 528px;
      margin-left: auto;
      margin-right: auto;
      height: auto;
      border-radius: var(--modal-border-radius);
      justify-content: flex-start;
      align-self: flex-start;
    }
  }
}
</style>