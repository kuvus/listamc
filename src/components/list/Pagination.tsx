import { ComponentProps, FunctionComponent } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
    current: number
}

interface PaginationButtonProps extends ComponentProps<'a'> {
    children: React.ReactNode
    active: boolean
    href: string
    ariaLabel?: string
}

const calculatePagination = (current: number, max: number) => {
    const center = [
            current - 2,
            current - 1,
            current,
            current + 1,
            current + 2,
        ],
        filteredCenter = center.filter(p => p > 1 && p < max),
        includeThreeLeft = current === 5,
        includeThreeRight = current === max - 4,
        includeLeftDots = current > 5,
        includeRightDots = current < max - 4

    if (includeThreeLeft) filteredCenter.unshift(2)
    if (includeThreeRight) filteredCenter.push(max - 1)

    if (includeLeftDots) filteredCenter.unshift(-1)
    if (includeRightDots) filteredCenter.push(-1)

    return [1, ...filteredCenter, max]
}

const PaginationButton: FunctionComponent<PaginationButtonProps> = ({
    children,
    href,
    active,
    ariaLabel,
}) => {
    if (children === '...')
        return (
            <span
                className={`flex h-11 items-center justify-center rounded border border-semi-border px-4 py-2 ${
                    active ? 'bg-semi-promoted' : 'bg-semi-bg'
                }`}>
                {children}
            </span>
        )
    return (
        <Link href={href} aria-label={ariaLabel}>
            <span
                className={`flex h-11 items-center justify-center rounded border border-semi-border px-4 py-2 hover:cursor-pointer hover:bg-semi-bg-hover ${
                    active ? 'bg-semi-promoted' : 'bg-semi-bg'
                }`}>
                {children}
            </span>
        </Link>
    )
}

export const Pagination: FunctionComponent<PaginationProps> = async ({
    current,
}) => {
    const max = Math.ceil((await getData())['count'] / 20) || 1
    const d = calculatePagination(current, max)

    if (d.length == 2 && d[0] == d[1]) d.pop()

    return (
        <div className={'mt-12 flex justify-center gap-2'}>
            <PaginationButton
                key={-20}
                href={`/p/${current !== 1 ? current - 1 : 1}`}
                active={false}
                ariaLabel={'Poprzednia strona'}>
                <ChevronLeft />
            </PaginationButton>
            {d.map((item, i) => {
                if (item === -1)
                    return (
                        <PaginationButton
                            key={item}
                            href={'#'}
                            active={current === item}>
                            ...
                        </PaginationButton>
                    )

                return (
                    <PaginationButton
                        key={item}
                        href={`/p/${item}`}
                        active={current === item}
                        ariaLabel={`Strona ${item}`}>
                        {item}
                    </PaginationButton>
                )
            })}
            <PaginationButton
                key={-20}
                href={`/p/${current !== max ? current + 1 : max}`}
                active={false}
                ariaLabel={'Następna strona'}>
                <ChevronRight />
            </PaginationButton>
        </div>
    )
}

const getData = async () => {
    const res = await fetch(`${process.env.API_URL}/servers?count=true`, {
        next: { revalidate: 10 },
    })

    // TODO: zmień revalidate na większe (teraz 10s)

    if (!res.ok) {
        // This will activate the closest `error.js` Error Boundary
        throw new Error('Failed to fetch data')
    }

    return res.json()
}
