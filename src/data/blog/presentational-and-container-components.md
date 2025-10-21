---
author: choiOV
pubDatetime: 2025-10-21T00:16:00.000Z
modDatetime: 2025-10-21T00:16:00.000Z
title: Container/Presentational 패턴
slug: presentational-and-container-components
featured: false
draft: false
tags:
  - 리액트 디자인 패턴
  - 관심사의 분리 원칙
description: Container/Presentational 패턴에 대해 고찰한 글입니다.
---

<br>

<img src="/assets/presentational-and-container-components/intro.png" alt="Container/Presentational 패턴 인트로 이미지" width="650" />

<br>

### 왜 이 패턴을 알고자 했는지에 대해

오늘은 [Dan Abramov가 제안했던 **Container / Presentational 패턴**](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)에 대해 이야기해보고자 한다.
이 패턴은 현재 React Hooks의 등장 이후 **더 이상 권장되지 않지만**,
React가 **관심사 분리(Separation of Concerns)를 어떻게 실현해왔는지** 이해하는 데 중요한 역할을 한다.

그래서 단순히 과거의 패턴을 복습하려는 것이 아니라,
**React의 아키텍처 사고방식이 어떤 과정을 거쳐 발전했는가**를 배우기 위해 살펴보았다.

<br>

### 무엇을 보여줄지, 어떻게 보여줄지

이 패턴의 핵심은 **UI와 비즈니스 로직을 분리**하는 데 초점을 둔다.

먼저 **Container 컴포넌트**는 무엇을 보여줄지를 결정한다.

1. API 호출 및 상태관리를 담당한다.
2. UI나 스타일을 직접 포함하지 않는다.
3. 데이터를 Presentational 컴포넌트로 전달한다.
4. Redux, Context, Hooks 등으로 상태를 관리한다.

<br>

다음으로 **Presentational 컴포넌트**는 어떻게 보여줄지를 담당한다.

1. 데이터를 props로 전달받는다.
2. 비즈니스 로직이 없다.
3. UI와 스타일을 포함한다.
4. UI 표현을 위한 최소한의 상태만을 가진다.

아래 영상을 보면 이 패턴의 동작 방식을 한 눈에 이해할 수 있다.

<video src="/assets/presentational-and-container-components/design-container-presentational.mp4" 
       alt="Container/Presentational 패턴 동작 예시" 
       width="650" 
       controls 
       autoplay 
       loop 
       muted>
</video>

영상 속에서 Container 컴포넌트는 `fetchDogs` 함수를 통해 데이터를 가져오고,
그 데이터를 그대로 Presentational 컴포넌트에 props로 전달하여 UI를 렌더링하는 걸 확인할 수 있다.

<br>

### 코드 예시

**Container 컴포넌트**

```tsx
function DogImagesContainer() {
  const [dogs, setDogs] = useState<string[]>([]);

  useEffect(() => {
    fetch("https://dog.ceo/api/breed/labrador/images/random/6")
      .then(res => res.json())
      .then(({ message }) => setDogs(message));
  }, []);

  return <DogImages dogs={dogs} />;
}
```

이 컴포넌트는 화면에 **직접적으로 무언가를 렌더링하지 않는다.**
대신 데이터를 불러오고, 상태를 관리하며, 그 결과를 `DogImages` 컴포넌트 (Presentational 컴포넌트)에 props로 전달한다.

<br>

**Presentational 컴포넌트**

```tsx
function DogImages({ dogs }) {
  return dogs.map((dog, i) => <img src={dog} key={i} alt="Dog" />);
}
```

이 컴포넌트는 오직 **렌더링만 담당한다.**
이미지를 표시할 뿐, **어디서 데이터를 가져오는지는 알지 못한다.** 데이터는 오직 props로 전달받는다.

**즉, 이 패턴은 다시 말해, 비즈니스 로직을 UI로부터 완전히 분리한 구조**다.

<br>

### React Hooks 이후의 대체 방식

이제 이 패턴은 React Hooks로 자연스럽게 대체할 수 있다.
Hooks가 추가되면서 **Container 컴포넌트를 별도로 만들 필요 없이,**
함수형 컴포넌트 내부에서 비즈니스 로직을 재사용할 수 있게 되었다.

<br>

**`useDogImages` 커스텀 Hooks**

```tsx
function useDogImages() {
  const [dogs, setDogs] = useState([]);

  useEffect(() => {
    fetch("https://dog.ceo/api/breed/labrador/images/random/6")
      .then(res => res.json())
      .then(({ message }) => setDogs(message));
  }, []);

  return dogs;
}
```

<br>

**Hooks를 사용하는 Presentational 컴포넌트**

```tsx
function DogImages() {
  const dogs = useDogImages();

  return dogs.map((dog, i) => <img src={dog} key={i} alt="Dog" />);
}
```

이제 별도의 **Container 컴포넌트**가 필요하지 않다.

`useDogImages` Hooks가 데이터를 관리하고, **Presentational 컴포넌트는** 단순히 Hooks에서 반환된 값을 수정없이 사용하면 된다.

<br>

즉, **Container/Presentational 패턴의 철학은 유지하면서 구조는 단순해진 셈이다.**

<br>

### 이 패턴의 장점과 단점

**장점**

1. **자연스럽게 관심사의 분리 원칙을 구현한다.**

   ⇒ Presentational 컴포넌트는 UI를 담당하는 순수함수로 작성하게 되고,
   Container 컴포넌트는 상태와 기타 데이터를 책임지게 된다.

2. **다양한 목적으로 재사용할 수 있다.
   ⇒** Presentational 컴포넌트는 데이터와 무관하게 여러 곳에서 활용할 수 있다.
3. **수정이 용이해진다.**

   ⇒ UI 변경이 필요할 때, Presentational 컴포넌트만 수정하면 된다. (비즈니스 로직을 건드리지 않아도 된다.)

4. **테스트가 용이해진다.**

   ⇒ Presentational 컴포넌트를 테스트하기도 쉽다. 일반적으로 순수함수로 구현되므로 전체 목 데이터 스토어를 만들 필요가 없다.

<br>

**단점**

1. 지금은 **Hooks**로 동일한 관심사 분리를 더 간결하게 구현할 수 있다.
2. 작은 규모의 프로젝트에서는 오히려 **오버엔지니어링**이 될 수 있다.
3. 클래스형 컴포넌트 시절에는 유용했지만, 현재는 함수형 컴포넌트 중심의 React에서 자연스럽게 흡수된 개념이다.

<br>

### Dan **Abramov의 조언 ⇒ _이제는 강제할 필요 없다._**

> _Update from 2019: I wrote this article a long time ago and my views have since evolved. In particular, I don’t suggest splitting your components like this anymore. If you find it natural in your codebase, this pattern can be handy. But I’ve seen it enforced without any necessity and with almost dogmatic fervor far too many times. The main reason I found it useful was because it let me separate complex stateful logic from other aspects of the component. [Hooks](https://reactjs.org/docs/hooks-custom.html) let me do the same thing without an arbitrary division. This text is left intact for historical reasons but don’t take it too seriously._

<br>

⇒ 해석하자면,

> **2019년 업데이트:** 이 글은 꽤 오래 전에 쓴 것이다. 지금의 내 생각은 그때와는 다르다.
> 요즘 나는 **이런 식으로 컴포넌트를 나누는 걸 더 이상 권장하지 않는다.**
>
> 만약 이 패턴이 너의 코드베이스 안에서 자연스럽게 느껴진다면,
> 그때는 유용하게 쓸 수 있을 것이다. 하지만 나는 이것이 필요하지 않은 상황에서도
> **불필요하게, 거의 교조적인 열정으로 강제되는 경우를 너무 많이 봤다.**
>
> 예전에 내가 이 패턴을 유용하다고 생각했던 이유는,
> **복잡한 상태 로직(stateful logic)을 컴포넌트의 다른 부분과 분리할 수 있었기 때문**이다.
> 그런데 이제는 **React Hooks**가 등장하면서 굳이 인위적으로 컴포넌트를 분리하지 않아도
> 같은 효과를 낼 수 있게 되었다.
>
> 이 글은 **역사적인 이유로 원문 그대로 남겨두지만**,
> 너무 심각하게 받아들이지 않기를 바란다.

<br>

즉, 이 패턴은 잘못된 방식이 아니라, **React가 발전하면서 더 자연스러운 대체 수단인 Hooks**가 등장했을 뿐이다. 따라서 Container/Presentational 패턴은 **React의 관심사의 분리 원칙이 어떻게 발전해왔는지를 이해하기에 좋은 예시**라 할 수 있다.

<br>

### 이 글의 회고

나 또한 개인 프로젝트에서 이 패턴을 부분적으로 부분적으로 적용한 경험이 있다.
당시에는 [Refine.dev의 글](https://refine.dev/blog/react-design-patterns/#container-and-presentation-patterns)을 참고해서
도메인 비즈니스 로직은 상위(Container) 컴포넌트에서,
UI와 사용자 입력 처리는 하위(Presentational) 컴포넌트에 담당하도록 자연스럽게 분리했었다.

적용 과정에서 이 패턴에 억지로 맞추기보다, 관심사의 분리 원칙만 유연하게 적용을 하는데 집중했었는데
이번에 [Dan Abramov의 글](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)을 다시 읽어보며, 이 접근 방식이 적절했음을 다시 한 번 확인할 수 있었던 시간이었다.
