# QRScout Development Guidelines

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run schema` - Generate JSON schema
- `npm run deploy` - Deploy to GitHub Pages

## Code Style
- **TypeScript**: Strict mode with noUnusedLocals/Parameters
- **Formatting**: 2 space indent, 80 char width, single quotes
- **Components**: Functional with TypeScript interfaces, PascalCase naming
- **Imports**: React first, then external libs, then project imports with `@/` alias
- **State**: Zustand with immer for immutable updates
- **Error Handling**: Result types `{success: true, data: T} | {success: false, error: Error}`
- **File Structure**:
  - Components in `/src/components/`
  - UI components in `/src/components/ui/`
  - State in `/src/store/`
  - Types in `/src/types/`
  - Utils in `/src/lib/` and `/src/util/`
- **CSS**: Tailwind with `cn` utility for class merging