---
author: choiOV
pubDatetime: 2025-09-12T14:57:00.000Z
modDatetime: 2025-09-12T14:57:00.000Z
title: 타입스크립트 핸드북 - Everyday Types
slug: everyday-types
featured: false
draft: false
tags:
  - 타입스크립트
  - 핸드북 Everyday Types
description: 타입스크립트 핸드북 Everyday Types를 읽고 스터디 발표를 위해 정리한 글입니다.
---

### 목차

<!-- toc -->

- [빠르게 개념 복습하기](#%EB%B9%A0%EB%A5%B4%EA%B2%8C-%EA%B0%9C%EB%85%90-%EB%B3%B5%EC%8A%B5%ED%95%98%EA%B8%B0)
- [**읽으면서 중요하다고 생각한 포인트**](#%EC%9D%BD%EC%9C%BC%EB%A9%B4%EC%84%9C-%EC%A4%91%EC%9A%94%ED%95%98%EB%8B%A4%EA%B3%A0-%EC%83%9D%EA%B0%81%ED%95%9C-%ED%8F%AC%EC%9D%B8%ED%8A%B8)

<!-- tocstop -->

<br>

<img src="/assets/everyday-types-intro.png" alt="Everyday Types 인트로 이미지" width="650" />

<br>

이 글은 [타입스크립트 핸드북 Everyday Types](https://www.typescriptlang.org/ko/docs/handbook/2/everyday-types.html)를 읽고 스터디 발표를 위해 정리한 글입니다.  
스터디원 모두가 해당 내용을 읽은 상태이므로 전체 내용을 담기보다는 핵심적인 부분과  
제가 중요하게 생각한 포인트만 별도로 정리했습니다.  
따라서 요약과 생략이 많을 수 있으니 양해 부탁드립니다. 감사합니다.

<br>

### 빠르게 개념 복습하기

1. **원시 타입**
   1. `string`, `number`, `boolean` → JS 기본 값들을 안전하게 표현 가능
   2. 대문자로 시작하는 타입도 유효하지만, 극히 드뭄 → 소문자가 원칙
2. **컬렉션 타입 (배열, 객체)**
   1. 배열 ⇒ `타입[]` 또는 `Array<타입>`
      1. `[타입]` → **튜플** (배열 아님!)
   2. 객체 ⇒ `{ 키: 타입 }`
      1. 프로퍼티 구분 → `,` 또는 `;` 사용 가능, 마지막 구분자는 선택 사항
      2. 타입 생략 → `any`로 간주
3. **any와 타입 추론**
   1. `any` ⇒ 타입 검사 비활성화, 최대한 지양
   2. 타입 미지정 ⇒ TS가 추론
      1. 추론 실패 → `any` (→ `noImplicitAny` 옵션으로 방지 가능)
4. **함수 타입**

   1. 매개변수 타입 표기

      ```tsx
      function greet(name: string) { ... }
      ```

   2. 반환 타입 표기 ⇒ 선택 사항, 추론되는 경우가 많음
   3. 익명 함수 ⇒ **문맥적 타입** 활용

5. **객체 타입 심화**
   1. 옵셔널 프로퍼티 ⇒ `{ 키?: 타입 }`
   2. `undefined` 가능성을 고려해야 함 → `if` 체크 또는 `?.` 사용 → 타입 추론(Narrowing)
6. **유니언과 좁히기(Narrowing)**
   1. `타입1 | 타입2` → 값이 여러 타입 중 하나일 수 있음
   2. 좁히기 필수 → `typeof`, `Array.isArray` 등 사용
7. **타입 별칭 vs 인터페이스**
   1. `type` → 모든 타입에 이름 부여 가능 (유니언, 원시 포함)
   2. `interface` → 주로 객체 구조, 확장, 선언 병합 가능
   3. 차이점 → `type`은 닫혀 있고, `interface`는 열려 있음
8. **리터럴 타입**
   1. `"left" | "right" | "center"` → 특정 값만 허용
9. **`null`과 `undefined`**
   1. `strictNullChecks` 끄면 → 어디든 대입 가능 (위험)
   2. 켜면 → 반드시 타입에 포함시켜야 함 (`string | null`)
10. **기타**
    1. 타입 단언 ⇒ `as T` / `!` (non-null assertion)
    2. `enum` ⇒ 런타임에도 남는 상수 집합 → 대신 리터럴 유니언 추천
    3. 드물게 쓰이는 타입: `bigint`, `symbol`

<br>

### **읽으면서 중요하다고 생각한 포인트**

- **타입 좁히기** ([by 한 입 크기로 잘라먹는 타입스크립트](https://ts.winterlood.com/92c2035a-49bc-4585-9e3d-43206ce92d59))

  1. 표준 가드 적극 활용하기

     1. `typeof` → 원시 타입 (number, string, boolean)

        ```tsx
        function func(value: number | string) {
          if (typeof value === "number") {
            console.log(value.toFixed());
          } else if (typeof value === "string") {
            console.log(value.toUpperCase());
          }
        }
        ```

     2. `instanceof` → 클래스/내장 객체 (Date, Error)

        ```tsx
        function func(value: number | string | Date | null) {
          if (typeof value === "number") {
            console.log(value.toFixed());
          } else if (typeof value === "string") {
            console.log(value.toUpperCase());
          } else if (value instanceof Date) {
            console.log(value.getTime());
          }
        }
        ```

     3. `in` → 커스텀 객체 속성 확인

        ```tsx
        type Person = {
          name: string;
          age: number;
        };

        function func(value: number | string | Date | null | Person) {
          if (typeof value === "number") {
            console.log(value.toFixed());
          } else if (typeof value === "string") {
            console.log(value.toUpperCase());
          } else if (value instanceof Date) {
            console.log(value.getTime());
          } else if (value && "age" in value) {
            console.log(`${value.name}은 ${value.age}살 입니다`);
          }
        }
        ```

- **객체 ⇒ 타입 별칭 vs 인터페이스** (by 코딩애플)
  1.  `type`을 자주 활용해도 무방함 → 더 범용적이고 간단
  2.  **다른 사람이 내 코드를 이용하는 상황**
      1.  `interface`가 유리함 → 확장(`extends`)이나 선언 병합이 가능해서 유연함
      2.  그래서 라이브러리/프레임워크의 공개 API는 interface로 정의된 경우가 많음
  3.  **팀 컨벤션 예시**
      1.  객체 자료형은 모두 `interface`
      2.  유니언/원시/리터럴 별칭은 `type`
      3.  결국 팀이 합의한 기준에 맞추는 게 중요
  4.  **정리**
      1.  `type`과 `interface`는 문법 차이만 잘 알고 있으면,
      2.  무엇을 쓸지는 상황과 협업 스타일에 따라 정하기 나름
