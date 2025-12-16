---
author: choiOV
pubDatetime: 2025-10-18T17:00:00.000Z
modDatetime: 2025-10-18T17:00:00.000Z
title: 타입스크립트 핸드북 - Object Types
slug: object-types
featured: false
draft: false
tags:
  - 타입스크립트
  - 핸드북 Object Types
description: 타입스크립트 핸드북 Object Types를 읽고 스터디 발표를 위해 정리한 글입니다.
---

### 목차

<!-- toc -->

- [1. Object Type 기본](#1-object-type-기본)
- [2. Property Modifiers (속성 한정자)](#2-property-modifiers-속성-한정자)
  - [Optional (선택적 속성)](#optional-선택적-속성)
  - [readonly (읽기 전용)](#readonly-읽기-전용)
- [3. Index Signatures (인덱스 시그니처)](#3-index-signatures-인덱스-시그니처)
- [4. Excess Property Checks (잉여 속성 검사)](#4-excess-property-checks-잉여-속성-검사)
- [5. Extending Types (타입 확장)](#5-extending-types-타입-확장)
- [6. Intersection Types (\&)](#6-intersection-types-)
- [7. Interface vs Intersection 차이](#7-interface-vs-intersection-차이)
- [8. Generic Object Types (제네릭 객체 타입)](#8-generic-object-types-제네릭-객체-타입)
- [9. Array \& ReadonlyArray](#9-array--readonlyarray)
- [10. Tuple \& readonly Tuple](#10-tuple--readonly-tuple)
- [전체 개념 흐름 요약](#전체-개념-흐름-요약)

<!-- tocstop -->

<br>

<img src="/assets/object-types/intro.png" alt="Object Types 인트로 이미지" width="650" />

<br>

이 글은 [타입스크립트 핸드북 Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html)를 읽고 스터디 발표를 위해 정리한 글입니다.  
스터디원 모두가 해당 내용을 읽은 상태이므로 전체 내용을 담기보다는 핵심적인 부분과  
제가 중요하게 생각한 포인트만 별도로 정리했습니다.  
따라서 요약과 생략이 많을 수 있으니 양해 부탁드립니다. 감사합니다.

## 1. Object Type 기본

- 자바스크립트의 객체 구조를 타입으로 표현
- 세 가지 정의 방식
  ```tsx
  function f(p: { name: string; age: number }) {}
  interface Person {
    name: string;
    age: number;
  }
  type Person = { name: string; age: number };
  ```

<br>

## 2. Property Modifiers (속성 한정자)

### Optional (선택적 속성)

- `?` 사용 → 존재하지 않아도 됨
- 읽을 때는 `number | undefined` 로 인식됨
- 기본값 지정은 구조 분해 할당으로 처리 가능

```tsx
interface PaintOptions {
  xPos?: number;
  yPos?: number;
}

function draw({ xPos = 0, yPos = 0 }: PaintOptions) {}
```

<br>

### readonly (읽기 전용)

- 컴파일 타임에 재할당 금지
- 내부 값은 변경 가능 (얕은 불변)
- 런타임에는 영향 없음 (개발 의도 표현용)

```tsx
interface Home {
  readonly owner: string;
}
```

<br>

## 3. Index Signatures (인덱스 시그니처)

- 키 이름이 동적으로 변할 때 사용
  ```tsx
  interface StringArray {
    [index: number]: string;
  }
  ```
- 숫자 인덱스는 문자열 인덱스 반환 타입의 **서브타입**이어야 함
- `readonly [index: number]: T` 로 변경 불가 인덱스 정의 가능

<br>

## 4. Excess Property Checks (잉여 속성 검사)

- 객체 리터럴을 **직접 전달할 때**, 선언되지 않은 속성이 있으면 에러 발생
  ```tsx
  createSquare({ colour: "red", width: 100 }); // 에러
  ```
- 해결 방법
  1. 타입 단언 `as`
  2. 인덱스 시그니처 `[prop: string]: unknown`
  3. 변수에 먼저 담기 (단, 공통 속성 필요)
- 대부분 실제 버그를 잡아주는 기능이므로, 우회보다 타입 정의 수정이 권장됨

<br>

## 5. Extending Types (타입 확장)

- 기존 타입을 **복사 + 확장**
  ```tsx
  interface Address {
    city: string;
  }
  interface AddressWithUnit extends Address {
    unit: string;
  }
  ```
- 코드 중복 감소, 관계 명시적 표현
- 다중 확장 가능 (`extends A, B`)

<br>

## 6. Intersection Types (&)

- 여러 타입을 결합 → **모두 만족하는 타입**
  ```tsx
  type ColorfulCircle = Colorful & Circle;
  ```
- 충돌 시 **둘 다 만족해야 함** → 불가능하면 `never`로 수렴

<br>

## 7. Interface vs Intersection 차이

| **구분**  | **Interface extends** | **Intersection (&)** |
| --------- | --------------------- | -------------------- |
| 병합 방식 | 상속(확장)            | 교집합(결합)         |
| 충돌 시   | 에러 발생             | never                |
| 의도      | 구조적 확장           | 타입 조건 결합       |

<br>

## 8. Generic Object Types (제네릭 객체 타입)

- “타입을 변수처럼” 받는 구조
  ```tsx
  interface Box<T> {
    contents: T;
  }
  ```
- 재사용성 극대화
  - `Box<string>` → `{ contents: string }`
  - `Box<number>` → `{ contents: number }`
- 함수에서도 활용 가능
  ```tsx
  function setContents<T>(box: Box<T>, value: T) {
    box.contents = value;
  }
  ```
- 타입 중복, 오버로드 제거 효과

<br>

## 9. Array & ReadonlyArray

| **구분**                        | **설명**                               |
| ------------------------------- | -------------------------------------- |
| T[] = Array<T>                  | 일반 배열                              |
| readonly T[] = ReadonlyArray<T> | 수정 불가능한 배열                     |
| 할당성                          | mutable → readonly 가능 / 반대 불가    |
| 목적                            | 불변성 유지, 함수 인자로 안전하게 전달 |

<br>

## 10. Tuple & readonly Tuple

- **Tuple:** 길이와 각 위치의 타입이 고정된 배열
  ```tsx
  type Pair = [string, number];
  ```
- Optional 요소: `[x: number, y?: number]`
- Rest 요소: `[string, number, ...boolean[]]`
- `readonly Tuple: readonly [T1, T2]` → 수정 불가
- `as const` 사용 시 자동으로 `readonly tuple` 추론됨

<br>

## 전체 개념 흐름 요약

| **개념**               | **핵심 포인트**          |
| ---------------------- | ------------------------ |
| Object Type            | 기본 구조 정의           |
| Optional / readonly    | 속성의 존재·수정 여부    |
| Index Signature        | 동적 키 허용             |
| Excess Property Check  | 오타 방지 안전장치       |
| Extends / &            | 타입 확장 vs 결합        |
| Generic                | 타입을 변수화하여 재사용 |
| Array / Tuple          | 자료구조의 타입 표현     |
| readonly Array / Tuple | 불변성 보장              |
