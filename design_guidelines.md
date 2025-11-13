# Hong Kong Primary School Filter - Design Guidelines

## Design Approach: Design System Foundation

**Selected System**: Material Design with Carbon Design influences for data-intensive components
**Rationale**: This is a utility-focused, information-dense application requiring robust data display patterns, efficient filtering mechanisms, and clear information hierarchy. Material Design provides excellent component libraries while Carbon Design principles enhance data table and comparison interfaces.

**Key Principles**:
- Clarity over decoration - every element serves a functional purpose
- Efficient information scanning with strong visual hierarchy
- Touch-friendly controls for mobile filtering
- Bilingual text optimization for Chinese characters

---

## Typography System

**Chinese Font Families**:
- Primary: 'Noto Sans TC' (Traditional Chinese) / 'Noto Sans SC' (Simplified Chinese) via Google Fonts
- Fallback: system-ui, -apple-system

**Type Scale**:
- Page Headers: text-3xl (30px) font-semibold
- Section Headers: text-xl (20px) font-semibold  
- Card Titles/School Names: text-lg (18px) font-medium
- Body/Data Labels: text-base (16px) font-normal
- Secondary Info: text-sm (14px) font-normal
- Captions/Meta: text-xs (12px) font-normal

**Chinese-Specific Adjustments**:
- Line height: leading-relaxed (1.625) for better character readability
- Letter spacing: tracking-normal (default) - Chinese characters don't benefit from increased tracking

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, and 8 for consistency
- Component padding: p-4, p-6
- Section spacing: space-y-6, space-y-8
- Card gaps: gap-4, gap-6
- Mobile padding: p-4 (desktop: p-6 or p-8)

**Grid Structure**:
```
Desktop: 
- Main content area: max-w-7xl mx-auto px-6
- Filter sidebar: w-72 (288px) fixed on left
- Content area: flex-1 with responsive grid

Mobile:
- Full width with collapsible filter drawer
- Single column card layout
- Sticky filter button at bottom
```

**Responsive Breakpoints**:
- Mobile: base (default)
- Tablet: md: (768px) - 2-column grid
- Desktop: lg: (1024px) - sidebar + 2-3 column grid
- Large: xl: (1280px) - sidebar + 3-4 column grid

---

## Component Library

### Navigation & Header
- **Top Navigation Bar**: Sticky header with logo, language toggle (繁/简), search bar
- Height: h-16 (64px)
- Language toggle: Pill-style button with smooth transition
- Search: Full-width on mobile, 40% width on desktop with icon

### Filter System
- **Desktop**: Fixed sidebar with collapsible filter groups
- **Mobile**: Bottom sheet drawer triggered by floating action button
- Filter groups: Accordion-style with chevron indicators
- Checkboxes: Material Design style with clear hit targets (min 44x44px)
- Filter chips: Show active filters with remove (×) button
- Clear all filters: Text link at top of filter area

### School Cards
- **Card Structure**: Elevated cards with rounded corners (rounded-lg)
- Padding: p-6
- School name: Large, bold at top
- Key info grid: 2-column on mobile, 3-column on desktop
- Icons: Use Material Icons for categories (location, type, gender, etc.)
- Compare checkbox: Top-right corner
- Action buttons: "詳細資料" (View Details) and "比較" (Compare)

### Data Tables (Desktop)
- Striped rows for easier scanning
- Sortable column headers with arrow indicators
- Sticky header row when scrolling
- Minimum column widths to prevent text wrapping
- Responsive: Convert to cards on mobile

### Comparison View
- Side-by-side layout (2-4 schools)
- Sticky school names at top
- Grouped attributes in rows
- Highlight differences with subtle backgrounds
- Mobile: Horizontal scroll with snap points

### School Detail View
- **Hero Section**: School name and key stats banner (not image-based)
- **Tabbed Interface**: 基本資料 (Basic Info), 設施 (Facilities), 聯絡 (Contact), 收費 (Fees)
- Info cards: Grouped by category with clear labels
- Contact information: Clickable phone/email/website
- Map integration: Embedded Google Maps for school location

### Forms & Inputs
- Search input: Autocomplete dropdown with school name suggestions
- Selects/Dropdowns: Material-style with floating labels
- Range sliders: For numeric filters (e.g., fees, student count)
- All inputs: Consistent height h-12, rounded borders

### Buttons
- **Primary Actions**: Solid filled buttons (e.g., "搜尋", "比較學校")
- **Secondary Actions**: Outlined buttons (e.g., "重設", "取消")
- **Tertiary**: Text buttons for minor actions
- Heights: h-10 or h-12 for better touch targets
- Padding: px-6 py-2

### Loading & Empty States
- Loading: Skeleton screens matching card/table layouts
- Empty results: Centered icon + message + "Clear filters" CTA
- Error states: Alert-style messages with retry options

### Mobile Optimization
- Bottom navigation for main sections if needed
- Swipeable cards in comparison view
- Pull-to-refresh for data updates
- Floating action button for quick filter access
- Sticky "比較" (Compare) button when schools selected

---

## Interaction Patterns

- **Filter application**: Real-time with debounced search (300ms)
- **Sorting**: Single-click column headers, visual indicator for active sort
- **Selection**: Multi-select with visible counter "已選擇 X 所學校"
- **Navigation**: Breadcrumbs for detail views
- **Transitions**: Quick, functional (150-200ms), minimal decorative animation

---

## Accessibility

- All form inputs with proper labels (visible or aria-label)
- Keyboard navigation: Tab order follows visual flow
- Focus indicators: Clear outline on all interactive elements
- Color contrast: WCAG AA minimum for all text
- Screen reader: Proper heading hierarchy (h1-h6)
- Touch targets: Minimum 44×44px for mobile

---

## Images

**No hero images required** - this is a data-focused application where function takes priority.

**Icon Usage**:
- Material Icons via CDN for UI elements (search, filter, sort, close, etc.)
- Category icons for school attributes (location pin, person icons for gender, building for type)
- Consistent 20px or 24px sizes

---

## Key Design Differentiators

- **Chinese-first typography** with proper character spacing
- **Efficient data scanning** through strong hierarchy and grouping
- **Mobile-optimized filtering** with bottom sheet pattern
- **Clear comparison interface** highlighting differences
- **Minimal decoration** - every pixel serves user goals