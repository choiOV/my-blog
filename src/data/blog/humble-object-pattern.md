---
author: choiOV
pubDatetime: 2025-09-16T05:00:00.000Z
modDatetime: 2025-09-16T05:00:00.000Z
title: 테스트는 어떻게 좋은 코드를 만드는가(feat. 험블 객체 패턴)
slug: humble-object-pattern
featured: false
draft: false
tags:
  - 험블 객체 패턴
description: 험블 객체 패턴을 이용해 테스트와 프로그램 코드를 개선하기
---

### 목차

<!-- toc -->

- [테스트가 어려운 이유는 충분히 고민하지 않았기 때문이다.](#%ED%85%8C%EC%8A%A4%ED%8A%B8%EA%B0%80-%EC%96%B4%EB%A0%A4%EC%9A%B4-%EC%9D%B4%EC%9C%A0%EB%8A%94-%EC%B6%A9%EB%B6%84%ED%9E%88-%EA%B3%A0%EB%AF%BC%ED%95%98%EC%A7%80-%EC%95%8A%EC%95%98%EA%B8%B0-%EB%95%8C%EB%AC%B8%EC%9D%B4%EB%8B%A4)
- [Mock 피라미드](#mock-%ED%94%BC%EB%9D%BC%EB%AF%B8%EB%93%9C)
- [험블 객체 패턴을 사용해 해결하자 (Feat. 다형성)](#%ED%97%98%EB%B8%94-%EA%B0%9D%EC%B2%B4-%ED%8C%A8%ED%84%B4%EC%9D%84-%EC%82%AC%EC%9A%A9%ED%95%B4-%ED%95%B4%EA%B2%B0%ED%95%98%EC%9E%90-feat-%EB%8B%A4%ED%98%95%EC%84%B1)
- [테스트 하기 좋은 코드 = 거의 SOLID하다.](#%ED%85%8C%EC%8A%A4%ED%8A%B8-%ED%95%98%EA%B8%B0-%EC%A2%8B%EC%9D%80-%EC%BD%94%EB%93%9C--%EA%B1%B0%EC%9D%98-solid%ED%95%98%EB%8B%A4)

<!-- tocstop -->

<br>

<img src="/assets/humble-object-pattern-intro.png" alt="험블 객체 패턴 인트로" width="650" />

<br>

이 글에서는 테스트를 작성할 때 유념해야 할 점과 좋은 코드의 개념에 대해 다룬다.

(이 글은 [테스트는 어떻게 좋은 코드를 만드는가(feat. 험블 객체 패턴)](https://d2.naver.com/helloworld/9921217)를 읽고 스터디 발표를 위해 정리한 글입니다.
따라서 요약과 생략이 많을 수 있으니 양해 부탁드립니다.)

(또한 이 글은 노션에서 처음 작성되었으며, 노션의 원문 스타일이 블로그에 완전히 적용되지 않아, 일부 가독성이 떨어질 수 있는 점 양해 부탁드립니다. 감사합니다.)

<br>

### 테스트가 어려운 이유는 충분히 고민하지 않았기 때문이다.

프론트엔드 영역에서 유닛 테스트 활용이 어렵다고 느껴지는 이유는 대부분 충분히 고민하지 않았기 때문이다.
많은 경우 테스트는 작성했지만, “좋은 테스트 코드란 무엇인가”에 대해서는 깊이 생각하지 않았다.

리팩터링을 하더라도 코드를 짧고 보기 좋게 만드는 데에만 집중했을 뿐, 좋은 설계가 무엇인지,
또 어떻게 적용해야 하는지에 대한 명확한 청사진은 없었다. 이것이 바로 테스트 코드를 망치는 가장 중요하고 심각한 문제다.

테스트 코드를 자세히 살펴보면 단서를 발견할 수 있다. 가장 먼저 드러나는 부분은 테스트에 사용되는 목(Mock) 객체다.

목 객체는 테스트 작성에서 필수적이다. 테스트에서 불필요한 부분을 제외하거나 특정 조건을 형성하기 위해 자주 사용한다.
하지만 모든 목이 같은 성격을 가지는 것은 아니다. 이 차이를 이해하는 것이 좋은 테스트 코드와 나쁜 테스트 코드를 구분하는 핵심이 된다.

<br>

### Mock 피라미드

테스트에서 사용하는 목 객체는 크게 네 가지 단계로 나눌 수 있다.
아래 그림처럼 피라미드 구조로 표현하면, 위로 올라갈수록 작성 비용이 높아지는 고수준 목이다.

또한 고수준 목을 많이 사용할수록 테스트 작성은 어려워진다.

![Mock 피라미드](/assets/humble-object-pattern-mock-pyramid.png)

각 목에 대해 간단하게 설명하자면 아래와 같다.

1. Network mock ⇒ 네트워크 통신 대상을 대체하는 목
2. Global mock ⇒ 전역 객체를 대체하는 목
3. Object spying ⇒ 클래스의 일부 메서드를 스파이 함수로 감싸는 작업
4. Dummy, Stub ⇒ 테스트용 가짜 객체 혹은 임시 데이터 (작성과 변경이 쉽고 독립적으로 존재할 수 있다.)

_이하부턴 목에 대해 한글로 표기하겠다. (예시: Global mock_ ⇒ _글로벌 목)_

이 글에선 글로벌 목부터 더미와 스텁 단계로 낮추는 글을 다룬다.

예시 코드를 한 번 살펴보자.

```tsx
describe("테스트", () => {
  let storage: any = {};
  let temp;

  beforeAll(() => {
    temp = window.localStorage;
  });

  beforeEach(() => {
    storage = {};
    window.localStorage = {
      setItem: jest.fn((key, val) => (storage[key] = val)),
    };
  });

  afterAll(() => {
    window.localStorage = temp;
  });

  test("save()", () => {
    const testobj = new MyClass();
    const saveData = 12345;
    testobj.save(saveData);
    expect(storage.userData).toBe(`user data no: ${saveData}`);
  });
});
```

크게 세 가지 문제점을 발견할 수 있다.

1. 글로벌 목 사용 (`window.localStorage`)
   1. `beforeAll`, `beforeEach`, `afterAll`로 원래 객체를 저장, 복원해야 한다.
   2. 테스트 환경이 꼬이지 않게 계속 초기화해줘야 한다.
2. `jest.fn()`으로 함수 모킹
   1. `setItem`을 가짜로 만들고, 내부에서 `storage`라는 별도 객체에 위임하는 구조를 가진다.
   2. 즉, 테스트를 위해 일일이 수작업으로 목 구조를 짜야 한다.
3. 테스트 로직보다 목 관리 코드가 더 길다.
   1. `beforeEach`, `afterAll` 같은 보일러플레이트가 테스트 본문보다 많다.

이처럼 유닛 테스트에서 고수준 목이 반복적으로 사용되면 치명적인 피로도와 기술 부채를 불러온다.
고수준 목은 그 자체로 코드 스멜이며**,** 이를 줄이는 방향으로 코드 구조를 개선해야 한다.

해답은 의외로 간단한데
글로벌 객체, 네트워크 통신처럼 테스트하기 어려운 코드를 마주칠 때마다 고수준 목을 남발하는 대신,
프로그램 코드에서 이런 부분을 격리해야 한다. 이렇게 해서 고수준 목의 사용 범위를 테스트의 일부로 제한할 수 있다.

<br>

### 험블 객체 패턴을 사용해 해결하자 (Feat. 다형성)

테스트하기 어려운 코드를 어떻게 다뤄야 할까? 여기서 등장하는 것이 바로 험블 객체 패턴이다.

**험블 객체 패턴?**

**험블 객체 패턴은** 테스트하기 어려운 행위와 테스트하기 쉬운 행위를 단위 테스트 작성자가 분리하기 쉽게 하는 방법으로 고안된 디자인 패턴이다.

이 정의에 따라 프로그램 코드를 “테스트하기 쉬운가”를 기준으로 나누어 본다.
이 글의 예시에서 테스트하기 어려운 부분은 바로 `window.localStorage` 호출 부분이다.

```tsx
class MyClass {
  save(data: number) {
    const saveData = `user data no: $${data}`;
    // 클래스 내부에서 localStorage를 직접 호출함
    window.localStorage.setItem("userData", saveData);
  }
}
```

이제 `localStorage`를 직접 호출하는 부분만 잘라내어 별도의 클래스로 분리한다.

```tsx
class StorageRepo {
  save(key: string, value: string) {
    window.localStorage.setItem(key, value);
  }
}

class MyClass {
  private repo = new StorageRepo();
  save(data: number) {
    const saveData = `user data no: ${data}`;
    this.repo.save("userData", saveData);
  }
}
```

이렇게 분리하면 `MyClass`는 더 이상 전역 객체를 직접 호출하지 않고 `StorageRepo`에 위임한다.
따라서 테스트에서는 `StorageRepo`를 모킹하면 된다.

```tsx
jest.mock("./StorageRepo");

// jest.mock으로 StorageRepo 경로에서 로드된 모듈을 목으로 교체
let MockRepo = jest.mocked(StorageRepo);

describe("테스트", () => {
  afterEach(() => {
    // 테스트가 종료된 후에는 mockClear를 호출해,
    // 인스턴스가 남아 다음 테스트에 영향을 끼치는 것을 방지함
    MockRepo.mockClear();
  });

  test("save()", () => {
    // 목 클래스가 초기화
    const testObj = new MyClass();
    const saveData = 12345;
    testObj.save(saveData);
    const instance = MockRepo.mock.instances[0];

    // 그 인스턴스를 받아와 save 함수가 호출되는지 확인
    expect(instance.save).toHaveBeenCalledWith(
      "userData",
      `user data no: ${saveData}`
    );
  });
});
```

이전 코드에 비하면 훨씬 간단해졌지만, 여전히 한계가 있다.
`StorageRepo`를 내부에서 직접 초기화하기 때문에 완전히 격리되지 않았고,
여전히 글로벌 목 수준의 모킹을 하고 있기 때문이다.

이를 개선하기 위해 외부에서 의존성을 주입한다.
`StorageRepo`를 `MyClass` 내부에서 만들지 않고, 생성자의 인자로 주입받도록 한다.

```tsx
class MyClass {
  // MyClass의 StorageRepo를 내부에서 초기화하는 대신 초기화 인자로 주입받도록 힘
  constructor(private repo: StorageRepo) {}
  save(data: number) {
    const saveData = `user data no: $${data}`;
    this.repo.save("userData", saveData);
  }
}
```

이제 테스트에서는 더 이상 `jest.mock`을 쓸 필요가 없다.
대신 `StorageRepo` 인스턴스를 직접 주입하고, `jest.spyOn`을 이용해 함수 호출 여부를 확인할 수 있다.

```tsx
// StorageRepo를 바깥에서 생성해 건네줄 수 있기 때문에,
// 더 이상 jest.mock을 사용할 필요는 없음
// let MockRepo = jest.mocked(StorageRepo);

describe("테스트", () => {
  test("save()", () => {
    let dataManager = new StorageRepo();
    // 대신 테스트 케이스에서 생성한 StorageRepo 인스턴스의 메서드를
    // 스파잉하여 해당 함수의 호출 여부를 테스트함
    jest.spyOn(dataManager, "save");

    const testobj = new MyClass(dataManager);
    const saveData = 12345;
    testobj.save(saveData);

    expect(dataManager.save).toHaveBeenCalledWith(
      "userData",
      `user data no: ${saveData}`
    );
  });
});
```

이제 목의 단계가 **글로벌 목 → 오브젝트 스파잉** 단계로 내려왔다.
하지만 우리의 목표는 **더미와 스텁만으로 테스트할 수 있는 구조**다. 이를 위해 필요한 것은 바로 다형성이다.

```tsx
interface Repository {
  save(key: string, value: string): void;
}

class StorageRepo implements Repository {
  save(key: string, data: any) {
    window.localStorage.setItem(key, data);
  }
}

class MyClass {
  constructor(private repo: Repository) {}
  save(data: number) {
    const saveData = `user data no: ${data}`;
    this.repo.save("userData", saveData);
  }
}
```

`Repository` 인터페이스를 도입하면, `MyClass`는 `Repository`를 구현하는 어떤 객체든 주입받을 수 있다.
따라서 테스트에서는 단순히 **더미와 스텁 객체**를 넣어주면 된다.

```tsx
describe("테스트", () => {
  test("save()", () => {
    let data: any = {};
    const testobj = new MyClass({
      save: (key, val) => (data[key] = val),
    });
    const saveData = 12345;
    testobj.save(saveData);
    expect(data.userData).toBe(`user data no: ${saveData}`);
  });
});
```

테스트가 훨씬 단순해진 걸 확인할 수 있다! (오브젝트 스파잉도, 글로벌 목도 필요 없음)

테스트는 오직 `MyClass`의 로직에만 집중하고 저장소 구현 방식(`localStorage`, `IndexedDB`, 서버 API 호출 등)이 어떻게 바뀌든 테스트 코드에는 영향을 주지 않는다.

<br>

### 테스트 하기 좋은 코드 = 거의 SOLID하다.

시간 관계 상 다음 기회에…
