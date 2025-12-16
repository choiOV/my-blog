---
author: choiOV
pubDatetime: 2025-10-14T13:43:00.000Z
modDatetime: 2025-10-14T13:43:00.000Z
title: 프론트엔드 개발자를 위한 5가지 스크롤 복구 시나리오와 실전 코드
slug: scroll-restoration
featured: false
draft: false
tags:
  - UI / UX
  - 스켈레톤 UI
  - react-query
  - 완벽보단 자연스러움
description: SPA 환경에서 스크롤 복구하기
---

<!-- toc -->

- [개요](#%EA%B0%9C%EC%9A%94)
- [SPA 환경에서 스크롤 복구가 어려운 이유](#spa-%ED%99%98%EA%B2%BD%EC%97%90%EC%84%9C-%EC%8A%A4%ED%81%AC%EB%A1%A4-%EB%B3%B5%EA%B5%AC%EA%B0%80-%EC%96%B4%EB%A0%A4%EC%9A%B4-%EC%9D%B4%EC%9C%A0)
- [1. 정적인 데이터 상황](#1-%EC%A0%95%EC%A0%81%EC%9D%B8-%EB%8D%B0%EC%9D%B4%ED%84%B0-%EC%83%81%ED%99%A9)
- [2. 동적인 데이터 상황](#2-%EB%8F%99%EC%A0%81%EC%9D%B8-%EB%8D%B0%EC%9D%B4%ED%84%B0-%EC%83%81%ED%99%A9)
- [3. 동적인 데이터 상황 - 레이지 로딩](#3-%EB%8F%99%EC%A0%81%EC%9D%B8-%EB%8D%B0%EC%9D%B4%ED%84%B0-%EC%83%81%ED%99%A9---%EB%A0%88%EC%9D%B4%EC%A7%80-%EB%A1%9C%EB%94%A9)
- [4. react-query를 사용하는 상황](#4-react-query%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%98%EB%8A%94-%EC%83%81%ED%99%A9)
- [5. 대량 리스트에서 가상화를 이용한 상황](#5-%EB%8C%80%EB%9F%89-%EB%A6%AC%EC%8A%A4%ED%8A%B8%EC%97%90%EC%84%9C-%EA%B0%80%EC%83%81%ED%99%94%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-%EC%83%81%ED%99%A9)
- [완벽보단 자연스럽게](#%EC%99%84%EB%B2%BD%EB%B3%B4%EB%8B%A8-%EC%9E%90%EC%97%B0%EC%8A%A4%EB%9F%BD%EA%B2%8C)

<!-- tocstop -->

<br>

<img src="/assets/scroll-restoration/intro.png" alt="스크롤 복구 아티클의 인트로 이미지" width="650" />

<br>

### 개요

이번에 읽은 아티클은 올리브영 프론트엔드팀에선 어떻게 SPA환경에서 스크롤 복구 이슈들을 해결해왔는지 코드와 팁에 대한 글이었다.

(이 글은 스터디 발표를 위해 원문을 요약·정리한 글로 일부 생략이 있을 수 있으며, 노션에서 처음 작성된 이유로 원문 스타일이 블로그에 일부 반영되지 않아 가독성이 다소 떨어질 수 있습니다.)

<br>

### SPA 환경에서 스크롤 복구가 어려운 이유

SPA 환경에서 스크롤 복구가 어려운 이유는, 과거의 전통적인 멀티 페이지 웹사이트와 구조가 다르기 때문이다.

예전에는 각 페이지가 독립적인 HTML 문서로 구성되어 있었기 때문에, 사용자가 다시 그 페이지로 돌아오면 브라우저가 스크롤 위치를 자동으로 복구해줄 수 있었다.

그러나 SPA는 한 페이지 안에서 자바스크립로 화면이 동적으로 전환되는 구조이다보니 브라우저 입장에서는 여전히 같은 페이지에 머물러 있는 것으로 인식하기 때문에 전통적인 방식의 자동 스크롤 복구 방식은 제대로 동작하지 않는다.

글에서는 상황별로 적합한 다섯 가지 스크롤 복구 방법을 소개하고 있다.

1. 정적인 데이터 상황
2. 동적인 데이터 상황
3. 동적인 데이터 상황 - 레이지 로딩
4. react-query를 사용하는 상황
5. 대량 리스트에서 가상화를 이용한 상황

<br>

### 1. 정적인 데이터 상황

첫 번째 상황은 페이지의 모든 데이터가 이미 로드되어 있고, 콘텐츠의 높이가 변하지 않는 정적 데이터 상황이다.

이 경우에는 스크롤 복구가 비교적 간단한데 브라우저의 **History API**를 이용해 scrollY 값을 저장하고,
페이지 복귀 시 해당 값을 이용해 스크롤 위치를 복원하면 된다.

더불어 꼭 History API를 사용하지 않더라도, Web Storage (로컬스토리지 / 세션스토리지) 혹은 URL 파라미터를 활용해서도 해결이 가능하다.

```jsx
// 기본적인 스크롤 위치 저장 및 복구
function setupBasicScrollRestoration() {
  // 페이지를 떠날 때 현재 스크롤 위치를 저장
  window.addEventListener("beforeunload", () => {
    const scrollY = window.scrollY;
    history.pushState({ scrollY }, null, "?page=1");
  });

  // 페이지로 돌아왔을 때 저장된 위치로 스크롤
  window.addEventListener("popstate", event => {
    if (event.state && event.state.scrollY) {
      setTimeout(() => {
        window.scrollTo(0, event.state.scrollY);
      }, 100);
    }
  });
}
```

<br>

### 2. 동적인 데이터 상황

두 번째 상황은 데이터가 비동기적으로 로드되면서 페이지의 높이가 변하는 경우이다.

이 경우 단순히 저장해둔 scrollY 값을 복원하더라도 페이지의 높이가 바뀌기 때문에 의미 없는 위치로 이동할 가능성이 있다.

따라서 스크롤 위치를 포함해 현재 화면에 보이는 아이템의 정보 같은 상대적인 기준점을 함께 저장하는 방식을 활용해야 한다. 예를 들어, 현재 화면 상단에 어떤 아이템이 보였는지를 기록해두면 데이터가 다시 로드된 뒤에도 정확히 같은 지점에 스크롤을 복원할 수 있다.

```jsx
// 동적 데이터 환경에서의 스크롤 관리
class DynamicScrollManager {
  saveScrollState(pageKey) {
    const scrollY = window.scrollY;
    const visibleItems = this.getVisibleItemsInfo();

    // 스크롤 위치와 보이는 아이템 정보를 함께 저장
    sessionStorage.setItem(
      pageKey,
      JSON.stringify({
        scrollY,
        visibleItems,
      })
    );
  }

  async restoreScrollState(pageKey) {
    const savedData = JSON.parse(sessionStorage.getItem(pageKey) || "{}");
    if (!savedData.visibleItems) return;

    // 데이터 로딩이 완료될 때까지 대기
    awaitthis.waitForDataLoad(); // 데이터가 다 로드된 후에만 복구해야 함!

    // 저장된 아이템을 찾아서 기준점으로 사용
    const targetElement = this.findTargetElement(savedData.visibleItems);
    if (targetElement) {
      targetElement.scrollIntoView();
      // 미세 조정을 위해 저장된 정확한 위치로 스크롤
      window.scrollTo(0, savedData.scrollY);
    }
  }

  getVisibleItemsInfo() {
    // 현재 화면에 보이는 아이템들의 ID와 위치 정보 수집, 각 아이템에는 고유한 식별자가 필요!
    const items = document.querySelectorAll("[data-item-id]");
    return Array.from(items).map(item => ({
      id: item.dataset.itemId,
      offsetTop: item.offsetTop,
    }));
  }

  findTargetElement(savedItems) {
    // 저장된 아이템 중 첫 번째 아이템을 기준점으로 사용
    return document.querySelector(`[data-item-id="${savedItems[0].id}"]`);
  }
}
```

그리고 중요한 점은, 스크롤 복구는 반드시 데이터 로드 이후에 해야 한다!
왜냐하면 특정 아이템을 기준으로 위치를 복구하기 때문에 페이지 높이가 변할 수 있기 때문이다.

<br>

### 3. 동적인 데이터 상황 - 레이지 로딩

세 번째 상황은 동적인 데이터를 무한 스크롤 또는 레이지 로딩 방식으로 불러오는 경우이다.

이 상황에선 두 가지 전략을 조합해 해결할 수 있다.

1. 필요한 데이터를 미리 로드 ( 복구 시점에 필요한 최소한의 콘텐츠를 확보 )
2. 스켈레톤 UI를 활용 ( 실제 데이터가 도착하기 전에 레이아웃을 미리 확보 )

```jsx
// 레이지 로딩 환경에서의 스크롤 복구
class LazyLoadScrollManager {
  async restoreScrollWithPreload(pageKey) {
    const savedState = this.getSavedState(pageKey);
    if (!savedState) return;

    // 1단계: 스켈레톤으로 공간 확보 ( 레이아웃 자리만 먼저 잡기 )
    this.createSkeletonPlaceholders(savedState.totalHeight);

    // 2단계: 저장된 지점까지 필요한 데이터를 배치 단위로 미리 로드
    await this.preloadRequiredData(savedState.requiredItemCount);

    // 3단계: 실제 스크롤 위치 복구 ( 모든 준비가 끝나면 정확한 위치로 스크롤 이동 )
    window.scrollTo(0, savedState.scrollY);
  }

  async preloadRequiredData(itemCount) {
    const batchSize = 20; // 한 번에 20개씩 로드

    for (let i = 0; i < itemCount; i += batchSize) {
      const batch = await this.loadDataBatch(i, batchSize);
      this.renderBatch(batch); // DOM에 그리기
      await this.waitForRender(); // DOM 업데이트 대기
    }
  }
}
```

스켈레톤으로 미리 해당 데이터의 height 크기를 미리 잡아놓아야 하는데 이를 위해 과거 데이터를 기반으로 예상 높이를 계산하는 방법 사용할 수 있다.

```jsx
// 스켈레톤 높이 관리
class SkeletonHeightManager {
  constructor() {
    this.itemHeights = []; // 실제 아이템 높이들을 기록
    this.averageHeight = 200; // 초기 평균 높이
  }

  // 높이 평균값 계산을 위해 각 엘리먼트 순회
  recordItemHeight(element) {
    const height = element.offsetHeight;
    this.itemHeights.push(height);
  }

  // 최근 50개 아이템의 평균 높이 계산
  getItemAverageHeight(element) {
    const recentHeights = this.itemHeights.slice(-50);
    this.averageHeight =
      recentHeights.reduce((sum, h) => sum + h, 0) / recentHeights.length;
  }

  // 스켈레톤 생성
  createSkeletonWithEstimatedHeight(count) {
    const container = document.createElement("div");
    for (let i = 0; i < count; i++) {
      const skeleton = document.createElement("div");
      skeleton.className = "skeleton-item";
      skeleton.style.height = `${this.averageHeight}px`;
      container.appendChild(skeleton);
    }
    return container;
  }
}
```

<br>

### 4. react-query를 사용하는 상황

React Query를 활용하면 데이터 캐싱 기능 덕분에 스크롤 복원을 훨씬 수월하게 구현할 수 있다.

이때 핵심은 데이터와 스크롤 상태를 함께 관리한다는 것이다.

<br>

**React Query의 캐싱 메커니즘**

- 기존: 서버 재요청 → 로딩 → 렌더 → scrollTo
- **React Query:** 캐시 즉시 표시 → scrollTo → 끝

이처럼 데이터가 캐시에 저장되어 있으면, 별도의 네트워크 요청 없이 UI를 바로 렌더링할 수 있다.

```jsx
// React Query 환경에서의 스크롤 복구
function useScrollRestorationWithQuery(queryKey) {
  const queryClient = useQueryClient();

  const saveScrollState = () => {
    const scrollData = {
      scrollY: window.scrollY,
      timestamp: Date.now(),
    };

    // React Query 캐시에 스크롤 정보도 함께 저장
    queryClient.setQueryData([...queryKey, "scroll"], scrollData);
  };

  const restoreScrollState = async () => {
    // 1단계: 캐싱된 데이터 가져옴
    const scrollData = queryClient.getQueryData([...queryKey, "scroll"]);
    const cachedData = queryClient.getQueryData(queryKey);

    if (scrollData && cachedData) {
      // 2단계: 캐싱된 데이터를 이용해서 컴포넌트를 화면에 렌더링
      await componentsRendering(cachedData);

      // 3단계: 캐싱된 스크롤값을 이용해서 좌표이동
      window.scrollTo(0, scrollData.scrollY);
    }
  };

  return { saveScrollState, restoreScrollState };
}

// 무한 스크롤과 조합한 경우
function useInfiniteScrollRestoration(queryKey) {
  const infiniteQuery = useInfiniteQuery({
    queryKey,
    queryFn: fetchData,
    staleTime: 5 * 60 * 1000, // 캐시 시간을 길게 설정
  });

  const restoreWithInfiniteData = async () => {
    // 1단계: 저장된 pageCount와 스크롤 위치를 가져옴
    const savedScrollData = getSavedScrollData();

    if (savedScrollData) {
      // 2단계: 저장된 페이지 수만큼 데이터 복구
      while (infiniteQuery.data.pages.length < savedScrollData.pageCount) {
        await infiniteQuery.fetchNextPage();
      }

      // 3단계: 모든 데이터 로딩 완료 후 스크롤 복구
      window.scrollTo(0, savedScrollData.scrollY);
    }
  };

  return { ...infiniteQuery, restoreWithInfiniteData };
}
```

<br>

### 5. 대량 리스트에서 가상화를 이용한 상황

가상화된 리스트에서는 실제로 화면에 보이는 아이템들만 DOM에 렌더링되기 때문에, 기존의 스크롤 복원 방식으로는 한계가 있다.

따라서 사용자가 마지막으로 보고 있던 아이템 데이터를 먼저 로드하고, 이후 주변의 데이터를 점진적으로 불러오는 방식을 사용해야 한다.

```jsx
// 가상화 환경에서의 스크롤 복구
class VirtualizedScrollManager {
  saveVirtualizedScrollState(pageKey) {
    const virtualList = getVirtualListInstance();
    // 먼저 로드되는 상황을 고려해서 0부터 시작하는 sequence값을 계산해서 저장
    const listSequence = virtualList.getSequence();
    const pageNumber = virtualList.getPageNumber();
    const pageSize = virtualList.getPageSize();

    // 가상화된 환경에서는 보이는 아이템 순서값과 최신 페이징 데이터값을 저장
    sessionStorage.setItem(
      pageKey,
      JSON.stringify({
        listSequence,
        pageNumber,
        pageSize,
      })
    );
  }

  async restoreVirtualizedScroll(pageKey) {
    const savedState = JSON.parse(sessionStorage.getItem(pageKey) || "{}");
    if (!savedState.listSequence) return;

    // 1단계: 먼저 보이는 아이템 데이터 호출
    await this.loadDataRange(savedState.pageNumber, savedState.pageSize);

    // 2단계: 가상 리스트에 저장된 스크롤 오프셋 적용
    virtualList.scrollTo(savedState.listSequence);

    // 3단계: 보이던 아이템 주변 데이터 로드
    await this.preloadAroundVisibleRange(
      savedState.pageNumber,
      savedState.pageSize
    );
  }
}
```

필요한 구간의 데이터만 우선 로드하고, 나머지 데이터는 백그라운드에서 점진적으로 불러오면,
사용자는 즉시 원하는 위치의 정보를 확인할 수 있어서 전체 데이터를 모두 로드할 때까지 기다릴 필요가 없다.

그러나 만약 React를 사용한다면 이런 가상화 로직을 직접 구현하기보다는 [react-virtualized](https://www.npmjs.com/package/react-virtualized?activeTab=code), [react-virtuoso](https://virtuoso.dev/) 같은 검증된 라이브러리의 사용을 추천한다.

<br>

### 완벽보단 자연스럽게

스크롤 복구의 목표는 사용자에게 완벽하게 동일한 위치를 복원해 제공하는 것보다
사용자가 불편함을 느끼지 않을 정도의 자연스러운 흐름을 유지시켜 주는것이 더 중요하다.

다시 말해, 기술적으로 100% 똑같이 복구하는 것보다, 심리적으로 끊기지 않는다는 느낌을 주는 것이 더 중요하다.

마지막으로 스크롤 복구의 정답은 하나가 아니다. 따라서 본인의 환경에 맞춰 자신만의 꿀조합을 찾아 적용하는 걸 권장한다.
