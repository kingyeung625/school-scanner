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

### November 13, 2025

**FilterSidebar Simplification:**
- Simplified 區域 (region) and 校網 (school net) filter sections to flat layouts
- Removed categorization/grouping for these two filters (previously grouped by geographic area/number ranges)
- Removed ScrollArea and Collapsible components for 區域 and 校網 sections
- Each section now displays as: title + search input + flat checkbox list
- Other filter categories (資助類型, 學生性別, 宗教, 教學語言, 關聯學校) retain collapsible behavior

**SchoolDetail Basic Info Enhancements:**
- Added 校監/校管會主席 (supervisor/school management committee chairman) display with title + name formatting
- Added 校長 (principal) display with title + name formatting
- Fixed name/title display order: now shows name before title (e.g., "張華先生" instead of "先生張華") to match Chinese naming conventions
- Added school schedule fields: 一般上學時間, 一般放學時間
- Added lunch arrangement card displaying: 午膳開始時間, 午膳結束時間, 午膳安排 (grouped together)
- Moved 校車服務 and 保姆車 from Facilities tab to Basic Info tab

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
- All new fields properly translated in i18n system for TC/SC support

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