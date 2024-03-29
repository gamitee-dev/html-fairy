import escapeHtml from 'escape-html'

type ElementOrText = Element | Text | Element[] | Text[]

type SafeArgument = Element | Text | null | undefined | string

const escapeArg = (arg: unknown): SafeArgument | Array<SafeArgument> => {
  if (Array.isArray(arg)) {
    return ([] as Array<SafeArgument>).concat(...arg.map(escapeArg))
  }

  if (arg instanceof Element || arg instanceof Text) {
    return arg
  }

  if (arg == null || !(arg as object).toString) {
    return null
  }

  return escapeHtml((arg as object).toString())
}

/**
 * Returns an HTML structure build from the given `htmlString`. If any argument is a HTMLElement
 * The original element will be used and will be nested in the correct nested place.
 */
function htmlFairy<T extends ElementOrText = HTMLElement>(htmlString: TemplateStringsArray, ...args: unknown[]): T {
  const safeArgs = args.map(escapeArg)

  // Replace every html element argument with a placeholder. After the creation, the original
  // element will be put back in place instead of the the placeholder.
  const templateArgs = safeArgs.map((e, i) => {
    if (e instanceof Element || e instanceof Text) {
      return `<div class="html-fairy-ph" data-index="${i}"></div>`
    }
    if (Array.isArray(e)) {
      if (e.every((v) => v instanceof Element || v instanceof Text)) {
        return `<div class="html-fairy-ph" data-index="${i}" data-placeholder-type="array"></div>`
      }
      return e.map((text) => text ?? '').join('')
    }
    return e ?? ''
  })

  const htmlStringRaw = String.raw(htmlString, ...templateArgs)
  const parsed = document.createElement('div')
  parsed.innerHTML = htmlStringRaw.trim()

  parsed.querySelectorAll('.html-fairy-ph').forEach((element) => {
    const el = element as HTMLElement
    const originalArgIndex = parseInt(el.dataset.index ?? '-1', 10)
    if (originalArgIndex === -1) {
      throw new Error('html-fairy placeholder is defined with no data index')
    }
    if (el.dataset.placeholderType === 'array') {
      const placeholderContainer = el.parentElement
      el.remove()
      ;(safeArgs[originalArgIndex] as HTMLElement[]).forEach((e) => {
        placeholderContainer?.appendChild(e)
      })
    } else {
      el.parentElement?.replaceChild(safeArgs[originalArgIndex] as Element, el)
    }
  })
  const children = [...parsed.childNodes].filter(
    (x) => x.nodeName !== '#text' || (x.textContent && x.textContent.trim().length > 0)
  )
  if (parsed.firstChild && children.length > 1) {
    return children as T
  }
  return parsed.firstChild as T
}

export default htmlFairy
