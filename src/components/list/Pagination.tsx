import { FunctionComponent } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
    current: number
    max: number
}

interface PaginationButtonProps {
    children: React.ReactNode
    active: boolean
    key: number
    href: string
}

const calculatePagination = (current: number, max: number) => {
    // let prev = current === 1 ? -1 : current - 1,
    //     next = current === max ? -1 : current + 1,
    //     items = [1]
    //
    // if (current === 1 && max === 1) return { current, prev, next, items }
    // if (current > 4) items.push(-1)
    //
    // let r = 2,
    //     r1 = current - r,
    //     r2 = current + r
    //
    // for (let i = r1 > 2 ? r1 : 2; i <= Math.min(max, r2); i++) items.push(i)
    //
    // if (r2 + 1 < max) items.push(-1)
    // if (r2 < max) items.push(max)
    //
    // return { current, prev, next, items }
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
    key,
    href,
    active,
}) => {
    if (children === '...')
        return (
            <span
                className={`flex items-center justify-center h-11 px-4 py-2 border border-semi-border rounded ${
                    active ? 'bg-semi-promoted' : 'bg-semi-bg'
                }`}>
                {children}
            </span>
        )
    return (
        <Link href={href} key={key}>
            <span
                className={`flex items-center justify-center h-11 px-4 py-2 border border-semi-border rounded hover:cursor-pointer hover:bg-semi-promoted ${
                    active ? 'bg-semi-promoted' : 'bg-semi-bg'
                }`}>
                {children}
            </span>
        </Link>
    )
}

export const Pagination: FunctionComponent<PaginationProps> = ({
    current,
    max,
}) => {
    const d = calculatePagination(current, max)

    return (
        <div className={'flex gap-2 mt-8 justify-center'}>
            <PaginationButton
                key={-20}
                href={`/p/${current !== 1 ? current - 1 : 1}`}
                active={false}>
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
                if (item === current)
                    return (
                        <PaginationButton
                            key={item}
                            href={`/p/${item}`}
                            active={current === item}>
                            {item}
                        </PaginationButton>
                    )
                return (
                    <PaginationButton
                        key={item}
                        href={`/p/${item}`}
                        active={current === item}>
                        {item}
                    </PaginationButton>
                )
            })}
            <PaginationButton
                key={-20}
                href={`/p/${current !== max ? current + 1 : max}`}
                active={false}>
                <ChevronRight />
            </PaginationButton>
        </div>
    )
}
