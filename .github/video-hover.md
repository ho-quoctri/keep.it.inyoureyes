Create an award-winning Hero Title Hover Reveal interaction using Next.js 15, React 19, TypeScript, Tailwind CSS, and GSAP.

## Goal

at Hero component // hero.tsx

When the user hovers the title, a floating video preview appears near the cursor and follows mouse movement.

The video acts as a premium media cursor.

This is NOT a card interaction.

---

## Example UX

User sees:

CRAFTING DIGITAL EXPERIENCES

Hover title
→ Wait 120ms
→ Video appears
→ Video starts playing
→ Video follows cursor with smooth inertia
→ Video loops while hovering
→ Mouse leaves
→ Video fades out
→ Video pauses
→ Current playback position is preserved
→ Hover again
→ Video resumes from the same frame

---

## Hero Title Requirements

* Large responsive typography
* Occupies significant viewport space
* Supports multi-line layouts
* Cursor hidden while hovering
* Keyboard focus should trigger the same interaction

Example:

<h1>
  CRAFTING
  DIGITAL
  EXPERIENCES
</h1>

---

## Floating Video Cursor

Video container:

* position: fixed
* pointer-events: none
* z-index: 9999
* width: 320px
* aspect-ratio: 16 / 9
* rounded-xl
* overflow-hidden
* shadow-xl
* will-change: transform

Behavior:

* Appears slightly offset from cursor
* Never blocks interactions
* Stays within viewport bounds
* Uses transform-based positioning only

---

## Hover Intent Delay

Do NOT show the video immediately.

When cursor enters title:

* Wait 100–150ms before reveal
* Recommended: 120ms

If cursor leaves before timer completes:

* Cancel reveal
* Never show video

Implementation:

* Store timeout in a ref
* Clear timeout on leave
* Avoid React state updates

Flow:

mouseenter
→ start 120ms timer

timer complete
→ reveal video
→ play video

mouseleave before timer complete
→ cancel timer

Purpose:

* Prevent accidental triggers
* Feel more premium and intentional

---

## Video Behavior

Video element should remain mounted.

Attributes:

* muted
* playsInline
* preload="auto"
* loop={true}

Hover enter:

video.play()

Hover leave:

video.pause()

Hover again:

video.play()

Requirements:

* Preserve currentTime
* Do NOT reset playback
* Do NOT recreate video element
* Do NOT remount video

---

## Inertia / Lerp Cursor Following

The video should NOT stick directly to the cursor.

Instead create a smooth inertia-based follow system.

Desired feeling:

* Cursor moves instantly
* Video follows behind
* Slight momentum
* Organic movement
* Cinematic feel

Maintain:

targetX
targetY

currentX
currentY

Update target values on mousemove.

Use GSAP ticker for rendering.

Example:

currentX += (targetX - currentX) * 0.12

currentY += (targetY - currentY) * 0.12

Render:

gsap.set(videoCursor, {
x: currentX,
y: currentY
})

Important:

* Mousemove only updates target values
* No animation per mousemove
* No React state updates

---

## Velocity-Based Rotation

Calculate movement velocity.

Example:

velocityX = targetX - previousTargetX

Map velocity to rotation:

-15deg → +15deg

Behavior:

Fast move right
→ rotate positive

Fast move left
→ rotate negative

When movement slows:

→ smoothly return rotation to 0

Use GSAP ticker.

Do not use CSS transitions.

---

## Parallax Hero Title

While hovering:

Move title content subtly based on cursor position.

Ranges:

translateX:
-20px → 20px

translateY:
-10px → 10px

Behavior:

* Smooth
* Subtle
* Premium
* Transform-only animations

---

## Reveal Animation

Hover Enter

Video Cursor:

opacity:
0 → 1

scale:
0.8 → 1

duration:
0.5

ease:
power3.out

---

## Hide Animation

Hover Leave

Video Cursor:

opacity:
1 → 0

scale:
1 → 0.8

duration:
0.4

ease:
power3.out

Pause video when leaving.

Keep playback position.

---

## GSAP Requirements

Use:

* gsap.context()
* gsap.ticker
* useGSAP
* gsap.set()
* transform-based animation

Avoid:

* CSS transitions
* Framer Motion
* top / left animation
* React state for mouse tracking
* setInterval

---

## Reusable Hooks

### useVideoHover()

Responsibilities:

* hover delay
* play
* pause
* preserve currentTime
* reveal animation
* hide animation

API:

const {
onEnter,
onLeave,
isVisible
} = useVideoHover()

---

### useInertiaCursor()

Responsibilities:

* target tracking
* lerp movement
* gsap ticker integration
* cleanup

API:

const {
onMouseMove
} = useInertiaCursor()

---

### useVelocityRotation()

Responsibilities:

* velocity calculation
* rotation mapping
* smooth reset

API:

const {
rotation
} = useVelocityRotation()

---

### useTitleParallax()

Responsibilities:

* title movement
* cursor-relative calculations
* cleanup

API:

const {
onMouseMove
} = useTitleParallax()

---

## Accessibility

* Respect prefers-reduced-motion
* Keyboard focus triggers interaction
* Escape key hides preview
* Video must remain muted
* playsInline enabled

---

## Deliverables

Provide:

* Recommended folder structure
* Complete hook implementations
* Full HeroTitle component
* TypeScript types
* Tailwind classes
* GSAP setup
* Performance optimization notes

---

## Visual References

Inspired by:

* Active Theory
* Studio Freight
* Locomotive
* BASIC/DEPT
* Resn
* Awwwards-winning agency websites

The final interaction should feel cinematic, luxurious, tactile, smooth, and maintain 60fps performance.
