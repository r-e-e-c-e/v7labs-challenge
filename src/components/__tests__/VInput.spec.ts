import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import VInput from '@/components/VInput.vue';
import { nextTick } from 'vue';

describe('VInput.vue', () => {
    it('renders a text input with the correct placeholder and label', () => {
        const wrapper = mount(VInput, {
            props: {
                label: 'Your Name',
                name: 'name',
                placeholder: 'Enter your name',
                modelValue: '',
            },
        });

        const label = wrapper.find('.input-label');
        expect(label.exists()).toBe(true);
        expect(label.text()).toContain('Your Name');

        const input = wrapper.find('[data-test="text-input"]');
        expect(input.exists()).toBe(true);
        expect(input.attributes('placeholder')).toBe('Enter your name');
    });

    it("renders a select dropdown when `type` is 'select'", () => {
        const options = [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
        ];

        const wrapper = mount(VInput, {
            props: {
                label: 'Select an option',
                type: 'select',
                options,
            },
        });

        const select = wrapper.find('[data-test="select-input"]');
        expect(select.exists()).toBe(true);

        const placeholderOption = select.find('option:disabled');
        expect(placeholderOption.text()).toBe('Select an option...');

        const optionElements = select.findAll('option');
        expect(optionElements.length).toBe(3); // 2 options + 1 placeholder
        expect(optionElements[1].text()).toBe('Option 1');
    });

    it('updates modelValue when text input changes', async () => {
        const wrapper = mount(VInput, {
            props: {
                modelValue: '',
            },
        });

        const input = wrapper.find('[data-test="text-input"]');
        await input.setValue('Hello Vue');

        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
        expect(wrapper.emitted('update:modelValue')![0][0]).toBe('Hello Vue');
    });

    it('updates modelValue when an option is selected', async () => {
        const options = [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
        ];

        const wrapper = mount(VInput, {
            props: {
                type: 'select',
                options,
                modelValue: '',
            },
        });

        const select = wrapper.find('[data-test="select-input"]');
        await select.setValue('option1');

        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
        expect(wrapper.emitted('update:modelValue')![0][0]).toBe('option1');
    });

    it('shows the clear button when modelValue is not empty', () => {
        const wrapper = mount(VInput, {
            props: {
                modelValue: 'Test',
            },
        });

        const clearButton = wrapper.find('button.clear');
        expect(clearButton.exists()).toBe(true);
    });

    it('clears the input value when the clear button is clicked', async () => {
        const wrapper = mount(VInput, {
            props: {
                modelValue: 'Test',
            },
        });

        const clearButton = wrapper.find('button.clear');
        await clearButton.trigger('click');

        expect(wrapper.emitted('update:modelValue')![0][0]).toBe('');
    });

    it('hides the clear button when modelValue is empty', () => {
        const wrapper = mount(VInput, {
            props: {
                modelValue: '',
            },
        });

        const clearButton = wrapper.find('button.clear');
        expect(clearButton.exists()).toBe(false);
    });

    it('displays required asterisk when `required` is true', () => {
        const wrapper = mount(VInput, {
            props: {
                label: 'Required Field',
                required: true,
            },
        });

        const asterisk = wrapper.find('.required');
        expect(asterisk.exists()).toBe(true);
        expect(asterisk.text()).toBe('*');
    });
});
