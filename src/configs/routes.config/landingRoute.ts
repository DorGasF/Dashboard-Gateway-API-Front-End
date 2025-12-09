import { lazy } from 'react'
import type { Routes } from '@/@types/routes'

const landingRoute: Routes = [
    {
        key: 'landing',
        path: `/`,
        component: lazy(() => import('@/views/others/Landing')),
        authority: [],
    },
]

export default landingRoute
