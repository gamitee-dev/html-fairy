type ElementOrText = Element | Text | Element[] | Text[];
/**
 * Returns an HTML structure build from the given `htmlString`. If any argument is a HTMLElement
 * The original element will be used and will be nested in the correct nested place.
 */
declare function htmlFairy<T extends ElementOrText = HTMLElement>(htmlString: TemplateStringsArray, ...args: unknown[]): T;
export default htmlFairy;
