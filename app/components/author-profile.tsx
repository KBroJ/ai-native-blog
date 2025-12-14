import Image from 'next/image'
import { Author } from 'app/lib/authors'

interface AuthorProfileProps {
  author: Author
}

interface AuthorAvatarProps {
  imageUrl: string
  authorName: string
}

interface AuthorDetailsProps {
  name: string
  bio: string
}

interface SocialLink {
  platform: string
  username: string
  baseUrl: string
}

interface SocialLinksProps {
  links: SocialLink[]
}

const AVATAR_SIZE = 48
const SOCIAL_PLATFORMS = {
  github: 'https://github.com',
  twitter: 'https://twitter.com',
} as const

const SHARED_LINK_STYLES = 'text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors'

function AuthorAvatar({ imageUrl, authorName }: AuthorAvatarProps) {
  return (
    <Image
      src={imageUrl}
      alt={authorName}
      width={AVATAR_SIZE}
      height={AVATAR_SIZE}
      className="rounded-full"
    />
  )
}

function AuthorDetails({ name, bio }: AuthorDetailsProps) {
  return (
    <div>
      <p className="font-medium text-neutral-900 dark:text-neutral-100">
        {name} Sir
      </p>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        {bio}
      </p>
    </div>
  )
}

function SocialLinks({ links }: SocialLinksProps) {
  if (links.length === 0) {
    return null
  }

  return (
    <div className="flex gap-3 mt-2">
      {links.map(({ platform, username, baseUrl }) => (
        <a
          key={platform}
          href={`${baseUrl}/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className={SHARED_LINK_STYLES}
        >
          {platform.charAt(0).toUpperCase() + platform.slice(1)}
        </a>
      ))}
    </div>
  )
}

function buildSocialLinks(author: Author): SocialLink[] {
  if (!author.social) {
    return []
  }

  const socialLinks: SocialLink[] = []

  if (author.social.github) {
    socialLinks.push({
      platform: 'github',
      username: author.social.github,
      baseUrl: SOCIAL_PLATFORMS.github,
    })
  }

  if (author.social.twitter) {
    socialLinks.push({
      platform: 'twitter',
      username: author.social.twitter,
      baseUrl: SOCIAL_PLATFORMS.twitter,
    })
  }

  return socialLinks
}

export function AuthorProfile({ author }: AuthorProfileProps) {
  const socialLinks = buildSocialLinks(author)

  return (
    <div className="flex items-center gap-3 my-8 py-4 border-t border-b border-neutral-200 dark:border-neutral-800">
      {author.avatar && (
        <AuthorAvatar imageUrl={author.avatar} authorName={author.name} />
      )}

      <div className="flex-1">
        <AuthorDetails name={author.name} bio={author.bio} />
        <SocialLinks links={socialLinks} />
      </div>
    </div>
  )
}
