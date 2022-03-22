/* eslint-disable default-param-last */
import escapeHtml from 'escape-html';

type ElementOrText = Element | Text | Element[] | Text[];

type HtmlFairyConfig = {
  unsafe: boolean;
}

type HtmlFairy<T extends ElementOrText = HTMLElement> = (
  htmlString: TemplateStringsArray, ...args: unknown[]
) => T

type SafeArgument = Element | Text | null | undefined | string

const escapeArg = (arg: unknown): SafeArgument | Array<SafeArgument> => {
  if (Array.isArray(arg)) {
    return ([] as Array<SafeArgument>).concat(...arg.map(escapeArg));
  }

  if (arg instanceof Element || arg instanceof Text) { return arg; }

  if (arg == null || !(arg as object).toString) { return null; }

  return escapeHtml((arg as object).toString());
};

/**
 * Returns an HTML structure build from the given `htmlString`. If any argument is a HTMLElement
 * The original element will be used and will be nested in the correct nested place.
 */
const htmlFairy = <T extends ElementOrText = HTMLElement>(
  safe: boolean, htmlString: TemplateStringsArray, ...args: unknown[]
): T => {
  const safeArgs = safe ? args.map(escapeArg) : args;

  // Replace every html element argument with a placeholder. After the creation, the original
  // element will be put back in place instead of the the placeholder.
  const templateArgs = safeArgs.map((e, i) => {
    if (e instanceof Element || e instanceof Text) {
      return `<div class="html-fairy-placeholder" data-index="${i}"></div>`;
    }
    if (Array.isArray(e)) {
      if (e.every((v) => v instanceof Element || v instanceof Text)) {
        return `<div class="html-fairy-placeholder" data-index="${i}" data-placeholder-type="array"></div>`;
      }
      return e.map((text) => text ?? '').join('');
    }
    return e ?? '';
  });

  const htmlStringRaw = String.raw(htmlString, ...templateArgs);
  const parsed = document.createElement('div');
  parsed.innerHTML = htmlStringRaw.trim();

  parsed.querySelectorAll('.html-fairy-placeholder').forEach((element) => {
    const originalArgIndex = Number.parseInt(element.getAttribute('data-index') ?? '-1', 10);
    if (originalArgIndex === -1) {
      throw new Error('html-fairy placeholder is defined with no data index');
    }
    if (element.getAttribute('data-placeholder-type') === 'array') {
      const placeholderContainer = element.parentElement;
      element.remove();
      (safeArgs[originalArgIndex] as HTMLElement[]).forEach((e) => {
        placeholderContainer?.appendChild(e);
      });
    } else {
      element.parentElement?.replaceChild(safeArgs[originalArgIndex] as Element, element);
    }
  });
  const children = Array.from(parsed.childNodes)
    .filter((x) => x.nodeName !== '#text' || (x.textContent && x.textContent.trim().length > 0));
  if (parsed.firstChild && children.length > 1) {
    return children as T;
  }
  return parsed.firstChild as T;
};

function htmlFairyFunction<T extends ElementOrText = HTMLElement>(
  htmlString: TemplateStringsArray, ...args: unknown[]
): T;
function htmlFairyFunction<T extends ElementOrText = HTMLElement>(
  config: HtmlFairyConfig
): HtmlFairy<T>;

function htmlFairyFunction<T extends ElementOrText = HTMLElement>(
  configOrHtmlString?: TemplateStringsArray | HtmlFairyConfig,
  ...args: unknown[]
): T | HtmlFairy<T> {
  const config = configOrHtmlString as HtmlFairyConfig;

  if (!config || config.unsafe !== undefined) {
    return htmlFairy.bind(null, !config?.unsafe) as HtmlFairy<T>;
  }

  const htmlString = configOrHtmlString as TemplateStringsArray;
  return htmlFairy<T>(true, htmlString, ...args);
}

export default htmlFairyFunction;
