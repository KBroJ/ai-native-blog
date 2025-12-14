# AuthorProfile

블로그 게시물 하단에 표시되는 작가 프로필 컴포넌트입니다. 작가의 아바타, 이름, 소개, 소셜 미디어 링크를 표시합니다.

## 목적

`AuthorProfile` 컴포넌트는 블로그 게시물 작성자에 대한 정보를 독자에게 제공하여 작가와 독자 간의 연결을 강화합니다. 다크 모드를 지원하며, GitHub 및 Twitter와 같은 소셜 미디어 플랫폼으로의 링크를 제공합니다.

## Props

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `author` | `Author` | Yes | - | 표시할 작가 정보 객체 |

### Author Type Definition

```typescript
type Author = {
  id: string
  name: string
  bio: string
  avatar?: string
  social?: {
    github?: string
    twitter?: string
    email?: string
  }
}
```

#### Author 필드 설명

- **`id`** (`string`): 작가의 고유 식별자
- **`name`** (`string`): 작가의 표시 이름
- **`bio`** (`string`): 작가에 대한 간단한 소개 문구
- **`avatar`** (`string | undefined`): 작가의 프로필 이미지 경로 (선택사항)
- **`social`** (`object | undefined`): 소셜 미디어 링크 정보 (선택사항)
  - **`github`** (`string | undefined`): GitHub 사용자명
  - **`twitter`** (`string | undefined`): Twitter 사용자명
  - **`email`** (`string | undefined`): 이메일 주소 (현재 UI에서 미사용)

## 기본 사용법

```tsx
import { AuthorProfile } from 'app/components/author-profile'
import { getAuthor } from 'app/lib/authors'

export default function BlogPost() {
  const author = getAuthor('kbroj')

  return (
    <article>
      <h1>블로그 포스트 제목</h1>
      <div>블로그 포스트 내용...</div>

      {/* 포스트 하단에 작가 프로필 표시 */}
      <AuthorProfile author={author} />
    </article>
  )
}
```

## 고급 사용 예제

### 완전한 작가 정보로 사용

```tsx
import { AuthorProfile } from 'app/components/author-profile'

export default function BlogPost() {
  const author = {
    id: 'john-doe',
    name: 'John Doe',
    bio: 'Full-stack developer passionate about TypeScript and React',
    avatar: '/images/authors/john-doe.jpg',
    social: {
      github: 'johndoe',
      twitter: 'johndoe_dev'
    }
  }

  return (
    <article>
      <h1>Understanding React Server Components</h1>
      <div>Article content...</div>

      <AuthorProfile author={author} />
    </article>
  )
}
```

### 소셜 링크 없이 사용

```tsx
import { AuthorProfile } from 'app/components/author-profile'

export default function BlogPost() {
  const author = {
    id: 'jane-smith',
    name: 'Jane Smith',
    bio: 'Technical writer and documentation specialist',
    avatar: '/images/authors/jane-smith.jpg'
    // social 필드 생략 가능
  }

  return (
    <article>
      <h1>Writing Better Documentation</h1>
      <div>Article content...</div>

      <AuthorProfile author={author} />
    </article>
  )
}
```

### 아바타 없이 사용

```tsx
import { AuthorProfile } from 'app/components/author-profile'

export default function BlogPost() {
  const author = {
    id: 'anonymous',
    name: 'Anonymous Contributor',
    bio: 'Guest writer for technical articles',
    // avatar 필드 생략 가능
    social: {
      github: 'contributor123'
    }
  }

  return (
    <article>
      <h1>Guest Post: Best Practices</h1>
      <div>Article content...</div>

      <AuthorProfile author={author} />
    </article>
  )
}
```

### MDX 블로그 포스트에서 사용

```tsx
// app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { CustomMDX } from 'app/components/mdx'
import { formatDate, getBlogPosts } from 'app/lib/posts'
import { baseUrl } from 'app/sitemap'
import { AuthorProfile } from 'app/components/author-profile'
import { getAuthor } from 'app/lib/authors'

export default async function Blog({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getBlogPosts().find((post) => post.slug === slug)

  if (!post) {
    notFound()
  }

  // 포스트 메타데이터에서 작가 ID 가져오기
  const author = getAuthor(post.metadata.author)

  return (
    <section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${baseUrl}${post.metadata.image}`
              : `${baseUrl}/og?title=${post.metadata.title}`,
            url: `${baseUrl}/blog/${post.slug}`,
            author: {
              '@type': 'Person',
              name: author.name,
            },
          }),
        }}
      />
      <h1 className="title font-medium text-2xl tracking-tighter max-w-[650px]">
        {post.metadata.title}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm max-w-[650px]">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {formatDate(post.metadata.publishedAt)}
        </p>
      </div>
      <article className="prose dark:prose-invert">
        <CustomMDX source={post.content} />
      </article>

      {/* 포스트 하단에 작가 프로필 추가 */}
      <AuthorProfile author={author} />
    </section>
  )
}
```

## 스타일링

컴포넌트는 다음과 같은 스타일 특징을 가집니다:

- **레이아웃**: Flexbox를 사용한 수평 정렬 (`flex items-center gap-3`)
- **간격**: 상하 여백 8단위 (`my-8`), 내부 패딩 4단위 (`py-4`)
- **테두리**: 상하단에 1px 테두리 (`border-t border-b`)
- **다크 모드**: 자동으로 다크 모드 색상 적용
- **아바타**: 48x48px 원형 이미지 (`rounded-full`)
- **소셜 링크**: 호버 시 색상 전환 애니메이션

### 커스터마이징

컴포넌트를 직접 수정하거나 래퍼 컴포넌트로 감싸서 추가 스타일을 적용할 수 있습니다:

```tsx
import { AuthorProfile } from 'app/components/author-profile'
import { getAuthor } from 'app/lib/authors'

export default function BlogPost() {
  const author = getAuthor('kbroj')

  return (
    <article>
      <h1>블로그 포스트 제목</h1>
      <div>블로그 포스트 내용...</div>

      {/* 추가 스타일이 적용된 래퍼 */}
      <div className="max-w-[650px] mx-auto">
        <AuthorProfile author={author} />
      </div>
    </article>
  )
}
```

## 중요 사항

- **Next.js Image 컴포넌트**: 아바타는 Next.js의 `Image` 컴포넌트를 사용하여 최적화됩니다. 아바타 이미지는 `public/images/authors/` 디렉토리에 위치해야 합니다.
- **외부 링크 보안**: 소셜 미디어 링크는 `target="_blank"`와 `rel="noopener noreferrer"`를 사용하여 보안을 강화합니다.
- **선택적 필드**: `avatar`와 `social` 필드는 선택사항이므로, 컴포넌트는 이들이 없어도 정상적으로 렌더링됩니다.
- **작가 이름 접미사**: 현재 구현에서는 작가 이름 뒤에 "Sir"이 자동으로 추가됩니다. 이는 컴포넌트 내부에 하드코딩되어 있습니다.
- **지원되는 소셜 미디어**: 현재 GitHub와 Twitter만 UI에 표시됩니다. `email` 필드는 타입 정의에 포함되어 있지만 UI에서는 렌더링되지 않습니다.

## 접근성

- 아바타 이미지에는 작가 이름을 `alt` 속성으로 제공합니다.
- 외부 링크는 명확한 텍스트 레이블을 가지고 있습니다.
- 색상 대비는 WCAG 가이드라인을 준수합니다.

## 관련 파일

- **컴포넌트**: `app/components/author-profile.tsx`
- **타입 정의**: `app/lib/authors.ts`
- **작가 데이터베이스**: `app/lib/authors.ts`
