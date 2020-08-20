import { Toast, ToastType } from './lib/toast'
import {
  consoleLog,
  consoleError,
  consoleWarn,
  consoleInfo,
} from './lib/console'

if (__DEV__) {
  consoleLog('[logbox] hello from injected script')
}

const escapeHTML = (input: string) => {
  return input.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

const formatMessage = (input: string) => {
  return escapeHTML(input).replace(/\n/g, '<br>')
}

const stringifyArg = (arg: any, type: ToastType): string => {
  const message = formatMessage(arg.message || String(arg))
  let result = message
  if (arg instanceof PromiseRejectionEvent) {
    return stringifyArg(arg.reason, type)
  }
  if (typeof arg.filename !== 'undefined' || arg instanceof ErrorEvent) {
    if (arg.filename) {
      result += ` <span style="text-decoration:underline">(${arg.filename.replace(
        `${location.origin}/`,
        ''
      )}:${arg.lineno}:${arg.colno})</span>`
    }
  }
  if (type === 'error') {
    result += `<div style="font-size:.875em;margin-top:5px;">
    <span>
    <svg viewBox="0 0 20 20" fill="currentColor" 
    viewBox="0 0 20 20" fill="currentColor"
    width="1.2em" height="1.2em"
    style="position:relative;top:3px"
    ><path d="M9 9a2 2 0 114 0 2 2 0 01-4 0z"></path><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a4 4 0 00-3.446 6.032l-2.261 2.26a1 1 0 101.414 1.415l2.261-2.261A4 4 0 1011 5z" clip-rule="evenodd"></path></svg>
 
    Search in <a target="_blank" href="https://google.com/search?q=${encodeURIComponent(
      message
    )}">Google</a></span></div>`
  }

  if (arg instanceof Error) {
    result += `<pre style="overflow:auto;margin:10px 0 0 0;">${escapeHTML(
      (arg.stack || '')
        .replace(`${arg.name}: ${arg.message}`, '')
        .replace(/^\s+/gm, '')
    )}</pre>`
  }

  return result
}

const options = JSON.parse(document.currentScript?.dataset.options || '{}')

const toast = (args: any[], type: ToastType, location?: string) => {
  const message = args.map((arg) => stringifyArg(arg, type)).join(' ')
  new Toast({
    html: `${message}${location ? ` (${location})` : ''}`,
    type,
    timeout: options.hideTimeout,
  }).show()
}

console.error = (...args: any[]) => {
  toast(args, 'error')
  consoleError(...args)
}

console.log = (...args: any[]) => {
  toast(args, 'info')
  consoleLog(...args)
}

console.warn = (...args: any[]) => {
  toast(args, 'warning')
  consoleWarn(...args)
}

console.info = (...args: any[]) => {
  toast(args, 'info')
  consoleInfo(...args)
}

window.addEventListener('error', (error) => {
  if (__DEV__) {
    consoleError(`[logbox] detected global error`)
  }
  toast([error], 'error')
  consoleError(error)
})

window.addEventListener('unhandledrejection', (error) => {
  toast([error], 'error')
  consoleError(error)
})
