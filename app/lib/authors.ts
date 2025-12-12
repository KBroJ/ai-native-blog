// Author 타입 정의
export type Author = {
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

// 작가 데이터베이스
const AUTHORS: Record<string, Author> = {
  kbroj: {
    id: 'kbroj',
    name: 'KBroJ',
    bio: 'Vim enthusiast, tab advocate, and static typing supporter.',
    avatar: '/images/authors/kbroj.jpg',
    social: {
      github: 'KBroJ',
    },
  },
}

// 기본 작가 ID
const DEFAULT_AUTHOR_ID = 'kbroj'

// 작가 조회 함수
export function getAuthor(authorId?: string): Author {
  const id = authorId || DEFAULT_AUTHOR_ID
  const author = AUTHORS[id]

  if (!author) {
    console.warn(`Author with id "${id}" not found, using default author`)
    return AUTHORS[DEFAULT_AUTHOR_ID]
  }

  return author
}

// 모든 작가 목록 (추후 확장용)
export function getAllAuthors(): Author[] {
  return Object.values(AUTHORS)
}
