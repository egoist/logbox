import './toast.css'
import { icons, xIcon } from './icons'

export type ToastType = 'error' | 'info' | 'log' | 'success' | 'warning'

export type ToastOptions = {
  type: ToastType
  html: string
  timeout?: number
}

const instances: Toast[] = []

const removeInstance = (instance: Toast) => {
  instances.splice(instances.indexOf(instance), 1)
}

const startAllTimers = () => {
  for (const i of instances) {
    i.startTimer()
  }
}

const stopAllTimers = () => {
  for (const i of instances) {
    i.stopTimer()
  }
}

export class Toast {
  private options: ToastOptions
  private $el?: HTMLDivElement
  private $container: HTMLDivElement
  private timerId?: number

  constructor(options: ToastOptions) {
    this.options = {
      ...options,
    }

    let $container = document.querySelector<HTMLDivElement>('.logbox_container')
    if (!$container) {
      $container = document.createElement('div')
      $container.className = 'logbox_container'
      $container.addEventListener('mouseenter', () => {
        stopAllTimers()
      })
      $container.addEventListener('mouseleave', () => {
        startAllTimers()
      })
      document.body.appendChild($container)
    }
    this.$container = $container

    this.$el = document.createElement('div')
    this.$el.className = `logbox logbox_type__${this.options.type}`
    const icon = icons[this.options.type]
    const $body = document.createElement('div')
    $body.className = `logbox_body`
    $body.innerHTML = `<div class="logbox_icon">
    <span class="logbox_icon__default">${icon}</span><span class="logbox_icon__x">${xIcon}</span>
    </div><div>${this.options.html}</div>`
    $body.addEventListener('mouseenter', (e) => {
      const $icon = $body.querySelector('.logbox_icon')
      $icon?.classList.toggle('logbox_icon__show-x')
    })
    $body.addEventListener('mouseleave', (e) => {
      const $icon = $body.querySelector('.logbox_icon')
      $icon?.classList.toggle('logbox_icon__show-x')
    })
    $body.querySelector('.logbox_icon__x')?.addEventListener('click', () => {
      this.hide()
    })
    this.$el.appendChild($body)

    instances.push(this)
  }

  show() {
    if (this.$el) {
      this.$container.appendChild(this.$el)
    }
    this.$container.scrollTop = this.$container.scrollHeight

    this.startTimer()
  }

  hide() {
    if (this.$el) {
      this.stopTimer()
      this.$container.removeChild(this.$el)
      this.$el = undefined
      removeInstance(this)
    }
  }

  startTimer() {
    if (this.options.timeout && !this.timerId && !this.isDebug()) {
      this.timerId = window.setTimeout(() => {
        this.hide()
      }, this.options.timeout)
    }
  }

  private isDebug() {
    return location.search.includes('logbox_debug=true')
  }

  stopTimer() {
    if (typeof this.timerId === 'number') {
      window.clearTimeout(this.timerId)
      this.timerId = undefined
    }
  }
}
