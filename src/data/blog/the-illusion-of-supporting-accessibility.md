---
author: choiOV
pubDatetime: 2025-09-30T15:43:00.000Z
modDatetime: 2025-09-30T15:43:00.000Z
title: 접근성을 지원한다는 착각
slug: the-illusion-of-supporting-accessibility
featured: true
draft: false
tags:
  - UI/UX
  - 웹 접근성
description: 접근성은 “지원”이 아니라 “필수”다.
---

### 목차

<!-- toc -->

- [**접근성은 지원이 아니라, 당연히 고려해야 하는 것**](#%EC%A0%91%EA%B7%BC%EC%84%B1%EC%9D%80-%EC%A7%80%EC%9B%90%EC%9D%B4-%EC%95%84%EB%8B%88%EB%9D%BC-%EB%8B%B9%EC%97%B0%ED%9E%88-%EA%B3%A0%EB%A0%A4%ED%95%B4%EC%95%BC-%ED%95%98%EB%8A%94-%EA%B2%83)
- [**섹션 접힘/펼침 요구사항을 테스트하기**](#%EC%84%B9%EC%85%98-%EC%A0%91%ED%9E%98%ED%8E%BC%EC%B9%A8-%EC%9A%94%EA%B5%AC%EC%82%AC%ED%95%AD%EC%9D%84-%ED%85%8C%EC%8A%A4%ED%8A%B8%ED%95%98%EA%B8%B0)
- [**플랫폼을 가리지 않는 원리**](#%ED%94%8C%EB%9E%AB%ED%8F%BC%EC%9D%84-%EA%B0%80%EB%A6%AC%EC%A7%80-%EC%95%8A%EB%8A%94-%EC%9B%90%EB%A6%AC)
- [**마치며**](#%EB%A7%88%EC%B9%98%EB%A9%B0)

<!-- tocstop -->

<img src="/assets/the-illusion-of-supporting-accessibility/intro.png" alt="접근성을 지원한다는 착각 인트로 이미지" width="650" />

<br>

(이 글은 [접근성을 지원한다는 착각](https://blog.banksalad.com/tech/the-illusion-of-supporting-accessibility/) 아티클을 읽고 스터디 발표를 위해 정리한 글입니다. 따라서 요약과 생략이 많을 수 있으니 양해 부탁드립니다.)

(또한 이 글은 노션에서 처음 작성되었으며, 노션의 원문 스타일이 블로그에 완전히 적용되지 않아, 일부 가독성이 떨어질 수 있는 점 양해 부탁드립니다. 감사합니다.)

<br>

### **접근성은 지원이 아니라, 당연히 고려해야 하는 것**

접근성은 ‘지원한다’고 표현할 대상이 아니다. 마치 **“보안성을 지원한다”** 라는 말이 어색한 것처럼,
**“접근성을 지원한다”** 라는 말도 어색한 것이다. 보안은 처음부터 고려하는 기본 요소이고,
접근성 또한 **개발 과정에 당연히 녹아들어야 하는 것**이다.

접근성이 높다는 것은 곧 **다양한 환경에서 일관되게 동작하는 제품**을 만든다는 뜻이다.
그리고 그 다양한 환경에서 동일하게 해석되게 하려면 출력물이 반드시 **텍스트**여야 한다.
텍스트만이 특정 환경에 의존하지 않고, 그 자체로 의미를 전달할 수 있기 때문이다.

<br>

### **섹션 접힘/펼침 요구사항을 테스트하기**

예를 들어, 화면에 처음 진입했을 때 `첫 번째 섹션은 접혀 있고, 두 번째 섹션은 펼쳐져 있어야 한다`는 요구사항이 있다고 하자.
아래처럼 실제 UI가 그렇게 구성되어 있을 때, 이 요구사항을 어떻게 테스트 코드로 표현할 수 있을까?

![section.png](public/assets/the-illusion-of-supporting-accessibility/section.png)

<br>

1. **스냅샷 테스트**

```jsx
func TestSnapshot() {
  let view = MyView()
  let snapshot = view.snapshot
  assertEqual(snapshot, MyView.reference.png)
}
```

이 방식은 테스트 코드를 읽어서는 무엇을 검증하는지 전혀 알 수 없다.
또한 스냅샷 테스트는 **요구사항에 없는 사소한 디테일까지 한 번에 검사**하기 때문에,
명세로서 가치가 부족하고 유지보수 비용도 크다.

<br>

2. **비즈니스 로직 추상화**

```jsx
describe('expandedSectionsOnInitialRender') {
    const expandedSections = expandedSectionsOnInitialRender()
    it('첫번째 섹션은 접혀져 있어야 한다') {
        assert(expandedSections.not.to.contain(0))
    }
   it ('두번째 섹션은 펼쳐져 있어야 한다') {
      assert(expandedSections.to.beEqualTo([1])
   }
```

이 방법은 요구사항을 표현할 수는 있다. 그러나 이를 위해 **테스트 전용 함수나 자료형**을 따로 만들어야 한다.
더 나아가, 이렇게 만들어진 함수가 실제 UI에서 쓰이고 있다는 보장이 없다.
선언만 남고 사용은 사라진 함수와, 그 위에 얹힌 테스트가 코드베이스에 남아 **“명세가 살아 있다”**는 착각만 불러일으킬 수 있다.

<br>

3. **접근성을 고려한 UI 테스트**

```jsx
describe("고정비 상세", () => {
  render(<고정비상세화면 />);

  it("첫번째 섹션은 접혀져 있어야 한다", async () => {
    expect(
      screen.getByRole("header", { name: "나간 고정 지출" })
    ).toBeCollapsed();
  });
});
```

접근성을 고려한 화면이라면 이런 식으로 테스트 코드를 작성할 수 있다.

1. 헤더 영역에 `role="header"`를 부여했으므로, 스크린리더는 이를 머리말 단위의 내비게이션으로 사용할 수 있고, 테스트 환경은 헤더 단위로 컴포넌트를 쿼리할 수 있다.
2. 컴포넌트에 `aria-expanded`를 부여했으므로, 스크린리더는 이 속성을 읽어 접힘/펼침 여부를 알려줄 수 있고, 테스트 환경은 이미지 없이도 이를 그대로 검증할 수 있다.

이 경우에는 **테스트 전용 코드가 전혀 필요 없다.** 출력물이 텍스트로 드러나기 때문에, 테스트는 실제 구현의 결과와 어긋나지 않는 진짜 명세가 된다.

<br>

### **플랫폼을 가리지 않는 원리**

이 원리는 특정 플랫폼에 국한되지 않는다. 웹처럼 원래부터 텍스트 기반 출력물을 제공하는 환경에서는 이미 이런 종류의 테스트 도구가 보편화되어 있다. 하지만 iOS, Android 같은 환경에서도, UI를 **텍스트 기반 ViewTree**로 직렬화하는 방식만 고안한다면 동일한 접근이 가능하다.

예를 들어, 뱅크샐러드에서 사용하는 **AXSnapshot** 도구는 뷰를 텍스트로 변환해 테스트 가능하게 만든다.

```jsx
// 단위 테스트 함수 정의 (비동기 + 에러 던질 수 있음)
func testMyViewController() async throws {

    // 1. 테스트 대상이 되는 뷰컨트롤러 생성
    let viewController = MyViewController()

    // 2. 실제 앱에서 수행될 비즈니스 로직 실행 (ex. 데이터 로드, 상태 변경)
    await viewController.doSomeBusinessLogic()

    // 3. 단언(XCTAssert): 아래 조건이 true여야 테스트 통과
    XCTAssert(
        // 3-1. 뷰컨트롤러의 접근성 스냅샷을 텍스트로 출력
        //      (화면을 스크린리더가 보는 "접근성 트리" 형태로 직렬화)
        viewController.axSnapshot() == """
        ------------------------------------------------------------
        Final Result
        button, header                 // 버튼 + 헤더 요소
        Double Tap to see detail result // 스크린리더 안내 문구
        Actions: Retry                  // 수행 가능한 액션
        ------------------------------------------------------------
        The question is, The answer to the Life, the Universe, and Everything
        button                          // 질문을 보여주는 버튼
        ------------------------------------------------------------
        The answer is, 42
        button                          // 정답을 보여주는 버튼
        ------------------------------------------------------------
        """
        // 3-2. 위 문자열과 실제 스냅샷이 같아야 테스트 성공
    )
}
```

UI를 텍스트로 표현해 테스트하는 전략은 **텍스트의 접근성**에 의존하기 때문에 플랫폼을 가리지 않고 유효하다.

<br>

### **마치며**

우리가 지금까지 테스트 코드 작성이 어렵다고 느끼는 이유는 **출력물을 텍스트라는 인터페이스로 바라본 적이 없었기 때문**이다.

처음에도 말했지만 접근성은 지원하는 것이 아니다. 보안을 당연히 고려하며 개발하듯, 접근성 역시 당연히 고려하며 개발해야 한다.

이 분야를 공부하기 위해 가장 먼저 해야 할 일은, 스스로 사용자 입장이 되어 **텍스트 기반 인터페이스를 직접 경험해보는 것**이다.
스크린리더 사용법을 익히고, 눈을 감은 채 자신의 제품을 사용해보는 것. 그것이 접근성을 가장 재미있고 효과적으로 공부할 수 있는 첫걸음이다.
