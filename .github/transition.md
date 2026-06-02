I want to update my existing Next.js + React + GSAP portfolio website to create an Awwwards-style scroll-driven Shared Element Transition between ShowSection (PhotoGlobe) and MyselfSection.

Current setup:

* ShowSection contains a PhotoGlobe component.
* PhotoGlobe renders multiple media items in a 3D globe.
* Globe items are continuously animated via GSAP ticker.
* Every frame, globe items receive transforms such as:

  * x
  * y
  * scale
  * zIndex
* Globe rotation is interactive and auto-rotating.
* MyselfSection contains a video inside `.myself-video-container`.

Goal:

One of the globe items should be a video instead of an image.

The video must behave exactly like all other globe items:

* participate in globe rotation
* receive depth scaling
* receive z-index updates
* appear as part of the gallery
* autoplay
* muted
* loop
* playsInline

The user should not need to click anything.

The transition is triggered entirely by scroll.

Desired experience:

Initial state:

PhotoGlobe contains many images and one video.
The video looks like just another item in the globe.

When the user scrolls down from ShowSection toward MyselfSection:

1. The video inside the globe becomes the hero element.

2. Create an Awwwards-style Shared Element Transition.

3. Do NOT animate the original globe video directly because the GSAP ticker continuously updates transforms and would overwrite animations.

4. Instead:

   * find the globe video element
   * get its current bounding rect
   * create a cloned video element
   * append the clone to document.body
   * position the clone using position: fixed
   * place it exactly on top of the original video

5. Hide the original globe video during the transition.

6. Use the cloned video as the transition layer.

7. Animate the cloned video based on ScrollTrigger progress.

8. The cloned video should smoothly morph from:

   * the video position inside PhotoGlobe
   * to the video position inside `.myself-video-container`

9. During the transition:

   * PhotoGlobe gradually fades out
   * Globe items can slightly scale down
   * The cloned video becomes the visual focus
   * The transition should feel cinematic and premium

10. At the end:

* The cloned video perfectly matches the position and size of `.myself-video-container`
* The real MyselfSection video becomes visible
* The clone visually overlaps perfectly with the target

IMPORTANT:

This transition must be FULLY REVERSIBLE.

The user can scroll down and scroll back up.

The entire animation must scrub in both directions.

Requirements:

* Use ScrollTrigger with scrub:true.
* The clone must remain alive during the entire ScrollTrigger range.
* Do NOT remove the clone on animation completion.
* Do NOT use onComplete cleanup during the transition.
* Do NOT use one-time page transition logic.
* The clone position, size, border radius, and opacity must be controlled entirely by ScrollTrigger progress.

Behavior when scrolling down:

* Globe video opacity: 1 → 0
* Clone opacity: visible
* Clone morphs toward MyselfSection
* Myself video opacity: 0 → 1

Behavior when scrolling up:

* Myself video opacity: 1 → 0
* Clone morphs back toward Globe
* Globe video opacity: 0 → 1

The transition must always restore the exact original PhotoGlobe state when the user scrolls back to the top.

Technical requirements:

* Next.js App Router
* TypeScript
* React hooks
* GSAP
* ScrollTrigger
* Proper cleanup
* Production-ready architecture
* Responsive behavior
* Recalculate bounds on resize
* No memory leaks

Please provide:

1. Updated component architecture
2. Required refs
3. Data structure updates for PhotoGlobe media items
4. Full GSAP implementation
5. ScrollTrigger setup
6. Shared Element Transition implementation
7. Clone lifecycle management
8. Resize handling
9. Cleanup logic
10. Complete code examples with explanations of where each piece should live

Visual reference:

PhotoGlobe (images + one video)
↓
Scroll
↓
Video is picked from the globe
↓
Video scales and morphs into a fullscreen focal element
↓
Video transitions into MyselfSection
↓
User scrolls up
↓
The entire animation reverses perfectly
↓
Video returns to its exact position inside the PhotoGlobe
