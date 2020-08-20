import { getOptions } from './lib/options'

getOptions().then((options) => {
  const script = document.createElement('script')
  script.src = browser.runtime.getURL('dist/script.js')
  script.dataset.options = JSON.stringify(options)
  script.onload = () => {
    script.remove()
  }
  script.id = `logbox-injected-script`
  ;(document.head || document.documentElement).appendChild(script)

  if (__DEV__) {
    console.log(`[logbox] injected script`)
  }
})
