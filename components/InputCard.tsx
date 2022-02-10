import React from 'react'

export interface InputCardProps {
  title: string
}

export default function InputCard(
  props: React.PropsWithChildren<InputCardProps>
) {
  return (
    <div className="focus:shadow-outline m-1 block appearance-none rounded bg-white leading-tight shadow hover:border-gray-500 focus:outline-none">
      <p className="rounded-t bg-gray-300 pl-2 text-left text-xs font-bold uppercase">
        {props.title}
      </p>
      <div className="p-2">{props.children}</div>
    </div>
  )
}
