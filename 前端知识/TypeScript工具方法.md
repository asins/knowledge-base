+++
title = "TypeScript工具方法"
template = "page.html"
date = "2022-03-04"
updated = "2022-03-04"
+++

在实际使用 `TypeScript` 的开发过程中，得益于这些高级类型于工具类型，我们可以更方便的构建出我们需要的类型。

比如说：我们在后台登陆信息认证中构建了一个用户，它是 `LoginUser` 的类型， 它包含了：“name 用户名”、“email 邮箱”、“roles：角色”等多个信息，其中 name 可能不是必选项。但是未登录时它肯定是一个 **Undefined** 的类型。当进行权限认证时它是只读的，当进行用户名 name 进行修改时 *name* 是必选属性。

```typescript
type LoginUser = {
  name?: string;
  email: string;
  roles: string[];
};

type CurrentUser = LoginUser | undefined;

type Muteable<T> = {
  +readonly [P in keyof T]: T[P];
};
type CertUser = Muteable<LoginUser>;
type SuerUser = Required<LoginUser>;
```

如果每个类型都重新声明一个新类型来满足程序，代码将会变得臃肿，反之如果我们高级类型来解决时，他将会变得简单高效。

## 一、高级类型

### 泛型

泛型可以理解为一个变量，这个变量的值是一个类型。和函数的参数一样。它通常配合一组尖括号进行声明使用：

```typescript
// 一个带有 name 属性的类型
type Cup = {
  name: string;
};
// 声明一个接收三个参数的函数，
// 第一个参数是必须拥有name属性的 object
// 第二个参数设置为第一个参数这个对象中的一个属性
// 第三个参数设置为第二个参数的属性值
const addAttr = <T extends {name: string}, K, U>(obj: T, attrName: K, attrValue: U) => {
  const temp: any = {};
  temp[attrName] = attrValue;
  return {...obj, ...temp};
};
// 函数名后使用尖括号传入限定类型
addAttr<Cup, string, number>({ name: 'mgdi' }, 'age', 18);
```

### 联合类型

联合类型是指将多个类型结合，使用 **｜** 符号进行连接。当使用这个类型时，值只需满足其中一个类型即可

```typescript
// 声明Foo类型
type Foo = {
  width: number;
}
// 声明一个Bar类型
type Bar = {
  height: number;
}
// 声明一个Foo, Bar的联合类型
type Baz = Foo | Bar;
// 赋值时只需要满足其中一个类型即可
const baz: Baz = {
  width: 20,
//  height: 10
}
```

### 字面量类型

字面量类型与联合类型很像，不同之处在于，联合类型用 **|** 分割的是类型，而字面量类型分割的是值。

```typescript
type Roles = 'student' | 'teacher' | 'kids';
const ading: Roles = "kids";
```

### 枚举类型

**enum** 类型通常也是多个键值对的集合，使用其类型时赋值只能是声明的值之一。

```typescript
enum UserRoleType {
  GHOST = "ghost",
  EDITOR = "editor",
  PUBLISH = "publish",
  ADMIN = "admin",
}
const ading: UserRoleType = UserRoleType.ADMIN;
```

### 交叉类型

交叉类型是多个类型的**集合**，使用 “ & ”连接多个类型，使用其作为值类型时必需同时满足所有类型。

```typescript
// 声明Foo类型
type Foo = { width: number }
// 声明一个Bar类型
type Bar = { height: number }
// 声明一个Foo, Bar的交叉类型
type Baz = Foo & Bar;
const baz: Baz = {
  width: 3,
  heght: 4,
}
```

### 类型断言

类型断言指将一个不确定的类型断言为一个自己确定的类型。通常使用一组尖括号 “<T>” 配合断言的目标类型 T 类型使用, 比如说在后端的登录的用户角色认证。

```typescript
import { Request } from 'express';
type CurrentUser = {
  username: string;
  email?: string;
};
const getCurrentUser = (req: Request): CurrentUser => {
  return <CurrentUser>req.currentUser;
};
```

### 类型别名

声明一个别名来代指当前类型，它是别名，不是一个新的类型。

```typescript
type MyString = string;
```


## 二、关键字

### keyof

keyof T: 返回一个由构造类型 T 的所有属性组成的字面量类型

```typescript
type Light = {
  light: number;
  energy: string;
};
type LightKey = keyof Light; // "light" | "energy"

interface Person {
    name: string;
    age: number;
}
type K1 = keyof Person; // "name" | "age"
type K2 = keyof Person[]; // "length" | "toString" | "pop" | "push" | "concat" | "join" 
type K3 = keyof { [x: string]: Person };  // string | number
```

### typeof

typeof k: 返回变量 k 的类型

```typescript
let computer: string[] = ["a"];
type MyComputerType = typeof computer; //  string[]
```

### in

in 用来遍历枚举类型：

``` typescript
type Keys = "a" | "b" | "c"

type Obj =  {
  [p in Keys]: any
} // -> { a: any, b: any, c: any }
```

### Infer

infer T； 将在类型 T 的处理过程中的某个部分抽离出来当做类型变量

```typescript
type Unpacked<T> =
  T extends (infer U)[] ? U :
  T extends (...args: any[]) => infer U ? U :
  T extends Promise<infer U> ? U :
  T;

type Foo = Unpacked<string>;  // string
type Bar = Unpacked<string[]>;  // string
type Baz = Unpacked<() => string>;  // string
type Qux = Unpacked<Promise<string>>;  // string
type Quux = Unpacked<Promise<string>[]>;  // Promise<string>
type Garply = Unpacked<Unpacked<Promise<string>[]>>;  // string
```

### extends
有时候我们定义的泛型不想过于灵活或者说想继承某些类等，可以通过 extends 关键字添加泛型约束。

```typescript
interface ILengthwise {
  length: number;
}

function loggingIdentity<T extends ILengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}
```

现在这个泛型函数被定义了约束，因此它不再是适用于任意类型：

```typescript
loggingIdentity(3);  // Error, number doesn't have a .length property
```

这时我们需要传入符合约束类型的值，必须包含必须的属性：

```typescript
loggingIdentity({length: 10, value: 3});
```

## 三、工具类型

### Partial

Partial<T>: 可以将传入类型 T 的所有属性变为可选属性。

```typescript
// type Partial<T> = { [P in keyof T]?: T[P] | undefined; }

type Foo = {
  name: string;
  age: number;
};
const partFoo: Partial<Foo> = {};
```

### Required

Required<T>: Required 与 Partial 刚好相反，功能是将传入类型 T 的所有可选项转换为必选项。

```typescript
// type Required<T> = { [P in keyof T]-?: T[P]; }

type Foo = {
  name?: string;
  age?: number;
};
const requiredFoo: Required<Foo> = {
  name: 'ading',
  age: 18,
};
```

### Readonly

Readonly<T>: Readonly 可以将构造类型 T 的所有属性转换为只读属性。

```typescript
// type Readonly<T> = { readonly [P in keyof T]: T[P]; }

type Foo = {foo: string};
const foo1: Foo = {foo: 'foo'};
foo1.foo = 'bar';
type ReadonlyFoo = Readonly<Foo>;
const readonlyFoo: ReadonlyFoo = {
  foo: 'foo',
}
// readonlyFoo.foo = 'bar'  //Error 
```

### Record

Record<K, T>: 类型复制，将构造类型 T 设置到属性 K 上。

```typescript
// type Record<K extends string | number | symbol, T> = { [P in K]: T; }

type Foo = {foo: string};
type Bar = {
  name: string;
  age: number;
};
type Baz = Record<keyof Bar, Foo>;
const baz: Baz = {
  name: { foo: 'foo' },
  age: { foo: 'foo' },
};
```

### Pick

PicK<T, K extends keyof T>: 挑选属性，将属性 T 中的其中一部分属性挑选出来

```typescript
// type Pick<T, K extends keyof T> = { [P in K]: T[P]; }

type Transportation = {
  name: string;
  speed: number;
  price: number;
  transportAble?: boolean;
};
type Transportable = Pick<Transportation, 'name' | 'speed'>;
const transportAble: Transportable = {
  name: '小火车',
  speed: 2,
};
```

### Omit

Omit<T, K>: Omit 与 Pick刚好相反，它是剔除选定属性，使用剩余类型构造新类型。

```typescript
// type Omit<T, K extends string | number | symbol> = { [P in Exclude<keyof T, K>]: T[P]; }

type Transportation = {
  name: string;
  speed: number;
  price: number;
  transportAble?: boolean;
};
type MyOmit = Omit<Transportation, 'name' | 'speed'>;
const myomit: MyOmit = {
  price: 20,
}
```

### Exclude

Exclude<T, K>: 去除 T 类型中于K类型包含的相同属性，使用剩余属性构造一个新类型

```typescript
// type Exclude<T, U> = T extends U ? never : T

type Foo = Exclude<"a" | "b" | "c", "a">;  // "b" | "c"
type Bar = Exclude<"a" | "b" | "c", "a" | "b">;  // "c"
type Baz = Exclude<string | number | (() => void), Function>;
// string | number
type TExcludeTrain = Exclude<Foo, Baz>; // naver
```

### Extract

Extract<T, K>: 获取构造类型 T, K 中相同的类型构造一个新的类型

```typescript
// type Extract<T, U> = T extends U ? T : never

type Foo = Extract<"a" | "b" | "c", "a" | "f">;  // "a"
type Bar = Extract<string | number | (() => void), Function>;  
// () => void
```

### NonNullable

NonNullable<T>:  去除类型 T 中的 null 与 undefined

```typescript
// type NonNullable<T> = T extends null | undefined ? never : T

type NoNonNullType = NonNullable<string | null | number>;
let noNonNullType: NoNonNullType = 10;
```

### ReturnType

构造一个由函数类型返回值类型 T 的类型

```typescript
// type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any

type FunReturnBoolean = () => boolean ; 
type ReturnTypeBoolean = ReturnType<FunReturnBoolean>;
type ReturnNumArr = ReturnType<<T extends U, U extends number[]>() => T>;
const numbers: ReturnNumArr = [1, 2];
```

### InstanceType

由构造函数类型 T 的实例类型构造一个类型

```typescript
class Human {
  name= '人类';
  age= 800;
};
type HumanType = InstanceType<typeof Human>;
let newHuman: HumanType;
let newHuman2: HumanType = new Human();
```

## 四、官方文档：

https://www.tslang.cn/docs/release-notes/typescript-3.1.html