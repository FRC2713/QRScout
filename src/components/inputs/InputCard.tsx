import React, { useState } from 'react'

export interface InputCardProps {
  title: string
  required: boolean
  hasValue: boolean
  description?: string
}

export default function InputCard(
  props: React.PropsWithChildren<InputCardProps>
) {
  const [showDescription, setShowDescription] = useState(false);
  return (
    <div className="mx-1 rounded bg-white leading-tight shadow-sm dark:bg-gray-500">
      <div className="flex flex-row justify-between rounded-t bg-gray-300">
        <p className="pl-2 text-left text-xs font-bold uppercase dark:text-black">
          {props.title}
        </p>
        {props.required && !props.hasValue && (
          <p className="mr-1 h-4 w-4 font-rhr text-red-rhr">!!</p>
        )}
      </div>
      <div style="position: relative">
        {props.description != null && (
          <button 
            className="rounded bg-gray-300 text-xs p-0.5 absolute right-0 bottom-0"
            type="button" 
            onClick={() => { setShowDescription(!showDescription); }}
          >
          {showDescription ? "▲" : "▼"} Note
          </button>
        )}
        <div>{props.children}</div>
      </div>
      {props.description != null && showDescription && (
        <div className="justify-between rounded-t bg-gray-100 p-1">
          <p className="text-left text-xs">{props.description}</p>
        </div>
      )}
    </div>
  )
}
