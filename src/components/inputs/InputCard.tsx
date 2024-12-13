import { TriangleAlert } from 'lucide-react';
import React from 'react';
import { Card, CardContent } from '../ui/card';

export interface InputCardProps {
  title: string;
  required: boolean;
  hasValue: boolean;
}

export default function InputCard(
  props: React.PropsWithChildren<InputCardProps>,
) {
  return (
    <Card>
      <div className="flex gap-2 bg-secondary px-1 items-center rounded-t-lg">
        {props.required && !props.hasValue && (
          <TriangleAlert className="text-primary animate-pulse size-4" />
        )}
        <h1 className="capitalize text-secondary-foreground text-sm">
          {props.title.toUpperCase()}
        </h1>
      </div>
      <CardContent className="p-0">{props.children}</CardContent>
    </Card>
  );
}
