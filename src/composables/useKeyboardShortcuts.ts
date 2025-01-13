import { onMounted, onUnmounted } from 'vue';

export type KeyboardShortcut = {
    name: string;
    cmdCtrl?: boolean;
    shift?: boolean;
    optionAlt?: boolean;
    key: string;
    action: () => void;
};

export function useKeyboardShortcuts(initialShortcuts: KeyboardShortcut[] = []) {
    const keyboardShortcuts: KeyboardShortcut[] = [...initialShortcuts];

    /**
     * Listener for all keyboard bindings. Opens relevant modals.
     * @param event The keyboard event to check for mapped modals.
     */
    function handleKeydown(event: KeyboardEvent) {
        if (event.key) {
            for (const shortcut of keyboardShortcuts) {
                if (keyEventMatchesShortcut(event, shortcut)) {
                    event.preventDefault();
                    shortcut.action();
                    return; // Stop once a matched shortcut is actioned.
                }
            }
        }
    }

    /**
     * Checks whether a KeyboardEvent matches the given shortcut object.
     * @param event The KeyboardEvent to check.
     * @param shortcut The registered shortcut to check.
     * @returns Event matches the given shortcut properties.
     */
    function keyEventMatchesShortcut(event: KeyboardEvent, shortcut: KeyboardShortcut): boolean {
        const isCmdCtrl = event.ctrlKey || event.metaKey;
        const isShift = event.shiftKey;
        const isAlt = event.altKey;
        const pressedKey = event.key.toLowerCase();

        // Flip each value to match undefined and false.
        const matches =
            !shortcut.cmdCtrl === !isCmdCtrl &&
            !shortcut.shift === !isShift &&
            !shortcut.optionAlt === !isAlt &&
            shortcut.key.toLowerCase() === pressedKey;

        return matches;
    }

    /**
     * Adds a new keyboard shortcut.
     * @param shortcut The new shortcut to register.
     */
    function addKeyboardShortcut(shortcut: KeyboardShortcut) {
        keyboardShortcuts.push(shortcut);
    }

    /**
     * Removes a keyboard shortcut by its `name`.
     * @param name The name of the shortcut to remove.
     */
    function removeKeyboardShortcut(name: string) {
        const index = keyboardShortcuts.findIndex(shortcut => shortcut.name === name);
        if (index !== -1) {
            keyboardShortcuts.splice(index, 1); // Remove the shortcut from the list
            console.log(`Shortcut "${name}" removed.`);
        } else {
            console.warn(`Shortcut "${name}" not found.`);
        }
    }

    onMounted(() => {
        window.addEventListener('keydown', handleKeydown);
    });

    onUnmounted(() => {
        window.removeEventListener('keydown', handleKeydown);
    });

    return {
        addKeyboardShortcut,
        removeKeyboardShortcut,
    };
}
