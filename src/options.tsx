import { h, render } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import { getOptions, defaultOptions } from './lib/options'

const App = () => {
  const [options, setOptions] = useState({
    ...defaultOptions,
  })

  const updateOption = (key: string, value: any) => {
    const newOptions = {
      ...options,
      [key]: value,
    }
    setOptions(newOptions)
    browser.storage.sync.set(newOptions)
  }

  useEffect(() => {
    getOptions().then((options) => {
      setOptions(options)
    })
  }, [])

  const handleSubmit = (e: any) => {
    e.preventDefault()
  }

  return (
    <div>
      <div style={{marginBottom: '20px', color: 'rgb(173, 173, 173)'}}>
        Auto save is enabled.
      </div>
      <div className="form-group">
        <label htmlFor="licenseKey">License key:</label>
        <input type="text" id="licenseKey" value={options.licenseKey} onChange={e => {
          // @ts-ignore
          updateOption('licenseKey', parseInt(e.target!.value))
        }} />
        <div style={{color: 'gray',marginTop: '5px'}}>This extension is free to use during beta, no license key needed.</div>
      </div>
      <div class="form-group">
        <label htmlFor="hideTimeout">Hide logs in (ms):</label>
        <input
          type="number"
          id="hideTimeout"
          value={options.hideTimeout}
          onChange={(e) => {
            // @ts-ignore
            updateOption('hideTimeout', parseInt(e.target!.value))
          }}
        />
      </div>
    </div>
  )
}

render(<App />, document.body)
