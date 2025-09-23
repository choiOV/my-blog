---
author: choiOV
pubDatetime: 2025-07-04T13:00:00Z
modDatetime: 2025-07-04T13:00:00Z
title: 접근성 필수 사항
slug: accessibility-essentials
featured: false
draft: false
tags:
  - 접근성 원칙
  - HTML
  - 사용자 경험
description: 접근성 필수 사항에 대한 기술 아티클을 읽고 핵심만 요약 정리한 글입니다.
---

<img src="/assets/accessibility/intro.png" alt="기능 분할 설계 인트로 이미지" width="650" />

<br>

지금으로부터 다소 지난 일이지만, 함께 개발 공부를 하던 사람들과 페어 프로그래밍을 하던 중, 이미지 대체 텍스트는 단순히 이미지가 로드되지 않을 때를 대비하는 용도일 뿐만 아니라, 시각이 불편하신 분들을 위해서도 반드시 작성해야 하는 중요한 요소라는 점을 배웠었다. 이 계기로 “접근성”이란 개념에 대해 더 깊이 탐구하고자, <a href="https://velog.io/@eunbinn/accessibility-essentials-every-front-end-developer-should-know" target="_blank">모든 프런트엔드 개발자가 알아야 할 접근성 필수 사항</a>이란 기술 아티클을 읽으면서 생소하거나 헷갈릴 수 있는 개념을 함께 정리해 “접근성”에 대한 이해를 높이고, 추후에 빠르게 참고하고 개발에도 적용할 수 있도록 나름대로 핵심 내용을 요약해 정리했음을 밝힌다.

(이 글은 노션에서 처음 작성되었으며, 노션의 원문 스타일이 블로그에 완전히 적용되지 않아, 일부 가독성이 떨어질 수 있는 점 양해 부탁드립니다.)

## 개요

모든 프론트엔드 개발자가 컴포넌트를 개발할 때 적용할 것을 권장하는 **주요 접근성 원칙(7가지)** 에 대해 설명한다.

<br>

1. **시맨틱 HTML**: 상호작용 및 기본 기능에 알맞은 요소를 사용해야 한다.
2. **폼**: 라벨과 구조를 간단히 만들어야 한다. (사용성 높임)
3. **키보드 내비게이션**: 키보드를 사용해 쉽게 탐색 가능해야 한다.
4. **모달**: 많은 접근성 요구 사항이 있다.
5. **이미지 대체 텍스트**: 더 나은 설명을 작성해야 한다. (이미지 접근성 높임)
6. **스타일링**: 포커스 표시기, 반응형 디자인, 애니메이션 최소화 (접근성 향상)
7. **ARIA 속성**: ARIA 제대로된 사용법 (접근성 격차를 줄임)

<br>

<a href="https://www.w3.org/WAI/fundamentals/accessibility-principles/ko" target="_blank">접근성 원칙?</a>

장애가 있는 사람을 포함해 **모든 사용자가 웹 콘텐츠와 서비스를 동등하게 이용할 수 있도록 보장하는
기준**을 말한다. 대표적인 국제 표준은 **WCAG**(Web Content Accessibility Guidelines)이다.

<br>

**그렇다면, <a href="https://tech.kakaopay.com/post/accessibility-stories-for-everyone/#%EC%A0%91%EA%B7%BC%EC%84%B1%EC%9D%B4%EB%9E%80" target="_blank">접근성 기능</a>이란 무엇일까?**

**스크린 리더, 키보드 탐색, 포커스 제어 등**을 지원해 “**모든”** 사용자가 서비스를 차별 없이 이용할 수있도록 하는 기능을 뜻한다. 현실을 예로 들자면, 휠체어를 위한 경사로, 레버형 손잡이를 예로 들 수 있다.

<br>

## <a href="https://developer.mozilla.org/ko/docs/Glossary/Semantics#html_%EC%8B%9C%EB%A7%A8%ED%8B%B1" target="_blank">시맨틱 HTML</a>

시맨틱 HTML를 의도된 용도로 사용한다면, **브라우저와 도구가 페이지의 구조를 이해해 기본 제공하는 접근성에 대한 이점을
얻을 수 있으며, SEO 또한 향상**시킨다.

<br>

**시맨틱 HTML?**

**태그 이름만으로도 그 태그가 어떤 역할과 의미를 가지는지 알 수 있도록 만든 HTML 구조**를 말한다.
즉, **콘텐츠의 의미(semantic)를 명확하게 전달하는 HTML 마크업 방식**이다.

<br>

### <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Content_categories#interactive_content" target="_blank">인터랙티브 요소</a>

이 요소들은 기본적으로 접근성 기능을 내장하고 있어, 시맨틱한 의미를 제공한다.

웹 애플리케이션에서 흔히 볼 수 있는 안티패턴 중 하나는 **`<div>` 에 `onClick` 핸들러를 붙여 인터랙티브 요소처럼 사용하는 것이다**. 그러나 이 방법은 **키보드 접근성과 스크린 리더 지원이 부족하여 사용자 경험을 크게 해친다.**

따라서 반드시 **`<button>` 또는 `<a>`처럼 시맨틱한 요소를 사용해 접근성을 확보하는걸 권장한다.**

<br>

**인터랙티브 요소?**

**사용자와 상호작용이 가능한 HTML 요소**(`<button>`, `<a>` 등)를 뜻한다.

<br>

### 네이티브 요소

네이티브 요소 역시 기본적인 접근성 기능을 갖추고 있어, **가능하면 그대로 사용하는 것이 가장 좋다.**

하지만 별도의 맞춤형 컴포넌트를 만들고자 하는 경우 **<a href="https://www.npmjs.com/package/react-select" target="_blank">react-select</a>
와 같은 널리 사용되고 성숙한 라이브러리를 사용하는 걸
권장한다.** (네이티브 요소를 대체해 접근성을 갖추게 하는건 매우 어렵고 시간이 많이 걸린다.)

<br>

**네이티브 요소?**

HTML 명세에 정의되어 있고 **브라우저에서 기본 동작과 스타일을 내장하고 있는 HTML 요소**
(`<select>`, `input>`, `<textarea>` 등)를 뜻한다.

<br>

## <a href="https://developer.mozilla.org/ko/docs/Web/HTML/Reference/Elements/form" target="_blank">폼</a>

**모든 폼 필드는 `onSubmit` 핸들러와 제출 버튼이 포함된 `<form>` 태그 내부에 존재해야 한다.**
이렇게 해야 브라우저와 스크린 리더가 관련 필드를 올바르게 인식하고, Enter 키 제출, 모바일 키보드 등의 기본 동작도 제대로 동작해 접근성과 사용성 모두 향상된다.

<br>

<img src="/assets/accessibility/form-field-jumping.gif" alt="" width="300" />

<p align="center">모바일 환경에서 필드 간 이동하는 예시</p>

<br>

### <a href="https://developer.mozilla.org/ko/docs/Web/HTML/Reference/Elements/label" target="_blank">라벨</a>

**모든 입력 필드에는 용도를 설명하는 명확한 라벨이 필요하다.**
따라서 **라벨은 `for` 속성(리액트: `htmlFor`)을 사용해 입력 필드의 `id`와 명시적으로 연결되어야 한다.**

```jsx
// 명시적 사용 예시
<label for="email">이메일:</label>
<input type="email" id="email" />
```

<br>

`for` 속성을 생략하고 `<label>` 요소에 함께 작성해 암시적으로 연결하는 것도 유효한 HTML이지만
<a href="https://www.tpgi.com/should-form-labels-be-wrapped-or-separate/" target="_blank">지원하지 않는 스크린 리더가 존재하기에</a>
**`for` 속성 사용이 권장된다.**

```jsx
// 암시적 연결 예시
<label>
  이름
  <input type="text" name="username" />
</label>
```

<br>

### <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input#placeholder" target="_blank">플레이스홀더</a>

**플레이스홀더는 라벨을 대체할 수 없다.**

더불어서, 플레이스홀더는 입력 이벤트가 발생하면 사라지는 특성으로 인해 사용자에게 혼란을 줄 수 있고, 식별 문제, 시인성이
떨어지는 문제 등이 있다. 따라서 **가급적 최소한으로 활용**하고, **항상 적절한 `<label>`을 사용하는걸 권장한다.**

<img src="/assets/accessibility/placeholder.png" alt="플레이스홀더 예시 이미지" width="650" />

두 양식 모두 작성되지 않았으나, 왼쪽의 경우 플레이스홀더로 인해 작성 여부를 명확히 식별하기 어렵다.

<br>

## 키보드 내비게이션

**키보드는 마우스를 대체할 수 있는 중요한 탐색 수단이다.**

사용자가 Tab키로 논리적인 순서대로 이동하고, Enter 키로 동작을 실행할 수 있도록 해야 한다.
이를 위해, **`<button>`과 `<a>`같은 네이티브 HTML 요소를 사용하는 것이 필수적이다.**

<br>

### <a href="https://developer.mozilla.org/ko/docs/Web/CSS/:focus" target="_blank">포커스 표시기</a>

**포커스 표시기는 키보드 탐색에 필수적이다. 포커스 표시기를 절대 완전히 비활성화 해선 안된다.**

**<a href="https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible" target="_blank">:focus-visible</a>
선택자를 사용하면 필요할 때만 포커스 링이 표시되어,** 시각적 불편함 주지 않으면서 접근성을 유지할 수
있다. 커스텀 UI에선 시맨틱한 HTML과 숨겨진 라디오 버튼을 적절히 활용하면 접근성과 디자인을 모두 만족시킬 수 있다.

<img src="/assets/accessibility/focus-indicator.gif" alt="" width="500" />

<p align="center">포커스 표시기를 사용해 폼 필드를 순차적으로 이동하는 모습</p>

<br>

## 모달

모달의 접근성을 보장하려면 **1. 포커스 관리, 2. 키보드 내비게이션, 3. 배경 콘텐츠 숨김이 중요하다.**

가장 쉬운 방법은 시맨틱한 HTML인 <a href="https://www.scottohara.me/blog/2023/01/26/use-the-dialog-element.html" target="_blank">&lt;dialog&gt;</a>
요소를 사용하는 것이며, <a href="https://caniuse.com/dialog" target="_blank">대부분의 브라우저에서 잘 지원되고</a>
접근성 문제도
(키보드 탐색 포함) 상당 부분 해결해준다.

<br>

### 커스텀 모달

`<dialog>` 없이 커스텀 모달을 구현할 경우, **접근성과 관련된 고려 사항이 많아 구현이 까다롭다.**
완전한 접근성을 갖춘 모달을 처음부터 만드는 것은 쉽지 않으며, 이 글에선 핵심적으로 고려해야 할 사항들만 간략히 소개한다.

<br>

1. **포커스 관리**

   **모달이 열리면, 사용자의 포커스는 모달을 연 버튼에 머무르게 된다.** 이로 인해 사용자는 새로 열린 모달과 상호작용하기가
   어려운 문제가 발생한다. (실수로 여러 모달을 여는 경우도 생긴다.)

   이 문제를 해결하기 위해선,

   1. 모달이 열리자마자, **포커스를 모달로 설정한다.**
   2. 포커스 트랩을 구현한다. (Tab키를 눌러도 모달 밖으로 포커스가 나가지 않도록.)
   3. 모달이 닫히면, 모달을 트리거한 요소로 **포커스를 반환**한다.

   이외에도, <a href="https://github.com/theKashey/react-focus-lock" target="_blank">react-focus-lock</a>
   같은 라이브러리를 활용해도 좋다. (포커스 처리를 도와주는 `returnFocus` 옵션을 제공한다.)

     <br>

   **참고**

   확인용 모달의 경우, **기본 포커스를 “확인” 버튼에 설정해** 사용자가 Enter 키로 빠르게 작업을 이어갈 수 있다.

<br>

2. **비활성 콘텐츠**

   모달이 열릴 때, 시각적으로는 가려져도 **스크린 리더는 배경 콘텐츠와 계속 상호작용할 수 있다.**
   방지하고 싶다면, **배경 콘텐츠에 <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/inert" target="_blank">inert</a>
   속성을 적용해** 보조 기술에서 숨겨야 한다.

<br>

**참고**

리액트에서 inert를 사용하려면, 모달을 메인 콘텐츠에서 포털 처리해야 한다.

(모달이 `inert` 범위 외에 위치하도록 보장한다.)
(`inert`는 모든 자식에게 적용되고, 자식 요소에서 비활성화할 수는 없다.)

<br>

3. **모달 닫기**

   **모달은 Escape 키로 닫을 수 있어야 한다.** (일반적인 사용패턴으로 전체 사용자 경험을 개선한다.)

<br>

## 이미지 대체 텍스트

![대체 텍스트 예제를 보여주는 의도적으로 깨진 이미지](attachment:34762fc6-dd3b-46ad-a3eb-586dea679c16:image.png)

대체 텍스트는 **이미지 접근 가능하도록 만들고, SEO 향상 등의 이점이 있으므로 필수적이다.**

따라서, **모든 이미지에는 alt 속성을 포함해야 한다.
장식용 이미지나 중복 정보**인 경우에는 `alt=""`를 사용해 스크린 리더가 무시하게 만들어도 좋다.

<br>

### 대체 텍스트 작성

**좋은 대체 텍스트**는, **시력이 좋지 않은 사람에게 이미지를 설명한다고 생각**하며 작성하면 된다.

이때 중요한 점은, **이미지에 텍스트가 포함되었다면, 그 텍스트를 항상 대체 텍스트에 포함시켜야 한다.**

<br>

## 스타일링

스타일링은 **접근성에 직접적인 영향을 주는 중요한 요소**다.

1. **포커스 표시기**: 포커스된 요소를 테두리로 강조 ([앞서](https://www.choiov-blog.site/posts/accessibility-essentials#포커스-표시기) 다룬 내용)
2. **인터랙티브 요소**: 링크는 링크처럼, 버튼은 버튼처럼 보이도록 해 상호작용을 쉽게 한다.
3. **인터랙티브 피드백**: 명확한 호버, 활성 및 비활성 상태를 제공한다.
4. **색상 대비**: 요소를 구별하기 위해 충분한 대비를 사용하다.
5. **색상**: 색맹인 사용자를 위해 색상을 텍스트나 아이콘과 함께 사용한다.
6. **반응형 디자인**: 커스텀한 글꼴 크기 및 확대를 지원한다.
7. **애니메이션 및 움직임**: 움직임에 민감한 사용자를 위해 움직임을 줄이거나 비활성화한다.
8. **글꼴 및 간격**: 간격이 충분한 명확한 글꼴을 사용한다. (특히 난독증 사용자에게 도움이 된다.)

이 중 대부분은 디자인의 영역일 수 있다. 따라서 이 글에선 개발자가 가장 직접적으로 제어할 수 있는 영역만 다루도록 하겠다.

<br>

### 클릭 가능한 영역

버튼과 링크는 **마우스나 터치로 쉽게 클릭할 수 있도록 충분한 크기의 클릭 영역을 가져야 한다.**
패딩을 추가하거나, 필요 시 음수 마진을 사용해 간단히 구현할 수 있다.

<img src="/assets/accessibility/styling.png" alt="" width="400" />

모달 닫기 버튼의 클릭 가능한 영역을 보여주는 좌우 비교.

<br>

### 애니메이션 최소화

사용자 중 일부는 움직임에 민감할 수 있다. 따라서, OS의 움직임 축소 설정을 감지해 **애니메이션을 비활성화해야 하며, 미디어
쿼리로 구현할 수 있다.**

```css
@media (prefers-reduced-motion: reduce) {
  .modal {
    animation: none;
  }
}
```

<br>

### 접근성 있는 반응형 디자인

접근성을 고려한 반응형 디자인은 **글꼴 크기나 여백을 픽셀 대신 em, rem 같은 상대 단위로 설정해**, 사용자의 브라우저 글꼴
설정과 확대 수준을 선호에 맞게 사용할 수 있도록 지원해야 한다.

<br>

## ARIA 속성

<a href="https://developer.mozilla.org/ko/docs/Web/Accessibility/ARIA" target="_blank">ARIA</a>
속성은 시맨틱 HTML로 부족할 때만 **신중히 사용해야 하는 보완 수단**이며, **잘못 사용할 경우 오히려 접근성을 해칠 수 있다.**

<br>

### aria-label

aria-label은 텍스트가 없는 **상호작용 요소에 접근 가능한 이름을 제공할 때 사용**하며**,**
**비상호작용 요소에는 사용하지 말아야 한다.** (<a href="https://ericwbailey.website/published/aria-label-is-a-code-smell/#1.-aria-label%E2%80%99s-varied-support-when-declared-on-a-non-interactive-element" target="_blank">사용할 경우 예상치 못한 성가신 알림을 받을 수 있다.</a>
)

<br>

### aria-hidden

aria-hidden은 시각적으로는 보이지만 **스크린 리더에는 숨기고 싶은 요소에 사용**하며, **주로 장식용이나 중복 콘텐츠에 적합하다.**

```jsx
<div>
  React <ReactLogo aria-hidden />
</div>
```

<br>

## 정리하자면,

접근성은 **개발 초기부터 고려해야 한다.** 이를 통해 “**모든”** 사용자의 UX를 개선하고 SEO에도 긍정적 영향을 준다.
기본 원칙만으로도 큰 도움이 되지만, **더 나은 접근성을 위해선 스크린 리더 테스트 등의 노력이 추가로 필요하다.**

<br>

## 같이 읽으면 좋을만한 사이트

<a href="https://tech.kakaopay.com/post/accessibility-stories-for-everyone/" target="_blank">카카오페이 기술 블로그 - 모두를 위한 접근성 이야기</a>

<a href="https://adrianroselli.com/2017/02/not-all-screen-reader-users-are-blind.html" target="_blank">다양한 스크린 리더 사용자의 특성에 대해 더 알고 싶다면?</a>
