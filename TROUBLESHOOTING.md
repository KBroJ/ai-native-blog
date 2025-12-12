# Troubleshooting

## Next.js 15+ params 비동기 처리 에러

### 날짜
2025-12-12

### 문제 상황

블로그 동적 라우트 `/blog/[slug]`에서 다음과 같은 에러가 발생:

```
Error: Route "/blog/[slug]" used `params.slug`. `params` is a Promise and must be unwrapped with `await` or `React.use()` before accessing its properties.
```

추가로 소스맵 관련 경고도 나타남:
```
Invalid source map. Only conformant source maps can be used to find the original code.
```

### 원인 분석

**핵심 원인**: Next.js 15부터 동적 라우트의 `params`가 Promise로 변경됨

#### 기존 코드 (잘못된 방식)
```typescript
export function generateMetadata({ params }) {
  let post = getBlogPosts().find((post) => post.slug === params.slug) // ❌ 직접 접근
}

export default function Blog({ params }) {
  let post = getBlogPosts().find((post) => post.slug === params.slug) // ❌ 직접 접근
}
```

#### 문제점
- `params`를 동기적으로 접근하려고 시도
- Next.js 15+에서는 `params`가 Promise 객체이므로 unwrap 없이 접근 불가
- `params.slug`에 직접 접근하면 런타임 에러 발생

### 해결 방법

**적용한 해결책**: `async/await`를 사용하여 params unwrap

#### 수정된 코드
```typescript
// 1. generateMetadata 함수를 async로 변경
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params // ✅ await로 unwrap
  let post = getBlogPosts().find((post) => post.slug === slug)
  // ... 나머지 코드
}

// 2. Blog 컴포넌트를 async로 변경
export default async function Blog({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params // ✅ await로 unwrap
  let post = getBlogPosts().find((post) => post.slug === slug)
  // ... 나머지 코드
}
```

#### 변경 사항 요약
1. **함수를 `async`로 변경**: `generateMetadata`와 `Blog` 모두
2. **params를 await**: `const { slug } = await params`
3. **TypeScript 타입 추가**: `{ params: Promise<{ slug: string }> }`
4. **직접 참조 제거**: `params.slug` → `slug`

### 왜 이런 변경이 필요했나?

#### Next.js의 설계 변경 이유
- **서버 컴포넌트 최적화**: 비동기 데이터 페칭을 더 효율적으로 처리
- **일관성**: 다른 비동기 API들과 동일한 패턴 사용
- **성능 개선**: Streaming과 Suspense를 더 잘 활용

#### 마이그레이션 가이드
Next.js 15로 업그레이드할 때 동적 라우트 파라미터를 사용하는 모든 페이지에서:
- `params` → `await params`
- `searchParams` → `await searchParams`

### 참고 자료
- [Next.js 공식 문서 - Dynamic APIs](https://nextjs.org/docs/messages/sync-dynamic-apis)
- [Next.js 15 Upgrade Guide](https://nextjs.org/docs/app/building-your-application/upgrading/version-15)

### 관련 파일
- `app/blog/[slug]/page.tsx:14-16` (generateMetadata 함수)
- `app/blog/[slug]/page.tsx:55-57` (Blog 컴포넌트)
