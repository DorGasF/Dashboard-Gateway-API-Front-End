import { useRef, useState, useEffect, ReactNode } from 'react'
import classNames from 'classnames'
import type { HTMLAttributes } from 'react'

interface StickyFooterProps extends Omit<
    HTMLAttributes<HTMLDivElement>,
    'children'
> {
    stickyClass?: string
    defaultClass?: string
    children?: ReactNode | ((isSticky: boolean) => ReactNode)
}

const StickyFooter = (props: StickyFooterProps) => {
    const { children, className, stickyClass, defaultClass, ...rest } = props

    const [isSticky, setIsSticky] = useState(false)
    const sentinelRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const sentinel = sentinelRef.current
        if (!sentinel) return

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0]
                if (!entry) return
                setIsSticky(!entry.isIntersecting)
            },
            {
                threshold: 0,
            },
        )

        observer.observe(sentinel)
        return () => observer.disconnect()
    }, [])

    return (
        <>
            {/* Sentinel invisível */}
            <div ref={sentinelRef} className="h-px w-full" />

            <div
                className={classNames(
                    className,
                    isSticky
                        ? classNames(
                              'sticky bottom-0 z-[20] bg-white dark:bg-gray-800',
                              stickyClass,
                          )
                        : defaultClass,
                )}
                {...rest}
            >
                {typeof children === 'function' ? children(isSticky) : children}
            </div>
        </>
    )
}

export default StickyFooter
