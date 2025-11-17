# Hong Kong Primary School Filter

## Overview

This is a Hong Kong Primary School database and filtering application that allows users to search, filter, compare, and view detailed information about primary schools in Hong Kong. The application is designed to handle bilingual content (Traditional Chinese and Simplified Chinese) with a focus on information density, efficient filtering, and clear data presentation.

The system provides a comprehensive school search experience with advanced filtering capabilities across multiple dimensions (region, school type, gender, religion, teaching language, etc.) and supports side-by-side comparison of up to 4 schools.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript running on Vite for fast development and optimized production builds.

**UI Component Library**: shadcn/ui components built on Radix UI primitives, providing accessible and customizable components following Material Design principles with Carbon Design influences for data-intensive displays.

**Styling System**: Tailwind CSS with custom design tokens for consistent spacing, colors, and typography. The design system is optimized for bilingual Chinese text rendering using Noto Sans TC/SC font families with adjusted line heights for character readability.

**State Management**: 
- React Context API for global language preferences (Traditional vs Simplified Chinese conversion)
- Local component state with React hooks for filter states, selected schools, and UI toggles
- TanStack Query (React Query) for server state management and data fetching

**Routing**: Wouter for lightweight client-side routing

**Internationalization**: Custom implementation using OpenCC.js for bidirectional Traditional/Simplified Chinese text conversion, allowing users to search in either variant and get matching results.

**Key Design Patterns**:
- Component composition with shadcn/ui base components
- Custom hooks for mobile detection and toast notifications
- Context providers for cross-cutting concerns (language, tooltips)
- Responsive design with mobile-first approach using Tailwind breakpoints

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript

**Development Setup**: 
- Vite middleware for HMR (Hot Module Replacement) in development
- Custom logging middleware for API request/response tracking
- Development-only Replit plugins for enhanced debugging

**API Design**: RESTful API structure with `/api` prefix (routes not yet implemented, infrastructure in place)

**Storage Interface**: Abstracted storage layer with `IStorage` interface supporting multiple implementations:
- In-memory storage (MemStorage) for development/testing
- Database storage ready for production (infrastructure prepared for Drizzle ORM integration)

**Session Management**: Infrastructure in place for connect-pg-simple for PostgreSQL-backed sessions

### Data Storage

**ORM**: Drizzle ORM configured for PostgreSQL with schema-first approach

**Database**: Configured for PostgreSQL via Neon serverless driver (@neondatabase/serverless)

**Schema Management**:
- Drizzle Kit for migrations (`migrations/` directory)
- Type-safe schema definitions in `shared/schema.ts`
- Zod integration via drizzle-zod for runtime validation

**Current Schemas**:
- User schema with username/password authentication (prepared but not actively used)
- School schema defined in TypeScript with extensive metadata fields (40+ properties including location, facilities, teaching staff, fees, etc.)

**Data Pattern**: Currently using mock data (`mockSchools.ts`) for frontend prototyping, with infrastructure ready for real database integration.

## Recent Changes

### November 17, 2025

**Article Carousel Implementation (Option A):**
- Redesigned article display: moved from list view to detail page for better discoverability and focus
- Created ArticleCarousel component using embla-carousel-react for smooth, native-feeling navigation
- List view changes:
  - Removed large OG image display from SchoolListItem
  - Added small article count badge (e.g., "新聞 (4)") with newspaper icon
  - Badge only displays when school has articles (29 schools total)
  - Improved list view performance and information density
- Detail page carousel features:
  - Prominent floating card at top of SchoolDetail, above tabs
  - Large responsive OG images (16:9 aspect, min 200px, max 675px height)
  - Article title displayed below image
  - Navigation with prev/next arrow buttons for multiple articles
  - Article count indicator (e.g., "1 / 4")
  - Swipe gesture support for mobile
  - Single-article graceful handling (no navigation buttons/counter when only 1 article)
  - Lazy-loading: OG images fetch for current and adjacent slides
- Secure OG metadata API with SSRF protection:
  - Domain whitelist enforcement (hk01.com, www.hk01.com only)
  - 5-second timeout to prevent hanging requests
  - Returns 403 Forbidden for invalid domains, 400 for malformed URLs
- Performance optimized:
  - All 508 schools load instantly
  - Articles data loads with schools (no blocking)
  - OG images lazy-load per visible carousel slide
- Click-through opens articles in new tab with proper security attributes (target="_blank", rel="noopener noreferrer")

### November 14, 2025

**Homework/Assessment Arrangements Card:**
- Created new "課業安排" (Homework Arrangement) card in SchoolDetail Basic Info tab
- Added 14 new fields to school schema for comprehensive homework/assessment data:
  - Text fields: 班級教學模式 (teaching mode), 班級結構備註 (class structure remarks), 分班安排 (class arrangement)
  - Numeric fields: 全年全科測驗次數_一年級/二至六年級 (test counts), 全年全科考試次數_一年級/二至六年級 (exam counts)
  - Policy fields (yes/no): 小一上學期以多元化的進展性評估代替測驗及考試, plus 6 additional policy flags covering homework policy transparency, diverse assessment, test scheduling, and homework time arrangements
- Implemented 3-subsection card layout for optimal readability:
  - Class Structure subsection: stacked text blocks for teaching mode, structure remarks, and arrangement
  - Testing Schedule subsection: 2-row table (小一, 小二至六) with test/exam count columns
  - Policy Highlights subsection: checkmark list displaying only "是" (yes) policies with green Check icons for visual clarity
- Smart conditional rendering ensures:
  - Card displays when ANY field has meaningful data (including "否" values)
  - Each subsection only renders when it has data to display
  - Separators only appear between populated subsections
  - Policy section displays checkmarks for positive policies only (避免 UI clutter)
- Added comprehensive TC/SC translations for all new fields and labels
- Updated mock data with realistic sample values for UI testing
- Positioned card after 辦學理念 card as requested

**Design Rationale:**
- Top-level guard treats both "是" and "否" as meaningful data (card shows if policies exist)
- Policy display only highlights "是" values to emphasize what schools DO offer
- Table format for testing schedule improves scannability vs. text format
- All elements use convertText for bilingual support and data-testid for testing

### November 13, 2025

**FilterSidebar Simplification:**
- Simplified 區域 (region) and 校網 (school net) filter sections to flat layouts
- Removed categorization/grouping for these two filters (previously grouped by geographic area/number ranges)
- Removed ScrollArea and Collapsible components for 區域 and 校網 sections
- Each section now displays as: title + search input + flat checkbox list
- Other filter categories (資助類型, 學生性別, 宗教, 教學語言, 關聯學校) retain collapsible behavior

**SchoolDetail Basic Info Reorganization:**
- Added 校監/校管會主席 (supervisor/school management committee chairman) display with title + name formatting
- Added 校長 (principal) display with title + name formatting
- Fixed name/title display order: now shows name before title (e.g., "張華先生" instead of "先生張華") to match Chinese naming conventions
- Created "上課時間及交通" card cluster grouping: 一般上學時間, 一般放學時間, 校車服務, 保姆車
- Created "午膳安排" card cluster grouping: 午膳開始時間, 午膳結束時間, 午膳安排
- Created "辦學理念" card cluster grouping: 校訓, 辦學宗旨, 校風
- All cards use smart conditional rendering: only display when at least one field is valid (not '-')
- Implemented intelligent separator logic: separators only appear between valid fields to prevent stray dividers

**Map Tab Enhancement:**
- Changed Google Maps embed URL to use school name (學校名稱) instead of address (學校地址) for more accurate location results

**Mock Data Completeness:**
- Updated all 6 mock schools with complete data for new fields:
  - Supervisor and principal names with titles (稱謂 + 姓名)
  - School times (start/end times)
  - Lunch times and arrangements
  - Class distribution by grade (P1-P6) for both 上學年 and 本學年
  - Teacher experience percentages (0-4年, 5-9年, 10年以上)
  - Special education training percentages

**Schema Updates:**
- Added fields to school schema: 校監_校管會主席姓名, 校監_校管會主席稱謂, 校長姓名, 校長稱謂
- Added time fields: 一般上學時間, 一般放學時間, 午膳開始時間, 午膳結束時間, 午膳安排
- Added 支援有特殊教育需要學生的設施 field for SEN support facilities
- Added 非標準項目的核准收費 field for non-standard approved fees
- All new fields properly translated in i18n system for TC/SC support

**SchoolDetail UI Reorganization (Latest):**
- Moved 學校類別2 (上課時間) from main info card to "上課時間及交通" card as the first row
- Merged all facility information into single comprehensive Facilities card:
  - Numeric counts section (課室/禮堂/操場/圖書館) with filtered array approach for bulletproof separator logic
  - Badge sections for 特別室, 其他學校設施, 支援有特殊教育需要學生的設施
  - Smart conditional rendering prevents stray separators even with sparse data
- Converted Fees tab from InfoRow layout to Table format:
  - Displays 學費, 家長教師會費, 非標準項目的核准收費 in tabular format
  - Shows "沒有" fallback for missing or '-' values
  - Improved data clarity and scannability

### External Dependencies

**UI Component Framework**: 
- Radix UI primitives (@radix-ui/react-*) for accessible, unstyled components
- shadcn/ui configuration for styled component variants

**Data Fetching & Caching**: TanStack Query v5 for server state management with custom query client configuration

**Form Handling**: 
- React Hook Form with @hookform/resolvers for validation
- Zod for schema validation and type inference

**Chinese Text Processing**: OpenCC.js for Traditional/Simplified Chinese conversion with Hong Kong (hk) to Mainland (cn) variant mapping

**Styling & UI**:
- Tailwind CSS with PostCSS for utility-first styling
- class-variance-authority for component variant management
- clsx and tailwind-merge for conditional class composition
- Lucide React for consistent iconography

**Charts & Visualization**: Recharts for data visualization (used in school detail views for teacher qualifications)

**Date Handling**: date-fns for date formatting and manipulation

**Development Tools**:
- TypeScript for type safety across full stack
- ESBuild for production server bundling
- Replit-specific plugins for development experience (@replit/vite-plugin-*)

**Build & Development**:
- Vite for frontend bundling and development server
- tsx for TypeScript execution in development
- Module resolution configured for path aliases (@/, @shared/, @assets/)