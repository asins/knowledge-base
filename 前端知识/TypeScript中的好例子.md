### 获取对象中的值的定义

```typescript
const getKeyValue = <U extends keyof T, T extends object>(key: U) => (obj: T) => obj[key];

interface User {
  name: string;
  age: number;
}

const user: User = {
  name: "John Smith",
  age: 20
};

const getUserName = getKeyValue<keyof User, User>("name")(user);
// => 'John Smith'

// 替代下写法
const getKeyValue = <T, K extends keyof T>(obj: T, key: K): T[K] => obj[key];
```



## 定义参数类型为一个Object的值

```typescript
type KeyToObjMap = {
  some: "other",
  more: "somemore",
};

type Keys = keyof KeyToObjMap;

type Values = KeyToObjMap[Keys]; // "other" | "somemore"

// 以下使用中TS也能正常的提示出值是否正确：
let one: Values = "some";
let two: Values = "other";
let three: Keys = "some";
let four: Values = "somemore";
let five: Keys = "fun";
```

## 定义指定长度的Array类型

### 每项类型一致

```typescript
type Grow<T, A extends T[]> = ((x: T, ...xs: A) => void) extends ((...a: infer X) => void) ? X : never;
type GrowToSize<T, A extends T[], N extends number> = { 0: A, 1: GrowToSize<T, Grow<T, A>, N> }[A['length'] extends N ? 0 : 1];
export type FixedArray<T, N extends number> = GrowToSize<T, [], N>;

// OK
const fixedArr3: FixedArray<string, 3> = ['a', 'b', 'c'];

// Error:
// Type '[string, string, string]' is not assignable to type '[string, string]'.
//   Types of property 'length' are incompatible.
//     Type '3' is not assignable to type '2'.ts(2322)
const fixedArr2: FixedArray<string, 2> = ['a', 'b', 'c'];

// Error:
// Property '3' is missing in type '[string, string, string]' but required in type 
// '[string, string, string, string]'.ts(2741)
const fixedArr4: FixedArray<string, 4> = ['a', 'b', 'c'];
```



### 每项类型不同

```js
type ArrayLengthMutationKeys = 'splice' | 'push' | 'pop' | 'shift' | 'unshift' | number
type ArrayItems<T extends Array<any>> = T extends Array<infer TItems> ? TItems : never
type FixedLengthArray<T extends any[]> =
  Pick<T, Exclude<keyof T, ArrayLengthMutationKeys>>
  & { [Symbol.iterator]: () => IterableIterator< ArrayItems<T> > }
     
// 定义包含 3 个字符串的数组
let foo : FixedLengthArray<[string, string, string]> 
  
Tests :

var myFixedLengthArray: FixedLengthArray<[string, string, string]>

// Array declaration tests
myFixedLengthArray = [ 'a', 'b', 'c' ]  // ✅ OK
myFixedLengthArray = [ 'a', 'b', 123 ]  // ✅ TYPE ERROR
myFixedLengthArray = [ 'a' ]            // ✅ LENGTH ERROR
myFixedLengthArray = [ 'a', 'b' ]       // ✅ LENGTH ERROR

// Index assignment tests 
myFixedLengthArray[1] = 'foo'           // ✅ OK
myFixedLengthArray[1000] = 'foo'        // ✅ INVALID INDEX ERROR

// Methods that mutate array length
myFixedLengthArray.push('foo')          // ✅ MISSING METHOD ERROR
myFixedLengthArray.pop()                // ✅ MISSING METHOD ERROR

// Direct length manipulation
myFixedLengthArray.length = 123         // ✅ READ-ONLY ERROR

// Destructuring
var [ a ] = myFixedLengthArray          // ✅ OK
var [ a, b ] = myFixedLengthArray       // ✅ OK
var [ a, b, c ] = myFixedLengthArray    // ✅ OK
var [ a, b, c, d ] = myFixedLengthArray // ✅ INVALID INDEX ERROR
```

