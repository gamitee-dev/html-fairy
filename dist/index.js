(()=>{"use strict";var e={573:e=>{var t=/["'&<>]/;e.exports=function(e){var r,a=""+e,n=t.exec(a);if(!n)return a;var o="",i=0,l=0;for(i=n.index;i<a.length;i++){switch(a.charCodeAt(i)){case 34:r="&quot;";break;case 38:r="&amp;";break;case 39:r="&#39;";break;case 60:r="&lt;";break;case 62:r="&gt;";break;default:continue}l!==i&&(o+=a.substring(l,i)),l=i+1,o+=r}return l!==i?o+a.substring(l,i):o}}},t={};function r(a){var n=t[a];if(void 0!==n)return n.exports;var o=t[a]={exports:{}};return e[a](o,o.exports,r),o.exports}r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},r.d=(e,t)=>{for(var a in t)r.o(t,a)&&!r.o(e,a)&&Object.defineProperty(e,a,{enumerable:!0,get:t[a]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var a={};(()=>{r.r(a),r.d(a,{default:()=>o});var e=r(573),t=r.n(e);const n=e=>Array.isArray(e)?[].concat(...e.map(n)):e instanceof Element||e instanceof Text?e:null!=e&&e.toString?t()(e.toString()):null,o=(e,...t)=>{const r=t.map(n),a=r.map(((e,t)=>e instanceof Element||e instanceof Text?`<div class="html-fairy-ph" data-index="${t}"></div>`:Array.isArray(e)?e.every((e=>e instanceof Element||e instanceof Text))?`<div class="html-fairy-ph" data-index="${t}" data-placeholder-type="array"></div>`:e.map((e=>e??"")).join(""):e??"")),o=String.raw(e,...a),i=document.createElement("div");i.innerHTML=o.trim(),i.querySelectorAll(".html-fairy-ph").forEach((e=>{const t=Number.parseInt(e.getAttribute("data-index")??"-1",10);if(-1===t)throw new Error("html-fairy placeholder is defined with no data index");if("array"===e.getAttribute("data-placeholder-type")){const a=e.parentElement;e.remove(),r[t].forEach((e=>{a?.appendChild(e)}))}else e.parentElement?.replaceChild(r[t],e)}));const l=Array.from(i.childNodes).filter((e=>"#text"!==e.nodeName||e.textContent&&e.textContent.trim().length>0));return i.firstChild&&l.length>1?l:i.firstChild}})(),exports.htmlFairy=a})();
