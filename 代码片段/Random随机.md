## Math.random指定随机范围

```js
function random(start, end){
    return Math.floor(Math.random() * (end - start + 1) + start);
}
```

  

## 随机生成CSS颜色值

```js
function getColor(){
	return '#' + ('00000' + (Math.random()*0x1000000<<0).toString(16)).slice(-6)
}


// 颜色翻转取反
function colorReverse(oldColor){
	var oldColor = '0x' + oldColor.replace(/#/g, '');
	var str = '000000' + (0xFFFFFF - oldColor).toString(16);
 	return str.slice(-6);
}
```





## 千万级别不重复随机数生成

### Mrg32k3a方式
```js
// From http://baagoe.com/en/RandomMusings/javascript/
function MRG32k3a() {
  return (function(args) {
    // Copyright (c) 1998, 2002 Pierre L'Ecuyer, DIRO, Université de Montréal.
    // http://www.iro.umontreal.ca/~lecuyer/
    var m1 = 4294967087;
    var m2 = 4294944443;
    var s10 = 12345,
        s11 = 12345,
        s12 = 123,
        s20 = 12345,
        s21 = 12345,
        s22 = 123;

    if (args.length === 0) {
      args = [+new Date()];
    }
    var mash = Mash();
    for (var i = 0; i < args.length; i++) {
      s10 += mash(args[i]) * 0x100000000; // 2 ^ 32
      s11 += mash(args[i]) * 0x100000000;
      s12 += mash(args[i]) * 0x100000000;
      s20 += mash(args[i]) * 0x100000000;
      s21 += mash(args[i]) * 0x100000000;
      s22 += mash(args[i]) * 0x100000000;
    }
    s10 %= m1;
    s11 %= m1;
    s12 %= m1;
    s20 %= m2;
    s21 %= m2;
    s22 %= m2;
    mash = null;

    var uint32 = function() {
      var m1 = 4294967087;
      var m2 = 4294944443;
      var a12 = 1403580;
      var a13n = 810728;
      var a21 = 527612;
      var a23n = 1370589;

      var k, p1, p2;

      /* Component 1 */
      p1 = a12 * s11 - a13n * s10;
      k = p1 / m1 | 0;
      p1 -= k * m1;
      if (p1 < 0) p1 += m1;
      s10 = s11;
      s11 = s12;
      s12 = p1;

      /* Component 2 */
      p2 = a21 * s22 - a23n * s20;
      k = p2 / m2 | 0;
      p2 -= k * m2;
      if (p2 < 0) p2 += m2;
      s20 = s21;
      s21 = s22;
      s22 = p2;

      /* Combination */
      if (p1 <= p2) return p1 - p2 + m1;
      else return p1 - p2;
    };

    var random = function() {
      return uint32() * 2.3283064365386963e-10; // 2^-32
    };
    random.uint32 = uint32;
    random.fract53 = function() {
      return random() +
        (uint32() & 0x1fffff) * 1.1102230246251565e-16; // 2^-53
    };
    random.version = 'MRG32k3a 0.9';
    random.args = args;

    return random;
  } (Array.prototype.slice.call(arguments)));
};
```

### Alea方式

```js
// From http://baagoe.com/en/RandomMusings/javascript/
function Alea() {
  return (function(args) {
    // Johannes Baagøe <baagoe@baagoe.com>, 2010
    var s0 = 0;
    var s1 = 0;
    var s2 = 0;
    var c = 1;

    if (args.length == 0) {
      args = [+new Date];
    }
    var mash = Mash();
    s0 = mash(' ');
    s1 = mash(' ');
    s2 = mash(' ');

    for (var i = 0; i < args.length; i++) {
      s0 -= mash(args[i]);
      if (s0 < 0) {
        s0 += 1;
      }
      s1 -= mash(args[i]);
      if (s1 < 0) {
        s1 += 1;
      }
      s2 -= mash(args[i]);
      if (s2 < 0) {
        s2 += 1;
      }
    }
    mash = null;

    var random = function() {
      var t = 2091639 * s0 + c * 2.3283064365386963e-10; // 2^-32
      s0 = s1;
      s1 = s2;
      return s2 = t - (c = t | 0);
    };
    random.uint32 = function() {
      return random() * 0x100000000; // 2^32
    };
    random.fract53 = function() {
      return random() + 
        (random() * 0x200000 | 0) * 1.1102230246251565e-16; // 2^-53
    };
    random.version = 'Alea 0.9';
    random.args = args;
    return random;

  } (Array.prototype.slice.call(arguments)));
}

// From http://baagoe.com/en/RandomMusings/javascript/
// Johannes Baagøe <baagoe@baagoe.com>, 2010
function Mash() {
  var n = 0xefc8249d;

  var mash = function(data) {
    data = data.toString();
    for (var i = 0; i < data.length; i++) {
      n += data.charCodeAt(i);
      var h = 0.02519603282416938 * n;
      n = h >>> 0;
      h -= n;
      h *= n;
      n = h >>> 0;
      h -= n;
      n += h * 0x100000000; // 2^32
    }
    return (n >>> 0) * 2.3283064365386963e-10; // 2^-32
  };

  mash.version = 'Mash 0.9';
  return mash;
}
```



### Xorshift方式

```js
// From http://baagoe.com/en/RandomMusings/javascript/
function Xorshift03() {
  return (function(args) {
    // George Marsaglia, 13 May 2003
    // http://groups.google.com/group/comp.lang.c/msg/e3c4ea1169e463ae
    var x = 123456789,
        y = 362436069,
        z = 521288629,
        w = 88675123,
        v = 886756453;

    if (args.length == 0) {
      args = [+new Date];
    }
    var mash = Mash();
    for (var i = 0; i < args.length; i++) {
      x ^= mash(args[i]) * 0x100000000; // 2^32
      y ^= mash(args[i]) * 0x100000000;
      z ^= mash(args[i]) * 0x100000000;
      v ^= mash(args[i]) * 0x100000000;
      w ^= mash(args[i]) * 0x100000000;
    }
    mash = null;

    var uint32 = function() {
      var t = (x ^ (x >>> 7)) >>> 0;
      x = y;
      y = z;
      z = w;
      w = v;
      v = (v ^ (v << 6)) ^ (t ^ (t << 13)) >>> 0;
      return ((y + y + 1) * v) >>> 0;
    }

    var random = function() {
      return uint32() * 2.3283064365386963e-10; // 2^-32
    };
    random.uint32 = uint32;
    random.fract53 = function() {
      return random() +
        (uint32() & 0x1fffff) * 1.1102230246251565e-16; // 2^-53
    };
    random.version = 'Xorshift03 0.9';
    random.args = args;
    return random;

  } (Array.prototype.slice.call(arguments)));
};
```



性能比较：https://jsperf.com/prng-comparison/6