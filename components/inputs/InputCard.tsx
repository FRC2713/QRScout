import React from 'react'

export interface InputCardProps {
  title: string
  required: boolean
  hasValue: boolean
}

export default function InputCard(
  props: React.PropsWithChildren<InputCardProps>
) {
  return (
    <div className="focus:shadow-outline m-1 block appearance-none rounded bg-white leading-tight shadow hover:border-gray-500 focus:outline-none">
      <div className="flex flex-row justify-between rounded-t bg-gray-300">
        <p className="pl-2 text-left text-xs font-bold uppercase">
          {props.title}
        </p>
        {props.required && !props.hasValue && (
          <p className="mr-1 rounded-full bg-red-300 px-2">!</p>
        )}
      </div>
      <div className="p-2">{props.children}</div>
    </div>
  )
}
