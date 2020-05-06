import { resolve, extname, basename } from "https://deno.land/std@v0.42.0/path/mod.ts"

const { readDir, readFile, lstat } = Deno;

const entryPath = Deno.args[0] || './';

async function getFileTxt(path: string) {
  const decoder = new TextDecoder('utf-8');
  const text = decoder.decode(await readFile(path));
  return text;
}

async function setFileTxt(path: string, txt: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(txt);
  await Deno.writeFile(path, data);
}

async function formatFile(path: string, dirEntry: Deno.DirEntry) {
  const txt: string = await getFileTxt(path);

  if (/^---\n/g.test(txt)) {
    console.log('[已存在YAML信息]', path);
    return;
  }


  const fileInfo = await lstat(path);
  const ext = extname(dirEntry.name);
  const title = basename(dirEntry.name, ext);

  // console.log(Object.keys(fileInfo));
  const creatDate = formatDate(fileInfo.birthtime); // 文件创建时间
  const modified = formatDate(fileInfo.mtime); // 文件修改时间

  const yamlTxt = `---
title: "${title}"
date: "${creatDate}"
lastmod: "${modified}"
---

${txt}`;

  await setFileTxt(path, yamlTxt);

  console.log('[更新成功]', path);
}

async function formatMdFileInDir(dirPath: string) {
  for await (const dirEntry of readDir(dirPath)) {
    const fileName = dirEntry.name;

    const path: string = resolve(dirPath, dirEntry.name);
    // console.log('dirEntry path->', path, extname(dirEntry.name).toLocaleLowerCase());

    if (dirEntry.isDirectory) {
      if(dirEntry.name === '.git') return;

      await formatMdFileInDir(path);
    } else if (dirEntry.isFile && extname(dirEntry.name).toLocaleLowerCase() === '.md') {
      formatFile(path, dirEntry);
    }
  }
}

type Formatter = (val: number, pattern: string) => string;
type Formatters = { [ token: string ]: Formatter; };
type FormattersNumber = { [ token: string ]: number; };

/**
 * 格式化日期
 * @method format
 * @static
 * @param {Date} date 日期对象
 * @param {string} pattern 日期格式(y年M月d天h时m分s秒)，默认为'yyyy-MM-dd'
 * @return {string}  返回format后的字符串
 * @example
 var d = new Date(2017, 8, 27, 15, 9, 12, 345);
 console.log(format(d, 'yyyy-MM-d/q hh:mm:ss.S, e')); // 2017-09-27/No.3 15:09:12.345, 3
 console.log(format(d, 'M/d/yy')); // 9/27/17
 console.log(format(d, 'yyyy-MM-dd hh:mm:ss.S')); // 2017-09-27 15:09:12.345

 var t = format(d, 'yyyy年M月dd日 e (第q季)', {
 e: (val, pattern) => {return (pattern.length > 1 ? '星期': '周') + '日一二三四五六'[val];},
 q: '一二三四',
 });
 console.log(t); // 2017年9月27日 周三 (第四季)
 */
function formatDate(date: Date | null, fmt = 'yyyy-MM-dd', opt: Formatters = {}) {
  // if (typeof date === 'string') {
  //   date = date.replace(/-/g, '/');
  // }

  date = date === null ? new Date() : new Date(date);

  const formatters = {
    y: date.getFullYear(), // 年份
    M: date.getMonth() + 1, //月份
    d: date.getDate(), //日
    h: date.getHours(), //小时
    m: date.getMinutes(), //分
    s: date.getSeconds(), //秒
    S: date.getMilliseconds(), //毫秒
    q: Math.floor((date.getMonth() + 3) / 3), //季度
    e: date.getDay(), // 星期（0-6）
  } as FormattersNumber;

  // type IRegArg2 = keyof typeof formatters;

  return fmt.replace(
    new RegExp(/([yMdhmsSqe])\1*/, 'g')
    ,function($0: string, $1: string) {
      if (!$1) $1 = $0;

      const extend = opt[$1];
      if (extend) {
        return typeof extend === 'function'
          ? extend(formatters[$1], $0)
          : extend[formatters[$1]];
      } else {
        return $0.length === 1
          ? String(formatters[$1])
          : ('0' + formatters[$1]).substr(-$0.length);
      }
    }
  );
}


formatMdFileInDir(entryPath);
