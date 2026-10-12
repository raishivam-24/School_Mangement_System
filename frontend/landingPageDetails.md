# Prompt: Recreate a Premium Animated SaaS Landing Page

Build a modern, premium SaaS landing page inspired by the reference video I provided. Focus especially on the **smooth typography reveals, scroll-driven dashboard animation, layered composition, and soft gradient background**. The result should feel polished, fluid, and cinematic, not like a generic template with basic fade-in effects.

## 2. Background and visual atmosphere

Create a spacious, minimal hero section with a soft, luminous gradient background.

- Use a smooth gradient transitioning between pale sky blue, periwinkle, and subtle lavender.
- Place a large, diffused blue glow behind the central hero content.
- Add a secondary, softer lavender glow toward one side to create depth.
- Use radial gradients with very large blur radii. The transitions must be seamless, with no visible gradient bands or harsh color boundaries.
- Keep the edges lighter and quieter than the central focal area.
- Use a clean white or near-white background for the sections below the hero.
- The background should feel airy, sophisticated, and slightly futuristic, like a premium AI or workflow automation product.
- Avoid excessive particles, decorative shapes, strong shadows, and distracting background animations.

The gradient should remain visually consistent while the foreground content moves during scrolling.

## 3. Hero typography animation

Create a centered hero layout with a small navigation bar, a prominent headline, supporting text, and a primary call-to-action.

Animate each text element independently.

**Headline reveal:**
- Start with the headline slightly below its final position, translated vertically by approximately 20–35px.
- Keep it initially transparent.
- Animate it upward into its final position while increasing opacity from 0 to 1.
- Use an elegant ease-out curve with a duration of approximately 700–1000ms.
- Reveal the headline in separate lines or small groups of words, using a clipped overflow container for a clean masked-text reveal.
- Stagger the lines by approximately 100–160ms.
- Avoid letter-by-letter typing effects.

**Supporting paragraph:**
- Reveal after the headline with a slight upward movement and fade.
- Use a duration of 500–700ms.
- Add a small delay so the headline gets visual priority.

**Buttons and navigation:**
- Let the navigation appear subtly, without a dramatic entrance.
- Reveal the CTA buttons shortly after the supporting text.
- Use restrained hover transitions, such as a slight color shift or 1–2px lift.

The overall effect should feel coordinated and effortless, as though the page content is gently settling into place.

## 4. Large dashboard rising animation

This is the most important part of the landing page.

Below the hero content, create a large, realistic browser-window mockup containing a dashboard UI. It should include a top browser bar, sidebar, cards, charts, tables, and small interface details appropriate to the product.

The dashboard should initially be partially hidden below the bottom edge of the hero viewport.

**Initial state:**
- Translate the dashboard downward by approximately 140–220px.
- Set its opacity to around 0.4–0.7.
- Apply a very subtle perspective or scale effect, starting around 0.96–0.98.
- Keep the dashboard wide and visually dominant, with rounded corners and a restrained shadow.

**Entrance animation:**
- As the user scrolls down, move the dashboard upward smoothly.
- Gradually increase opacity to 1.
- Slightly scale it toward its natural size.
- Use the scroll position to control the animation progress instead of relying only on a fixed-duration entrance animation.
- The movement must remain synchronized with scrolling: scrolling down advances the animation, and scrolling back up reverses it naturally.

**Layering:**
- Allow the dashboard to overlap the lower portion of the hero section.
- Keep the hero headline visible above the dashboard during the transition.
- Use appropriate `z-index` values and overflow settings so the dashboard appears to emerge from behind the hero content without being abruptly clipped.
- As the dashboard rises, reveal more of its content progressively.

The dashboard should feel like a physical interface sliding into view, not a flat image abruptly appearing on screen.

## 5. Scroll-driven hero transition

Treat the hero and dashboard as one connected visual composition.

- Give the hero sufficient vertical space for the transition.
- Use a scroll-progress-based animation to control the dashboard's vertical position, opacity, and scale.
- If necessary, pin or temporarily hold the hero composition during part of the scroll, but avoid making the page feel stuck.
- Gradually transition the background from the blue-lavender hero gradient to a clean white background.
- As the dashboard moves upward, let the next section begin to enter the viewport naturally.
- Avoid sudden jumps, abrupt section boundaries, or animations that finish before the user has scrolled through the intended transition.

Do not animate every element at maximum intensity. The dashboard should provide the main visual movement while the surrounding content stays relatively calm.

## 6. Next section reveal

After the hero/dashboard composition, introduce a new section with a heading, supporting text, and workflow or feature illustrations.

- Use a white or near-white background.
- Reveal the heading with the same upward masked-text animation used in the hero, but with a shorter duration.
- Fade and translate supporting text upward slightly.
- Bring feature cards or workflow diagrams into view with a subtle stagger.
- Keep the animation timing tied to when the elements enter the viewport.
- Once revealed, the elements should remain visible rather than repeatedly animating every time the user scrolls a few pixels.

Maintain consistent typography, spacing, and animation curves across all sections.

## 7. Motion design rules

The entire page should feel smooth, restrained, and intentional.

- Prefer transforms and opacity over properties that trigger expensive layout recalculations.
- Use smooth ease-out curves for entrance animations.
- Use scroll-linked transforms for the dashboard's main movement.
- Use viewport-triggered animations for ordinary headings and content.
- Avoid excessive parallax, bouncing, spinning, elastic motion, or exaggerated zooms.
- Prevent layout shifts while animations are running.
- Do not introduce horizontal scrolling.
- Ensure animations work with mouse-wheel scrolling, trackpads, and touch scrolling.
- Respect `prefers-reduced-motion` by providing a simpler static or low-motion experience.

## 8. Implementation requirements

Build the actual working page, not a static visual mockup.

- Create separate components for the navigation, hero, animated headline, dashboard mockup, and following sections.
- Use Framer Motion's scroll hooks or GSAP ScrollTrigger to implement the scroll-driven dashboard movement.
- Use a shared animation style for headings so that the reveals remain consistent.
- Keep the layout responsive for desktop, tablet, and mobile.
- On smaller screens, reduce the dashboard's size and complexity, adjust its entrance distance, and prevent content overflow.
- Ensure the page remains usable if JavaScript animations are disabled or reduced.
- Clean up animation listeners and scroll triggers correctly.
- Do not use a giant screenshot as the dashboard. Construct it from HTML/CSS components so that it remains responsive and crisp.

## 9. Final quality target

The final result should resemble a carefully art-directed SaaS landing page:

1. A soft blue-lavender luminous hero background.
2. A headline that glides upward into view, with a subtle masked reveal.
3. Supporting copy and CTA buttons that appear in a coordinated sequence.
4. A large dashboard mockup that rises smoothly as the user scrolls.
5. A seamless transition into a clean white section with new text and illustrations.
6. Consistent motion, generous whitespace, restrained shadows, and polished typography.

