# Hong Kong Primary School Filter

## Overview

This application provides a comprehensive database and filtering system for Hong Kong primary schools. Users can search, filter by multiple criteria (region, school type, gender, religion, language), compare up to four schools side-by-side, and view detailed information. The system is designed for bilingual content (Traditional and Simplified Chinese), focusing on information density, efficient data presentation, and a rich user experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript on Vite.
**UI Component Library**: shadcn/ui built on Radix UI, adhering to Material Design principles with Carbon Design influences.
**Styling**: Tailwind CSS with custom design tokens, optimized for bilingual Chinese text rendering using Noto Sans TC/SC.
**State Management**: React Context API for global state (e.g., language), local component state with React hooks, and TanStack Query for server state.
**Routing**: Wouter for client-side routing.
**Internationalization**: Custom implementation using OpenCC.js for bidirectional Traditional/Simplified Chinese text conversion.
**Key Design Patterns**: Component composition, custom hooks, context providers, and a mobile-first responsive design.

### Backend Architecture

**Server Framework**: Express.js on Node.js with TypeScript.
**API Design**: RESTful API structure with an `/api` prefix.
**Storage Interface**: Abstracted `IStorage` layer supporting in-memory (development) and PostgreSQL (production via Drizzle ORM).
**Session Management**: Infrastructure for PostgreSQL-backed sessions (connect-pg-simple).

### Data Storage

**ORM**: Drizzle ORM configured for PostgreSQL via Neon serverless driver.
**Schema Management**: Drizzle Kit for migrations, type-safe schema definitions, and Zod for runtime validation.
**Schemas**: Includes user authentication (prepared) and an extensive school schema with over 40 metadata fields. Mock data is currently used for prototyping, with real database integration planned.

### UI/UX Decisions

The application emphasizes information density and clear presentation. School detail views are organized into a 9-tab architecture covering philosophy, homework, teaching features, facilities, class distribution, teachers, fees, and contact information. Responsive design is a core principle, with elements like article carousels adapting for various screen sizes and supporting features like autoplay and swipe gestures. Conditional rendering ensures that UI elements only display when relevant data is available, preventing clutter. Filtering interfaces are streamlined for usability.

## External Dependencies

**UI Component Framework**: Radix UI primitives, shadcn/ui.
**Data Fetching & Caching**: TanStack Query v5.
**Form Handling**: React Hook Form, Zod.
**Chinese Text Processing**: OpenCC.js.
**Styling & UI**: Tailwind CSS, class-variance-authority, clsx, tailwind-merge, Lucide React (icons).
**Charts & Visualization**: Recharts.
**Date Handling**: date-fns.
**Development Tools**: TypeScript, ESBuild, Vite, tsx.