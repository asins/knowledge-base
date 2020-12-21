---
title: "Template 模板引擎"
date: "2019-08-21"
lastmod: "2019-08-21"
---

## 一、简单的模板

```js
var TemplateEngine = function(tpl, data) {
  const re = /\{\{([^}]+)?\}\}/g;
  while (re.exec(tpl)) {
    tpl = tpl.replace(RegExp.lastMatch, data[RegExp.$1]);
  }
  return tpl;
}

var tpl = '<p>Hello, my name is {{name}}. I\'m {{age}} years old.</p>';
var html = TemplateEngine(tpl, {name: "Krasimir", age: 29});
// Out: <p>Hello, my name is Krasimir. I'm 29 years old.</p>
```

##  二、完整模板
```js
function TemplateEngine(tmpl) {
	var str = '', tb = '{{', te = '}}', m, l,
		arr = tmpl.replace(/\s*<!\[CDATA\[\s*|\s*\]\]>\s*|[\r\n\t]|(\/\*[\s\S]*?\*\/)/g, '')
			.split(tb).join(te +'\x1b')
			.split(te);

	for (m=0,l=arr.length; m < l; m++) {
		str += arr[m].charAt(0) !== '\x1b' ?
		"out+='" + arr[m].replace(/(\\|["'])/g, '\\$1') + "'" : (arr[m].charAt(1) === '=' ?
		';out+=(' + arr[m].substr(2) + ');' : (arr[m].charAt(1) === '!' ?
		';out+=(' + arr[m].substr(2) + ").toString().replace(/&(?!\\w+;)/g, '&#38;').split('<').join('&#60;').split('>').join('&#62;').split('" + '"' + "').join('&#34;').split(" + '"' + "'" + '"' + ").join('&#39;').split('/').join('&#x2F;');" : ';' + arr[m].substr(1)));
	}

	str = ('var out="";'+str+';return out;')
		.split("out+='';").join('')
		.split('var out="";out+=').join('var out=');

	try {
		return new Function('it', str);
	} catch (e) {
		if (typeof console !== 'undefined') console.log("Could not create a template function: " + str);
		throw e;
	}
}


var tpl = '<p>Hello, my name is {{=it.name}}. I\'m {{=it.profile.ag1e}} years old.</p>';
console.log(TemplateEngine(tpl)({name: "Krasimir Tsonev", profile: {age: 29}}));
// Out: <p>Hello, my name is Krasimir Tsonev. I'm 29 years old.</p>
```

## 三、HTML 字符转义

```js
function encodeHTML(str) {
	var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': '&#34;', "'": '&#39;', "/": '&#47;' };
	var matchHTML = /&(?!#?\w+;)|<|>|"|'|\//g;
	return str ? (str+'').replace(matchHTML, function(m) { return encodeHTMLRules[m] || m }) : str;
}
```
