**DEVELOPMENT LOG**

1. Created API key in V7 Go.
2. Got workspace and project IDs from from live V7 Go site.
3. Explore UI.
4. Check out router to see what components are being loaded.
5. App cmp -> RouterView (ProjectTable cmp or EntityView cmp). Otherwise Fallback cmp.

Assumption 1: Quick access feature requires auth to be valid.
Assumption 2: Quick access feature can be accessed anywhere, including Fallback cmp.
Note: API can be cleared on entity page but the page will still load. Auth is only checked on ProjectTable cmp.

6. Do UX design in Figma.
7. Install Sass.
8. Create Project page cmp for modal to show inside of. Move auth routes into Project page.
9. Start creating QuickAccessModal cmp.
10. Use dialog element. Style it mobile-first full-screen, and on desktop show top centred.
11. Handle key handler registration for Cmd + K on mount/unmount in Project page cmp.
12. Add isVisible prop to QuickAccessModal which maps to the dialog open attribute.
13. QuickAccessModal cmp getting big. Move generic stuff to reusable Modal cmp for better practice.
14. Move some style properties from Modal cmp to global CSS variables.
15. Add modal transition styles.
16. Change to only having dark styles for modal, to somewhat match V7 modal style.
17. Toggle body scrolling on modal open/close.
18. Add keyboard shortcuts composable to allow future flexibility.
19. Add modal store for handling opening and closing of modals.
20. Add createProject, getProjects, and renameProject fetch functions.
21. Create form component.
22. Create general input component to be used across multiple modals and forms.
23. Create create-project modal.
24. Create rename-project modal.
25. Add unit tests.
26. Clean up.
27. Make videos.

**FEATURES ADDED**

1. Keyboard shortcut composable.
2. Modal store.
3. Page wrapper component to place modal and register shortcut.
4. Form component.
5. Input component.
6. Generic modal component.
7. Quick Access modal component.
8. Create Project modal component.
9. Rename Project modal component.
10. Icons, transitions, basic CSS var usage.

IMPROVEMENTS

1. Clean up styles. Centralise some styles.
2. Add loading state to modals.
3. Fetch data from router rather than on async component load.
4. Add more tests.
5. Modal management shouldn't be in a specific page component, should be moved up to major layout comp.
6. Add more docs.
7. Keyboard shortcuts should be defined globally so that a keyboard shortcuts modal can be displayed, rather than being registered in the page component.
8. Modal store should allow multiple modals in memory via a stack, so the user can go back to previous modal.
9. Modal store/modal comp could allow displaying of modals as a slideover.
10. Add support for input validation rules and inline error state. I.e. required, max text length, etc.
