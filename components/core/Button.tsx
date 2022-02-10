import React from 'react'

export interface ButtonProps {
  onClick: () => void
  text: string
  children: JSX.Element
}

export default function Button(props: ButtonProps) {
  return (
    <button
      onClick={props.onClick}
      className="focus:shadow-outline mx-2 rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 focus:outline-none"
      type="button"
    >
      {props.text}
    </button>
  )
}
