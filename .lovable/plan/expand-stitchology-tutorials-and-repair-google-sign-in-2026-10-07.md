# Expand Stitchology tutorials and repair Google sign-in

## Tutorial library
- Expand the tutorial data model so each guide can carry rich, step-specific visual media: an optional video source plus an animated-diagram fallback and accessible description.
- Add the requested tutorials and full instructional content:
  - **Basics:** Thread your machine correctly; Master tension settings; Sew a blind hem.
  - **Clothing:** The Full Bust Adjustment (FBA).
  - **Bags & Accessories:** Zippered pencil pouch; keep and relabel the sturdy everyday tote at the requested level.
  - **Home Decor:** Box cushion with custom piping.
  - **Repair:** Darning denim with visible mending.
- Preserve all existing tutorials, normalize the requested Beginner / Intermediate / Expert levels, and keep category filtering accurate.
- Enrich cards with a visual preview, clear difficulty/time/step metadata, and the existing warm ivory, terracotta, navy, and sharp type system.

## Visual tutorial player
- Replace the separate overview-first interaction with a mobile-first tutorial detail experience: prominent media on top and the active step immediately below.
- Build a reusable media frame that plays a supplied tutorial video when one exists and otherwise renders a category/step-specific looping sewing diagram.
- Include a centered play/pause control with a restrained translucent backdrop, stable responsive dimensions, captions/labels, reduced-motion support, and keyboard-accessible controls.
- Keep supplies and project context accessible without interrupting the main sewing flow.
- Add sequential previous/next controls, visible progress, step count, tips, completion state, and the existing Workroom save action.

## Coach handoff
- Add a floating **Ask Coach about this step** action within the active-step view.
- For signed-in users, create a fresh Coach conversation and pre-send a contextual prompt containing the tutorial title, step number, exact step title/instructions, and any tip.
- For signed-out users, preserve the intended tutorial-step question through sign-in and continue to the preloaded Coach conversation afterward.
- Keep the Coach as its dedicated chat view rather than squeezing a second panel into the tutorial screen on mobile.

## Google sign-in repair
- Reproduce the reported error in the preview and inspect the safe OAuth completion state before changing code. Current auth logs confirm Google successfully issued a login token, so diagnosis will focus on the app’s session handoff, redirect, and post-login navigation rather than provider enablement.
- Preserve a sanitized same-origin destination before Google sign-in, use the public auth landing page for completion, wait for a verified session, then navigate to the intended tutorial or Coach destination.
- Surface the provider’s safe error message instead of the current generic failure notice, prevent duplicate clicks, and keep the sign-in button state clear during completion.
- Reconfigure the managed Google provider only if verification shows its project setting is stale or disabled.

## Verification
- Check all requested categories, cards, levels, and tutorial step sequences on mobile and desktop.
- Verify video-capable and animated-fallback media states, play/pause behavior, reduced motion, arrows, completion, and Workroom saving.
- Verify the Coach handoff for signed-in and signed-out paths and confirm the exact step context reaches a new chat.
- Run the project checks, inspect the live preview for layout/console/network errors, and complete an end-to-end Google sign-in test where the available test session permits it.
