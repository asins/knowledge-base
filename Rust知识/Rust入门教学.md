# 学习Rust基础知识编写的一些代码

## 简介
Rust是一门赋予每个人构建可靠且高效软件能力的编程语言。可靠主要体现在安全性上。其高效不仅限于开发效率，它的执行效率也是令人称赞的，是一种少有的兼顾开发效率和执行效率的语言。Rust 语言由 Mozilla 开发，最早发布于 2014 年 9 月。Rust 的编译器是在 MIT License 和 Apache License 2.0 双重协议声明下的免费开源软件。

### 特性

* 高性能：Rust 速度惊人且内存利用率极高。由于没有运行时和垃圾回收，它能够胜任对性能要求特别高的服务，可以在嵌入式设备上运行，还能轻松和其他语言集成。

* 可靠性：Rust 丰富的类型系统和所有权模型保证了内存安全和线程安全，让您在编译期就能够消除各种各样的错误。

* 生产力：Rust 拥有出色的文档、友好的编译器和清晰的错误提示信息， 还集成了一流的工具——包管理器和构建工具， 智能地自动补全和类型检验的多编辑器支持， 以及自动格式化代码等等。

* Rustacean：使用 rust 的攻城狮不叫 ruster 而是叫  Rustacean ，咱也不知道为什么，书上就是这么说的。  

### 特征
* 作为一门编程语言，rust既可以分类为面向过程编程语言，也可以分类为面向对象编程语言
* rust拥有精细化的基础数据结构
* rust中支持泛型，并且拥有泛型枚举
* rust中支持接口，甚至支持接口默认方法，并且接口既可以作为方法入参也可以作为方法出参

### 用途
* 传统命令行程序
* 嵌入式
* 网络服务
* WebAssembly
* Web服务
* ......

## 安装 
> 以 windows 11 为例

下载 rustup-init.exe ，双击此可执行程序会打开一个命令行程序，此程序引导安装，

再安装[C++ Build Tools](https://visualstudio.microsoft.com/downloads/)

## 核心组件
* rustup：安装、更新rust用的，rustup doc 可查看安装包中的官方指导文档
* cargo：包管理器和编译源代码工具
* rustc：将rust源文件编译成可执行程序
* rustdoc：为rust项目生成说明文档

## 常用命令
|命令|说明|备注|
|---|---|---|
|rustup  doc|打开官方指导文档||
|cargo  new projectName |创建一个rust工程| 示例：cargo new firstRustProject|
|cargo  run |运行rust工程||
|cargo  build |编译rust工程|  若增加了依赖，即修改了toml文件，需要重新编译   |


## 基础语法
* fn 声明函数
* let 声明变量，变量默认不可变，加 mut 的变量为可变变量
* 虽然所有变量声明都用let关键字，但是rust是强类型的语言，内置了强大的类型推导
* 函数参数：参数名:参数数据类型
* 变量重影性质：同一个名称可以被多个变量使用，后面的变量会覆盖前面的变量
* const 声明常量
* //注释一行，/**/注释多行
* 使用英文分号换行


示例：

~~~rust
fn main() {
    println!("Hello, world!");
       //变量默认是不可变的，加上 mut 关键字就可以重新赋值。
       let mut  x=5;
       println!("The value of x is   {}  ",x);
   
       x=6;
       println!("The value of x is   {}  ",x);
   
   
       //变量的隐藏
       let  money=100;
       println!("money is {}",money);
       let money =money+8;
       println!("money is {}",money);
       let money="一百元";
       println!("money is {}",money);
   
       //常量使用 const 关键字声明，声明的时候必须指定数据类型，常量名全大写。
       //不需要let ， 不可使用mut 修饰
       const MAX_PIONTS: u32=888;
       println!("The constant is {}",MAX_PIONTS);
       
    let  result:char= a_function(88, 'M', false);
    println!("result is {}",result);
}
fn a_function(a:u64,b:char,c:bool)-> char{
    println!("a is {}",a);
    println!("b is {}",b);
    println!("c is {}",c);
    return  'N';
}


~~~

输出：

~~~rust
Hello, world!
The value of x is   5
The value of x is   6
money is 100
money is 108
money is 一百元
The constant is 888
a is 88
b is M
c is false
result is N
~~~

### 数据类型
#### 标量类型
整数，浮点，布尔，字符
* 整数：i8,u8,i16,u16,i32,u32,i64,u64,i128,u128,isize,usize
    * i表示有符号
    * u表示无符号
    * isize 和 usize 两种整数类型是用来衡量数据大小的，它们的位长度取决于所运行的目标平台，如果是 32 位架构的处理器将使用 32 位位长度整型。
* 浮点：f32,f64

#### 复合类型
可以将多个值放到一个数据类型中。
* 元组-tuple。长度固定，元素的数据类型可以不同
* 数组，长度固定，元素的数据类型必须相同
* Vector：不是标准库提供的。和数组类似，长度可变



#### 示例

~~~

fn main() {
    println!("Hello, world!");
    let q=3.0;
    let q:f32=5.00;
    let w=true;
    let r:bool =false;
 
    let t='🔣';
    let tup :(i32,u64,bool) =(88,99,false);
    println!("元素1：{},元素2：{},元素3：{}",tup.0 , tup.1, tup.2);
    let arr:[u64;5]=[1,2,3,5,5];
    let arr2=['E';9];
    println!("arr piont 2  is :{}",arr[1]);
    println!("arr2 piont 2  is :{}",arr2[1]);
    //Vector：todo
}


~~~

### 条件语句
和大多数编程语言一样， if - else if - else 表示条件语句，在 if 后面不用加括号。

~~~

fn main() {
    println!("Hello, world!");
    //条件语句
    let a = 12;
    let b;
    if a > 0 {
        b = 1;
    } else if a < 0 {
        b = -1;
    } else {
        b = 0;
    }
    println!("b is {}", b);
    //三元运算符
    let x = 3;
    let number = if x > 0 { 1 } else { -1 };
    println!("number 为 {}", number);
}


~~~

### 循环
* while
* for
* loop：终止循环，并返回一个值

~~~

fn main() {
    println!("Hello, world!");
    //循环
    //while
    let mut number = 1;
    while number != 4 {
        println!("{}", number);
        number += 1;
    }
    println!("while cycle  EXIT");
    //for - 迭代器
    let a = [10, 20, 30, 40, 50];
    for i in a.iter() {
        println!("元素值为 : {}", i);
    }
    println!("for-iter cycle  EXIT");
    //for - 下标
    let b = [10, 20, 30, 40, 50];
    let mut length = b.len();
    println!("b 数组的长度是:{}", length);
    for i in 0..length {
        println!("b[{}] = {}", i, b[i]);
    }
    println!("for-index cycle  EXIT");
    //loop 终止循环，并返回一个值
    let s = ['R', 'U', 'N',  'O', 'B'];
    let mut i = 0;
    let location = loop {
        let ch = s[i];
        if ch == 'B' {
            break i;
        }
        i += 1;
    };
    println!(" \'B\' 的索引为 {}", location);
}


~~~


### 输出&输入
#### 输出

~~~

println!("print a  small =_=*");

~~~

##### 输出花括号
花括号中套花括号就可以输出花括号
示例代码：

~~~

 let mut name = String::from("cml");
    println!("输出中带花括号:{{  {}  }}", name);


~~~

以上代码输出：

~~~rust
输出中带花括号:{  cml  }
~~~

##### 输出非基础类型

~~~
  println!("输出一个结构体，a={:?}", a);
~~~

#### 输入

~~~

 let mut guess = String::new();
 io::stdin().read_line(&mut guess).expect("无法读取行");

~~~

## 所有权
所有权可以理解为命名空间+作用域+指针。

* 基本数据类型（值类型）变量在栈空间中可以复制。先给x赋值9(let x = 9)，将x赋值给y等同于直接给y赋值9（let y = x 等同于let y = 9）
* 引用类型变量在堆空间中的“值引用”可以复制，但是存储在栈空间的“值”不可复制。因此，引用类型变量仅可被消费一次
* 引用类型变量可以通过“克隆”的方式复制
* 特殊的数据类型--->类型的引用（即指针），使用 & 关键字表示
    * 指针存放在栈中，便于理解可以将指针看作“特殊的值类型”
    * 被借用的不可变变量，不可再借用给其他人
    * 指针类型的不可变变量，不可被修改
    * 值类型（基本数据类型）变量也可以使用指针，但是一般不建议这样使用

* 可变变量也可以有指针
* rust中不允许出现空指针


示例代码：

~~~rust
fn main() {
    println!("Hello, world!");
    //01.基本数据类型（值类型）变量在栈空间中可以复制。先给x赋值9(let x = 9)，将x赋值给y等同于直接给y赋值9（let y = x 等同于let y = 9）
    let x = 9;
    let y = x;
    //x is :9 , y is :9
    println!("x is :{0} , y is :{1}", x, y);
    let c1 = 'M';
    let c2 = c1;
    //c1 is :M , c2 is :M
    println!("c1 is :{0} , c2 is :{1}", c1, c2);
    //02.引用类型变量在堆空间中的“值引用”可以复制，但是存储在栈空间的“值”不可复制。因此，引用类型变量仅可被消费一次。
    let s1 = String::from("hello");
    let s2 = s1;
    //编译错误：use of moved value: `s1`
    //let s3 = s1;
    //编译错误：borrow of moved value: `s1`
    //println!("s1 is :{0} , s2 is :{1}", s1, s2);
    //03.引用类型变量可以通过“克隆”的方式复制。
    let h1 = String::from("hello");
    let h2 = h1.clone();
    let h3 = h1.clone();
    //h1 = hello, h2 = hello , h3 is :hello
    println!("h1 = {}, h2 = {} , h3 is :{}", h1, h2, h3);
    //04.特殊的数据类型--->类型的引用（即指针），使用 & 关键字表示
    let k1 = String::from("hello");
    //k1为String类型：std::String::String ; k2 为带String类型的指针类型：&std::String:String
    let k2 = &k1;
    let k3 = k2;
    //指针存放在栈中，便于理解可以将指针看作“特殊的值类型”。所以虽然k2已经赋值给了k3，任然可以赋值给k4。
    let k4 = k2;
    //k1无法赋值给k5，因为k1已经被借用了。这是出于安全考虑，试想如果多个人都可以借用k1，意味着多个人可以修改k1，那势必对正在使用它的人正在进行的工作产生影响
    // let k5 = k1;
    //编译错误：`k2` is a `&` reference, so the data it refers to cannot be borrowed as mutable
    //既然k2是指针类型，那么就不允许被修改，因为k2的“值”本身是借来的，如果修改了，那么势必对正在使用它的人正在进行的工作产生影响
    //k2.push_str("world");
    println!("k1 is {}, k2 is {}, k3 is :{} , k4 is : {}", k1, k2, k3, k4);
    //值类型（基本数据类型）变量也可以使用指针，但是一般不建议这样使用
    //n1为i32类型；n2为&i32类型
    let n1 = 8;
    let n2 = &n1;
    println!("n1 is :{} , n2 is :{}", n1, n2);
    //05.可变变量的指针。
    let mut m1 = String::from("run");
    let m2 = &mut m1;
    m2.push_str(",world");
    println!("m2 is :{}", m2);
    //编译错误：cannot borrow `m1` as immutable because it is also borrowed as mutable
    //借出去后，所有权已不在拥有，所以无法被消费
    // println!("m1 is :{} , m2 is :{}", m1, m2);
    //编译错误：cannot borrow `m2` as mutable, as it is not declared as mutable。cannot borrow as mutable
    //不可将借来的东西再借给别人
    // let m3 = &mut m2;
    //06.rust中不允许出现空指针
}


~~~


以上代码输出：

~~~rust
Hello, world!
x is :9 , y is :9
c1 is :M , c2 is :M
h1 = hello, h2 = hello , h3 is :hello
k1 is hello, k2 is hello, k3 is :hello , k4 is : hello
n1 is :8 , n2 is :8
m2 is :run,world
~~~




## 切片
切片是指向数据结构（字符串、集合）一部分内容的引用。

不愿意将rust中的切片理解为一种“类型”，实际上也不是；更不愿将rust中的切片理解为一种“集合”。暂且将切片理解成一种对象吧。例如 &s[0..5] 就是获取到了字符串  s  索引从0到5位置的元素，包含0不包含5。

rust中的切片部分主要是要理解索引和下标的概念。

示例代码：

~~~

fn main() {
    println!("Hello, world!");
    let s = String::from("hello,world.");
    //ss 的数据类型为：&str
    let ss = &s[0..5];
    println!("s is : {} , ss is : {}", s, ss);
    let arr = [1, 3, 5, 7, 9];
    //start_part 的数据类型为：&[i32]
    let start_part = &arr[0..3];
    let end_part = &arr[3..];
    let full_part = &arr[..];
    println!(
        "arr is : {:?} , start_part  is : {:?} , end_part is : {:?} , full_part is : {:?}",
        arr, start_part, end_part, full_part
    );
}


~~~

以上代码输出：

~~~rust
Hello, world!
s is : hello,world. , ss is : hello
arr is : [1, 3, 5, 7, 9] , start_part  is : [1, 3, 5] , end_part is : [7, 9] , full_part is : [1, 3, 5, 7, 9]
~~~


## 结构体
struct 类似 java 中的类，用来自定义一种数据结构，这种数据结构一般用来描述生活中的某一个对象。struct 中可以包含属性和方法。使用结构体分为两步：首先需要定义一个结构体，然后需要实例化一个结构体，再然后才可以使用。

一旦结构体实例化的时候是可变的，即使用  mut 修饰， 那么结构体中所有的属性都将是可变的。


结构体属性：
* 声明方式，属性名:数据类型；
* 即使是最后一个属性，末尾也要加英文逗号；
* 属性可以是另外一个结构体，但不能是本身；
* 属性可以是一个元组
* 属性可以是一个枚举



示例代码：

~~~

/**
 * 人
 */
#[derive(Debug)]
struct Person {
    //结构体属性：声明方式，属性名:数据类型；即使是最后一个属性，末尾也要加英文逗号；属性可以是另外一个结构体，但不能是本身；属性可以是一个元组
    active: bool,
    name: String,
    email: String,
    sign_in_count: u64,
    nation: Nation,
    parent: Parent,
    empty: Empty,
    tuple: (u32, u32),
}
/**
 * 国家结构体
 */
#[derive(Debug)]
struct Nation {
    name: String,
    area: String,
    time_zone: u64,
}
/**
 * 父母结构体
 * 特殊的结构体，元组结构体。
 */
#[derive(Debug)]
struct Parent(String, String);
/**
 * 空结构体
 */
#[derive(Debug)]
struct Empty;
fn main() {
    println!("Hello, world!");
    //实例化一个结构体
    let p1 = Person {
        active: true,
        name: String::from("cml"),
        email: String::from("cnaylor@163.com"),
        sign_in_count: 99,
        nation: Nation {
            name: String::from("xm"),
            area: String::from("north"),
            time_zone: 8,
        },
        parent: Parent(String::from("baba"), String::from("mama")),
        empty: Empty,
        tuple: (8, 8),
    };
    //实例化一个可变结构体
    let mut p2 = Person {
        active: true,
        name: String::from("cml"),
        email: String::from("cnaylor@163.com"),
        sign_in_count: 99,
        nation: Nation {
            name: String::from("xm"),
            area: String::from("north"),
            time_zone: 8,
        },
        parent: Parent(String::from("baba"), String::from("mama")),
        empty: Empty,
        tuple: (8, 8),
    };
    //给结构体实例重新赋值
    p2.email = String::from("c@163.com");
    let email = &p2.email;
    println!("p1 is : {:#?} , p2 is : {:#?} , email is :{}", p1, p2, email);
    #[derive(Debug)]
    struct User {
        active: bool,
        username: String,
        email: String,
        sign_in_count: u64,
    }
    fn build_user(email: String, username: String) -> User {
        let u = User {
            email: email,
            //简写。函数参数和结构体属性名相同，可简写
            // email,
            username,
            active: true,
            sign_in_count: 1,
        };
        //从已创建的结构体实例创建实例
        // let u2 = User { ..u };
        let u3 = User {
            email: String::from("o@163.com"),
            ..u
        };
        return u3;
    }
    let u = build_user(String::from("a@163.com"), String::from("tom"));
    println!("u is : {:?}", u);
}

~~~

以上代码输出：

~~~rust
Hello, world!
p1 is : Person {
    active: true,
    name: "cml",
    email: "cnaylor@163.com",
    sign_in_count: 99,
    nation: Nation {
        time_zone: 8,
    },
    parent: Parent(
        "baba",
        "mama",
    ),
    empty: Empty,
    tuple: (
        8,
        8,
    ),
} , email is :c@163.com
u is : User { active: true, username: "tom", email: "o@163.com", sign_in_count: 1 }
~~~



## 枚举

枚举表示某一个对象可能的值，实际使用中常用来表达：ip地址类型，订单状态，人员性别，实名认证方式等某一事物简短又不经常变化的“可选值”。

枚举成员：
* 英文逗号分割
* 可以是字符串，数字类型或者结构体。甚至可以包含另一个枚举
* 要合理使用标准库中的枚举，避免重复定义
* 可以使用match比对枚举成员，类似java中的switch-case
* 可以用 if - let ---> else 比对枚举成员

### Match

~~~rust
use std::fs::File;

fn main() {
    let f = File::open("hello.txt");
    match f {
        Ok(file) => {
            println!("File opened successfully.");
        },
        Err(err) => {
            println!("Failed to open the file.");
        }
    }
}
~~~

### If-let

~~~rust
fn main() {
    enum Book {
        Papery(u32),
        Electronic(String)
    }
    let book = Book::Electronic(String::from("url"));
    if let Book::Papery(index) = book {
        println!("Papery {}", index);
    } else {
        println!("Not papery book");
    }
}
~~~


### Option
Option 是一个标准库中的枚举，用来处理空值（null） 的情况。Option是一个泛型枚举，接受类型 T 。Option 要干的事情和java 中的 optional（java8新特性） 类似。

简言之：
* 我们在设计资源提供者时候，如果不确定资源提供者是否会输出null，那么我们可以将返回值定义为 Option<T>。若一切正常，资源消费者直接消费返回值T就行；若出了问题，资源消费者得到的返回值将为Option.None 。
* 同理，作为调用方，我们可以定义一个Option<T>的变量来接收资源提供者的输出值，而后根据返回值是否为none处理业务逻辑。


Option 源码：

~~~rust
enum Option<T> {
    Some(T),
    None,}
~~~


使用举例：

~~~

// 整数除法。
fn checked_division(dividend: i32, divisor: i32) -> Option<i32> {
    if divisor == 0 {
        // 失败表示成 `None` 取值
        None
    } else {
        // 结果 Result 被包装到 `Some` 取值中
        Some(dividend / divisor)
    }
}
// 此函数处理可能失败的除法
fn try_division(dividend: i32, divisor: i32) {
    // `Option` 值可以进行模式匹配，就和其他枚举类型一样
    let result = checked_division(dividend, divisor);
    if result!=Option::None
    {
        //获取返回值
        println!("Nice, result is :{:?}", result.unwrap());
    }
 
    match checked_division(dividend, divisor) {
        None => println!("{} / {} failed!", dividend, divisor),
        Some(quotient) => {
            println!("{} / {} = {}", dividend, divisor, quotient)
        }
    }
}
fn main() {
    try_division(4, 2);
    try_division(1, 0);
}


~~~

以上代码输出：

~~~rust
Nice, result is :2
4 / 2 = 2
1 / 0 failed!
~~~

## 集合

Rust 标准库中包含一系列被称为 集合（collections）的非常有用的数据结构。大部分其他数据类型都代表一个特定的值，不过集合可以包含多个值。不同于内建的数组和元组类型，集合指向的数据是储存在堆上的，这意味着数据的数量不必在编译时就已知，并且还可以随着程序的运行增长或缩小。

### vector容器
vector 允许我们在一个单独的数据结构中储存多个值，所有值在内存中彼此相邻排列。vector 只能储存相同类型的值。

如果借助枚举，有时候 vector 也可以变相存储不同类型的值。

示例代码：

~~~

fn main() {
    println!("Hello, world!");
    //新建一个 vector
    let mut v: Vec<i32> = Vec::new();
    let v2 = vec![1, 2, 3];
    println!("v is : {:?} , v2 is : {:?}", v, v2);
    //更新
    v.push(888);
    v.push(111);
    v.push(222);
    v.push(333);
    //删除
    v.remove(0);
    //查询
    let two = v[1];
    let two2 = &v[1];
    //get方法返回的是Option
    let three = v.get(2);
    println!("two is : {} , three is  : {:?}", two, three);
    //遍历
    let arr = vec![100, 32, 57];
    for i in &arr {
        println!("arr item for --> {}", i);
    }
    //借助枚举，vector中可以存储不同的数据类型
    let row = vec![
        SpreadsheetCell::Int(3),
        SpreadsheetCell::Text(String::from("blue")),
        SpreadsheetCell::Float(10.12),
    ];
    let  s = &row[1];
    println!("row is : {:?} , s is : {:?} ", row, s);
}
#[derive(Debug)]
enum SpreadsheetCell {
    Int(i32),
    Float(f64),
    Text(String),
}
~~~

以上代码输出：

~~~rust
Hello, world!
v is : [] , v2 is : [1, 2, 3]
two is : 222 , three is  : Some(333)
arr item for --> 100
arr item for --> 32
arr item for --> 57
row is : [Int(3), Text("blue"), Float(10.12)] , s is : Text("blue")
~~~

### String
你没有看错，rust 中，字符串也是集合，是什么集合呢？ 是“字符”的集合。注意：上面提到过字符是 rust 的基础标量类型，但是字符串不是标量类型，而是集合类型。

* 字符串是UTF-8编码，中文不会乱码，一个英文字符占1字节，一个汉字占2字节。
* 字符串底层实际是一个结构体，数据存储在结构体中的 Vec （vector容器）里面 。
* rust中不建议用下标访问字符串元素：rust中的字符串大部分时候和 java 中的不太一样，相比较而言更低级（对部分使用者来说），但是rust中的字符串更能真实的反应文字本来的样子。

更新字符串的方式：
* push_str
* push
* 加号
* format!


示例代码：

~~~rust

fn main() {
    println!("Hello, world!");
    //创建
    let mut s = String::new();
    let data = "initial contents";
    let ss = data.to_string();
    let sss = String::from("你好！");
    println!("s is : {} , ss is  : {} , sss is  : {}", s, ss, sss);
    //更新
    let mut word = String::from("Aa");
    word.push_str("Bb");
    word.push('C');
    word += "cDd";
    word = format!("{}{}-{}", word, "Ee", "Ff");
    println!("final  word is : {} ", word);
    //不要使用下标访问
    let p = String::from("hello");
    let p1 = &p[0..3];
    let k = String::from("你好我是陈明亮");
    let k1 = &k[0..3];
    //输出结果可能不是大多数人预期：p1 is : hel , k1 is : 你
    println!("p1 is : {} , k1 is : {}", p1, k1);
    //遍历
    word+="北京";
    for i in word.chars() {
        println!("word ---> item is :{}", i);
    }
}
~~~

以上代码输出：

~~~

Hello, world!
s is :  , ss is  : initial contents , sss is  : 你好！
final  word is : AaBbCcDdEe-Ff
p1 is : hel , k1 is : 你
word ---> item is :A
word ---> item is :a
word ---> item is :B
word ---> item is :b
word ---> item is :C
word ---> item is :c
word ---> item is :D
word ---> item is :d
word ---> item is :E
word ---> item is :e
word ---> item is :-
word ---> item is :F
word ---> item is :f
word ---> item is :b
word ---> item is :C
word ---> item is :c
word ---> item is :D
word ---> item is :d
word ---> item is :E
word ---> item is :e
word ---> item is :-
word ---> item is :F
word ---> item is :f
word ---> item is :北
word ---> item is :京

~~~




## 代码组织
讲道理，rust 中的代码组织相比 java 、CSharp 这些所谓高级语言，要复杂的多。大概包含两个部分：命名空间和访问权限。

### 命名空间
rust 中针对包管理主要有三个概念：包（package），箱（crate），模块（module）。三个概念形成一个树状结构，包中包含箱，箱中包含模块。
* 包：cargo new 出来的工程就是一个包，包中包含箱。一个包会包含有一个 Cargo.toml 文件，阐述如何去构建里面的 crate
* 箱：箱是二进制程序文件或者库文件，箱中包含模块。在 https://crates.io 这个网站中有很多别人开发好的箱，我们可以通过引入这些箱提升我们的开发效率。
* 模块：基于业务功能的实现和代码组织的考量，我们将功能相似或共同完成一个功能的代码分到一个组里面，这个组就是模块了，一个箱中往往包含多个模块。当然，模块中可以包含子模块。

### 访问其他mod和crate

#### 访问权限和关键字
Rust 中默认所有项（函数、方法、结构体、枚举、模块和常量）都是私有的。父模块中的项不能使用子模块中的私有项，但是子模块中的项可以使用他们父模块中的项。

关键字：
* pub：添加 pub 访问修饰符的项将被公开，所有人可以访问
* use：将其他命名空间引入当前作用域
* as ：使用 as 可将use进来的命名空间取一个别名，一般用来解决当两个需 use 对象的名称相同时候区分他们
* mod ：定义一个 module 或者导入一个 module。

#### 访问其他文件中的对象

* 一个文件默认就是 module ，所以 other_rs_file.rs 就是一个名为 other_rs_file 的 module
* main.rs 中如果要使用 other_rs_file 中的对象需要先导入这个 module： mod other_rs_file ，使用 mod::对象名   访问其中对象
* 如果 other_rs_file.rs 中定义了子 module ， main.rs 仅需导入顶层 module （即  mod other_rs_file） ，使用 mod::子mod::对象名 访问其中对象

* rust 默认将rs文件识别为一个 module 处理， 但是无法将文件夹识别为一个  module ，所以如果我们要访问entity文件夹中dept.rs文件中的对象，需要在entiry文件夹中新增一个mod.rs 并在其中定义 dept module ，访问其中对象的时候同样仅需导入顶层 mod ，然后通过 entity::dept::Dept 方式访问 dept 对象。

工程目录文件结构：

~~~
│  main.rs
│  other_rs_file.rs
└─entity
        dept.rs
        mod.rs
~~~

示例代码：
other_rs_file.rs：
~~~rust

pub mod other {
    #[derive(Debug)]
    pub struct User {
        //结构体属性默认是私有的，若外部需要访问需添加pub关键字
        pub name: String,
        pub age: i32,
    }
    fn init_user(n: String) -> User {
        let u = User {
            name: String::from(n),
            age: 100,
        };
        return u;
    }
    pub fn add_user(n: String, a: i32) -> bool {
        return false;
    }
    //枚举不用给元素添加 pub ，只要枚举是公开的，里面元素就是公开的
    #[derive(Debug)]
    pub enum IpAddrKind {
        IPV4,
        IPV6,
    }
}
~~~

dept.rs：

~~~rust
#[derive(Debug)]
pub struct Dept {
    pub name: String,
    pub no: i32,
}
~~~

mod.rs：

~~~rust
pub mod dept;
~~~


main.rs：

~~~rust

mod other_rs_file;
mod  entity;
fn main() {
    println!("Hello, world!");
    /*
     * main.rs 同级 rs文件
     * 引入其他rs文件，需先导入module ，通过mod名称（即文件名称）::对象名称 访问其内部对象
     * 如果在其他文件内部定义了子 module ， 导入方式不变，访问方式：mod名称::子mod名称::对象名称
     * 导入时候只导入顶层mod
     */
    let u = other_rs_file::other::User {
        name: String::from("cml"),
        age: 9,
    };
    println!("实例化另外一个rs文件中定义的结构体，u is： {:?}", u);
    /*
    * main.rs 上级文件夹 rs 文件
    * rust 默认将rs文件识别为一个 module 处理， 但是无法将文件夹识别为一个  module ，所以如果我们要访问entity文件夹中dept.rs文件中的对象，需要在entiry文件夹中新增一个mod.rs 并在其中定义 dept module。
    */
    let d=entity::dept::Dept{
        name:String::from("技术部门"),
        no:5,
    };
   
    println!("实例化另外一个rs文件中定义的结构体，d is： {:?}", d);
}
~~~

main输出：

~~~
Hello, world!
实例化另外一个rs文件中定义的结构体，u is： User { name: "cml", age: 9 }
实例化另外一个rs文件中定义的结构体，d is： Dept { name: "技术部门", no: 5 }
~~~

### 使用第三方库

* 使用 use 导入其他的 crate
* 默认的 crate 源是 crate.io 这个网站
* 导入其他 crate 需要在 Cargo.toml 中定义相关 dependencies。标准库除外，标准库中的 crate 可以直接导入使用
*  使用花括号导入一个 crate 下多个 module ：use std::{self,io,cmp::Ordering}
*  使用 * 号导入一个 crate 下所有 module：use std::*;

示例代码：
Cargo.toml：

~~~yaml
[package]
name = "Crate"
version = "0.1.0"
edition = "2021"


[dependencies]
rand = "0.5.5"
~~~

main.rs：

~~~rust
/*
 * 导入标准库
 */
use std::fmt::Result as FmtResult;
use std::io::Result as IoResult;
// use std::cmp::Ordering
use std::*;
use std::{self, cmp::Ordering, io};
/*
 * 导入外部第三方库
 */
use rand::{thread_rng, Rng};
fn main() {
    println!("Hello, world!");
    let fmtr = FmtResult::Ok;
    let ior = IoResult::Ok("成功");
    println!("fmtr 无法打印 , ior is : {:?}", ior);
    //生成随机数
    let mut rng = thread_rng();
    let x: u32 = rng.gen();
    println!("x is :{}", x);
}
~~~



## 异常处理
* rust中的异常不叫 exception ， 而是叫做 panic （恐慌），意思是编译器执行到这里的代码害怕了，不敢继续执行了，就恐慌了，相当于程序就终止了。
* rust官方对于错误处理有两个类别：可恢复错误（如打开文件失败算是一个错误，但是这种错误可以重试）；不可恢复错误（如索引越界，这就是实打实的bug了，程序将崩溃）
* 对于不可恢复的错误，官方的做法是提供一个Result<T, E> 枚举类来处理，如 std::fs::File--->Result 。若程序运行成功返回 Ok(T) ，即响应结果，若程序运行出现错误返回 Err(E) ，即错误信息。


工程结构：

~~~
│  Cargo.lock
│  Cargo.toml
│  hello.txt
├─src
│      main.rs
~~~

示例代码：

~~~rust
use std::fs;
use std::fs::File;
use std::io;
use std::io::Read;

fn main() {
    println!("Hello, world!");

    let mut f = File::open("hello.txt");
    match f {
        Ok(file) => {
            println!("File opened successfully.");
        }
        Err(err) => {
            //打开失败
            println!("Failed to open the file.");
            match err.kind() {
                //打开失败原因，不存在情况创建
                io::ErrorKind::NotFound => {
                    println!("File Not Found. soon create . ");
                    File::create("hello.txt");
                    fs::write("hello.txt", "I am  hello.txt");
                }
                _ => {
                    //其他原因直接抛 panic
                    panic!("Failed to open the file.");
                }
            }
        }
    }

    //打印 txt内容
    let mut file = std::fs::File::open("hello.txt").unwrap();
    let mut contents = String::new();
    file.read_to_string(&mut contents).unwrap();
    print!("txt 的内容是：{}", contents);
}

~~~


以上代码输出：

~~~rust
Hello, world!
Failed to open the file.
File Not Found. soon create .
txt 的内容是：I am  hello.txt
~~~













## 泛型
### 泛型概念
泛型这种编程语言得设计绝非 rust 独有的，实际上在C# ， Java 这些语言中早就引入了泛型的设计思想。泛型即类型的泛化，在编写代码的时候并不知道具体的数据类型或者数据结构是什么样子的，而是定义一个标识，在运行时此标识可动态替换为实际的数据类型。很显然这种设计能够让开发人员避免编写很多相似的重复的代码。

在 rust 中，可以在如下位置编写泛型代码：
* 泛型函数
* 泛型结构体
* 泛型枚举

示例代码：

~~~rust

fn main() {
    println!("Hello, world!-->泛型");
    /*
     * 泛型函数
     */
    let a = [2, 4, 6, 3, 1];
    println!("数字数组中最大元素是 = {}", max(&a));
    let b = ["A", "B", "C"];
    println!("字符数组中最大元素是 = {}", max(&b));
    /*
     * 泛型结构体
     */
    // i32
    let p1 = Point { x: 1, y: 2 };
    //f64
    let p2 = Point { x: 1.0, y: 2.0 };
    println!("p1  ={:?} , p2 = {:?}", p1, p2);
}
//求最大元素
fn max<T: std::cmp::PartialOrd>(array: &[T]) -> &T {
    let mut max_index = 0;
    let mut i = 1;
    while i < array.len() {
        if array[i] > array[max_index] {
            max_index = i;
        }
        i += 1;
    }
    return &array[max_index];
}
//泛型结构体
#[derive(Debug)]
struct Point<T> {
    x: T,
    y: T,
}


~~~



以上代码输出：

~~~
Hello, world!-->泛型
数字数组中最大元素是 = 6
字符数组中最大元素是 = C
p1  =Point { x: 1, y: 2 } , p2 = Point { x: 1.0, y: 2.0 }
~~~




## 特性（接口）
特性（trait）概念接近于 Java 中的接口（Interface），但两者不完全相同。特性与接口相同的地方在于它们都是一种行为规范，可以用于标识哪些类有哪些方法


一个对象的行为由其可供调用的方法构成。如果可以对不同类型调用相同的方法的话，这些类型就可以共享相同的行为了。trait 定义是一种将方法签名组合起来的方法，目的是定义一个实现某些目的所必需的行为的集合。


* 一个结构体可以同时实现多个接口，但是一个结构体的继承者类（即 impl ， rust 中实现类无自己的类名）仅可实现一个接口
* trait 接口可以有默认实现方法，这个就和java8一样，接口可以有默认的已实现方法


示例代码：

~~~rust

use std::time::{SystemTime, UNIX_EPOCH};
fn main() {
    println!("Hello, world!--->特性（接口）");
    //实例化Person
    let p = Person {
        name: String::from("cml"),
        age: 100,
    };
    let d = p.describe();
    println!("d = {}", d);
    let s = p.tostring();
    println!("s={}", s);
    let t = p.nowTime();
    println!("t ={:?}", t);
}
//定义一个描述接口
trait Descriptive {
    fn describe(&self) -> String;
    //接口默认方法
    fn nowTime(&self) -> SystemTime {
        let start = SystemTime::now();
        return start;
    }
}
//定义一个 tostring 接口
trait ToString {
    fn tostring(&self) -> String;
}
//定义一个结构体
#[derive(Debug)]
struct Person {
    name: String,
    age: u8,
}
//结构体的一个继承类实现了 Descriptive 接口
impl Descriptive for Person {
    fn describe(&self) -> String {
        format!(
            "I am   Person , name is : {} , age is : {}",
            self.name, self.age
        )
    }
}
impl ToString for Person {
    fn tostring(&self) -> String {
        format!("Person:{{name:{},age:{}}}", self.name, self.age)
    }
}
~~~

以上代码输出：

~~~
Hello, world!--->特性（接口）
d = I am   Person , name is : cml , age is : 100
s=Person:{name:cml,age:100}
t =SystemTime { intervals: 132914629768805244 }
~~~



## 文件和IO
rust 标准库中的 std::fs 可以用来操作文件

示例代码：

~~~rust

use std::fs;
use std::fs::OpenOptions;
use std::io::prelude::*;
fn main() {
    println!("Hello, world!--->文件io");
    //读取文件内容，一次性读取
    //文件内容：This is a text file.
    let text = fs::read_to_string("text.txt").unwrap();
    println!("txt文件的内容是：{}", text);
    //写入文件，追加
    //追加完成文件内容：
    append();
    println!("追加后，txt文件的内容是：{}", text);
    //写入文件，会覆盖
    //覆盖之后文件内容：
    fs::write("text.txt", "FROM RUST PROGRAM").unwrap();
    println!("覆盖写入后，txt文件的内容是：{}", text);
}
//追加
fn append() -> std::io::Result<()> {
    let mut file = OpenOptions::new().append(true).open("text.txt")?;
    file.write(b" APPEND WORD")?;
    Ok(())
}
~~~

以上代码输出：

~~~
Hello, world!--->文件io
txt文件的内容是：This is a text file.
追加后，txt文件的内容是：This is a text file.
覆盖写入后，txt文件的内容是：This is a text file.
~~~


## 面向对象
面向对象编程（OOP）思想是一个概念，是一种思想指导，围绕“对象”展开，从万物皆是对象的角度出发，一个 crate ， 一个 module ，一个 struct ，一个枚举等等都是一个个独立的对象，能自主表达一个事物、某种特征。而运用封装、继承、多态等手段可以让对象与对象之间产生某种联系，进而表达更多的事物，解决更多的问题。

面向对象思想是构建大型应用软件系统的基石。

rust 语言中 可以通过 结构体，枚举，特性（trait）等来实现oop思想。



## 并发编程
rust 中的并发编程主要得益与 线程 、 消息传递和互斥锁。
Rust 语言是满足多线程特性的，所以 rust 可以满足 主-->子 多任务应用场景。

消息传递有点类似与消息队列，但消息队列一般跨进程或线程，而 rust 中的消息传递主要是主子线程中数据的传递。


### 线程

* rust 标准库  std::thread 中的 spawn 函数用来创建一个新的线程
* 通过在主线程中 join 子线程，让主线程阻塞，确保所有子线程执行完毕再继续执行子线程。这种情况在实际开发中非常常见，比如在获取用户个人中心信息接口中，我们将获取基本信息、订单信息、积分信息、用户消息信息分别放在4个子线程中并发执行，在主线程中等待所有子线程都响应了再将结果汇总返回给调用方。

示例代码：

~~~rust

use std::thread;
use std::time::Duration;
fn main() {
    println!("[主线程] Hello, world!--->线程");
    //创建子线程
    for item in 0..5 {
        println!("[主线程] 即将创建一个子线程，当前循环变量:{}", item);
        let child_thread = thread::spawn(|| {
            for i in 0..2 {
                println!("[子线程] hi number {} from the spawned thread!", i);
                thread::sleep(Duration::from_millis(1));
            }
        });
    }
    for i in 0..3 {
        println!("[主线程] hi number {} from the main thread!", i);
        thread::sleep(Duration::from_millis(1));
    }
    //线程join
    let child1 = thread::spawn(|| {
        println!("[child-1]hi I am spawned thread!");
        thread::sleep(Duration::from_millis(1));
    });
    let child2 = thread::spawn(|| {
        println!("[child-2]hi I am spawned thread!");
        thread::sleep(Duration::from_millis(1));
    });
    child1.join().unwrap();
    child2.join().unwrap();
    println!("[main]hi I am main thread!");
}
~~~

以上代码输出：

~~~bash
[主线程] Hello, world!--->线程
[主线程] 即将创建一个子线程，当前循环变量:0
[主线程] 即将创建一个子线程，当前循环变量:1
[子线程] hi number 0 from the spawned thread!
[主线程] 即将创建一个子线程，当前循环变量:2
[子线程] hi number 0 from the spawned thread!
[主线程] 即将创建一个子线程，当前循环变量:3
[子线程] hi number 0 from the spawned thread!
[主线程] 即将创建一个子线程，当前循环变量:4
[子线程] hi number 0 from the spawned thread!
[主线程] hi number 0 from the main thread!
[子线程] hi number 0 from the spawned thread!
[子线程] hi number 1 from the spawned thread!
[子线程] hi number 1 from the spawned thread!
[子线程] hi number 1 from the spawned thread!
[子线程] hi number 1 from the spawned thread!
[主线程] hi number 1 from the main thread!
[子线程] hi number 1 from the spawned thread!
[主线程] hi number 2 from the main thread!
[child-1]hi I am spawned thread!
[child-2]hi I am spawned thread!
[main]hi I am main thread!
~~~

### 消息传递

以下示例演示了子线程获得了主线程的发送者 tx，并调用了它的 send 方法发送数据，然后主线程就通过对应的接收者 rx 接收到了发送的数据。

无法在子线程中发送而在另外一个子线程中接收

示例代码：

~~~rust
use std::sync::mpsc;
use std::thread;
fn main() {
    println!("Hello, world!--->消息传递");
    let p1 = Person {
        active: true,
        name: String::from("cml"),
        email: String::from("cnaylor@163.com"),
        sign_in_count: 99,
        tuple: (8, 8),
    };
    let (tx, rx) = mpsc::channel();
    thread::spawn(move || {
        tx.send(p1).unwrap();
    });
    let received = rx.recv().unwrap();
    println!("Got: {:?}", received);
}
#[derive(Debug)]
struct Person {
    active: bool,
    name: String,
    email: String,
    sign_in_count: u64,
    tuple: (u32, u32),
}
~~~

以上代码输出：

~~~rust
Hello, world!--->消息传递
Got: Person { active: true, name: "cml", email: "cnaylor@163.com", sign_in_count: 99, tuple: (8, 8) }
~~~


### 互斥锁

互斥锁（mutex）是 mutual exclusion 的缩写，也就是说，任意时刻，其只允许一个线程访问某些数据。为了访问互斥器中的数据，线程首先需要通过获取互斥器的 锁（lock）来表明其希望访问数据。锁是一个作为互斥器一部分的数据结构，它记录谁有数据的排他访问权。因此，我们描述互斥器为通过锁系统 保护（guarding）其数据。

以下示例演示了在主线程中创建一个值，并在多个子线程中修改此值，最终等所有子线程处理完毕，主线程打印最终值。为了让变量能够跨线程之间共享，引入了std::sync::Arc 这个结构体。

示例代码：

~~~rust

use std::sync::{Arc, Mutex};
use std::thread;
fn main() {
    println!("Hello, world!--->互斥锁");
    //Arc 原子引用计数器，确保在多个线程中共享数据；counter初始值为0    
    let counter = Arc::new(Mutex::new(0));
    println!("counter 初始值为：0");
    //定义一个子线程集合
    let mut handles = vec![];
    for _ in 0..10 {
        //将counter值从主线程中克隆，并赋值给私有变量 counter
        let counter = Arc::clone(&counter);
        let handle = thread::spawn(move || {
            //获取互斥锁，并将counter值加一
            let mut num = counter.lock().unwrap();
            *num += 1;
            let thread_id = thread::current().id();
            println!("[子线程：{:?}]中将 counter 的值修改为：{}", thread_id, num);
        });
        //将创建的子线程存储到子线程集合中
        handles.push(handle);
    }
    //将所有的子线程join到主线程，确保主线程等待所有子线程执行成功
    for handle in handles {
        handle.join().unwrap();
    }
    let result = *counter.lock().unwrap();
    println!("Result: {}", result);
}

~~~

以上代码输出：

~~~bash
Hello, world!--->互斥锁
counter 初始值为：0
[子线程：ThreadId(2)]中将 counter 的值修改为：1
[子线程：ThreadId(4)]中将 counter 的值修改为：2
[子线程：ThreadId(3)]中将 counter 的值修改为：3
[子线程：ThreadId(5)]中将 counter 的值修改为：4
[子线程：ThreadId(8)]中将 counter 的值修改为：5
[子线程：ThreadId(6)]中将 counter 的值修改为：6
[子线程：ThreadId(7)]中将 counter 的值修改为：7
[子线程：ThreadId(9)]中将 counter 的值修改为：8
[子线程：ThreadId(10)]中将 counter 的值修改为：9
[子线程：ThreadId(11)]中将 counter 的值修改为：10
Result: 10
~~~

## 代码
本文示例代码维护在gitee上面：https://gitee.com/naylor_personal/rust-hello-world

**打开代码仓库中的 Sport 文件夹，有惊喜！！！** 

## 说明
* 勘误：本文篇幅较长、涉及内容较多，若阅读过程种发现错误，欢迎批评指正
* 目的：本文绝非传统意义上面的技术博文，仅作为学习rust的笔记，或者说是学习rust的一个教程。文中涵盖rust大部分基础知识，在实际开发过程中可以作为手册翻阅
* 心得：本文主要使用下班和周末时间断断续续编写，历时超过一个月。纵观整个过程，开头和结尾是喜悦的，中间的过程是相当的枯燥。开头为即将掌握一门新语言的 hello，world 编写方式而感到兴奋。结束后回顾了整个过程，发现除了学会了rust 的hello,world 之外，其实也同步回顾了一些已经使用过的其他语言的基础知识，尤其是java。中间过程是对未知事物的探索和对自我理解的求证，简单来说就是先得想办法索取rust中有哪些内容，然后形成自己的理解，最后在整理文章和编写示例代码的时候不断推导和验证自己的理解是否正确。


## 引用
* 文章来源及Demo：https://gitee.com/naylor_personal/rust-hello-world
* 下载：https://www.rust-lang.org/zh-CN/tools/install
* B站教程：https://www.bilibili.com/video/BV1hp4y1k7SV?spm_id_from=333.999.0.0
* runoob教程：https://www.runoob.com/rust/rust-tutorial.html
* Rust程序设计中文版：https://rust.bootcss.com/title-page.html
* https://kaisery.github.io/trpl-zh-cn/
* create：https://crates.io/
```