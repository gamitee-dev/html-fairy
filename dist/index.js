"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const escape_html_1 = __importDefault(require("escape-html"));
const escapeArg = (arg) => {
    if (Array.isArray(arg)) {
        return [].concat(...arg.map(escapeArg));
    }
    if (arg instanceof Element || arg instanceof Text) {
        return arg;
    }
    if (arg == null || !arg.toString) {
        return null;
    }
    return (0, escape_html_1.default)(arg.toString());
};
/**
 * Returns an HTML structure build from the given `htmlString`. If any argument is a HTMLElement
 * The original element will be used and will be nested in the correct nested place.
 */
const htmlFairy = (htmlString, ...args) => {
    const safeArgs = args.map(escapeArg);
    // Replace every html element argument with a placeholder. After the creation, the original
    // element will be put back in place instead of the the placeholder.
    const templateArgs = safeArgs.map((e, i) => {
        if (e instanceof Element || e instanceof Text) {
            return `<div class="html-fairy-ph" data-index="${i}"></div>`;
        }
        if (Array.isArray(e)) {
            if (e.every((v) => v instanceof Element || v instanceof Text)) {
                return `<div class="html-fairy-ph" data-index="${i}" data-placeholder-type="array"></div>`;
            }
            return e.map((text) => text ?? '').join('');
        }
        return e ?? '';
    });
    const htmlStringRaw = String.raw(htmlString, ...templateArgs);
    const parsed = document.createElement('div');
    parsed.innerHTML = htmlStringRaw.trim();
    parsed.querySelectorAll('.html-fairy-ph').forEach((element) => {
        const originalArgIndex = Number.parseInt(element.getAttribute('data-index') ?? '-1', 10);
        if (originalArgIndex === -1) {
            throw new Error('html-fairy placeholder is defined with no data index');
        }
        if (element.getAttribute('data-placeholder-type') === 'array') {
            const placeholderContainer = element.parentElement;
            element.remove();
            safeArgs[originalArgIndex].forEach((e) => {
                placeholderContainer?.appendChild(e);
            });
        }
        else {
            element.parentElement?.replaceChild(safeArgs[originalArgIndex], element);
        }
    });
    const children = Array.from(parsed.childNodes)
        .filter((x) => x.nodeName !== '#text' || (x.textContent && x.textContent.trim().length > 0));
    if (parsed.firstChild && children.length > 1) {
        return children;
    }
    return parsed.firstChild;
};
exports.default = htmlFairy;
//# sourceMappingURL=index.js.map