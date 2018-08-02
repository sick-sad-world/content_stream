import throttle from 'lodash/throttle';

export class StoryFlasher {
  constructor({nodes = [], container, delay = 3000}) {
    this.delay = delay;
    this.nodes = Array.from(nodes).sort(() => 0.5 - Math.random());
    this.container = container;
    this.nodeClass = 'light';
    this.interval = null;
    this.node = 0;
  }

  removeClass = (className) => (el) => {
    el.classList.remove(className)
  }

  do = () => {
    this.nodes.forEach(this.removeClass(this.nodeClass));
    this.nodes[this.node].classList.add(this.nodeClass)
    this.container.insertBefore(this.container.children[this.container.children.length - 1], this.container.firstElementChild);
    this.node = (this.node < this.nodes.length - 1) ? this.node + 1 : 0;
  }

  start = () => {
    if (this.interval) return false;
    this.interval = setInterval(this.do, this.delay);
  }
  
  stop = () => {
    clearInterval(this.interval);
    this.interval = null;
  }
}

export class Form {
  constructor({el, onSubmit, className}) {
    const isForm = el.nodeName === 'form';

    this.el = el;
    this.form = (isForm) ? el : el.querySelector('form');
    this.error = el.querySelector('[data-action="error"]');
    this.onSubmit = onSubmit;
    this.cn = className;

    this.el.querySelector('[data-action="cancel"]').addEventListener('click', this.hide);
    this.form.addEventListener('submit', this.runSubmit);
    if (!isForm) {
      this.el.querySelector('[data-action="submit"]').addEventListener('click', this.runSubmit);
    }
  }

  setError = ({error}) => {
    this.error.classList.add(this.cn);
    this.error.innerText = error;
  }

  clearError = () => {
    this.error.classList.remove(this.cn);
    this.error.innerText = '';
  }

  runSubmit = () => {
    this.onSubmit(new FormData(this.form), this.setError)
  }
}

export class Modal extends Form {
  constructor(options) {
    super(options);
    const { layover, openers } = options;

    this.layover = layover;
    this.openers = Array.from(openers);
    this.layover.addEventListener('click', this.hide);
    Array.from(this.el.querySelectorAll('[data-action="cancel"]')).forEach((el) => el.addEventListener('click'));
    this.openers.forEach((el) => el.addEventListener('click', this.show));
  }

  runSubmit = () => {
    this.onSubmit(new FormData(this.form), this.hide, this.setError)
  }

  show = () => {
    this.layover.classList.add(this.cn);
    this.el.classList.add(this.cn);
  }

  hide = () => {
    this.layover.classList.remove(this.cn);
    this.el.classList.remove(this.cn);
  }
}

export class CSSTransformer {
  constructor({el, target = window, interval, transform}) {
    this.el = el;
    this.target = target;
    this.interval = interval;
    this.processor = throttle(this.makeProcessor(transform), interval);
    target.addEventListener('scroll', throttle(interval));
  }
  makeProcessor = (map) => {
    const transform = Array.entries(map).map(([prop, func]) => (scrollTop) => el.style[prop] = func(scrollTop));
    return ({target}) => transform.forEach(func => func(target.scrollTop));
  }
}