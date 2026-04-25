## Goal
Allow the intro paragraph in the Experiences section's 50/50 header block to fill the full width of its grid column instead of being capped at 440px.

## Change
**File:** `src/components/rfx/Experiences.tsx` (line 122)

Remove the `max-w-[440px]` constraint from the paragraph so it expands to fill the right-hand column of the 50/50 grid on desktop/tablet. Mobile remains centred and naturally full-width within the container.

**Before:**
```tsx
<p className="text-[15.5px] leading-[1.6] text-ink-soft max-w-[440px] pb-3 text-center md:text-left mx-auto md:mx-0">
```

**After:**
```tsx
<p className="text-[15.5px] leading-[1.6] text-ink-soft pb-3 text-center md:text-left mx-auto md:mx-0">
```

## Notes
- Only this one paragraph is affected — the heading and cards below remain unchanged.
- No other 50/50 blocks on the page are touched (you mentioned just this width change for the selected element).
- If you'd like the same "fill" treatment applied to the right-column copy in the other 50/50 sections (HeroEditorial, About, etc.), let me know and I'll extend the change.