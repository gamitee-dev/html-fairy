/* eslint-disable max-classes-per-file */
import htmlFairy from '../index';

describe('build HTML structure', () => {
  it('should return the expected structure from the given string', () => {
    const structure = htmlFairy`
            <div data-attr="bar">foo</div>
        `;
    const dataAttribute = structure.getAttribute('data-attr');
    const content = structure.textContent;

    expect(structure).toBeInstanceOf(HTMLDivElement);
    expect(dataAttribute).toBe('bar');
    expect(content).toBe('foo');
  });

  it('should return the expected structure from the given template', () => {
    const VALUE = 'bazz';
    const SECOND_VALUE = 'bar';
    const structure = htmlFairy`
            <div data-attr="${VALUE}" data-second=${SECOND_VALUE}>foo</div>
        `;
    const dataAttribute = structure.getAttribute('data-attr');
    const secondAttribute = structure.getAttribute('data-second');
    const content = structure.textContent;

    expect(structure).toBeInstanceOf(HTMLDivElement);
    expect(dataAttribute).toBe('bazz');
    expect(secondAttribute).toBe('bar');
    expect(content).toBe('foo');
  });

  it('should enable nested html elements', () => {
    const nestedButton = htmlFairy`<botton>I am button</button>`;
    const cbFunction = jest.fn();
    nestedButton.addEventListener('click', cbFunction);
    const structure = htmlFairy`<div>${nestedButton}</div>`;

    const buttonInStructure = structure.firstChild as HTMLButtonElement;
    buttonInStructure.click();

    expect(structure).toBeInstanceOf(HTMLDivElement);
    expect(buttonInStructure).toBe(nestedButton);
    expect(cbFunction).toHaveBeenCalledWith(new MouseEvent('click'));
  });

  it('should enable element array argument', () => {
    const list = ['a', 'b', 'c'].map((x) => htmlFairy`<li>${x}</li>`);
    const structure = htmlFairy`<ul>${list}</ul>`;

    expect(structure).toBeInstanceOf(HTMLUListElement);
    expect(structure.childElementCount).toBe(list.length);
    expect(structure.textContent).toBe('abc');
  });

  it('should enable nested array argument', () => {
    const structure = htmlFairy`<ul>${[
      ['a', 'b'],
      undefined,
      [['c'], 'd', null],
    ]}</ul>`;

    expect(structure).toBeInstanceOf(HTMLUListElement);
    expect(structure.textContent).toBe('abcd');
  });

  it('should enable nested array elements', () => {
    const structure = htmlFairy`<ul>${[
      [htmlFairy`<div>a</div>`, htmlFairy`<div>b</div>`],
      [[htmlFairy`<div>c</div>`], htmlFairy`<div>d</div>`],
    ]}</ul>`;

    expect(structure).toBeInstanceOf(HTMLUListElement);
    expect(structure.textContent).toBe('abcd');
  });

  it('should return style element when asked to be created', () => {
    const element = htmlFairy`<style>.foo {position: fixed;}</style>`;

    expect(element).toBeInstanceOf(HTMLStyleElement);
    expect(element.textContent).toBe('.foo {position: fixed;}');
  });

  it('should ignore null and undefined arguments parameters', () => {
    const element = htmlFairy`<div>${null}${undefined}${'test'}</div>`;

    expect(element.textContent).toBe('test');
  });

  it('should ignore null and undefined arguments in array', () => {
    const element = htmlFairy`<div>${['test', null, undefined]}</div>`;

    expect(element.textContent).toBe('test');
  });

  it('should accepts svg elements', () => {
    const svgElement = htmlFairy<SVGElement>`<svg></svg>`;
    const element = htmlFairy`<div>${svgElement}</div>`;
    expect(element.childElementCount).toBe(1);
  });

  it('should accepts text node', () => {
    const textNode = [htmlFairy<Text>`hello`, htmlFairy<Text>`world`];
    const element = htmlFairy`<div>${textNode}</div>`;
    expect(element.textContent).toBe('helloworld');
  });

  it('should accepts text node array', () => {
    const textNode = htmlFairy<Text>`text`;
    const element = htmlFairy`<div>${textNode}</div>`;
    expect(element.textContent).toBe('text');
  });

  it('should accepts multy elements', () => {
    const elements = htmlFairy<HTMLDivElement[]>`
            <div>hello</div>
            <div>world</div>
        `;
    expect(elements).toHaveLength(2);
    expect(elements[0]).toBeInstanceOf(HTMLDivElement);
    expect(elements[0].textContent).toBe('hello');
    expect(elements[1]).toBeInstanceOf(HTMLDivElement);
    expect(elements[1].textContent).toBe('world');
  });

  it('should accepts nested multy elements', () => {
    const elements = htmlFairy<HTMLDivElement[]>`
            <div>hello</div>
            <div>world</div>
        `;
    const element = htmlFairy<HTMLDivElement>`<div>${elements}</div>`;
    expect(element.textContent).toBe('helloworld');
    expect(element.childElementCount).toBe(2);
  });

  it('should throw error if there is placeholder without data-index', () => {
    const creator = () => htmlFairy<HTMLElement>`<div><div class="html-fairy-ph"></div></div>`;
    expect(creator).toThrow('html-fairy placeholder is defined with no data index');
  });
  it('should throw error if there is placeholder parent', () => {
    const creator = () => htmlFairy<HTMLElement>`<div class="html-fairy-ph"><div></div></div>`;
    expect(creator).toThrow('html-fairy placeholder is defined with no data index');
  });

  it('should build text and html together', () => {
    const elements = htmlFairy`${'Today at:'}<span> ${21}:${23}</span>`;

    expect(elements[0].textContent).toBe('Today at:');
    expect(elements[1].textContent).toBe(' 21:23');
  });
});

describe('safe configuration', () => {
  it('should escape string by default', () => {
    const subElement = '<span>text</span>';
    const structure = htmlFairy`<div>${subElement}</div>`;

    expect(structure.textContent).toBe('<span>text</span>');
    expect(structure.childElementCount).toBe(0);
  });

  it('should escape string if unsafe is false', () => {
    const subElement = '<span>text</span>';
    const structure = htmlFairy({ unsafe: false })`<div>${subElement}</div>`;

    expect(structure.textContent).toBe('<span>text</span>');
    expect(structure.childElementCount).toBe(0);
  });

  it('should not escape string if unsafe is true', () => {
    const subElement = '<span>text</span>';
    const structure = htmlFairy({ unsafe: true })`<div>${subElement}</div>`;

    expect(structure.textContent).toBe('text');
    expect(structure.childElementCount).toBe(1);
  });

  it('should escape array of strings', () => {
    const list = ['a', 'b', 'c'].map((x) => `<li>${x}</li>`);
    const structure = htmlFairy`<ul>${list}</ul>`;

    expect(structure).toBeInstanceOf(HTMLUListElement);
    expect(structure.textContent).toBe('<li>a</li><li>b</li><li>c</li>');
    expect(structure.childElementCount).toBe(0);
  });

  it('should not escape html elements', () => {
    const subElement = htmlFairy`<span>text</span>`;
    const structure = htmlFairy`<div>${subElement}</div>`;

    expect(structure.textContent).toBe('text');
    expect(structure.childElementCount).toBe(1);
  });

  it('should escape object with toString as well', () => {
    const subElement = {
      toString() {
        return '<span>text</span>';
      },
    };
    const structure = htmlFairy`<div>${subElement}</div>`;
    expect(structure.textContent).toBe('<span>text</span>');
  });

  it('should escape string constructor as well', () => {
    // eslint-disable-next-line no-new-wrappers
    const subElement = new String('<span>text</span>');
    const structure = htmlFairy`<div>${subElement}</div>`;
    expect(structure.textContent).toBe('<span>text</span>');
  });
});

describe('htmlFairy with web components', () => {
  class GamiteeTestMemberMethodsElement extends HTMLElement {
    b: number;

    B() {
      this.b = 1;
    }
  }
  class GamiteeTestLifeCycleElement extends HTMLElement {
    c: number;

    connectedCallback() {
      this.c = 2;
    }
  }

  class GamiteeTestMembersElement extends HTMLElement {
    b = 2;
  }

  beforeAll(() => {
    customElements.define('gamitee-test-member-methods', GamiteeTestMemberMethodsElement);
    customElements.define('gamitee-test-life-cycle', GamiteeTestLifeCycleElement);
    customElements.define('gamitee-test-members', GamiteeTestMembersElement);
  });

  it('should create member methods when web components created by htmlFairy', () => {
    const gamiteeTestElement = htmlFairy<GamiteeTestMemberMethodsElement>`<gamitee-test-member-methods/>`;

    expect(gamiteeTestElement).toHaveProperty('B');

    gamiteeTestElement.B();
    expect(gamiteeTestElement.b).toBe(1);
  });

  it('should run custom elements life cycle hooks', () => {
    const gamiteeTestElement = htmlFairy<GamiteeTestLifeCycleElement>`<gamitee-test-life-cycle/>`;
    expect(gamiteeTestElement.c).toBeUndefined();
    document.body.appendChild(gamiteeTestElement);
    expect(gamiteeTestElement.c).toBe(2);
  });

  it('should create members web components created by htmlFairy', () => {
    const gamiteeTestElement = htmlFairy<GamiteeTestMembersElement>`<gamitee-test-members/>`;
    expect(gamiteeTestElement).toHaveProperty('b');
    expect(gamiteeTestElement.b).toBe(2);
  });
});
