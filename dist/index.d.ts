type ElementOrText = Element | Text | Element[] | Text[];
declare const htmlFairy: <T extends ElementOrText = HTMLElement>(htmlString: TemplateStringsArray, ...args: unknown[]) => T;
export default htmlFairy;
