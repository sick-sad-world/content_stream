import throttle from 'lodash/throttle'

const on = (el, evt, func) => {
  if (Array.isArray(el)) {
    el.forEach((e) => e.addEventListener(evt, func))
  } else {
    el.addEventListener(evt, func)
  }
}

export class StoryFlasher {
  constructor({nodes = [], container, delay = 3000}) {
    this.delay = delay
    this.nodes = Array.from(nodes).sort(() => 0.5 - Math.random())
    this.container = container
    this.nodeClass = 'light'
    this.interval = null
    this.node = 0
  }

  removeClass = (className) => (el) => {
    el.classList.remove(className)
  }

  do = () => {
    this.nodes.forEach(this.removeClass(this.nodeClass))
    this.nodes[this.node].classList.add(this.nodeClass)
    this.container.insertBefore(this.container.children[this.container.children.length - 1], this.container.firstElementChild)
    this.node = (this.node < this.nodes.length - 1) ? this.node + 1 : 0
  }

  start = () => {
    if (this.interval) return false
    this.interval = setInterval(this.do, this.delay)
  }
  
  stop = () => {
    clearInterval(this.interval)
    this.interval = null
  }
}

export class Form {
  constructor({el, onSubmit, className, setInnerListeners = true}) {
    const isForm = el.nodeName === 'form'

    this.el = el
    this.cn = className
    this.onSubmit = onSubmit
    this.form = (isForm) ? el : el.querySelector('form')
    this.error = el.querySelector('[data-action="error"]')
    this.cancel = Array.from(this.el.querySelectorAll('[data-action="cancel"]'))

    on(this.form, 'submit', this.runSubmit)
    if (setInnerListeners) {
      on(this.cancel, 'click', this.reset)
      if (!isForm) {
        on(this.el.querySelector('[data-action="submit"]'), 'click', this.runSubmit)
      }
    }
  }

  setError = ({error}) => {
    this.error.classList.add(this.cn)
    this.error.innerText = error
  }

  clearError = () => {
    this.error.classList.remove(this.cn)
    this.error.innerText = ''
  }

  reset = (e) => {
    e.preventDefault()
    this.clearError()
    this.form.reset()
  }

  runSubmit = (e) => {
    e.preventDefault()
    this.onSubmit(new FormData(this.form), this.reset, this.setError)
  }
}

export class Modal extends Form {
  constructor(options) {
    super({...options, setInnerListeners: false})

    const { layover, openers } = options
    
    this.layover = layover
    this.openers = Array.from(openers)

    on(this.cancel, 'click', this.reset)
    on(this.layover, 'click', this.reset)
    on(this.openers, 'click', this.show)
  }

  show = () => {
    this.layover.classList.add(this.cn)
    this.el.classList.add(this.cn)
  }

  reset = () => {
    this.clearError()
    this.form.reset()
    this.layover.classList.remove(this.cn)
    this.el.classList.remove(this.cn)
  }
}

export class CSSTransformer {
  constructor({el, target = window, interval, transform, initial}) {
    this.el = el
    this.target = target
    this.interval = interval
    this.processor = this.makeProcessor(transform)
    on(this.target, 'scroll', throttle(this.processor, interval))
    if (initial) {
      this.processor({target: {scrollTop: this.target.scrollY || this.target.scrollTop}})
    }
  }
  
  makeProcessor = (map) => {
    const transform = Object.entries(map).map(([prop, func]) => (scrollTop) => this.el.style[prop] = func(scrollTop))
    return ({target}) => {
      transform.forEach(func => func((target.scrollingElement || target).scrollTop))
    }
  }
}