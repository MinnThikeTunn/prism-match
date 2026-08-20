# Header search opens the Chromatic Network Directory

## What changes

1. **Nav bar search becomes a real entry point.** The header already has a search field, but it only reacts to the Enter key and the typed text is thrown away. After this change:
   - Clicking (or focusing) the search bar opens the Chromatic Network Directory modal immediately.
   - Whatever the user has typed is carried into the directory's own search box, so results are already filtered when it opens.
   - Same behaviour for the mobile drawer search field.

2. **Search also matches Prism ID.** The directory currently filters on name, title, offers and needs. Prism ID (e.g. `PRSM-…`) gets added to the match list, case-insensitive, so users can look someone up by ID from the nav bar or inside the modal.

## Technical notes

- `src/components/Header.tsx`: add `onClick`/`onFocus` on both search inputs to call `onOpenNetwork()`; change the `onOpenNetwork` prop signature to `(query?: string) => void` and pass `searchQuery`.
- `src/App.tsx`: store the incoming query in state and pass it to `NetworkModal` as `initialSearch`.
- `src/components/NetworkModal.tsx`: accept `initialSearch`, seed `searchTerm` from it when the modal opens, and extend the filter predicate with `c.prismId?.toLowerCase().includes(term)`.

No backend or data-model changes.
