import Image from 'next/image'
import { Author } from 'app/lib/authors'

interface AuthorProfileProps {
  author: Author
}

export function AuthorProfile({ author }: AuthorProfileProps) {
  return (
    <div className="flex items-center gap-3 my-8 py-4 border-t border-b border-neutral-200 dark:border-neutral-800">
      {author.avatar && (
        <Image
          src={author.avatar}
          alt={author.name}
          width={48}
          height={48}
          className="rounded-full"
        />
      )}

      <div className="flex-1">
        <p className="font-medium text-neutral-900 dark:text-neutral-100">
          {author.name}
        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {author.bio}
        </p>

        {author.social && (
          <div className="flex gap-3 mt-2">
            {author.social.github && (
              <a
                href={`https://github.com/${author.social.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              >
                GitHub
              </a>
            )}
            {author.social.twitter && (
              <a
                href={`https://twitter.com/${author.social.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              >
                Twitter
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
