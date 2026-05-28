# Health Check-UP System - Complete Website Documentation

## 📱 WEBSITE OVERVIEW

**Project**: City Clinical Lab / Health Checks  
**Type**: Medical Diagnostic Lab Booking Platform  
**Tech Stack**: React 19 + Vite + Tailwind CSS + Node.js + Express + MongoDB  
**Deployment**: Localhost (Frontend: 5173, Backend: 5000)

---

## 🎨 DESIGN SYSTEM

### COLOR SCHEME (CSS Variables - Day Theme)
```
--hc-page: #f7fbfb         (Light teal background)
--hc-nav: #ffffff          (White navbar)
--hc-surface: #ffffff      (White cards/containers)
--hc-elevated: #f4fbfb     (Light background)
--hc-soft: #eaf8f7         (Soft teal)
--hc-input: #f3faf9        (Input background)
--hc-text: #15323a         (Dark text)
--hc-muted: #607987        (Gray text)
--hc-border: #d6ebe9       (Light border)
--hc-brand: #0bb8ad        (Teal primary brand color)
--hc-brand-text: #ffffff   (White on brand)
--hc-accent: #009b96       (Darker teal accent)
--hc-accent-soft: #d9f6f3  (Soft accent background)
--hc-warm: #ff7a59         (Orange/warm CTA)
```

### COLOR SCHEME (Night Theme)
```
--hc-page: #08242a         (Very dark background)
--hc-nav: #0a2b31          (Dark navbar)
--hc-surface: #0d333a      (Dark surface)
--hc-brand: #4bd6c9        (Bright teal)
--hc-text: #f1fffe         (White text)
--hc-muted: #bdd8d9        (Light gray text)
--hc-border: #21545e       (Dark border)
```

### TYPOGRAPHY
- **Font Family**: Inter, system fonts
- **Heading 1 (h1)**: 48px, weight 900, line-height 1.06
- **Heading 2 (h2)**: 38-42px, weight 900, line-height 1.05-1.12
- **Heading 3 (h3)**: 24px, weight 900
- **Body Text**: 16px, weight 600, line-height 1.75
- **Small Text**: 12-14px, weight 600
- **Labels/Kickers**: 12px, weight 900, uppercase, letter-spacing 0.16em

---

## 📐 SPACING STANDARDS

### Padding (Component Level)
```
- Extra Small: 2px - 4px   (icons, tight spacing)
- Small: 8px - 12px        (inputs, buttons internal)
- Medium: 16px - 20px      (card padding default)
- Large: 24px - 32px       (section padding - ENHANCED)
- Extra Large: 40px - 48px (large card padding - PREMIUM)
```

### Margins (Between Elements)
```
- Vertical spacing between sections: 48px - 64px (PREMIUM)
- Section gap: 40px - 48px
- Component gap: 16px - 24px
- Text elements: 8px - 16px
```

### Container Widths
```
- Max Width: 1280px (80rem / 7xl)
- Content Padding: 20px (mobile) → 32px (desktop)
- Grid Gap: 24px-28px
```

---

## 🏗️ COMPONENT LIBRARY

### 1. NAVBAR
**Location**: `client/src/components/Navbar.jsx`

**Dimensions**:
- Height: 64px (16 rem) / 72px on desktop (lg:h-[72px])
- Sticky position (top: 0, z-index: 100)
- Backdrop blur: md:block (hidden on mobile)

**Components**:
- Promotion bar (hidden on mobile)
  - Height: 36px (h-9)
  - Background: var(--hc-soft)
  - Font: 12px, bold
- Main navbar section
  - Height: 64px
  - Logo icon: 40px square (h-10 w-10)
  - Logo text: max-width 170px (mobile), 210px (desktop)
- Search bar (hidden on mobile, shows on lg)
  - Width: 290px (w-[290px])
  - Height: 44px (h-11)
  - Border radius: 10px
- Theme toggle button
  - Height: 44px (h-11)
  - Hidden on mobile
- Mobile menu button
  - Height: 44px (h-11)
  - Width: 44px (w-11)
  - Shows only on mobile (<lg)

**Icons Used**:
- Stethoscope (logo)
- Search
- Moon/Sun (theme toggle)
- Phone
- User
- LogOut
- Menu/X (mobile toggle)

**Padding/Margin**:
- Main padding: 16px mobile, 32px desktop
- Gap between items: 16px
- Search margin-left: auto

---

### 2. HERO SECTION
**Location**: `client/src/components/Hero.jsx`

**Dimensions**:
- Grid: 2 columns on desktop (col-1: 0.92fr, col-2: 1.08fr)
- Gap: 40px (gap-10)
- Padding: 64px top/bottom (py-16), 16px mobile (px-4), 32px desktop (lg:px-8)
- Full width

**Components**:

#### Left Column
- Badge/Kicker
  - Padding: 8px left/right, 10px top/bottom (px-4 py-2.5)
  - Border radius: 9999px (rounded-full)
  - Font: 12px, weight 900, uppercase
  - Margin bottom: 32px (mb-8)

- Main H1 Title
  - Font size: clamp(32px, 4vw, 48px)
  - Weight: 900
  - Line height: 1.06
  - Margin bottom: 32px (mt-8)

- Description Paragraph
  - Font size: 16px
  - Weight: 600
  - Line height: 1.75
  - Max width: 896px
  - Color: var(--hc-muted)
  - Margin bottom: 40px (mt-10)

- Search Form
  - Height: auto
  - Padding: 12px (p-3)
  - Border radius: 14px
  - Flex direction: column on mobile, row on tablet (sm:flex-row)
  - Box shadow: shadow-xl shadow-slate-900/5

  - Search Input
    - Height: 44px (py-4)
    - Padding: 12px left/right
    - Font: 14px, weight 900
    - Border: none
    - Background: transparent

  - Search Button
    - Height: 44px (py-4)
    - Padding: 24px left/right (px-6)
    - Font: 14px, weight 900
    - Border radius: 10px
    - Background: var(--hc-brand)
    - Color: var(--hc-brand-text)

- Quick Search Tags
  - Padding: 20px left/right, 8px top/bottom (px-5 py-2.5)
  - Border radius: 9999px
  - Font: 12px, weight 900
  - Gap: 10px
  - Margin top: 24px

- Trust Stats (3 column grid)
  - Gap: 16px
  - Padding: 20px
  - Border radius: 12px
  - Margin top: 40px

#### Right Column
- Image Carousel Card
  - Border radius: 18px
  - Padding: 16px (p-4)
  - Box shadow: shadow-2xl shadow-slate-900/8
  - Background: var(--hc-surface)

  - Main Image Container
    - Border radius: 14px
    - Min height: 390px
    - Grid layout: [1fr, 220px] on desktop

  - Slide Image
    - Full height/width (inset-0)
    - Object fit: cover
    - Transition: opacity 700ms

  - Slide Info (overlaid bottom)
    - Gradient overlay: from-slate-950/88 via-transparent
    - Padding: 20px mobile, 28px desktop
    - Text color: white

  - Category Badge
    - Padding: 12px left/right, 6px top/bottom (px-3 py-1.5)
    - Background: white/15 with backdrop blur
    - Font: 11px, weight 900, uppercase
    - Border radius: 9999px

  - Slide Title
    - Font size: 24px mobile, 36px desktop
    - Weight: 900
    - Line height: tight
    - Color: white

  - Slide Description
    - Font: 14px, weight 600
    - Color: white/82
    - Line clamp: 2 lines
    - Margin top: 12px

  - Slide Actions (bottom)
    - "Book now" button
      - Background: white
      - Text: slate-950
      - Padding: 12px, 16px
      - Font: 12px, weight 900
      - Border radius: 10px

    - "View details" link
      - Border: white/30
      - Text: white
      - Same padding as button

    - Price display (right side)
      - Font: 48px, weight 900
      - Text color: white
      - Helper text: 12px, opacity-65

  - Service Rail (right side)
    - Grid gap: 16px
    - Item padding: 20px
    - Background: var(--hc-soft)
    - Border radius: 14px
    - Icon size: 20px

- Pagination Dots (bottom)
  - Gap: 10px
  - Active dot width: 36px
  - Inactive dot width: 8px
  - Border radius: 9999px
  - Margin top: 20px

**Icons Used**:
- ShieldCheck (certified badge)
- Search (search icon)
- BadgeCheck (hero slide)
- ArrowRight (buttons)

---

### 3. PACKAGES SLIDER
**Location**: `client/src/components/packages/PackagesSlider.jsx`

**Section**:
- Padding: 56px top/bottom (py-14), 20px mobile (px-5), 32px desktop (lg:px-8)
- Background: var(--hc-surface)
- Max width: 1280px (max-w-7xl)
- Margin: auto centered

**Header Section**:
- Grid gap: 24px
- Margin bottom: 48px (mb-12)

- Title Container
  - Margin bottom: 16px (mb-4)
  - Font: 14px, weight 900, uppercase, letter-spacing 0.22em

- Heading
  - Font: 24px (compact-title class)
  - Weight: 900

- Description
  - Max width: 448px
  - Font: 14px, weight 500
  - Color: var(--hc-muted)

**Swiper Container**:
- Space between slides: 28px (spaceBetween)
- Padding top: 48px (pt-12)
- Gap bottom: 56px for pagination

**Responsive Breakpoints**:
- Mobile: 1 slide per view
- Tablet (>700px): 2 slides per view
- Desktop (>1080px): 3 slides per view

**Navigation Buttons**:
- Size: 44px × 44px (h-11 w-11)
- Position: absolute, top 50%, -translate-y-1/2
- Left button: -left-5 (desktop)
- Right button: -right-5 (desktop)
- Border radius: 8px
- Background: var(--hc-surface)
- Color: var(--hc-muted)
- Border: 1px var(--hc-border)
- Hover: background var(--hc-brand), color white
- Icon size: 18px

**Pagination Dots**:
- Flex centered
- Margin top: auto (above container)

---

### 4. PACKAGE CARD
**Location**: `client/src/components/packages/PackageCard.jsx`

**Card Dimensions**:
- Height: 100% (flex h-full)
- Padding: 20px (p-5)
- Border radius: 16px (rounded-[16px])
- Border: 1px var(--hc-border)
- Background: var(--hc-surface)
- Flex direction: column
- Box shadow: shadow-sm
- Hover: -translate-y-1 (h-4 up), shadow-xl shadow-black/8
- Transition: duration-300

**Content Structure**:

- Header (gap 16px, margin-bottom 20px)
  - Left section (min-w-0)
    - Badge (Verified)
      - Padding: 12px left/right, 6px top/bottom (px-3 py-1.5)
      - Background: var(--hc-accent-soft)
      - Font: 10px, weight 900, uppercase
      - Border radius: 9999px
      - Margin bottom: 12px (mb-3)
      - Icon size: 13px

    - Package Name (Title)
      - Font size: 18px mobile, 20px desktop
      - Weight: 900
      - Line height: snug (1.375)
      - Color: var(--hc-text)

  - Right section (test count box)
    - Padding: 16px, 12px
    - Border radius: 12px
    - Background: var(--hc-soft)
    - Border: 1px var(--hc-border)
    - Text alignment: center

    - Large number
      - Font size: 24px
      - Weight: 900
      - Color: var(--hc-text)

    - Label
      - Font: 10px, weight 900, uppercase
      - Color: var(--hc-muted)
      - Letter spacing: 0.14em

- Description
  - Font: 14px, weight 500
  - Line height: 1.5
  - Color: var(--hc-muted)
  - Line clamp: 3 lines

- Features Grid (3 columns)
  - Padding: 12px top/bottom
  - Margin: 20px top/bottom
  - Border top/bottom: 1px var(--hc-border)
  - Gap: 8px

  - Each feature
    - Icon: 17px, color var(--hc-muted)
    - Margin bottom: 8px
    - Text: 10px, weight 900, uppercase, center aligned

- Pricing Section (bottom, margin-top: auto)
  - Margin bottom: 20px

  - Price Display
    - Font: 24px, weight 900
    - Color: var(--hc-text)
    - Line through original price
    - Text: "per person"
    - Margin bottom: 20px

  - Members Badge (right side)
    - Padding: 12px left/right, 8px top/bottom (px-3 py-2)
    - Background: var(--hc-soft)
    - Border radius: 10px
    - Font: 12px, weight 900
    - Color: var(--hc-muted)
    - Icon size: 15px

- CTA Button
  - Width: 100%
  - Height: auto (py-3.5)
  - Padding: 12px top/bottom
  - Background: var(--hc-warm) - orange (#ff7a59)
  - Color: white
  - Font: 14px, weight 900, uppercase
  - Border radius: 12px
  - Box shadow: shadow-lg shadow-black/10
  - Hover: opacity-90

**Icons Used**:
- ShieldCheck (verified)
- Clock (fasting)
- FileText (report time)
- CalendarDays (location)
- Users (members)

---

### 5. TESTIMONIALS
**Location**: `client/src/components/Testimonials.jsx`

**Section**:
- Padding: 56px top/bottom (py-14), 20px mobile (px-5), 32px desktop (lg:px-8)
- Background: var(--hc-brand) - teal primary color
- Text color: var(--hc-brand-text) - white
- Max width: 1280px

**Header**:
- Text alignment: center
- Margin bottom: 64px (mb-16)
- Max width: 768px, centered

- Kicker
  - Font: 12px, weight 900, uppercase, letter-spacing 0.22em
  - Opacity: 70%
  - Margin bottom: 16px

- Heading
  - Font size: 30px mobile, 48px desktop
  - Weight: 900
  - Line height: tight
  - Max width: 768px

**Testimonials Grid**:
- 3 columns (md:grid-cols-3)
- Gap: 24px
- Margin bottom: 64px

**Testimonial Card**:
- Padding: 32px
- Border: 1px white/10
- Background: white/8
- Border radius: 12px
- Transition: hover -translate-y-2, shadow increased
- Backdrop: blurred (implicit)

- Star Rating (top left)
  - Gap: 4px
  - Icon size: 18px
  - Color: amber-300
  - Margin bottom: 40px

- Quote Icon (top right)
  - Icon size: 32px
  - Color: white/20
  - Margin bottom: 40px

- Text
  - Min height: 128px
  - Font: 16px, weight 500
  - Line height: 2
  - Opacity: 85%
  - Quoted in quotes

- Author Section (bottom)
  - Padding top: 24px
  - Border top: 1px white/10
  - Margin top: 40px

  - Author Avatar
    - Size: 48px × 48px
    - Border radius: 10px
    - Background: white/15
    - Font: weight 900, 16px
    - Margin right: 16px (gap-4)

  - Author Name
    - Font: 14px, weight 900, uppercase, letter-spacing 0.12em
    - Color: white

  - Location
    - Font: 12px, weight 900, uppercase
    - Opacity: 60%
    - Margin top: 6px

**Icons Used**:
- Quote
- Star

---

### 6. WHY CHOOSE US (Features)
**Location**: `client/src/components/WhyChooseUs.jsx`

**Section**:
- Class: hc-section hc-surface
- Padding: 56px top/bottom (py-14)
- Max width: 1280px
- Background: var(--hc-surface)

**Header**:
- Grid: 2 columns on desktop
- Gap: 32px
- Margin bottom: 64px (mb-16)

- Left side (title)
  - Kicker: 12px, 900 weight, teal accent, uppercase, 0.22em spacing
  - Heading: 30px mobile, 48px desktop, weight 900
  - Max width: 512px
  - Color: var(--hc-text)

- Right side (description)
  - Max width: 448px
  - Font: 14px, weight 500
  - Line height: 1.75
  - Color: var(--hc-muted)

**Features Grid**:
- 3 columns on desktop, 2 on tablet
- Gap: 24px

**Feature Card**:
- Padding: 32px
- Border radius: 12px
- Background: var(--hc-soft)
- Border: 1px var(--hc-border)
- Transition: hover bg-var(--hc-surface), shadow-lg shadow-black/5
- Hover: -translate-y-2

- Icon Container
  - Size: 56px × 56px (h-14 w-14)
  - Border radius: 10px
  - Background: var(--hc-surface)
  - Color: var(--hc-accent)
  - Box shadow: shadow-sm
  - Margin bottom: 24px (mb-6)
  - Icon size: 26px

- Title
  - Font: 18px, weight 900
  - Color: var(--hc-text)

- Description
  - Font: 14px, weight 500
  - Line height: 1.5
  - Color: var(--hc-muted)
  - Margin top: 16px

**Icons Used**:
- Truck (on-time collection)
- HeartPulse (report counselling)
- Activity (fast delivery)
- ShieldCheck (verified doctors)
- Users (network)
- Award (quality protocols)

---

### 7. PROCESS FLOW
**Location**: `client/src/components/ProcessFlow.jsx`

**Section**:
- Class: hc-section hc-page
- Background: var(--hc-page)

**Header**:
- Max width: 512px
- Margin bottom: 64px (mb-16)

- Kicker: 12px, weight 900, uppercase, teal accent
- Heading: 30px mobile, 48px desktop, weight 900

**Steps Grid**:
- 4 columns (md:grid-cols-4)
- Gap: 24px

**Step Card**:
- Padding: 32px
- Border radius: 12px
- Border: 1px var(--hc-border)
- Background: var(--hc-surface)
- Box shadow: shadow-sm

- Icon + Number
  - Flex, space-between
  - Margin bottom: 40px (mb-10)

  - Icon Container
    - Size: 56px × 56px (h-14 w-14)
    - Border radius: 10px
    - Background: var(--hc-soft)
    - Color: varies by step (accent color)
    - Icon size: 24px

  - Step Number
    - Font: 48px, weight 900
    - Color: var(--hc-border) - light gray
    - Opacity implied (lighter)

- Title
  - Font: 18px, weight 900
  - Color: var(--hc-text)

- Description
  - Font: 14px, weight 500
  - Line height: 1.5
  - Color: var(--hc-muted)
  - Margin top: 16px

**Icons Used**:
- Home (Book Online)
- Truck (Home Collection)
- FlaskConical (Lab Processing)
- FileCheck (Digital Report)

---

### 8. BOOKING COUNTER
**Location**: `client/src/components/BookingCounter.jsx`

**Section**:
- Background: slate-900
- Padding: 40px top/bottom (py-10)
- Border top/bottom: 1px white/10
- Overflow: hidden (relative positioning)
- Max width: 1280px

**Background Decoration**:
- Absolute positioned blur (top-0 left-1/4)
- Width: 256px (w-64)
- Height: 100%
- Background: blue-600/20
- Blur: 100px

**Counter Layout**:
- Flex, wrap on mobile
- Justify: space-around
- Items: center
- Gap: 48px
- Relative z-index: 10 (above blur)

**Each Counter Block**:
- Flex, gap-5
- Hover animation group

- Icon Container
  - Padding: 16px (p-4)
  - Border radius: 16px
  - Background: varies (blue-600/20, green-600/20, teal-600/20)
  - Hover: background opacity increases
  - Transition: smooth
  - Icon size: 28px × 28px

- Text Container
  - Number
    - Font: 30px, weight 900
    - Color: white
    - Tabular nums (monospace alignment)
    - Margin bottom: 0

  - Label
    - Font: 10px, weight 900, uppercase
    - Color: slate-400
    - Letter spacing: widest
    - Margin top: 4px

**Icons Used**:
- Droplets (samples - blue)
- Users (active users - green with animate-pulse)
- ShieldCheck (standards - teal)

---

### 9. CALLBACK WIDGET
**Location**: `client/src/components/CallbackWidget.jsx`

**Position**:
- Fixed: bottom-24 right-4
- Z-index: 400

**Trigger Button** (when closed):
- Size: 48px × 48px (h-12 w-12)
- Border radius: 9999px (circle)
- Background: var(--hc-surface)
- Border: 1px var(--hc-border)
- Color: var(--hc-accent)
- Hover: scale-105
- Active: scale-95
- Box shadow: shadow-lg
- Icon size: 20px (h-5 w-5)

**Form Card** (when open):
- Width: 320px
- Border radius: 14px
- Border: 1px var(--hc-border)
- Background: var(--hc-surface)
- Padding: 24px
- Box shadow: shadow-2xl
- Animation: slide-in-from-bottom-10, fade-in, 500ms

**Close Button**:
- Position: absolute top-4 right-4
- Size: 24px × 24px (implied via p-1)
- Border radius: 9999px
- Background: var(--hc-soft)
- Icon size: 16px
- Hover: text color to var(--hc-text)

**Header Section**:
- Flex, gap-3
- Margin bottom: 24px

- Icon Badge
  - Padding: 10px (p-2.5)
  - Border radius: 10px
  - Background: var(--hc-brand)
  - Color: var(--hc-brand-text)
  - Icon size: 20px

- Text
  - Title: 11px, weight 900, uppercase, no margin
  - Subtitle: 10px, teal accent, weight 900, uppercase, 0.5em letter-spacing

**Description Text**:
- Font: 12px, weight 900
- Color: var(--hc-muted)
- Line height: relaxed
- Margin bottom: 24px

**Phone Input**:
- Full width (w-full)
- Height: auto (py-4)
- Padding: left 12px (for +91 prefix), right 16px
- Border radius: 10px
- Border: 1px var(--hc-border)
- Background: var(--hc-soft)
- Font: 14px, weight 900
- Color: var(--hc-text)
- Focus: border-var(--hc-accent)
- Disabled: opacity-50

- Prefix "+91"
  - Position: absolute left-4, top-1/2, -translate-y-1/2
  - Font: 10px, weight 900
  - Color: var(--hc-muted)

**Submit Button**:
- Width: 100%
- Height: auto (py-4)
- Padding: vertical
- Border radius: 10px
- Background: var(--hc-brand)
- Color: var(--hc-brand-text)
- Font: 12px, weight 900, uppercase, 0.12em letter-spacing
- Hover: opacity-90
- Disabled: loading state
- Icon gap: 8px
- Icon size: 16px (animate-spin when loading)

**Success State**:
- Icon container: 80px × 80px (w-20 h-20)
- Background: green-50
- Color: green-500
- Border radius: 24px
- Icon size: 40px, weight 3 (thick strokes)
- Box shadow: inner shadow
- Margin bottom: 24px

- Title: weight 900, uppercase, 20px
- Subtitle: 11px, weight 900, uppercase, 0.2em spacing

**Icons Used**:
- PhoneCall (trigger button)
- Clock (header)
- X (close)
- Loader2 (loading spinner)
- CheckCircle2 (success)

---

### 10. EXPERT PANEL
**Location**: `client/src/components/ExpertPanel.jsx`

**Section**:
- Padding: 96px top/bottom (py-24)
- Background: white
- Overflow: hidden
- Relative positioning

**Background Decoration**:
- Absolute positioned circle
- Top-right: -right-40 -top-40
- Size: 384px × 384px (w-96 h-96)
- Background: blue-50
- Border radius: 9999px
- Blur: 150px

**Container**:
- Max width: 1280px
- Padding: 24px mobile/desktop (px-6)
- Relative z-index: 10

**Header**:
- Text alignment: center
- Max width: 512px, centered
- Margin bottom: 80px (mb-20)

- Badge
  - Background: blue-100
  - Color: blue-700
  - Font: 12px, weight 900, uppercase, 0.2em spacing
  - Padding: 20px left/right, 10px top/bottom (px-5 py-2.5)
  - Border radius: 9999px
  - Inline-flex, gap-2
  - Ring: 4px blue-50 (ring-4 ring-blue-50)
  - Icon size: 16px

- Title
  - Font: 36px mobile, 48px desktop, weight 900, tight line-height
  - Color: slate-950
  - Max width: 512px

  - Accent Span
    - Color: blue-600

- Description
  - Font: 18px, weight 500
  - Color: slate-600
  - Line height: relaxed
  - Margin top: 20px

**Experts Grid**:
- 3 columns (md:grid-cols-3)
- Gap: 32px

**Expert Card**:
- Padding: 32px
- Background: slate-50
- Border: 1px slate-100
- Border radius: 35px (rounded-[35px])
- Box shadow: shadow-lg
- Hover: shadow-2xl, -translate-y-2
- Transition: duration-300
- Group class (for hover effects)

- Header (Flex, gap-6, margin-bottom 32px)
  - Image Container
    - Size: 96px × 96px (w-24 h-24)
    - Border radius: 9999px
    - Object fit: cover
    - Border: 4px white
    - Box shadow: shadow-xl
    - Ring: 2px blue-100 (ring-2 ring-blue-100)
    - Position: relative

  - Verification Badge (overlaid)
    - Position: absolute bottom-1 right-1
    - Size: implied (p-1.5)
    - Background: green-500
    - Border: 2px white
    - Border radius: 9999px
    - Icon size: 14px, weight 3

  - Info Container
    - Name
      - Font: 24px, weight 900, slate-950
      - Tracking: tight
      - Line height: snug

    - Qualification
      - Font: 14px, weight 900, blue-600

- Specialty Section (space-y-4)
  - Each item
    - Flex, gap-3
    - Background: white
    - Padding: 16px left/right, 10px top/bottom (px-4 py-2.5)
    - Border radius: 12px
    - Font: 14px, weight 500
    - Color: slate-700

  - Icon size: 18px, color: blue-500

- Footer
  - Padding top: 24px (pt-6)
  - Border top: 1px slate-200
  - Text alignment: center
  - Font: 10px, weight 900, uppercase
  - Color: slate-400
  - Line height: relaxed

**Icons Used**:
- Award
- ShieldCheck
- Zap

---

### 11. FOOTER
**Location**: `client/src/components/Footer.jsx`

**Section**:
- Padding: 80px top/bottom (py-20), 20px left/right mobile (px-5), 32px desktop (lg:px-8)
- Background: var(--hc-brand)
- Color: var(--hc-brand-text)

**Grid Layout**:
- Max width: 1280px
- Grid: 4 columns on desktop (1.2fr, 0.8fr, 1fr, 1fr)
- Gap: 48px

**Column 1: Brand Info**:
- Logo
  - Size: 48px × 48px (h-12 w-12)
  - Border radius: 10px
  - Background: white/15
  - Font size: 18px, weight 900
  - Margin bottom: 28px (mb-7)
  - Gap: 16px

- Description
  - Max width: 448px
  - Font: 14px, weight 500
  - Line height: 2 (8)
  - Opacity: 70%
  - Margin bottom: 32px (mt-8)

- Social Links
  - Flex, gap-4
  - Each button
    - Size: 44px × 44px (h-11 w-11)
    - Border radius: 10px
    - Background: white/10
    - Hover: white/20
    - Transition: smooth

**Column 2: Packages**:
- Heading
  - Font: 12px, weight 900, uppercase, 0.2em spacing
  - Opacity: 75%
  - Margin bottom: 28px (mb-7)

- List
  - Space-y-4
  - Font: 14px, weight 900
  - Opacity: 70%
  - Hover: opacity-100, color white

**Column 3: Contact**:
- Heading: same as column 2
- List (space-y-5)
  - Flex with icons
  - Font: 14px, weight 500
  - Icon size: 18px

**Column 4: Support Card**:
- Padding: 32px
- Border: 1px white/10
- Background: white/8
- Border radius: 12px
- Icon size: 32px, margin bottom 24px (mb-6)

- Title
  - Font: 18px, weight 900

- Description
  - Font: 14px, weight 500
  - Line height: 1.5
  - Opacity: 70%
  - Margin top: 16px

- CTA Button
  - Width: 100%
  - Flex centered
  - Background: white
  - Color: zinc-950
  - Padding: 16px left/right, 16px top/bottom (px-5 py-4)
  - Border radius: 10px
  - Font: 12px, weight 900, uppercase, 0.14em spacing
  - Hover: opacity-90
  - Margin top: 32px (mt-8)

**Bottom Bar**:
- Margin top: 64px (mt-16)
- Padding top: 48px (pt-12)
- Border top: 1px white/10
- Flex: column on mobile, row on desktop
- Gap: 24px
- Font: 12px, weight 900, opacity-60
- Justify: space-between

**Icons Used**:
- Stethoscope (logo)
- Facebook, Instagram, Twitter
- MapPin
- Phone
- Mail
- ShieldCheck

---

## 📊 RESPONSIVE DESIGN BREAKPOINTS

```
Mobile:    0px - 640px    (default styles)
Tablet:    641px - 1024px (sm: 640px, md: 768px)
Desktop:   1025px+        (lg: 1024px, xl: 1280px)
```

**Visibility Classes**:
- `hidden` → `lg:block` (show on desktop only)
- `block` → `lg:hidden` (show on mobile/tablet)
- `grid-cols-1` → `md:grid-cols-2` → `lg:grid-cols-3` (responsive grids)
- `px-4` → `lg:px-8` (responsive padding)
- `text-3xl` → `md:text-5xl` (responsive text size)

---

## 🎯 FUNCTIONALITY & FEATURES

### User Actions
1. **Book Package**
   - Click "Book Now" button on any package
   - Opens booking modal with form
   - Collects: Name, Phone, Address
   - Saves to localStorage (client-side) OR backend API (not yet integrated)

2. **Request Callback**
   - Click phone icon (fixed bottom-right)
   - Enter 10-digit mobile number
   - Backend API: `POST /api/callbacks/add`
   - Shows success confirmation

3. **Authentication**
   - Click "Login" in navbar
   - Routes to `/auth` page
   - Login/Sign Up form
   - Backend API: `POST /api/auth/login` or `/api/auth/signup`
   - Stores user data in localStorage

4. **User Dashboard**
   - After login, click username → Dashboard
   - Routes to `/dashboard`
   - Shows user bookings from backend API
   - Fetch: `GET /api/bookings/user/{phone}`

5. **Search Tests**
   - Search bar in hero section
   - Quick search tags: CBC, Thyroid, Diabetes, Lipid profile
   - Routes to `/package/{testName}`
   - Shows package details and included tests

6. **Theme Toggle**
   - Moon/Sun button in navbar
   - Toggles between day/night theme
   - CSS variables switch automatically

7. **Admin Portal**
   - Fixed button bottom-right (overlay navbar's callback)
   - Admin login: username "admin", password "anand2026"
   - Admin dashboard shows:
     - Booking Manager (mock data)
     - Add Patient (form)
     - Lab Settings (editable)

---

## 🔗 API ENDPOINTS

### Backend Routes
```
POST   /api/callbacks/add              → Create callback request
GET    /api/callbacks/all              → Fetch all callbacks
PUT    /api/callbacks/update/:id       → Update callback status

POST   /api/auth/signup                → User registration
POST   /api/auth/login                 → User login

POST   /api/bookings/new               → Create new booking
GET    /api/bookings/all               → Fetch all bookings
GET    /api/bookings/user/:phone       → Fetch user bookings
PATCH  /api/bookings/update-status/:id → Update booking status
POST   /api/bookings/manual-add        → Add patient manually
POST   /api/bookings/upload-report/:id → Upload PDF report

POST   /api/upload                     → Upload image
PUT    /api/auth/update-profile/:id    → Update user profile
DELETE /api/bookings/delete/:id        → Delete booking
```

---

## 🎭 ANIMATIONS & TRANSITIONS

```
Fade In:     animate-in fade-in duration-300/500
Slide In:    slide-in-from-bottom-4 / slide-in-from-bottom-10
Zoom In:     animate-in zoom-in-95 duration-300
Bounce:      animate-bounce
Spin:        animate-spin (for loaders)
Pulse:       animate-pulse (for active states)

Hover Effects:
  - -translate-y-1 (slide up slightly)
  - shadow increase
  - opacity change
  - scale-105, scale-95 (button press effects)
```

---

## 💾 DATA STORAGE

### Frontend (localStorage)
```
isUserAuthenticated → boolean
userData            → JSON {name, email, phone}
labSettings         → JSON {labName, contact, address, email}
labBookings         → JSON array of booking objects
```

### Backend (MongoDB)
```
Collections:
  - users          → User authentication
  - bookings       → Test bookings
  - callbacks      → Callback requests
```

---

## 📦 COMPONENT TREE

```
App
├── Navbar
├── Hero
├── PackagesSlider
│   └── PackageCard (×3)
├── AutoSlider
├── BookingCounter
├── ExpertPanel
├── ProcessFlow
├── WhyChooseUs
├── Testimonials
├── CallbackWidget
├── WhatsAppWidget
├── Footer
├── Routes
│   ├── / (home)
│   ├── /auth (login/signup)
│   ├── /dashboard (user dashboard)
│   │   ├── UserProfile
│   │   └── MyBookings
│   ├── /package/:id (package detail)
│   └── Admin Portal
│       ├── BookingManager
│       ├── AddPatient
│       └── LabSettings
└── BookingForm Modal
```

---

## 🎨 SHADOW & ELEVATION SCALE

```
shadow-sm      → 0 1px 2px rgba(0,0,0,0.05)
shadow-lg      → 0 10px 15px rgba(0,0,0,0.1)
shadow-xl      → 0 20px 25px rgba(0,0,0,0.1)
shadow-2xl     → 0 25px 50px rgba(0,0,0,0.25)

shadow-black/5  → shadow with 5% black opacity
shadow-black/8  → shadow with 8% black opacity
shadow-black/10 → shadow with 10% black opacity
```

---

## 🎯 KEY TAKEAWAYS

1. **Premium Spacing**: Enhanced padding (32px/48px+) and margins for luxury feel
2. **Component-First Design**: Reusable, modular components with consistent sizing
3. **Responsive**: Mobile-first approach with smooth breakpoints
4. **Accessible Colors**: High contrast, readable fonts, semantic color usage
5. **Interactive States**: Hover, active, loading, success animations
6. **Brand Consistency**: Unified color palette, typography, spacing
7. **Performance**: Lazy loading images, optimized bundle size
8. **Backend Ready**: API endpoints prepared for full integration

---

**Last Updated**: May 24, 2026  
**Framework Versions**:
- React 19.2.0
- Tailwind CSS 4.2.1
- Vite 7.3.1
- Express 5.2.1
- MongoDB 9.2.3