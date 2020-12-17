import Link from 'next/link'

type SubNavProps = {
    current: string | undefined,
    text: string,
}

export default function SubNav({ current, text }: SubNavProps) {
    const capitaliseString = (word: string) => {
        return typeof word !== 'string' ? '' : word.charAt(0).toUpperCase() + word.slice(1)
    }

    return (
        <Link href={`/settings/${text}`}>
            <a
                href={`/settings/${text}`}
                className={`${current === text ? 'border-l-2 border-brand font-medium -ml-px' : ''} pl-3`}
            >
                {capitaliseString(text)}
            </a>
        </Link>
    )
}
