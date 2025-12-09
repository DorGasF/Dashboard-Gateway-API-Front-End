import { CommonProps } from '@/@types/common'
import LayoutBase from '@/components/template/LayoutBase'
import { LAYOUT_BLANK } from '@/constants/theme.constant'

const Blank = ({ children }: CommonProps) => {
    return (
        <LayoutBase
            type={LAYOUT_BLANK}
            className="app-layout-blank min-h-[100vh] w-full"
        >
            {children}
        </LayoutBase>
    )
}

export default Blank
