---
author: choiOV
pubDatetime: 2025-09-20T07:15:00.000Z
modDatetime: 2025-09-20T07:15:00.000Z
title: 타입스크립트 핸드북 - Narrowing
slug: narrowing
featured: false
draft: false
tags:
  - 타입스크립트
  - 핸드북 Narrowing
description: 타입스크립트 핸드북 Narrowing을 읽고 스터디 발표를 위해 정리한 글입니다.
---

### 목차

<!-- toc -->

- [목차](#목차)
- [1. Narrowing 기본 개념](#1-narrowing-기본-개념)
- [2. `typeof` \& 타입 가드](#2-typeof--타입-가드)
- [3. Truthiness Narrowing (Truthy/Falsy 좁히기)](#3-truthiness-narrowing-truthyfalsy-좁히기)
- [4. Equality Narrowing (동등성 좁히기)](#4-equality-narrowing-동등성-좁히기)
- [5. `in` 연산자 Narrowing](#5-in-연산자-narrowing)
- [6. `instanceof` Narrowing](#6-instanceof-narrowing)
- [7. Assignments Narrowing (할당을 통한 타입 좁히기)](#7-assignments-narrowing-할당을-통한-타입-좁히기)
- [8. Control Flow Analysis (제어 흐름 분석)](#8-control-flow-analysis-제어-흐름-분석)
- [9. Type Predicates (사용자 정의 타입 가드)](#9-type-predicates-사용자-정의-타입-가드)
- [10. Discriminated Unions (식별 가능한 유니언 타입)](#10-discriminated-unions-식별-가능한-유니언-타입)
- [11. `never` \& Exhaustiveness Checking (`never` 타입 \& 빠짐없이 검사하기)](#11-never--exhaustiveness-checking-never-타입--빠짐없이-검사하기)
- [12. 보너스 (실전 설계 문제)](#12-보너스-실전-설계-문제)

<!-- tocstop -->

<br>

<img src="/assets/narrowing/intro.png" alt="Narrowing 인트로 이미지" width="650" />

<br>

이 글은 [타입스크립트 핸드북 Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)를 읽고 스터디 발표를 위해 정리한 글입니다.  
스터디원 모두가 해당 내용을 이미 읽었기 때문에, 학습 효과를 높이고자 퀴즈 형식으로 재구성하여 정리했습니다. 감사합니다.

<br>

### 1. Narrowing 기본 개념

**Q1.** Narrowing은 `if/else`, 삼항, `return` 같은 **제어 흐름**을 따라가며 타입을 더 구체적으로 만든다.

→ O / X 이유도 함께 말씀해주세요

<br><br><br><br><br><br><br><br><br><br>
<br><br><br><br><br><br><br><br><br><br>

- **정답**
  **⇒ O**
  타입스크립트는 [제어 흐름 분석(Control Flow Analysis)](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#control-flow-analysis)으로 실행 경로를 추적하며 타입을 좁힌다.

<br>

### 2. `typeof` & 타입 가드

**Q2.** `typeof v === "number"` 블록 안에서 `v`의 타입은? 이유도 함께 말씀해주세요

```tsx
function format(v: string | number) {
  if (typeof v === "number") {
    // 여기서 v의 타입은?
    return v.toFixed(1);
  }
  return v.toUpperCase();
}
```

1. `string`
2. `number`
3. `string | number`

<br><br><br><br><br><br><br><br><br><br>
<br><br><br><br><br><br><br><br><br><br>

- **정답**
  **⇒ 2번**
  `typeof`는 타입 가드로 동작하여 분기 내부에서 `number`로 좁혀진다.
  <img src="/assets/narrowing/q2.png" alt="" />

<br>

### 3. Truthiness Narrowing (Truthy/Falsy 좁히기)

**Q3.** `if (name)`이 **거짓**이 되는 값은? (다중 선택) 이유도 함께 말씀해주세요

```tsx
function greet(name?: string) {
  if (name) return `Hi, ${name}`;

  return "Hi, stranger";
}
```

1. `"Alice"`
2. `""`
3. `undefined`
4. `"0"`

<br><br><br><br><br><br><br><br><br><br>
<br><br><br><br><br><br><br><br><br><br>

- **정답**
  **⇒ 2, 3번**
  `""`와 `undefined`는 falsy. `"0"`(문자열)은 truthy이다.
  ※ 빈 문자열 누락 위험을 항상 염두!
  <img src="/assets/narrowing/q3.png" alt="" />

<br>

### 4. Equality Narrowing (동등성 좁히기)

**Q4.** `if` 블록 안에서 `x`, `y`의 타입은? 이유도 함께 말씀해주세요

```tsx
function same(x: string | number, y: string | boolean) {
  if (x === y) {
    return [x, y]; // 여기서 x, y의 타입은?
  }
}
```

1. `string`
2. `number`
3. `boolean`
4. `string | number | boolean`

<br><br><br><br><br><br><br><br><br><br>
<br><br><br><br><br><br><br><br><br><br>

- **정답**
  **⇒ 1번**
  공통 가능 타입은 `string` 뿐이라 두 값 모두 `string`으로 좁혀진다.
  <img src="/assets/narrowing/q4-1.png" alt="" />

<br>

**Q4-보너스.** `value != null`은 `null`과 `undefined` 둘 다를 걸러낸다.

→ O / X 이유도 함께 말씀해주세요

<br><br><br><br><br><br><br><br><br><br>
<br><br><br><br><br><br><br><br><br><br>

- **정답**
  **⇒ O**
  [느슨한 비교(부등 연산자)](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Inequality) `!=`는 `null | undefined` 동시 제거에 유용하다.
  <img src="/assets/narrowing/q4-2.png" alt="" />

<br>

### 5. `in` 연산자 Narrowing

**Q5.** 각 분기에서 `a`의 타입으로 올바른 것은? 이유도 함께 말씀해주세요

```tsx
type Cat = { meow: () => void };
type Dog = { bark: () => void };
type Human = { meow?: () => void; bark?: () => void };

function speak(a: Cat | Dog | Human) {
  if ("meow" in a) {
    // 여기서 a의 타입은?
    return "maybe cat or human";
  }
  // 여기서 a의 타입은?
  return "maybe dog or human";
}
```

1. 참분기: `Cat | Human` / 거짓분기: `Dog`
2. 참분기: `Cat` / 거짓분기: `Dog | Human`
3. 참분기: `Cat | Human` / 거짓분기: `Dog | Human`
4. 참분기: `Cat` / 거짓분기: `Dog`

<br><br><br><br><br><br><br><br><br><br>
<br><br><br><br><br><br><br><br><br><br>

- **정답**
  **⇒ 3번**
  `Human`의 `meow?`는 선택적이라 **있을 수도/없을 수도** 있음 →
  `"meow" in a`가 참이면 `Cat | Human`, 거짓이면 `Dog | Human`가 남는다.
  (선택적 프로퍼티(`?`)가 있는 타입은 양쪽 분기에 모두 남을 수 있음)
  <img src="/assets/narrowing/q5-1.png" alt="" />
  <img src="/assets/narrowing/q5-2.png" alt="" />

<br>

### 6. `instanceof` Narrowing

**Q6.** `if` 블록 안에서 `x`의 타입은? 이유도 함께 말씀해주세요

```tsx
function info(x: Date | URL) {
  if (x instanceof URL) {
    // 여기서 x의 타입은?
    return x.hostname;
  }
  return x.toISOString();
}
```

1. `Date`
2. `URL`
3. `Date | URL`

<br><br><br><br><br><br><br><br><br><br>
<br><br><br><br><br><br><br><br><br><br>

- **정답**
  **⇒ 2번**
  `instanceof`는 해당 생성자의 프로토타입 체인을 따라 타입을 좁혀준다.
  <img src="/assets/narrowing/q6.png" alt="" />

<br>

### 7. Assignments Narrowing (할당을 통한 타입 좁히기)

**Q7.** 각 줄에서 **관찰되는 타입**으로 맞는 것은? 이유도 함께 말씀해주세요

```tsx
let v: string | number = Math.random() > 0.5 ? "hi" : 7;
v = 9; // 지금 관찰되는 타입은?
v = "bye"; // 지금 관찰되는 타입은?
```

1. 첫 재할당 후 `number`, 그 다음 `string`
2. 둘 다 `string | number`
3. 둘 다 `any`

<br><br><br><br><br><br><br><br><br><br>
<br><br><br><br><br><br><br><br><br><br>

- **정답**
  **⇒ 1번**
  <img src="/assets/narrowing/q7-1.png" alt="" />
  해설은 보너스 문제와 함께

**Q7-보너스.** 마지막 v는 타입 에러가 발생할까? 이유도 함께 말씀해주세요

→ O / X

```tsx
let v: string | number = Math.random() > 0.5 ? "hi" : 7;
v = 9;
v = "bye";
v = true; // 타입 에러가 발생할까?
```

<br><br><br><br><br><br><br><br><br><br>
<br><br><br><br><br><br><br><br><br><br>

- **정답**
  **⇒ O**
  `boolean`이 `string | number` 타입에 포함되지 않으므로 오류가 발생한다.
  <img src="/assets/narrowing/q7-2.png" alt="" />
  해설: 현재 값에 의해 순간적으로 타입은 좁혀 보이지만, 결국 넣을 수 있는 값의 범위는 처음 선언된 타입(`string | number`)에 의해 결정된다.

<br>

### 8. Control Flow Analysis (제어 흐름 분석)

**Q8.** `return`으로 한 분기가 종료되면, 남은 경로에서는 해당 분기의 타입 가능성은 제거되어 더 좁혀진다.
이에 대한 올바른 설명은?

1. `return`은 타입과 관계없고 단순히 함수 실행만 끝낸다.
2. `return`으로 분기가 끝나면, 이후 경로에서 해당 타입 가능성은 제거되어 타입이 좁혀진다.
3. `return`은 분기와 상관없이 항상 타입을 그대로 유지한다.
4. `return`이 나오면 타입은 좁혀지지만, `strictNullChecks`를 꺼야 동작한다.

<br><br><br><br><br><br><br><br><br><br>
<br><br><br><br><br><br><br><br><br><br>

- **정답**
  **⇒ 2번**
  타입스크립트는 코드의 실행 흐름(도달 가능성)을 따라가면서, 조건문·할당마다 변수가 가질 수 있는 타입을 좁히고, 분기와 합류 지점에서 타입을 다시 계산한다.
  1. `return`은 함수 실행을 끝낸다는 건 맞지만, 타입 분석에도 직접적인 영향을 준다.
     1. 어떤 분기가 `return`으로 끝나면 그 경로는 더 이상 실행될 수 없음
        따라서 타입스크립트는 **그 분기에 해당하는 타입 가능성을 제거**함
  2. 타입스크립트는 **제어 흐름 분석(Control Flow Analysis)** 을 수행한다.
     1. 따라서 `if` 분기 안에서 `return`을 만나면, 나머지 코드에서는 그 조건을 만족하는 타입이 제외됨
     2. 즉, 남은 코드에서 타입이 더 좁혀진 상태로 추론됨
  3. 분기와 상관없이 타입을 그대로 유지한다면, 타입스크립트는 타입 안전성을 제대로 보장하지 못한다.
  4. `strictNullChecks`는 **`null`/`undefined`를 엄격하게 다루는 옵션**일 뿐, 제어 흐름 분석 자체에는 영향을 주지 않음
     1. 즉, return에 따른 타입 좁히기는 **`strictNullChecks`와 상관없이 항상 동작**함

<br>

### 9. Type Predicates (사용자 정의 타입 가드)

**Q9.** 아래 예제에서 `isOk(something)`를 반환한 분기 안에서 `something`의 타입은?
이유도 함께 말씀해주세요

```tsx
function isOk(v: unknown): v is { ok: true } {
  return typeof v === "object" && v !== null && (v as any).ok === true;
}

const something: unknown = { ok: true };

if (isOk(something)) {
  // 여기서 something 타입은 무엇일까요?
  console.log(typeof something);
} else {
  // 여기서 something 타입은 무엇일까요?
  console.log(typeof something);
}
```

1. 번호
   1. **if 분기 안**: `something`은 `{ ok: true }`
   2. **else 분기 안**: `something`은 `unknown`
2. 번호
   1. **if 분기 안**: `something`은 `object`
   2. **else 분기 안**: `something`은 `null`
3. 번호
   1. **if 분기 안**: `something`은 `any`
   2. **else 분기 안**: `something`은 `never`

<br><br><br><br><br><br><br><br><br><br>
<br><br><br><br><br><br><br><br><br><br>

- **정답**
  **⇒ 1번**
  사용자 정의 타입 가드(`v is { ok: true }`) 덕분에
  `isOk(something)`이 `true`일 때는 타입이 `{ ok: true }`로 좁혀지고,
  `false`일 때는 원래 타입인 `unknown`으로 남는다.
  <img src="/assets/narrowing/q9-1.png" alt="" />
  <img src="/assets/narrowing/q9-2.png" alt="" />

<br>

### 10. Discriminated Unions (식별 가능한 유니언 타입)

**Q10.** 아래 `login` 함수가 각 분기에서 안전한 이유는 무엇일까요?

```tsx
type Login =
  | { type: "password"; id: string; pw: string }
  | { type: "oauth"; provider: "google" | "github"; token: string };

function login(l: Login) {
  switch (l.type) {
    case "password":
      return l.pw.length;
    case "oauth":
      return l.provider.toUpperCase();
  }
}
```

1. `switch`에서 각 케이스에 `return`이 있어서
2. `strictNullChecks` 옵션 설정 덕분에
3. 공통 리터럴 필드로 각 케이스의 필수 프로퍼티가 보장되니까
4. `any` 타입으로 암묵 변환되기 때문에

<br><br><br><br><br><br><br><br><br><br>
<br><br><br><br><br><br><br><br><br><br>

- **정답**
  **⇒ 3번**
  **식별 가능한 유니언 타입(Discriminated Union)**은
  유니언 타입의 모든 멤버가 **공통 필드(discriminant)**를 가진 경우 동작함
  그 공통 필드에 리터럴 타입 값(예제에선 `type:` 필드)이 들어가면,
  타입스크립트는 `if`나 `switch` 조건 검사에 따라 자동으로 타입을 좁혀줌
  <img src="/assets/narrowing/q10.png" alt="" />

### 11. `never` & Exhaustiveness Checking (`never` 타입 & 빠짐없이 검사하기)

**Q11. `default`의 역할은?**

```tsx
type Animal = { kind: "cat"; meow: string } | { kind: "dog"; bark: string };

function speak(a: Animal) {
  switch (a.kind) {
    case "cat":
      return a.meow;
    case "dog":
      return a.bark;
    default:
      const _ex: never = a;
      return _ex;
  }
}
```

1. 아무 의미 없음
2. 새 케이스 추가 시 누락을 컴파일 타임 에러로 잡아줌
3. 런타임 최적화

<br><br><br><br><br><br><br><br><br><br>
<br><br><br><br><br><br><br><br><br><br>

- **정답**
  **⇒ 2번**
  새로운 멤버가 추가되면, 아직 처리되지 않은 타입이 남기 때문에 `a`가 `never`가 될 수 없어 에러로 경고한다
  <img src="/assets/narrowing/q11.png" alt="" />

<br>

### 12. 보너스 (실전 설계 문제)

**Q12.** 다음 옵션 설계를 **Discriminated Union(식별 가능한 유니언 타입)**으로 안전하게 바꿔주세요

```tsx
interface Pay {
  method: "card" | "cash";
  cardNo?: string;
  amount?: number;
}

// method가 "card"인데 cardNo가 없어도 통과됨 → 타입에서 걸러지지 않음
const card: Pay = { method: "card" };
```

<br><br><br><br><br><br><br><br><br><br>
<br><br><br><br><br><br><br><br><br><br>

- **정답**

1. 정답

   ```tsx
   type Pay =
     | { method: "card"; cardNo: string }
     | { method: "cash"; amount: number };
   ```

<img src="/assets/narrowing/q12-1.png" alt="" />

<br>

2. 정답

```tsx
interface CardPay {
  method: "card";
  cardNo: string;
  amount: number;
}

interface CashPay {
  method: "cash";
  amount: number;
}

type Pay = CardPay | CashPay;
```

<img src="/assets/narrowing/q12-2.png" alt="" />
