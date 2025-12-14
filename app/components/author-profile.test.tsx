import { render, screen } from '@testing-library/react'
import { AuthorProfile } from './author-profile'
import { Author } from 'app/lib/authors'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    width,
    height,
    className,
  }: {
    src: string
    alt: string
    width: number
    height: number
    className?: string
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  ),
}))

describe('AuthorProfile', () => {
  describe('Rendering', () => {
    it('should render author name with "Sir" suffix', () => {
      const author: Author = {
        id: 'test-author',
        name: 'John Doe',
        bio: 'Test bio',
      }

      render(<AuthorProfile author={author} />)

      expect(screen.getByText('John Doe Sir')).toBeInTheDocument()
    })

    it('should render author bio', () => {
      const author: Author = {
        id: 'test-author',
        name: 'John Doe',
        bio: 'A passionate developer and writer',
      }

      render(<AuthorProfile author={author} />)

      expect(
        screen.getByText('A passionate developer and writer')
      ).toBeInTheDocument()
    })

    it('should render with minimal required props', () => {
      const author: Author = {
        id: 'minimal',
        name: 'Minimal Author',
        bio: 'Minimal bio',
      }

      render(<AuthorProfile author={author} />)

      expect(screen.getByText('Minimal Author Sir')).toBeInTheDocument()
      expect(screen.getByText('Minimal bio')).toBeInTheDocument()
    })
  })

  describe('Avatar', () => {
    it('should render avatar image when avatar prop is provided', () => {
      const author: Author = {
        id: 'test-author',
        name: 'John Doe',
        bio: 'Test bio',
        avatar: '/images/authors/john.jpg',
      }

      render(<AuthorProfile author={author} />)

      const avatar = screen.getByRole('img', { name: 'John Doe' })
      expect(avatar).toBeInTheDocument()
      expect(avatar).toHaveAttribute('src', '/images/authors/john.jpg')
      expect(avatar).toHaveAttribute('width', '48')
      expect(avatar).toHaveAttribute('height', '48')
      expect(avatar).toHaveClass('rounded-full')
    })

    it('should not render avatar image when avatar prop is not provided', () => {
      const author: Author = {
        id: 'test-author',
        name: 'John Doe',
        bio: 'Test bio',
      }

      render(<AuthorProfile author={author} />)

      expect(screen.queryByRole('img')).not.toBeInTheDocument()
    })

    it('should not render avatar image when avatar is undefined', () => {
      const author: Author = {
        id: 'test-author',
        name: 'John Doe',
        bio: 'Test bio',
        avatar: undefined,
      }

      render(<AuthorProfile author={author} />)

      expect(screen.queryByRole('img')).not.toBeInTheDocument()
    })

    it('should not render avatar image when avatar is empty string', () => {
      const author: Author = {
        id: 'test-author',
        name: 'John Doe',
        bio: 'Test bio',
        avatar: '',
      }

      render(<AuthorProfile author={author} />)

      expect(screen.queryByRole('img')).not.toBeInTheDocument()
    })
  })

  describe('Social Links', () => {
    describe('GitHub', () => {
      it('should render GitHub link when github username is provided', () => {
        const author: Author = {
          id: 'test-author',
          name: 'John Doe',
          bio: 'Test bio',
          social: {
            github: 'johndoe',
          },
        }

        render(<AuthorProfile author={author} />)

        const githubLink = screen.getByRole('link', { name: 'GitHub' })
        expect(githubLink).toBeInTheDocument()
        expect(githubLink).toHaveAttribute(
          'href',
          'https://github.com/johndoe'
        )
        expect(githubLink).toHaveAttribute('target', '_blank')
        expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer')
      })

      it('should not render GitHub link when github username is not provided', () => {
        const author: Author = {
          id: 'test-author',
          name: 'John Doe',
          bio: 'Test bio',
          social: {
            twitter: 'johndoe',
          },
        }

        render(<AuthorProfile author={author} />)

        expect(screen.queryByRole('link', { name: 'GitHub' })).not.toBeInTheDocument()
      })

      it('should not render GitHub link when github username is undefined', () => {
        const author: Author = {
          id: 'test-author',
          name: 'John Doe',
          bio: 'Test bio',
          social: {
            github: undefined,
          },
        }

        render(<AuthorProfile author={author} />)

        expect(screen.queryByRole('link', { name: 'GitHub' })).not.toBeInTheDocument()
      })

      it('should not render GitHub link when github username is empty string', () => {
        const author: Author = {
          id: 'test-author',
          name: 'John Doe',
          bio: 'Test bio',
          social: {
            github: '',
          },
        }

        render(<AuthorProfile author={author} />)

        expect(screen.queryByRole('link', { name: 'GitHub' })).not.toBeInTheDocument()
      })
    })

    describe('Twitter', () => {
      it('should render Twitter link when twitter username is provided', () => {
        const author: Author = {
          id: 'test-author',
          name: 'John Doe',
          bio: 'Test bio',
          social: {
            twitter: 'johndoe',
          },
        }

        render(<AuthorProfile author={author} />)

        const twitterLink = screen.getByRole('link', { name: 'Twitter' })
        expect(twitterLink).toBeInTheDocument()
        expect(twitterLink).toHaveAttribute(
          'href',
          'https://twitter.com/johndoe'
        )
        expect(twitterLink).toHaveAttribute('target', '_blank')
        expect(twitterLink).toHaveAttribute('rel', 'noopener noreferrer')
      })

      it('should not render Twitter link when twitter username is not provided', () => {
        const author: Author = {
          id: 'test-author',
          name: 'John Doe',
          bio: 'Test bio',
          social: {
            github: 'johndoe',
          },
        }

        render(<AuthorProfile author={author} />)

        expect(screen.queryByRole('link', { name: 'Twitter' })).not.toBeInTheDocument()
      })

      it('should not render Twitter link when twitter username is undefined', () => {
        const author: Author = {
          id: 'test-author',
          name: 'John Doe',
          bio: 'Test bio',
          social: {
            twitter: undefined,
          },
        }

        render(<AuthorProfile author={author} />)

        expect(screen.queryByRole('link', { name: 'Twitter' })).not.toBeInTheDocument()
      })

      it('should not render Twitter link when twitter username is empty string', () => {
        const author: Author = {
          id: 'test-author',
          name: 'John Doe',
          bio: 'Test bio',
          social: {
            twitter: '',
          },
        }

        render(<AuthorProfile author={author} />)

        expect(screen.queryByRole('link', { name: 'Twitter' })).not.toBeInTheDocument()
      })
    })

    describe('Combined Social Links', () => {
      it('should render both GitHub and Twitter links when both are provided', () => {
        const author: Author = {
          id: 'test-author',
          name: 'John Doe',
          bio: 'Test bio',
          social: {
            github: 'johndoe',
            twitter: 'johndoe',
          },
        }

        render(<AuthorProfile author={author} />)

        expect(screen.getByRole('link', { name: 'GitHub' })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'Twitter' })).toBeInTheDocument()
      })

      it('should not render social links container when social object is not provided', () => {
        const author: Author = {
          id: 'test-author',
          name: 'John Doe',
          bio: 'Test bio',
        }

        render(<AuthorProfile author={author} />)

        expect(screen.queryByRole('link')).not.toBeInTheDocument()
      })

      it('should not render social links container when social object is undefined', () => {
        const author: Author = {
          id: 'test-author',
          name: 'John Doe',
          bio: 'Test bio',
          social: undefined,
        }

        render(<AuthorProfile author={author} />)

        expect(screen.queryByRole('link')).not.toBeInTheDocument()
      })

      it('should render social links container when social object exists but is empty', () => {
        const author: Author = {
          id: 'test-author',
          name: 'John Doe',
          bio: 'Test bio',
          social: {},
        }

        render(<AuthorProfile author={author} />)

        // Social container renders but no links appear
        expect(screen.queryByRole('link')).not.toBeInTheDocument()
      })
    })
  })

  describe('Props Combinations', () => {
    it('should render with avatar and all social links', () => {
      const author: Author = {
        id: 'full-author',
        name: 'Jane Smith',
        bio: 'Full-featured author profile',
        avatar: '/images/authors/jane.jpg',
        social: {
          github: 'janesmith',
          twitter: 'janesmith',
        },
      }

      render(<AuthorProfile author={author} />)

      expect(screen.getByText('Jane Smith Sir')).toBeInTheDocument()
      expect(
        screen.getByText('Full-featured author profile')
      ).toBeInTheDocument()
      expect(screen.getByRole('img', { name: 'Jane Smith' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'GitHub' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Twitter' })).toBeInTheDocument()
    })

    it('should render with avatar but no social links', () => {
      const author: Author = {
        id: 'avatar-only',
        name: 'Bob Wilson',
        bio: 'Author with avatar only',
        avatar: '/images/authors/bob.jpg',
      }

      render(<AuthorProfile author={author} />)

      expect(screen.getByRole('img', { name: 'Bob Wilson' })).toBeInTheDocument()
      expect(screen.queryByRole('link')).not.toBeInTheDocument()
    })

    it('should render with social links but no avatar', () => {
      const author: Author = {
        id: 'social-only',
        name: 'Alice Brown',
        bio: 'Author with social only',
        social: {
          github: 'alicebrown',
          twitter: 'alicebrown',
        },
      }

      render(<AuthorProfile author={author} />)

      expect(screen.queryByRole('img')).not.toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'GitHub' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Twitter' })).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle very long author names', () => {
      const author: Author = {
        id: 'long-name',
        name: 'This Is A Very Long Author Name That Should Still Display Correctly',
        bio: 'Test bio',
      }

      render(<AuthorProfile author={author} />)

      expect(
        screen.getByText(
          'This Is A Very Long Author Name That Should Still Display Correctly Sir'
        )
      ).toBeInTheDocument()
    })

    it('should handle very long bio text', () => {
      const longBio =
        'This is a very long bio that contains multiple sentences and should still render correctly. It talks about the author\'s background, interests, and achievements in great detail. The component should handle this gracefully without breaking the layout.'

      const author: Author = {
        id: 'long-bio',
        name: 'Test Author',
        bio: longBio,
      }

      render(<AuthorProfile author={author} />)

      expect(screen.getByText(longBio)).toBeInTheDocument()
    })

    it('should handle empty bio string', () => {
      const author: Author = {
        id: 'empty-bio',
        name: 'Empty Bio Author',
        bio: '',
      }

      render(<AuthorProfile author={author} />)

      expect(screen.getByText('Empty Bio Author Sir')).toBeInTheDocument()
      // Empty bio still renders, just with no text
      const bioElement = screen.getByText('', { selector: 'p.text-sm' })
      expect(bioElement).toBeInTheDocument()
    })

    it('should handle special characters in name', () => {
      const author: Author = {
        id: 'special-chars',
        name: "O'Brien-Smith & Co.",
        bio: 'Test bio',
      }

      render(<AuthorProfile author={author} />)

      expect(screen.getByText("O'Brien-Smith & Co. Sir")).toBeInTheDocument()
    })

    it('should handle special characters in bio', () => {
      const author: Author = {
        id: 'special-bio',
        name: 'Test Author',
        bio: 'Expert in C++, Node.js & React <3',
      }

      render(<AuthorProfile author={author} />)

      expect(screen.getByText('Expert in C++, Node.js & React <3')).toBeInTheDocument()
    })

    it('should handle special characters in social usernames', () => {
      const author: Author = {
        id: 'special-social',
        name: 'Test Author',
        bio: 'Test bio',
        social: {
          github: 'user-name_123',
          twitter: 'user_name',
        },
      }

      render(<AuthorProfile author={author} />)

      const githubLink = screen.getByRole('link', { name: 'GitHub' })
      const twitterLink = screen.getByRole('link', { name: 'Twitter' })

      expect(githubLink).toHaveAttribute(
        'href',
        'https://github.com/user-name_123'
      )
      expect(twitterLink).toHaveAttribute(
        'href',
        'https://twitter.com/user_name'
      )
    })

    it('should handle email in social object (ignored by component)', () => {
      const author: Author = {
        id: 'with-email',
        name: 'Test Author',
        bio: 'Test bio',
        social: {
          github: 'testauthor',
          email: 'test@example.com',
        },
      }

      render(<AuthorProfile author={author} />)

      // Only GitHub should render, email is in type but not used by component
      expect(screen.getByRole('link', { name: 'GitHub' })).toBeInTheDocument()
      expect(screen.queryByText('test@example.com')).not.toBeInTheDocument()
    })

    it('should handle avatar path with query parameters', () => {
      const author: Author = {
        id: 'avatar-query',
        name: 'Test Author',
        bio: 'Test bio',
        avatar: '/images/authors/test.jpg?v=123&size=large',
      }

      render(<AuthorProfile author={author} />)

      const avatar = screen.getByRole('img', { name: 'Test Author' })
      expect(avatar).toHaveAttribute(
        'src',
        '/images/authors/test.jpg?v=123&size=large'
      )
    })

    it('should handle avatar path with absolute URL', () => {
      const author: Author = {
        id: 'avatar-absolute',
        name: 'Test Author',
        bio: 'Test bio',
        avatar: 'https://example.com/avatar.jpg',
      }

      render(<AuthorProfile author={author} />)

      const avatar = screen.getByRole('img', { name: 'Test Author' })
      expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg')
    })
  })

  describe('Accessibility', () => {
    it('should have proper image alt text matching author name', () => {
      const author: Author = {
        id: 'test-author',
        name: 'John Doe',
        bio: 'Test bio',
        avatar: '/images/authors/john.jpg',
      }

      render(<AuthorProfile author={author} />)

      const avatar = screen.getByAltText('John Doe')
      expect(avatar).toBeInTheDocument()
    })

    it('should have proper link attributes for external links', () => {
      const author: Author = {
        id: 'test-author',
        name: 'John Doe',
        bio: 'Test bio',
        social: {
          github: 'johndoe',
          twitter: 'johndoe',
        },
      }

      render(<AuthorProfile author={author} />)

      const links = screen.getAllByRole('link')
      links.forEach((link) => {
        expect(link).toHaveAttribute('target', '_blank')
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      })
    })

    it('should render semantic HTML structure', () => {
      const author: Author = {
        id: 'test-author',
        name: 'John Doe',
        bio: 'Test bio',
        social: {
          github: 'johndoe',
        },
      }

      const { container } = render(<AuthorProfile author={author} />)

      // Check for proper container structure
      const mainDiv = container.querySelector('div.flex.items-center')
      expect(mainDiv).toBeInTheDocument()

      // Check for paragraph tags
      const paragraphs = container.querySelectorAll('p')
      expect(paragraphs.length).toBeGreaterThan(0)
    })

    it('should have accessible link text', () => {
      const author: Author = {
        id: 'test-author',
        name: 'John Doe',
        bio: 'Test bio',
        social: {
          github: 'johndoe',
          twitter: 'johndoe',
        },
      }

      render(<AuthorProfile author={author} />)

      // Links have descriptive text, not just icons
      expect(screen.getByRole('link', { name: 'GitHub' })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Twitter' })).toBeInTheDocument()
    })
  })

  describe('CSS Classes', () => {
    it('should apply correct CSS classes to container', () => {
      const author: Author = {
        id: 'test-author',
        name: 'John Doe',
        bio: 'Test bio',
      }

      const { container } = render(<AuthorProfile author={author} />)

      const mainDiv = container.querySelector(
        'div.flex.items-center.gap-3.my-8.py-4'
      )
      expect(mainDiv).toBeInTheDocument()
      expect(mainDiv).toHaveClass(
        'border-t',
        'border-b',
        'border-neutral-200',
        'dark:border-neutral-800'
      )
    })

    it('should apply correct CSS classes to avatar', () => {
      const author: Author = {
        id: 'test-author',
        name: 'John Doe',
        bio: 'Test bio',
        avatar: '/images/authors/john.jpg',
      }

      render(<AuthorProfile author={author} />)

      const avatar = screen.getByRole('img', { name: 'John Doe' })
      expect(avatar).toHaveClass('rounded-full')
    })

    it('should apply correct CSS classes to social links', () => {
      const author: Author = {
        id: 'test-author',
        name: 'John Doe',
        bio: 'Test bio',
        social: {
          github: 'johndoe',
        },
      }

      render(<AuthorProfile author={author} />)

      const link = screen.getByRole('link', { name: 'GitHub' })
      expect(link).toHaveClass(
        'text-xs',
        'text-neutral-600',
        'dark:text-neutral-400',
        'hover:text-neutral-900',
        'dark:hover:text-neutral-100',
        'transition-colors'
      )
    })
  })
})
