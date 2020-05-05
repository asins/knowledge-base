---
title: "获取当前脚本Url"
date: "2019-08-21"
lastmod: "2019-08-21"
---

获取当前执行JS文件的Path，


```js
const doc = window.document;
const expose = +new Date();
const isLtIE8 = ('' + doc.querySelector).indexOf('[native code]') === -1;

// 获取脚本路径
export default function getScriptPath() {
    // FF,Chrome,Safari,Edge
    if (doc.currentScript) {
        return doc.currentScript.src;
    }
    // IE10+ or other unsupport browser
    const loc = _getScriptLocation();
    if (loc) {
        return loc;
    }
    // IE10-
    for (let scripts = doc.scripts, i = scripts.length - 1, script; script = scripts[i--];) {
        if (script.className !== expose && script.readyState === 'interactive') {
            script.className = expose;
            // if less than ie 8, must get abs path by getAttribute(src, 4)
            return isLtIE8 ? script.getAttribute('src', 4) : script.src;
        }
    }
}

function _getScriptLocation() {
    let loc = null;
    const stackTrace = 'stacktrace';
    const stack = 'stack';
    const fileName = 'fileName';
    const matcher = function(stack, matchedLoc) {
        loc = matchedLoc;
        return loc;
    };

    try {
        // Invalid code
        __nil__();
    } catch (ex) {
        if (fileName in ex) { // Firefox
            loc = ex[fileName];
        } else if (stackTrace in ex) { // Opera
            ex[stackTrace].replace(/called from line \d+, column \d+ in (.*):/gm, matcher);
        } else if (stack in ex) { // WebKit, Blink and IE10
            ex[stack].replace(/at Global code.*?\(?(\S+):\d+:\d+\)?/g, matcher);
            if (!loc) {
                ex[stack].replace(/global code@?(\S+):\d+:\d+?/g, matcher);
            }
            if (!loc) {
                ex[stack].replace(/at.*?\(?(\S+):\d+:\d+\)?$/g, matcher);
            }
        }
        return loc;
    }
}
```

