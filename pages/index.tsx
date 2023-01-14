import Head from 'next/head'
import { ChangeEvent, useEffect, useState } from 'react'
import configJson from '../config/2022/config.json'
import {
  Config,
  InputProps,
  SectionProps,
} from '../components/inputs/BaseInputProps'
import QRModal from '../components/QRModal'
import Section from '../components/Section'
import Button, { Variant } from '../components/core/Button'

function buildConfig(c: Config) {
  let config: Config = { ...c }
  config.sections
    .map((s) => s.fields)
    .flat()
    .forEach((f) => (f.value = f.defaultValue))
  return config
}

function getDefaultConfig(): Config {
  return buildConfig(configJson as Config)
}

export default function Home() {
  const [formData, setFormData] = useState<Config>(getDefaultConfig)
  const [showQR, setShowQR] = useState(false)

  useEffect(() => {
    let userConfig = localStorage.getItem('QRScoutUserConfig')
    if (userConfig) {
      setFormData(buildConfig(JSON.parse(userConfig) as Config))
    } else {
      setFormData(getDefaultConfig())
    }
  }, [])

  function updateValue(sectionName: string, code: string, data: any) {
    const currentData = { ...formData }
    let section = currentData.sections.find((s) => s.name === sectionName)
    if (section) {
      let field = section.fields.find((f) => f.code === code)
      if (field) {
        field.value = data
      }
    }
    setFormData(currentData)
  }

  function getMissingRequiredFields(): InputProps[] {
    return formData.sections
      .map((s) => s.fields)
      .flat()
      .filter(
        (f) =>
          f.required &&
          (f.value === null || f.value === undefined || f.value === ``)
      )
  }

  function getFieldValue(code: string): any {
    return formData.sections
      .map((s) => s.fields)
      .flat()
      .find((f) => f.code === code)?.value
  }

  function resetSections() {
    const currentData = { ...formData }

    currentData.sections
      .filter((s) => !s.preserveDataOnReset)
      .map((s) => s.fields)
      .flat()
      .forEach((f) => {
        console.log(`resetting ${f.title} from ${f.value} to ${f.defaultValue}`)
        f.value = f.defaultValue
      })

    setFormData(currentData)
  }

  function getQRCodeData(): string {
    return formData.sections
      .map((s) => s.fields)
      .flat()
      .map((v) => `${v.value}`)
      .join('\t')
  }

  function download(filename: string, text: string) {
    var element = document.createElement('a')
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
    )
    element.setAttribute('download', filename)

    element.style.display = 'none'
    document.body.appendChild(element)

    element.click()

    document.body.removeChild(element)
  }

  function downloadConfig() {
    const configDownload = { ...formData }

    configDownload.sections.forEach((s) =>
      s.fields.forEach((f) => (f.value = undefined))
    )
    download('QRScout_config.json', JSON.stringify(configDownload))
  }

  function handleFileChange(evt: ChangeEvent<HTMLInputElement>) {
    var reader = new FileReader()
    reader.onload = function (e) {
      const configText = e.target?.result as string
      localStorage.setItem('QRScoutUserConfig', configText)
      const jsonData = JSON.parse(configText)
      setFormData(buildConfig(jsonData as Config))
    }
    if (evt.target.files && evt.target.files.length > 0) {
      reader.readAsText(evt.target.files[0])
    }
  }

  return (
    <div className="min-h-screen py-2">
      <Head>
        <title>{formData.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-4 text-center">
        <h1 className="font-sans text-6xl font-bold">
          <div className="text-yellow-400">{formData.page_title}</div>
        </h1>
        <QRModal
          show={showQR}
          title={`${getFieldValue('robot')} - ${getFieldValue('matchNumber')}`}
          data={getQRCodeData()}
          onDismiss={() => setShowQR(false)}
        />

        <form>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {formData.sections.map((section) => {
              return (
                <Section
                  key={section.name}
                  name={section.name}
                  inputs={section.fields}
                  onValueChanged={updateValue}
                />
              )
            })}

            <div className="mb-4 flex flex-col justify-center rounded bg-white shadow-md">
              <button
                className="focus:shadow-outline mx-2 rounded bg-gray-700 py-6 px-6 font-bold uppercase text-white hover:bg-gray-700 focus:shadow-lg focus:outline-none disabled:bg-gray-300"
                type="button"
                onClick={() => setShowQR(true)}
                disabled={getMissingRequiredFields().length > 0}
              >
                Commit
              </button>
              <button
                className="focus:shadow-outline mx-2 my-6 rounded border border-grey-900 bg-white py-2 font-bold text-black-500 hover:bg-grey-900 focus:outline-none"
                type="button"
                onClick={() => resetSections()}
              >
                Reset
              </button>
            </div>
            <div className="mb-4 flex flex-col justify-center rounded bg-white shadow-md">
              <Button
                variant={Variant.Secondary}
                className="m-2"
                onClick={() =>
                  navigator.clipboard.writeText(
                    formData.sections
                      .map((s) => s.fields)
                      .flat()
                      .map((f) => f.title)
                      .join('\t')
                  )
                }
              >
                Copy Column Names
              </Button>
              <Button
                variant={Variant.Secondary}
                className="m-2"
                onClick={() => downloadConfig()}
              >
                Download Config
              </Button>
              <label className="m-2 flex cursor-pointer flex-row justify-center rounded border bg-gray-500 py-2 text-center font-bold text-white hover:bg-gray-600">
                <span className="text-base leading-normal">Upload Config</span>
                <input
                  type="file"
                  className="hidden"
                  accept=".json"
                  onChange={(e) => handleFileChange(e)}
                />
              </label>
            </div>
          </div>
        </form>
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
