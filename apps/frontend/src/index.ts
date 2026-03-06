const cehis = '123';

console.log(cehis);

/**
 * 位运算标识符
 * 每个标志位表示一个状态，通过位运算可以组合多个状态
 *
 * 每个标志位的含义：
 * - ACTIVE: 表示 effect 是否是活跃的
 * - RUNNING: 表示 effect 是否正在运行
 * - TRACKING: 表示 effect 是否正在跟踪依赖
 * - NOTIFIED: 表示 effect 是否已经被通知过
 * - DIRTY: 表示 effect 是否是脏的，需要重新运行
 * - ALLOW_RECURSE: 表示 effect 是否允许递归调用
 * - PAUSED: 表示 effect 是否被暂停
 * - EVALUATED: 表示 effect 是否已经被评估过
 */

// 让我解释一下为什么在 Vue 的响应式系统中使用位标志（Bit Flags）：

// 1. 1.
//    内存效率高

//    - 用一个整数就能存储多个布尔状态
//    - 比如 EffectFlags 用一个数字就存储了 8 个不同的状态
//    - 如果用 8 个独立的布尔变量，会占用更多内存
// 2. 2.
//    性能优势

//    - 位运算非常快，是 CPU 的基础操作
//    - 检查状态： if (flags & EffectFlags.PAUSED)
//    - 设置状态： flags |= EffectFlags.PAUSED
//    - 清除状态： flags &= ~EffectFlags.PAUSED
//    - 这些操作都是常量时间复杂度
// 3. 3.
//    原子性操作

//    - 可以一次性修改多个状态
//    - 例如： flags |= (EffectFlags.ACTIVE | EffectFlags.TRACKING)
//    - 避免了多次赋值带来的性能开销
// 4. 4.
//    代码简洁性

//    - 状态判断和修改的代码更简洁
//    - 不需要写很多 if/else 来处理各种状态组合
//    - 维护起来更容易，不容易出错
// 5. 5.
//    在响应式系统中的重要性

//    - Vue 的响应式系统需要频繁地检查和更新各种状态
//    - 效果（Effect）的状态变化非常频繁
//    - 使用位标志能显著提升性能

enum EffectFlags {
  ACTIVE = 1 << 0,
  RUNNING = 1 << 1,
  TRACKING = 1 << 2,
  NOTIFIED = 1 << 3,
  DIRTY = 1 << 4,
  ALLOW_RECURSE = 1 << 5,
  PAUSED = 1 << 6,
  EVALUATED = 1 << 7
}

// 初始状态

let flags = EffectFlags.ACTIVE | EffectFlags.RUNNING | EffectFlags.TRACKING;

console.log(flags);
// 检查是否处于 ACTIVE 状态
console.log(flags & EffectFlags.ACTIVE);
// 检查是否处于 RUNNING 状态
console.log(flags & EffectFlags.RUNNING);
// 检查是否处于 TRACKING 状态
console.log(flags & EffectFlags.TRACKING);

console.log('### 检查 NOTIFIED 标志 ###');
console.log(flags & EffectFlags.NOTIFIED);

console.log('### flags 赋值 EffectFlags.NOTIFIED ###');

// 添加 NOTIFIED 标志
flags |= EffectFlags.NOTIFIED;
console.log(flags & EffectFlags.NOTIFIED);

// 移除 ACTIVE 标志

console.log('### 移除 ACTIVE 标志 ###');
flags &= ~EffectFlags.ACTIVE;
console.log('### 检查 ACTIVE 标志 ###');
console.log(flags & EffectFlags.ACTIVE);
