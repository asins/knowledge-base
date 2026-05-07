Rust 的标准库中提供了基本的数据结构，向量（`Vec<T>`）、哈希映射（`HashMap<K, V>`）、和集合（`HashSet<T>`），Rust 标准库提供的这三种数据结构是在大多数编程场景中最常用且最有用的数据结构。它们的设计和提供符合 Rust 的目标，即提供安全、并发、实用的编程语言工具。这三种数据结构能够覆盖大部分数据存储和访问的需求，同时保持了 Rust 标准库的轻量级和高效性。

## 向量（`Vec<T>`）

向量是 Rust 中最常用的动态数组实现。它提供了快速的索引访问、动态增长和缩小的特性。向量在内存中连续存储元素，使得遍历元素非常高效，因为它利用了现代 CPU 的缓存机制。

```rust
fn main() {
    // 创建一个空的向量
    let mut numbers: Vec<i32> = Vec::new();

    // 使用宏创建并初始化向量
    let mut names = vec!["Alice", "Bob", "Carol"];

    // 向向量中添加元素
    numbers.push(1);
    numbers.push(2);
    numbers.push(3);

    // 从向量中移除元素
    numbers.pop(); // 移除并返回最后一个元素

    // 访问向量中的元素
    if let Some(first_name) = names.get(0) {
        println!("The first name is: {}", first_name);
    }

    // 遍历向量中的元素
    for name in &names {
        println!("{}", name);
    }

    // 修改向量中的元素
    if let Some(first_name) = names.get_mut(0) {
        *first_name = "Dave";
    }

    // 使用迭代器处理向量中的元素
    let numbers_squared: Vec<i32> = numbers.iter().map(|&x| x * x).collect();
    println!("Squared numbers: {:?}", numbers_squared);

    // 使用扩展方法扩充向量
    numbers.extend([4, 5, 6].iter().copied());

    // 直接访问向量的索引
    println!("Second name: {}", names[1]); // 注意：直接索引访问可能会panic
}
```

向量是处理一系列同类型元素时的理想选择，无论是字符串、整数还是自定义类型。使用向量可以轻松实现元素的添加、删除和随机访问。

## 哈希映射（`HashMap<K, V>`）

哈希映射提供了基于键值对的存储，使用哈希表实现。它支持快速查找、插入和删除操作，是实现高效数据检索和管理的关键数据结构。

```rust
use std::collections::HashMap;

fn main() {
    // 创建一个空的哈希映射
    let mut book_reviews: HashMap<String, String> = HashMap::new();

    // 向哈希映射中添加元素
    book_reviews.insert("The Hobbit".to_string(), "Excellent fantasy book".to_string());
    book_reviews.insert("The Catcher in the Rye".to_string(), "Classic novel".to_string());

    // 访问哈希映射中的元素
    if let Some(review) = book_reviews.get("The Hobbit") {
        println!("Review of The Hobbit: {}", review);
    }

    // 移除哈希映射中的元素
    book_reviews.remove("The Catcher in the Rye");

    // 遍历哈希映射
    for (book, review) in &book_reviews {
        println!("{}: {}", book, review);
    }

    // 更新哈希映射中的元素
    book_reviews.entry("The Hobbit".to_string()).or_insert("No review found".to_string());
    book_reviews.entry("1984".to_string()).or_insert("Distopian science fiction".to_string());

 

    let mut scores = HashMap::new();
    
    // 使用 insert 直接插入
    scores.insert("Blue", 10);
    scores.insert("Blue", 25); // 直接覆盖旧值
    
    // 使用 entry 更新或插入
    scores.entry("Yellow").or_insert(50); // 插入，因为 "Yellow" 不存在
    scores.entry("Blue").or_insert(50); // 不做任何操作，因为 "Blue" 已存在
    
    // 结果是 {"Blue": 25, "Yellow": 50}

    // 检查是否包含键
    if book_reviews.contains_key("1984") {
        println!("Review for 1984 is available.");
    }
}
```

哈希映射适用于需要快速根据键访问数据的场景，如数据库索引、缓存实现等。它通过提供灵活的键值关联，使得数据的组织和检索变得简单高效。

## 集合（`HashSet<T>`）

集合是一个无序集合，用于存储唯一的元素。它内部通过哈希表实现，提供了快速的查找、插入和删除操作。

```rust
use std::collections::HashSet;

fn main() {
    // 创建一个空的集合
    let mut numbers = HashSet::new();

    // 向集合中添加元素
    numbers.insert(1);
    numbers.insert(2);
    numbers.insert(3);

    // 从集合中移除元素
    numbers.remove(&3);

    // 检查元素是否在集合中
    if numbers.contains(&1) {
        println!("1 is in the set");
    }

    // 遍历集合中的元素
    for number in &numbers {
        println!("{}", number);
    }

    // 使用集合操作：并集、交集、差集、对称差集
 
    // 此时，numbers 包含 {1, 2}

    let other_numbers = [2, 3, 4].iter().cloned().collect::<HashSet<_>>();
    // other_numbers 包含 {2, 3, 4}

    let union = numbers.union(&other_numbers).cloned().collect::<HashSet<_>>();
    println!("Union: {:?}", union);
    // 并集（Union） ：`union` 方法返回两个集合所有唯一元素的集合，
    因此 `{1, 2}` 和 `{2, 3, 4}` 的并集是 `{1, 2, 3, 4}`。
    
    let intersection = numbers.intersection(&other_numbers).cloned().collect::<HashSet<_>>();
    println!("Intersection: {:?}", intersection); //  交集（Intersection）  ：`intersection` 方法返回两个集合共有的元素，
    因此 `{1, 2}` 和 `{2, 3, 4}` 的交集是 `{2}`。

    let difference = numbers.difference(&other_numbers).cloned().collect::<HashSet<_>>();
    println!("Difference: {:?}", difference); 
    //  差集（Difference）  ：`difference` 方法返回第一个集合中独有的元素，
    所以 `{1, 2}` 对 `{2, 3, 4}` 的差集是 `{1}`。

    let symmetric_difference = numbers.symmetric_difference(&other_numbers).cloned().collect::<HashSet<_>>();
    println!("Symmetric Difference: {:?}", symmetric_difference); 
    // 对称差集（Symmetric Difference）  ：`symmetric_difference` 方法返回两个集合中不重叠的元素，
    因此 `{1, 2}` 和 `{2, 3, 4}` 的对称差集是 `{1, 3, 4}`。
}
```

集合主要用于处理不允许重复元素的数据集，如用户ID列表、特定条件下的记录等。集合的操作包括并集、交集、差集等，这些都是处理集合数据时非常有用的工具。

## 双向链表（`LinkedList<T>`）

`LinkedList<T>` 是 Rust 标准库中提供的一个双向链表。与向量（`Vec<T>`）相比，链表允许高效的元素插入和删除操作，尤其是在列表的开头或结尾，但它在随机访问方面性能较差。

```rust
use std::collections::LinkedList;

fn main() {
    // 创建一个新的空链表
    let mut list: LinkedList<i32> = LinkedList::new();

    // 向链表尾部添加元素
    list.push_back(1);
    list.push_back(2);

    // 向链表头部添加元素
    list.push_front(0);

    // 弹出链表头部和尾部的元素
    assert_eq!(list.pop_front(), Some(0));
    assert_eq!(list.pop_back(), Some(2));

    // 遍历链表
    for elem in list.iter() {
        println!("{}", elem);
    }

    // 修改链表中的元素（需要使用迭代器）
    let mut iter_mut = list.iter_mut();
    if let Some(first_elem) = iter_mut.next() {
        *first_elem = 3;
    }

    // 打印修改后的链表
    println!("Modified list: {:?}", list);
}
```

- 当你需要频繁地在列表的开头或结尾添加或删除元素时，`LinkedList` 是一个好选择，因为这些操作的时间复杂度为 O(1)。
- 如果你的应用场景中几乎不需要随机访问列表中的元素，而是更多地进行遍历，那么使用链表可能比使用向量更合适。

## B树映射（`BTreeMap<T>`）

`BTreeMap<K, V>` 是基于B树实现的一个键值对集合，它保持键以排序的状态。与哈希映射（`HashMap<K, V>`）相比，`BTreeMap` 在键的有序性方面提供了优势，特别是当需要范围查找或有序遍历时。

```rust
use std::collections::BTreeMap;

fn main() {
    // 创建一个新的空 BTreeMap
    let mut map: BTreeMap<String, i32> = BTreeMap::new();

    // 向 BTreeMap 中添加键值对
    map.insert("apple".to_string(), 3);
    map.insert("banana".to_string(), 2);
    map.insert("pear".to_string(), 4);

    // 获取键对应的值
    if let Some(v) = map.get("apple") {
        println!("apple: {}", v);
    }

    // 移除一个键值对
    map.remove("banana");

    // 遍历 BTreeMap
    for (key, value) in &map {
        println!("{}: {}", key, value);
    }

    // 范围查询：获取所有键大于等于 "apple" 且小于 "pear" 的键值对
    let range = map.range("apple".to_string()..="pear".to_string());
    for (key, value) in range {
        println!("Range query: {}: {}", key, value);
    }
}
```

当你需要一个自动排序的映射时，`BTreeMap` 是一个好选择。这对于范围查询或有序遍历尤其有用。

如果你的程序需要频繁地进行查找、插入和删除操作，并且这些操作的键是可比较排序的，那么 `BTreeMap` 可能比 `HashMap` 更合适，因为它能保持键的有序状态，便于范围查找和有序遍历。

## B树集合`BTreeSet<T>`

`BTreeSet<T>` 是基于 B-树实现的集合，它存储唯一元素并自动保持元素的排序。与 `HashSet<T>` 相比，`BTreeSet` 提供了基于顺序的操作和范围查询的能力，但可能在某些操作上比基于哈希的集合更慢。

```rust
use std::collections::BTreeSet;

fn main() {
    // 创建一个新的空 BTreeSet
    let mut set: BTreeSet<i32> = BTreeSet::new();

    // 向集合中添加元素
    set.insert(12);
    set.insert(5);
    set.insert(18);

    // 检查元素是否存在
    if set.contains(&12) {
        println!("Set contains 12");
    }

    // 移除元素
    set.remove(&5);

    // 遍历集合（元素将按升序遍历）
    for num in &set {
        println!("{}", num);
    }

    // 范围查询：获取所有大于等于 10 且小于 20 的元素
    for num in set.range(10..20) {
        println!("Range query: {}", num);
    }
}
```

- 当你需要一个有序集合，以便进行快速查找、范围查询或有序遍历时，`BTreeSet` 是一个很好的选择。
- 适用于需要存储唯一元素且元素之间有可比较关系的场景。

## 二叉堆`BinaryHeap<T>`

`BinaryHeap<T>` 是一个优先队列的实现，它是基于二叉堆的集合，可以快速地插入元素和移除最大元素（或最小元素，取决于是最大堆还是最小堆）。在 Rust 的标准库中，`BinaryHeap` 默认是一个最大堆。

```rust
use std::collections::BinaryHeap;

fn main() {
    // 创建一个新的空 BinaryHeap
    let mut heap = BinaryHeap::new();

    // 向堆中添加元素
    heap.push(1);
    heap.push(5);
    heap.push(2);

    // 查看堆中的最大元素（不移除）
    if let Some(max) = heap.peek() {
        println!("Max element: {}", max);
    }

    // 移除并返回堆中的最大元素
    println!("Removed max element: {}", heap.pop().unwrap());

    // 遍历堆（遍历的顺序不是有序的）
    for num in &heap {
        println!("{}", num);
    }
}
```

- 当需要快速访问并移除最大（或最小）元素的数据结构时，`BinaryHeap` 是一个理想的选择，例如在实现某些算法（如 Dijkstra 的最短路径算法）时。
- 适用于任务调度、贪心算法或任何需要优先队列的场景。



作者：Pomelo_刘金
链接：https://juejin.cn/post/7337227407366242331
来源：稀土掘金