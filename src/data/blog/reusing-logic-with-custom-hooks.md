---
author: choiOV
pubDatetime: 2025-11-25T14:09:00.000Z
modDatetime: 2025-11-25T14:09:00.000Z
title: 커스텀 Hook으로 로직 재사용하기
slug: reusing-logic-with-custom-hooks
featured: false
draft: false
tags:
  - 리액트 공식문서
  - useEffectEvent
  - 커스텀 Hook
description: 리액트 공식문서인 "커스텀 Hook으로 로직 재사용하기"를 복습하고 발표를 위해 요약 정리한 글입니다.
---

<!-- toc -->

- [최신 값(state, props)은 받고 싶으면서도, `useEffect` 재실행은 막고 싶을 때는 어떻게 하면 좋을까?](#최신-값state-props은-받고-싶으면서도-useeffect-재실행은-막고-싶을-때는-어떻게-하면-좋을까)
- [왜 커스텀 훅으로 Effect를 감싸는 것이 장기적으로 좋을까?](#왜-커스텀-훅으로-effect를-감싸는-것이-장기적으로-좋을까)

<!-- tocstop -->

<br>

<img src="/assets/reusing-logic-with-custom-hooks/intro.png" alt="스크롤 복구 아티클의 인트로 이미지" width="650" />

<br>

(이 글은 리액트 공식문서 "[커스텀 Hook으로 로직 재사용하기](https://ko.react.dev/learn/reusing-logic-with-custom-hooks)" 을 읽고 일부 내용을 스터디 발표를 위해 정리한 글입니다.)

<br>

### 최신 값(state, props)은 받고 싶으면서도, `useEffect` 재실행은 막고 싶을 때는 어떻게 하면 좋을까?

⇒ `useEffectEvent` 훅을 활용한다.

- 예시

  - 컴포넌트가 재렌더링될 때마다 채팅방 연결을 끊고 다시 연결하게 되는 상황
    ```jsx
    function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
      useEffect(() => {
        const options = {
          serverUrl: serverUrl,
          roomId: roomId,
        };
        const connection = createConnection(options);
        connection.connect();
        connection.on("message", msg => {
          onReceiveMessage(msg);
        });
        return () => connection.disconnect();
      }, [roomId, serverUrl, onReceiveMessage]);
    }
    ```
  - `useEffectEvent`로 해결
    ⇒ **비리액티브한 로직**을 Effect에서 분리하고 싶을 때 사용하는 훅

    ````jsx
    function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
    const onMessage = useEffectEvent(onReceiveMessage);

          useEffect(() => {
            const options = {
              serverUrl: serverUrl,
              roomId: roomId
            };
            const connection = createConnection(options);
            connection.connect();
            connection.on('message', (msg) => {
              onMessage(msg);
            });
            return () => connection.disconnect();
          }, [roomId, serverUrl]); // ✅ 모든 의존성이 정의됨.
        }
        ```

    ````

  - **주의사항**

    - 꼼수로 의존성 배열을 줄일 때
      ⇒ 디버깅이 어렵고, 코드 이해가 더 어려워진다.
    - `useEffect` 밖에서 호출할 때

      ```jsx
      const handleEvent = useEffectEvent(() => {
        console.log("Hello");
      });

      // 1. ❌ 렌더링 중 호출 → 금지
      handleEvent();

      function onClick() {
        // 2. ❌ 이벤트 핸들러에서 호출하면 안 됨
        handleEvent();
      }
      ```

    - 다른 컴포넌트, 훅에 넘겨선 안된다.
      ⇒ Effect 내부에서만 호출되는 특수한 콜백이기 때문에 언제 실행될지 리액트가 예측할 수 없음

<br>

### 왜 커스텀 훅으로 Effect를 감싸는 것이 장기적으로 좋을까?

⇒ 훗날 리액트가 더 좋은 공식 API를 제공한다면, 컴포넌트 코드를 거의 고치지 않고 더 나은 패턴으로 교체할 수 있기 때문이다.

- 더 자세히 알아보자면,
  - 리액트 팀에선 앞으로 Effect를 점점 줄이고, 더 안전하고 추상적인 새 공식 API들을 제공하려고 한다.
  - 따라서 Effect를 커스텀 훅 내부에 가둬, 더 나은 공식 기능이 제공 됐을 때 컴포넌트는 거의 수정 할 필요 없이,
    훅 내부만 교체해서 새로운 패턴을 적용할 수 있다.
    ⇒ 커스텀 훅을 사용하지 않았다면, 관련된 훅과 컴포넌트를 일일이 교체해야 한다.
- 예시

  - [`useSyncExternalStore`](https://ko.react.dev/reference/react/useSyncExternalStore) ⇒ 외부 store를 구독할 수 있는 리액트 훅 (브라우저 API 구독도 가능)

    ```jsx
    // 이전
    export function useOnlineStatus() {
      const [isOnline, setIsOnline] = useState(true);

      useEffect(() => {
        function handleOnline() { setIsOnline(true); }
        function handleOffline() { setIsOnline(false); }

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
          window.removeEventListener('online', handleOnline);
          window.removeEventListener('offline', handleOffline);
        };
      }, []);

      return isOnline;
    }

    ---

    // 이후
    export function useOnlineStatus() {
      return useSyncExternalStore(
        subscribe,
        () => navigator.onLine,
        () => true
      );
    }

    // 훅을 사용하던 컴포넌트는 한 줄도 수정할 필요가 없음
    function StatusBar() {
      const isOnline = useOnlineStatus(); // 내부가 바뀌어도 API 동일
    }
    ```

- 커스텀 훅으로 Effect를 감싸면 좋은 이유를 총 정리하자면,
  <img src="/assets/reusing-logic-with-custom-hooks/custom-hook-reason.png" alt="리액트 공식문서 기반 좋은 이유 이미지" width="650" />
  ⇒ 부연설명

  1. 컴포넌트 내부에서 Effect를 직접 쓰지 않고 커스텀 훅을 호출해 데이터를 주고 받을 수 있게 한다.

     ```jsx
     const isOnline = useOnlineStatus();
     ```

  2. 어떻게 그것을 하는지가 아니라 무엇을 하려는지에 집중할 수 있다.

     ```jsx
     function StatusBar() {
       const [isOnline, setIsOnline] = useState(true);

       useEffect(() => {
         function handleOnline() { setIsOnline(true) }
         function handleOffline() { setIsOnline(false) }

         window.addEventListener("online", handleOnline);
         window.addEventListener("offline", handleOffline);

         return () => {
           window.removeEventListener("online", handleOnline);
           window.removeEventListener("offline", handleOffline);
         };
       }, []);

       return <div>{isOnline ? "Online" : "Offline"}</div>;
     }
     // 컴포넌트가 어떻게 그것을 하는지도 관할하고 있음

     ---

     function StatusBar() {
       const isOnline = useOnlineStatus();
       return <div>{isOnline ? "Online" : "Offline"}</div>;
     }
     // 온라인이면 무엇(UI를 어떻게 보여줄지)을 하려는구나~ 에만 집중할 수 있음
     ```

  3. `useSyncExternalStore` 예시

     ```jsx
     function useOnlineStatus() {
       return useSyncExternalStore(
         subscribe,
         () => navigator.onLine,
         () => true
       );
     }

     // 훅을 사용하던 컴포넌트는 한 줄도 수정할 필요가 없음
     function StatusBar() {
       const isOnline = useOnlineStatus(); // 내부가 바뀌어도 API 동일
     }
     ```
