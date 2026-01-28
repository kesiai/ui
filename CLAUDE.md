# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Airiot UI Library - a custom React component library compatible with shadcn-ui CLI workflow. The library uses a registry-based system where components are defined with metadata and can be installed via shadcn CLI.

## Development Commands

```bash
# Development
npm run dev              # Start Vite dev server (port 3000)

# Build
npm run build            # Build with tsup
npm run build:registry   # Build registry (generates JSON files in public/r/)

# Testing
npm test                 # Run tests in watch mode
npm run test:run         # Run tests once
npm run test:ui          # Open Vitest UI
npm run test:coverage    # Generate coverage report

# Linting/Type Checking
npm run lint             # ESLint
npm run type-check       # TypeScript check (no emit)
```

## Architecture

### Registry System

The project follows shadcn-ui's registry pattern. Components are defined in `src/registry/` with:

1. **Component files** (`.tsx`) - Actual implementation
2. **Registry metadata** (`registry-item.json`) - Component metadata including:
   - `name`: Unique identifier (kebab-case)
   - `type`: Usually "registry:component"
   - `registryDependencies`: Other components from this library it depends on
   - `dependencies`: External npm packages
   - `files`: List of files to include when installing

### Registry Structure

```
src/registry/
├── components/ui/           # Basic atomic UI components
│   ├── button/button.tsx
│   ├── card/card.tsx
│   └── ...
└── blocks/                  # Complex business components
    ├── business/            # Business logic components (data-point, bar, etc.)
    ├── chart/               # Charts (chart-line, chart-pie, etc.)
    ├── components/          # Simple blocks (button, text, status, etc.)
    ├── containers/          # Layout containers (app-page, slot, etc.)
    ├── form/                # Form components
    ├── gis/                 # GIS/map components
    ├── mobile/              # Mobile-specific components
    ├── page-elements/       # Page-level elements (menu, user-menu, etc.)
    ├── view/                # View/table components
    ├── video/               # Video components
    ├── 3d/                  # Three.js 3D components
    └── advanced/            # Advanced components (editor, upload, etc.)
```

### Registry Build Process

- Run `npm run build:registry` to:
  1. Read all registry-item.json files
  2. Embed file contents into JSON
  3. Output to `public/r/registry.json` and individual component JSONs
  4. Generate `__registry__/index.tsx` for the preview app

**Important**: The `src/registry/blocks/index.ts` file is auto-generated (see comment at top). Do not manually edit it.

### Configuration System (Preview App)

The preview app (`src/app/`) uses a configuration system for component playgrounds:

- `src/app/config/types.ts` - Defines `ComponentConfig`, `PropConfig` types
- `src/app/config/components/*.config.tsx` - Per-component configs with:
  - `propsConfig`: Array of prop definitions (name, label, type, default, options)
  - `defaultProps`: Default prop values
  - `renderPreview`: React component for live preview
  - `renderCodePreview`: Function to generate code snippet
  - `renderCustomForm`: Optional custom form for advanced prop UI

### Context Libraries

- `src/registry/lib/form-context.tsx` - FormContext for form integration (submit/reset handlers)
- `src/registry/lib/modal-context.tsx` - ModalContext for modal state management
- `src/registry/lib/airiot/client.ts` - AirIoT client SDK

### Component Patterns

1. **Base UI components** (`src/registry/components/ui/`) use Radix UI primitives
2. **Block components** compose base components and add business logic
3. Components use `React.forwardRef` for ref forwarding
4. Use the `cn()` utility from `@/lib/utils` for conditional classes
5. Components use `displayName` property for debugging

## Path Aliases

```typescript
@/* → ./src/*
```

## Testing

- Framework: Vitest with jsdom environment
- Test files: `**/__tests__/*.test.{ts,tsx}` or `**/*.test.{ts,tsx}`
- Setup: `test/setup.ts`
- Coverage excludes: `node_modules/`, `test/`, `*.config.ts`, `cli/`, `registry/`

## Adding New Components

1. Create component file in appropriate `src/registry/` directory
2. Create `registry-item.json` with component metadata
3. Add import to `src/registry/blocks/index.ts` (if it's a block)
4. Optionally: Create config in `src/app/config/components/` for preview app
5. Run `npm run build:registry` to rebuild registry JSONs

## Key Dependencies

- `@radix-ui/*` - Unstyled component primitives
- `@base-ui/react` - Base UI components
- `class-variance-authority` - Component variant management (cva)
- `tailwind-merge` + `clsx` - The `cn()` utility for conditional classes
- `@airiot/client` - AirIoT platform client
- `lucide-react` - Icon library

## TypeScript Configuration

- Target: ES2020
- Module resolution: "bundler" mode
- `strict: true` enabled
- `jsx: "react-jsx"`
