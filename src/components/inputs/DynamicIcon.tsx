import dynamicIconImports from 'lucide-react/dynamicIconImports';
import { lazy, Suspense } from 'react';

// Cache for lazy-loaded icon components to avoid recreating on each render
const iconCache = new Map<string, React.LazyExoticComponent<React.FC<{ className?: string }>>>();

export interface DynamicIconProps {
  name: string;
  className?: string;
}

export default function DynamicIcon({ name, className }: DynamicIconProps) {
  // Check if the icon name exists in the available imports
  if (!name || !(name in dynamicIconImports)) {
    return null;
  }

  // Get or create the lazy component
  if (!iconCache.has(name)) {
    const importFn = dynamicIconImports[name as keyof typeof dynamicIconImports];
    iconCache.set(name, lazy(importFn) as React.LazyExoticComponent<React.FC<{ className?: string }>>);
  }

  const IconComponent = iconCache.get(name)!;

  return (
    <Suspense fallback={<span className={className} />}>
      <IconComponent className={className} />
    </Suspense>
  );
}
