# EDITO Responsive Design Guidelines

## Mobile-First Approach

EDITO is built with a mobile-first philosophy. Design for mobile constraints first, then enhance for larger screens.

## Breakpoints

Using Tailwind CSS breakpoints:

```
sm:  640px  - Tablet
md:  768px  - Larger tablet
lg:  1024px - Desktop
xl:  1280px - Large desktop
2xl: 1536px - Extra large
```

## Layout Patterns

### Single Column (Mobile)

- Full-width with padding (16px left/right)
- Stacked sections
- Buttons full-width or 2-column grid

### Multi-Column (Tablet & Above)

- Content grid with proper gaps
- Sidebar becomes visible
- Horizontal navigation bar

### Desktop Enhancements

- Multi-column grids
- Wider content areas
- Hover states and tooltips
- Sidebar navigation

## Component Responsiveness

### Navbar

```
Mobile:   Logo + menu icon
Tablet:   Logo + navigation + user menu
Desktop:  Full navigation with secondary actions
```

### Toolbar

```
Mobile:   Essential buttons only (Run, Save)
Tablet:   All primary actions visible
Desktop:  Secondary actions visible
```

### Sidebar

```
Mobile:   Hidden, accessible via toggle
Tablet:   Collapsed state with icons
Desktop:  Full expanded state
```

### Editor Layout

```
Mobile:   Single column (editor, console, panels below)
Tablet:   Split view (editor left, panel right)
Desktop:  Three-column (sidebar, editor, right panel)
```

## Typography Scaling

```css
/* Heading 1 */
Mobile:   text-3xl (30px)
Desktop:  text-4xl (36px)

/* Heading 2 */
Mobile:   text-2xl (24px)
Desktop:  text-3xl (30px)

/* Body Text */
Mobile:   text-base (16px)
Desktop:  text-base (16px) - consistent
```

## Spacing Scale

```
xs:  0.25rem (4px)
sm:  0.5rem  (8px)
md:  1rem    (16px)
lg:  1.5rem  (24px)
xl:  2rem    (32px)
2xl: 3rem    (48px)
```

Mobile spacing uses smaller values, desktop can use larger values for breathing room.

## Touch Targets

- **Minimum size**: 44×44px for touch targets
- **Safe area**: 48-56px for optimal thumb reach
- **Spacing**: 8px gap between touch targets
- **Hover**: Not available on mobile, use focus states instead

## Image Handling

### Responsive Images

```html
<img 
  srcset="image-sm.jpg 640w, image-md.jpg 1024w, image-lg.jpg 1440w"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  src="image-md.jpg"
  alt="Description"
/>
```

### Container Queries

For components that adapt to container width rather than viewport:

```css
@container (min-width: 400px) {
  /* Styles for containers wider than 400px */
}
```

## Navigation Patterns

### Mobile Navigation

- Hamburger menu (collapsible)
- Bottom navigation bar (for primary actions)
- Full-screen overlay menu

### Desktop Navigation

- Horizontal navbar with dropdowns
- Persistent sidebar
- Breadcrumb navigation

## Form Layouts

### Mobile

- Full-width inputs
- Single column layout
- Large touch targets (48px height)
- Clear labels above inputs

### Desktop

- Multi-column grids where appropriate
- Labels beside inputs when space permits
- Inline help text

## Grid Systems

### Mobile

```css
grid-cols-1
/* Single column layout */
```

### Tablet

```css
md:grid-cols-2
/* Two column layout */
```

### Desktop

```css
lg:grid-cols-3 xl:grid-cols-4
/* Three or four column layout */
```

## Viewport Meta Tag

Required for mobile rendering:

```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

## Testing Checklist

### Mobile (375px - 425px)

- [ ] Layout doesn't overflow horizontally
- [ ] Touch targets are 44×44px minimum
- [ ] Text is readable without zoom
- [ ] Navigation is accessible
- [ ] Images scale appropriately
- [ ] Modals/dialogs fit screen
- [ ] Form inputs work properly

### Tablet (768px - 810px)

- [ ] Two-column layouts work
- [ ] Sidebar visible or accessible
- [ ] All navigation visible
- [ ] Buttons have proper spacing

### Desktop (1024px+)

- [ ] Multi-column layouts functional
- [ ] Hover states work properly
- [ ] Tooltips display correctly
- [ ] Maximum content width respected
- [ ] White space is proportional

## Media Query Patterns

### Mobile First

```css
/* Mobile styles (no media query) */
.component { }

/* Tablet and up */
@media (min-width: 768px) {
  .component { }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .component { }
}
```

### Desktop First (avoid when possible)

```css
/* Desktop styles */
.component { }

/* Tablet and below */
@media (max-width: 1024px) {
  .component { }
}
```

## Performance Considerations

### Optimization

- Lazy load images below the fold
- Use responsive image formats (WebP)
- Minify CSS and JavaScript
- Reduce motion for slow connections
- Progressive enhancement for Core Web Vitals

### Mobile Performance Metrics

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

## Device Testing

### Recommended Devices

- iPhone SE (375px)
- iPhone 12 (390px)
- iPhone 12 Pro Max (428px)
- iPad (768px)
- iPad Pro (1024px)
- Desktop (1920px)

### Browser Testing

- Chrome (mobile & desktop)
- Safari (iOS & macOS)
- Firefox (all platforms)
- Edge (Windows)

## Common Issues & Solutions

### Text Too Small

```css
/* Bad */
font-size: 12px;

/* Good */
font-size: 16px;
@media (min-width: 1024px) {
  font-size: 14px;
}
```

### Horizontal Overflow

```css
/* Good: Use overflow-x-auto for horizontal scrolling */
overflow-x-auto;

/* Good: Stack elements vertically on mobile */
flex-direction: column;
@media (min-width: 768px) {
  flex-direction: row;
}
```

### Unreadable On Small Screens

```css
/* Reduce line-height for mobile */
line-height: 1.4;
@media (min-width: 1024px) {
  line-height: 1.6;
}
```

## Resources

- [MDN Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Tailwind Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [Web Vitals](https://web.dev/vitals/)
