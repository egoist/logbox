let options: typeof defaultOptions | undefined

export const defaultOptions = {
  hideTimeout: 5000,
  licenseKey: ''
}

export const getOptions = async () => {
  if (!options) {
    const storedOptions = await browser.storage.sync.get(['hideTimeout'])
    return {
      ...defaultOptions,
      ...storedOptions,
    }
  }
  return options
}