import React from 'react'
import QRCode from 'qrcode.react'

export interface QRModalProps {
  show: boolean
  title: string
  data: string
  onDismiss: () => void
}

export default function QRModal(props: QRModalProps) {
  return (
    <>
      {props.show && (
        <>
          <div
            className="fixed inset-0 h-full w-full overflow-y-auto bg-gray-600 bg-opacity-50"
            id="my-modal"
          />
          <div className="relative top-20 mx-auto w-72 rounded-md border bg-white p-5 shadow-lg md:w-72 lg:w-96">
            <div className="mt-3 text-center">
              <h1 className="text-4xl">{props.title.toUpperCase()}</h1>
              <div className="flex flex-col items-center">
                <QRCode className="m-2 mt-4 w-72" value={props.data} />
                <div
                  onClick={() =>
                    navigator.clipboard.writeText(props.data + '\n')
                  }
                >
                  <svg
                    className="h-8 w-8 text-gray-500 hover:text-gray-800"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" />{' '}
                    <rect x="8" y="8" width="12" height="12" rx="2" />{' '}
                    <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2" />
                  </svg>
                </div>
                <button
                  className="focus:shadow-outline mx-2 mt-4 rounded bg-red-800 py-2 px-4 font-bold text-white hover:bg-red-700 focus:outline-none"
                  type="button"
                  onClick={props.onDismiss}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
