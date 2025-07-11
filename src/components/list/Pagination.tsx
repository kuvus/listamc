import { ComponentProps, FunctionComponent } from 'react'
import Link from 'next/link'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'
import { cn } from '@/lib/utils'
import { getServerCount } from '@/data/server'

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
                className={cn(
                    'border-semi-border flex h-11 items-center justify-center rounded-md border px-4 py-2',
                    active ? 'bg-semi-promoted' : 'bg-semi-bg'
                )}>
                {children}
            </span>
        )

    return (
        <Link href={href} aria-label={ariaLabel}>
            <span
                className={cn(
                    'border-semi-border hover:bg-semi-bg-hover flex h-11 items-center justify-center rounded-md border px-4 py-2 hover:cursor-pointer',
                    active ? 'bg-semi-promoted' : 'bg-semi-bg'
                )}>
                {children}
            </span>
        </Link>
    )
}

export const Pagination: FunctionComponent<PaginationProps> = async ({
    current,
}) => {
    const max = Math.ceil((await getServerCount()) / 20) || 1
    const d = calculatePagination(current, max)

    if (d.length == 2 && d[0] == d[1]) d.pop()

    return (
        <div className={'mt-12 flex justify-center gap-2'}>
            <PaginationButton
                key='prev'
                href={`/p/${current !== 1 ? current - 1 : 1}`}
                active={false}
                ariaLabel={'Poprzednia strona'}>
                <LuChevronLeft />
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
                key='next'
                href={`/p/${current !== max ? current + 1 : max}`}
                active={false}
                ariaLabel={'Następna strona'}>
                <LuChevronRight />
            </PaginationButton>
        </div>
    )
}
