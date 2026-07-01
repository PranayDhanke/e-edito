# EDITO Design System

A comprehensive guide to EDITO's visual language, components, and design principles.

## Overview

EDITO is a professional collaborative code editor platform. The design system reflects this positioning through a modern, professional aesthetic with careful attention to usability and visual hierarchy.

## Color Palette

### Primary Colors
- **Orange**: `oklch(0.922 0.005 34.3)` - Primary brand color used for CTAs, highlights, and key interactions
- **Black**: `oklch(0.147 0.004 49.3)` - Dark backgrounds for professional appearance
- **White**: `oklch(0.986 0.002 67.8)` - Light text and backgrounds

### Secondary Colors
- **Gray**: `oklch(0.714 0.014 41.2)` - Muted text and borders
- **Slate**: `oklch(0.268 0.011 36.5)` - Darker accents and cards
- **Red**: `oklch(0.704 0.191 22.216)` - Destructive actions and errors

### Dark Mode
The platform uses a professional dark theme optimized for coding:
- **Background**: Deep charcoal
- **Surfaces**: Darker grays with subtle borders
- **Text**: White with reduced opacity for hierarchy
- **Accents**: Orange for interactive elements

## Typography

### Fonts
- **Heading Font**: Playfair Display - Elegant serif for page titles and hero sections
- **Body Font**: Noto Sans - Clean, readable sans-serif for body text
- **Code Font**: Geist Mono - Fixed-width font for code blocks and monospace content

### Scale
- **Hero**: 56px-72px (Large, bold headlines)
- **H1**: 32px-48px (Page section titles)
- **H2**: 24px-32px (Subsection titles)
- **H3**: 20px-24px (Feature titles)
- **Body**: 14px-16px (Main content)
- **Small**: 12px-14px (Labels, hints)
- **Code**: 12px-14px (Code blocks)

### Line Heights
- **Headlines**: 1.2-1.3 (tight)
- **Body**: 1.5-1.6 (relaxed for readability)
- **Code**: 1.5 (comfort for reading)

## Spacing

Uses a consistent 4px base unit:
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px

## Component Library

### Buttons
- **Primary**: Orange background, white text - for main CTAs
- **Secondary**: Gray outline - for alternative actions
- **Ghost**: Transparent background - for tertiary actions
- **Destructive**: Red background - for delete/warning actions

### Cards
- Dark background with subtle border
- Rounded corners (8-12px)
- Shadow for depth (only on hover for IDE components)
- Hover states increase border opacity

### Forms
- Light backgrounds for inputs
- Clear labels and error states
- Proper spacing between fields
- Focus states with colored rings

### IDE Components

#### IDELayout
- 3-panel architecture: left sidebar, center editor, right panel, bottom console
- Fully resizable panels with visible drag handles
- Smooth transitions and hover effects
- Console auto-scrolls with manual scroll lock option

#### IDEToolbar
- Primary actions: Run, Save, Share
- Connection indicator with pulse animation
- Room code display with copy button
- Participant count badge
- Secondary toolbar with formatting and search

#### IDESidebar
- File browser or file info view
- Version history integration
- Tab-based navigation
- Quick stats display

#### IDERightPanel
- Tabbed interface: Participants, Messages, Video
- Tab icons for quick recognition
- Close button for collapsing
- Empty states for guidance

#### ConsolePanelPro
- Color-coded output (log, error, warning, info, success)
- Type icons and optional timestamps
- Auto-scroll toggle and copy functionality
- Running state indicator
- Clean footer with status information

## Icons

- **Size**: 16px, 20px, 24px (consistent sizing)
- **Source**: Lucide React icons
- **Color**: Matches text color or specific role (error=red, success=green)

## Interactions

### Animations
- **Transitions**: 200-300ms for smooth interactions
- **Hover**: Increased opacity or color shift for interactive elements
- **Loading**: Subtle pulse or spinner animation
- **Status**: Animated dots or progress indicators

### Feedback
- Toast notifications for confirmations
- Inline error messages for validation
- Hover tooltips for additional context
- Status bars at bottom of panels

## Responsiveness

Mobile-first approach:
- **Mobile**: Single column, stacked components
- **Tablet**: Two column layout, side panels optional
- **Desktop**: Full 3-4 panel layout

Key breakpoints:
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px

## Accessibility

- **Contrast**: All text meets WCAG AA standards (minimum 4.5:1)
- **Focus**: Clear focus states for keyboard navigation
- **ARIA**: Proper labels and roles for screen readers
- **Keyboard**: Full keyboard navigation support
- **Alt Text**: All images have descriptive alt text

## Landing Page Design

### Hero Section
- Dark background with orange gradient accents
- Bold, large typography
- Subtle animated backgrounds
- Clear value proposition
- Dual CTAs for signed-in and new users

### Features Section
- 4-column grid on desktop, 2-column on tablet, 1-column on mobile
- Icon + title + description format
- Hover effects on cards
- Balanced visual weight

### CTA Section
- Contrasting background (dark with orange border)
- Center-aligned text
- Single, prominent CTA button
- Reinforces key value proposition

### Footer
- Dark background matching header
- Logo and brand description
- Organized link sections
- Copyright information

## IDE Workspace Design

### Editor Area
- Maximized display space
- Syntax highlighting for code
- Line numbers and gutter
- Minimap for large files

### Collaboration Features
- Live cursor positions
- Participant list with colors
- Real-time code changes
- Audio/video indicators

### Status Communication
- Connection status indicator
- Participant count
- Room information display
- Execution status in console

## Best Practices

1. **Consistency**: Use design tokens and components from this system
2. **Hierarchy**: Establish clear visual hierarchy through size and color
3. **Whitespace**: Use generous spacing to avoid clutter
4. **Feedback**: Provide clear feedback for all user actions
5. **Performance**: Optimize animations and transitions for smooth performance
6. **Testing**: Test on multiple devices and browsers
7. **Accessibility**: Always consider keyboard and screen reader users

## Variables

All design values are centralized in `globals.css` using CSS custom properties:

```css
--background
--foreground
--primary
--secondary
--accent
--destructive
--border
--radius
```

Update these variables to maintain consistency across the platform.

## Future Considerations

- [ ] Light mode support
- [ ] Additional accent colors
- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] Mobile-specific enhancements
- [ ] Localization and RTL support
