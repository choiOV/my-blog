---
author: choiOV
pubDatetime: 2025-09-23T14:13:00.000Z
modDatetime: 2025-09-23T14:13:00.000Z
title: 자바스크립트에서 긴 작업을 분할하는 다양한 방법
slug: breaking-up-long-tasks-in-javascript
featured: true
draft: false
tags:
  - 자바스크립트
  - 성능최적화
  - 비동기
  - 이벤트루프
description: 자바스크립트에서 긴 작업을 나누어 처리하는 다양한 방법
---

### 목차

<!-- toc -->

<br>

<img src="/assets/breaking-up-long-tasks-in-javascript/intro.png" alt="기능 분할 설계 인트로 이미지" width="650" />

<br>

### 개요

이 아티클을 읽게 된 계기는 “리액트 개발자가 아닌 자바스크립트 개발자가 되라”는 [링크드인 글](https://www.linkedin.com/posts/hyunbinleo_%EC%96%BC%EB%A7%88%EC%A0%84%EC%97%90-%EB%8B%A4%EB%A5%B8-%ED%9A%8C%EC%82%AC-%EC%A3%BC%EB%8B%88%EC%96%B4-%ED%94%84%EB%A1%A0%ED%8A%B8-%EA%B0%9C%EB%B0%9C%EC%9E%90%EB%93%A4%EA%B3%BC-%ED%9B%84%EB%B0%B0-%EB%AA%87%EB%AA%85%EC%9D%B4%EB%9E%91-%EB%A7%8C%EB%82%AC%EB%8A%94%EB%8D%B0-%ED%94%84%EB%A1%A0%ED%8A%B8-activity-7373695965301641216-ioAr/?utm_medium=ios_app&rcm=ACoAADO3hXQBvCf8W68Ln4_n23n9hJCFxy1Egw8&utm_source=social_share_send&utm_campaign=copy_link)을 보고서
그 글에서 언급된 `requestAnimationFrame` 키워드를 잘 몰랐고 동시에 자바스크립트에서 긴 작업을
어떻게 분할 처리하는지가 궁금해져 읽게되었다.

이 아티클을 간단 요약하자면, 긴 작업을 이벤트 루프의 여러 틱으로 나누어 실행하는 것이 흔한 패턴이라는 점을 강조하고,
이를 구현할 수 있는 7가지 방법을 소개하며 마지막에 상황별로 어떤 선택을 하면 좋을지 정리하고 있다.

(이 글은 위 아티클을 읽고 스터디 발표를 위해 정리한 글입니다. 따라서 요약과 생략이 많을 수 있으니 양해 부탁드립니다.)

(또한 이 글은 노션에서 처음 작성되었으며, 노션의 원문 스타일이 블로그에 완전히 적용되지 않아, 일부 가독성이 떨어질 수 있는 점 양해 부탁드립니다. 감사합니다.)

<br>

### 문제 상황

메인 스레드에서 긴 작업(예: 무거운 반복문)을 동기적으로 실행하면 이벤트 루프가 막혀 UI 갱신과 이벤트 처리(버튼 클릭 등)가 모두 지연된다.

```html
<!-- 버튼과 카운트를 표시할 HTML -->
<button id="button">count</button>
<div>Click count: <span id="clickCount">0</span></div>
<!-- 버튼 클릭 횟수 -->
<div>Loop count: <span id="loopCount">0</span></div>
<!-- 반복문 진행 횟수 -->

<script>
  // 일정 시간 동안 '동기적으로' 멈추는 함수
  // Date.now()를 이용해 특정 밀리초가 지날 때까지 while 루프로 대기
  // → CPU를 점유한 채 멈추므로, 그 동안 다른 작업은 전혀 실행되지 않음
  function waitSync(milliseconds) {
    const start = Date.now();
    while (Date.now() - start < milliseconds) {}
  }

  // 버튼 클릭 이벤트 핸들러 등록
  // 버튼이 눌리면 clickCount 값이 +1 증가하도록 함
  button.addEventListener("click", () => {
    clickCount.innerText = Number(clickCount.innerText) + 1;
  });

  // 크기 100짜리 배열 생성 (모든 요소는 null로 채움)
  const items = new Array(100).fill(null);

  // 배열을 순회하며 loopCount를 1씩 증가
  // 각 반복마다 waitSync(50) 호출로 50ms 동안 블로킹
  // → 전체 반복문이 끝날 때까지 브라우저는 화면 갱신, 이벤트 처리 불가
  for (const i of items) {
    loopCount.innerText = Number(loopCount.innerText) + 1;
    waitSync(50);
  }
</script>
```

<br>

그 결과 사용자는 화면이 멈춘 것처럼 느끼고, 클릭 반응도 작업이 끝난 뒤에야 뒤늦게 표시된다.

![frozen-click.gif](/assets/breaking-up-long-tasks-in-javascript/frozen-click.gif)

<br>

개발자 도구의 플레임 차트(flame chart)를 보면 이러한 문제를 확인할 수 있다.

(이벤트 루프에서 하나의 작업이 무려 5초 동안 실행되고 있음)

![flame-chart.png](/assets/breaking-up-long-tasks-in-javascript/flame-chart.png)

<br>

따라서 긴 작업은 여러 틱으로 나누어 실행해 브라우저가 중간중간 화면 갱신과 사용자 입력을 처리할 수 있도록 해야 한다.

![long-task.avif](/assets/breaking-up-long-tasks-in-javascript/long-task.avif)

쉽게 말해 위 상태를 아래와 같은 상태로 바꿔야 한다.

![shorter-tasks.avif](/assets/breaking-up-long-tasks-in-javascript/shorter-tasks.avif)

<br>

### **#1. setTimeout() + 재귀 호출**

이 방식은 `setTimeout`과 재귀 호출을 조합해 긴 작업을 여러 번의 이벤트 루프 사이클에 분산시키는 전통적인 기법으로,
UI가 멈추지 않도록 해준다.

```jsx
function processItems(items, index) {
  // index가 전달되지 않았으면 0으로 초기화
  index = index || 0;

  // 현재 처리할 아이템
  var currentItem = items[index];

  // 현재 아이템을 콘솔에 출력
  console.log("processing item:", currentItem);

  // 아직 처리할 다음 아이템이 남아 있다면
  if (index + 1 < items.length) {
    // setTimeout을 0ms로 설정 → 이벤트 루프의 다음 틱에서 실행
    // 즉, 긴 작업을 한 번에 실행하지 않고 나눠서 처리
    setTimeout(function () {
      // 다음 아이템을 처리하도록 재귀 호출
      processItems(items, index + 1);
    }, 0);
  }
}

// ['a' ~ 'j'] 배열의 모든 요소를 순차적으로 처리 시작
processItems(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]);
```

400ms 동안의 플레임 차트를 보면 하나의 거대한 작업이 차지하던 구간이 잘게 나뉘어 여러 개의 작은 작업으로 분산되어 실행되는 모습을 확인할 수 있다.

![flame-chart-setTimeout.avif](/assets/breaking-up-long-tasks-in-javascript/flame-chart-setTimeout.avif)

<br>

클릭 이벤트 핸들러가 즉시 실행되고, 브라우저도 화면을 정상적으로 갱신하는 모습

![responsive.gif](/assets/breaking-up-long-tasks-in-javascript/responsive.gif)

여전히 쓸 수 있는 방법이지만 코드가 장황한 편이라, 요즘은 `Promise`나 `async/await` 같은 문법으로 더 간결하고 현대적인 방식으로 대체하는 경우가 많다.

<br>

### **#2. Async/Await & 타임아웃**

`async/await`와 `setTimeout`을 조합하면 재귀 호출 없이도 간단하게 긴 작업을 분할할 수 있다.

```html
<script>
  function waitSync(ms) {
    const start = Date.now();
    while (Date.now() - start < ms) {}
  }

  button.addEventListener("click", () => {
    clickCount.innerText = Number(clickCount.innerText) + 1;
  });

  (async () => {
    const items = new Array(100).fill(null);

    for (const i of items) {
      loopCount.innerText = Number(loopCount.innerText) + 1;

      // 다음 틱에서 실행되도록 잠시 대기
      await new Promise(resolve => setTimeout(resolve, 0));

      waitSync(50);
    }
  })();
</script>
```

![flame-chart-async-await.avif](public/assets/breaking-up-long-tasks-in-javascript/flame-chart-async-await.avif)

핵심은 for 루프와 프로미스를 활용해 각 반복을 분산 실행한다는 점이다. 실행 흐름은 기존 `setTimeout` 재귀 방식과 비슷하지만, 여기서는 `Promise`가 마이크로태스크 큐에서 동작한다는 특징이 있다. 큰 차이는 아니지만, 이 동작 원리를 알고 쓰는 것이 중요하다.

⇒ `setTimeout`은 매크로테스크 → **다음 이벤트 루프 싸이클**에서 실행

⇒ `Promise.then` / `await` = 마이크로태스크 → **현재 싸이클이 끝나자마자 바로 실행**

→ 대부분의 경우 둘 다 비슷하게 동작하지만, 실행 우선순위에 차이가 있다!

<br>

### #3. scheduler.postTask()

`scheduler.postTask()`는 크로미움 브라우저에서 지원되는 새로운 스케줄링 API로, 기존 `setTimeout(…, 0)`보다 안정적이고 효율적으로 작업을 분산할 수 있다.

```jsx
const items = new Array(100).fill(null);

for (const i of items) {
  loopCount.innerText = Number(loopCount.innerText) + 1;

  // postTask로 다음 틱에서 실행 예약
  await new Promise(resolve => scheduler.postTask(resolve));

  waitSync(50);
}
```

기본 우선순위는 `user-visible`이며, 필요에 따라 `user-blocking`, `background` 등 다양한 우선순위를 부여해 스케줄러 큐의 태스크 실행 순서를 조정할 수 있다.

<br>

[**_우선순위 (MDN)_**](https://developer.mozilla.org/en-US/docs/Web/API/Prioritized_Task_Scheduling_API#task_priorities)

1. **`user-blocking`**
   1. **사용자가 페이지와 상호작용하는 것을 막는 작업**
   2. 페이지가 실제로 **사용 가능해질 때까지의 렌더링**, **사용자 입력(클릭, 키보드 등)에 대한 즉각적인 응답** 같은 것들이 여기에 해당됨
2. **`user-visible`**
   1. **사용자가 눈으로는 볼 수 있지만, 굳이 상호작용을 막지는 않는 작업**
   2. 페이지 핵심 기능은 이미 동작하지만, **부가적인 이미지 렌더링, 애니메이션 처리** 같은 것들
3. **`background`** 1. **시간에 쫓기지 않는 작업** 2. **로그 처리, 통계 수집, 3rd-party 라이브러리 초기화**처럼 지금 당장 없어도 사용자 경험에 문제 없는 것들

```jsx
// 기본 우선순위
scheduler.postTask(() => console.log("postTask - default"));

// 사용자 입력과 같이 중요한 작업에 높은 우선순위 부여
scheduler.postTask(() => console.log("postTask - blocking"), {
  priority: "user-blocking",
});

// 중요도가 낮은 작업은 background 우선순위로 설정
scheduler.postTask(() => console.log("postTask - background"), {
  priority: "background",
});
// 우리의 목표처럼 이벤트 루프에 적절히 제어권을 넘겨줘서
// 다른 작업이 실행될 수 있도록 하는거라면
// background를 사용해 우선순위를 낮추는 것이 오히려 나을 수 있다.
```

`setTimeout()`과는 다르게, `postTask()`는 스케줄링을 위해 만들어졌기 때문에 
타임아웃에 의존하지 않고 [태스크 큐의 앞부분](https://developer.chrome.com/blog/introducing-scheduler-yield-origin-trial?ref=cms.macarthur.me&hl=ko#enter_scheduleryield)에 작업을 배치하므로 실행 지연이나 순서 꼬임을 줄일 수 있다는 장점이 있다.

(`setTimeout()`은 태스크 큐의 뒤쪽에 붙는다.)

다만 아직 모든 브라우저에서 호환되지 않기 때문에, 실제 사용 시에는 폴리필이나 다른 비동기 방식과 함께 고려해야 한다.

<br>

**`requestIdleCallback()`는 어떤가요?**

`requestIdleCallback()`은 브라우저가 유휴 상태일 때 콜백을 실행하는 방식이라 이론적으로는 리소스 여유가 있을 때 작업을 처리할 수 있다.

하지만 실행 시점이 보장되지 않고 아예 실행되지 않을 수도 있으며, [Safari처럼 아예 지원하지 않는 브라우저](https://caniuse.com/requestidlecallback)도 존재한다.

또한 MDN에서도 중요한 작업에는 `requestIdleCallback()`보다 [`setTimeout` 사용을 권장](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestIdleCallback)하고 있어, 실무에서 활용하기에는 신뢰성이 떨어진다.

<br>

### **#4. scheduler.yield()**

`scheduler.yield()`는 긴 작업을 수행하는 도중 메인 스레드에 잠시 제어권을 넘겨 브라우저가 다른 이벤트나 화면 갱신을 처리할 수 있게 해주는 API다.

기존처럼 `Promise`를 직접 만들어 반환할 필요 없이 단순히 `await scheduler.yield()`를 호출하면 되므로 코드가 훨씬 간결하다.

```jsx
const items = new Array(100).fill(null);

for (const i of items) {
  loopCount.innerText = Number(loopCount.innerText) + 1;

  // Promise 생성 안 함
  await scheduler.yield();

  waitSync(50);
}
```

<br>

플레임 차트도 더욱 깔끔해진다. 실행 스택에서 불필요한 항목이 하나 줄어든 것을 볼 수 있다.

![flame-chart-scheduler.avif](/assets/breaking-up-long-tasks-in-javascript/flame-chart-scheduler.avif)

<br>

이 API 사용예제를 확인해보자

아래 체크박스를 클릭하면 UI가 1초 동안 멈추게 된다.

```jsx
// change될 때 무거운 작업을 실행하는 체크박스 예제
document
  .querySelector('input[type="checkbox"]')
  .addEventListener("change", function (e) {
    waitSync(1000);
  });
```

![frozen-click-i-like-eggs.webp](public/assets/breaking-up-long-tasks-in-javascript/frozen-click-i-like-eggs.webp)

<br>

하지만 이제 클릭 후 즉시 제어권을 브라우저에 넘기면, UI가 클릭에 반응할 기회를 얻을 수 있다.

```jsx
document
  .querySelector('input[type="checkbox"]')
  .addEventListener("change", async function (e) {
    +(await scheduler.yield());

    waitSync(1000);
  });
```

![normal-click-i-like-eggs.webp](public/assets/breaking-up-long-tasks-in-javascript/normal-click-i-like-eggs.webp)

UI가 멈추지 않고 곧바로 반응하는 것을 확인할 수 있다.

<br>

다만 아직 브라우저 지원이 넓지 않다는 한계가 있으며, 필요할 경우 `setTimeout`을 이용한 간단한 폴리필로 대체할 수 있다.

```jsx
globalThis.scheduler = globalThis.scheduler || {};
globalThis.scheduler.yield =
  globalThis.scheduler.yield || (() => new Promise(r => setTimeout(r, 0)));
```

<br>

### **#5. requestAnimationFrame()**

`requestAnimationFrame()`은 브라우저의 화면 갱신 주기(보통 **1초에 60번**)와 맞춰 콜백을 실행하기 때문에
실행 타이밍이 매우 정확하며, 렌더링 직전에 호출된다는 특징이 있다. 이로 인해 개별 작업이 프레임 단위로 밀집되게 실행되며, [별도의 큐에서 처리되므로](https://html.spec.whatwg.org/multipage/imagebitmap-and-animations.html?ref=cms.macarthur.me#list-of-animation-frame-callbacks) 다른 작업이 순서를 바꾸거나 간섭하기 어렵다.

![flame-chart-requestAnimationFrame.avif](/assets/breaking-up-long-tasks-in-javascript/flame-chart-requestAnimationFrame.avif)

하지만 무거운 연산을 이 방식으로 실행하면 렌더링 성능이 떨어지고,
(왜냐하면 예를 들어 **50ms 걸리는 계산을 하면 원래는 16ms 안에 그려야 할 프레임이 밀려서 화면이 버벅임(프레임 드랍 발생)**)

부분적으로만 그려진 프레임(아래 노란색 줄무늬가 있는 섹션)이 발생할 수 있다. (화면이 제때 그려지지 못해 끊긴다는 뜻)

![yellow-section-requestAnimationFrame.avif](/assets/breaking-up-long-tasks-in-javascript/yellow-section-requestAnimationFrame.avif)

게다가 비활성화된 탭(사용자가 다른 탭을 보고 있거나 하는 상황)에서는 아예 실행되지 않는 경우가 있어 일반적인 긴 작업 분할 용도로는 적합하지 않다.

<br>

### **#6. MessageChannel()**

`MessageChannel()`을 활용하면 `setTimeout(…, 0)` 대신 메시지를 바로 전달해 비동기적으로 작업을 이어갈 수 있다.
타이머를 거치지 않고 곧바로 큐에 들어가기 때문에 지연이 거의 없고 성능상 이점이 있을 수 있다.

```jsx
for (const i of items) {
  // 반복할 때마다 loopCount를 1씩 증가시켜 화면에 표시
  loopCount.innerText = Number(loopCount.innerText) + 1;

  // MessageChannel을 이용해 비동기 작업을 잠깐 분리
  await new Promise(resolve => {
    const channel = new MessageChannel();

    // 채널의 port1이 메시지를 받으면 resolve 실행 → 프로미스 완료
    // (여기서 'resolve()'로 되어 있지만 'resolve'만 써야 정상 동작)
    channel.port1.onmessage = resolve();

    // port2에서 메시지를 보내면 port1이 이를 수신
    channel.port2.postMessage(null);
  });

  // 50ms 동안 동기적으로 블로킹 (CPU를 붙잡고 대기)
  waitSync(50);
}
```

플레임차트를 확인해봐도 개별 작업 간의 지연 시간이 거의 없어서 성능면에서도 유의미할 수 있음

![flame-chart-messageChannel.avif](/assets/breaking-up-long-tasks-in-javascript/flame-chart-messageChannel.avif)

다만 코드 구조가 다소 번거롭고(포트 2개 만들고 메시지 주고 받아야 함),
원래 이런 용도(스케줄링용)로 설계된 API가 아니기 때문에 실무에서 널리 쓰이지는 않는다.

<br>

### **#7. 웹 워커(Web Workers)**

웹 워커(Web Workers)는 무거운 연산을 메인 스레드가 아닌 별도의 스레드에서 실행할 수 있게 해주는 방법이다.
메인 스레드의 이벤트 루프를 차단하지 않으므로 버튼 클릭이나 화면 갱신 같은 UI 반응성이 훨씬 매끄럽게 유지된다.

(무거운 작업을 메인 스레드에서 작업할 필요가 없다면 가장 먼저 웹 워커를 고려해야 한다.)

```jsx
const items = new Array(100).fill(null);

// 워커 안에서 실행할 스크립트 문자열
const workerScript = `
  function waitSync(milliseconds) {
    const start = Date.now();
    while (Date.now() - start < milliseconds) {}
  }

  // 메인 스레드에서 메시지가 오면 50ms 블로킹 후 결과 전달
  self.onmessage = function(e) {
    waitSync(50);
    self.postMessage('Process complete!');
  }
`;

// Blob을 이용해 워커 코드 생성
const blob = new Blob([workerScript], { type: "text/javascript" });
const worker = new Worker(window.URL.createObjectURL(blob));

// 반복문을 돌면서 워커에게 작업을 맡기고 응답을 기다림
for (const i of items) {
  worker.postMessage(items);

  await new Promise(resolve => {
    worker.onmessage = function (e) {
      loopCount.innerText = Number(loopCount.innerText) + 1;
      resolve();
    };
  });
}
```

작업을 워커로 위임하면 플레임 차트 상에서 메인 스레드가 거의 비워져 있는 것을 확인할 수 있으며,
모든 연산이 **“Worker”** 영역에서 처리된다.

![flame-chart-web-workers.avif](/assets/breaking-up-long-tasks-in-javascript/flame-chart-web-workers.avif)

지금 예제는 각 항목마다 워커와 메시지를 주고받도록 구성했지만, 상황에 따라 전체 데이터를 한 번에 워커로 전달하는 방식이 오버헤드를 줄이는 데 더 효과적일 수 있다.

<br>

### 어떻게 선택해야 할까?

긴 작업을 쪼개는 방법은 여러 가지가 있지만, 상황에 따라 적합한 선택지가 달라진다.

1. **메인 스레드가 아닌 곳에서 처리할 수 있다면?**

   ⇒ 가장 좋은 방법은 웹 워커를 쓰는 것이다. 브라우저 지원도 넓고 메인 스레드 부하를 크게 줄일 수 있지만, API가 번거롭다는 점이 단점이다.

2. **단순히 반복 작업을 적당히 나눠 실행하려는 목적이라면?**

   ⇒ `scheduler.yield()`가 깔끔한 대안이 될 수 있다. 다만 크로미움 외 브라우저에서는 폴리필이 필요하다.

3. **작업의 중요도에 따라 실행 순서를 제어하거나 더 정밀하게 조정하고 싶다면?**

   ⇒ `scheduler.postTask()`를 고려할 만하다.

4. **반대로 가장 널리 지원되고 확실하게 동작하는 방식을 원한다면?**

   ⇒ 여전히 `setTimeout()`이 안정적인 선택지다.
