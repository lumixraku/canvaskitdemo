import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

window.myFunction = myFunction;
function myFunction() {
  // 实际的功能逻辑
  console.log('my FN');
  requestAnimationFrame(() => {
    window.myFunction();
  })
}

function someAnimationLogic() {
  requestAnimationFrame(() => {
    window.myFunction();
    // 可能还有其他逻辑
  });
}

describe('requestAnimationFrame Test', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Mock requestAnimationFrame
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      console.log('mock timeout');
      return setTimeout(callback, 16);
    });
    someAnimationLogic(); // 这个函数内部会调用 requestAnimationFrame
  });

  afterEach(() => {
    // 恢复原生的 requestAnimationFrame
    // @ts-expect-error https://stackoverflow.com/questions/61593774/how-do-i-test-code-that-uses-requestanimationframe-in-jest
    window.requestAnimationFrame.mockRestore();
    vi.restoreAllMocks();
  });

  it('should call myFunction after requestAnimationFrame', async () => {


    const spy = vi.spyOn(window, 'myFunction'); // 确保 myFunction 是全局或可以被 spy
    // const obj = { myFunction };

    console.log('before run timer');
    // await vi.runAllTimers(); // 执行所有定时器，模拟一帧时间过去

    vi.advanceTimersByTime(51); // 模拟时间流逝
    console.log('after run timer');

    // expect(spy).toHaveBeenCalled(); // 检查 myFunction 是否被调用
    expect(spy).toHaveBeenCalledTimes(3)

    spy.mockRestore(); // 清理 spy
  });
});