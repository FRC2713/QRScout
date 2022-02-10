import Head from 'next/head'
import { useState } from 'react'
import configJson from '../config/2022/config.json'
import { Config } from '../components/inputs/BaseInputProps'
import QRModal from '../components/QRModal'
import Section from '../components/Section'

const config: Config = configJson as Config

function getDefaultValues(): Record<string, any> {
  let defaults: Record<string, any> = {}
  Object.values(config.sections).forEach((section) => {
    Object.values(section).forEach((i) => (defaults[i.code] = i.defaultValue))
  })

  return defaults
}

function getColumnNames(): string {
  let columns: string[] = []
  Object.values(config.sections).forEach((section) => {
    Object.values(section).forEach((i) => columns.push(i.title))
  })

  return columns.join('\t')
}

function getRequiredFieldCodes(): string[] {
  const codes = Object.values(config.sections)
    .map((s) => s.filter((i) => i.required).map((i) => i.code))
    .flat()

  console.log('required fields:', codes)
  return codes
}

export default function Home() {
  const [values, setValues] = useState<Record<string, any>>(getDefaultValues())
  const [showQR, setShowQR] = useState(false)

  function updateValue(code: string, data: any) {
    const currVals = { ...values }
    currVals[code] = data
    setValues(currVals)
    console.log(currVals)
  }

  function getQRCodeData(): string {
    return Object.keys(values)
      .map((v) => `${values[v]}`)
      .join('\t')
  }

  return (
    <div className="min-h-screen py-2">
      <Head>
        <title>{config.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-4 text-center">
        <h1 className="font-sans text-6xl font-bold">
          <div className="text-red-600">{config.page_title}</div>
        </h1>
        <QRModal
          show={showQR}
          title={`${values['l']}${values['m']}`}
          data={getQRCodeData()}
          onDismiss={() => setShowQR(false)}
        />
        {!showQR && (
          <form>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Object.keys(config.sections).map((element) => {
                return (
                  <Section
                    key={element}
                    name={element}
                    inputs={config.sections[element]}
                    values={values}
                    onValueChanged={updateValue}
                  />
                )
              })}

              <div className="mb-4 flex flex-col justify-center rounded bg-white shadow-md">
                <button
                  className="focus:shadow-outline mx-2 my-6 rounded bg-gray-700 py-2 px-6 font-bold uppercase text-white hover:bg-gray-700 focus:shadow-lg focus:outline-none disabled:bg-gray-300"
                  type="button"
                  onClick={() => setShowQR(true)}
                  disabled={getRequiredFieldCodes().some((v) => !values[v])}
                >
                  Commit
                </button>

                <input
                  className="focus:shadow-outline mx-2 my-6 rounded border border-red-400 bg-white py-2 font-bold text-red-400 hover:bg-red-200 focus:outline-none"
                  type="reset"
                  onClick={() => setValues(getDefaultValues())}
                />

                <button
                  className="focus:shadow-outline mx-2 my-6 rounded bg-gray-500 py-2 font-bold text-white hover:bg-gray-700 focus:outline-none"
                  type="button"
                  onClick={() =>
                    navigator.clipboard.writeText(getColumnNames())
                  }
                >
                  Copy Column Names
                </button>
              </div>
            </div>
          </form>
        )}
      </main>
      <footer>
        <div className="flex items-center justify-center">
          <a
            href="https://vercel.com/?utm_source=iraiders&utm_campaign=oss"
            target="_blank"
          >
            <img src="https://www.datocms-assets.com/31049/1618983297-powered-by-vercel.svg"></img>
          </a>
        </div>
      </footer>
    </div>
  )
}
