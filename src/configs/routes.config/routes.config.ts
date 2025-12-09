import dashboardsRoute from './dashboardsRoute'
import conceptsRoute from './conceptsRoute'
import authRoute from './authRoute'
import authDemoRoute from './authDemoRoute'
import othersRoute from './othersRoute'
import type { Routes } from '@/@types/routes'

const landingRoute = othersRoute.find((route) => route.key === 'landing')
const otherRoutes = othersRoute.filter((route) => route.key !== 'landing')

export const publicRoutes: Routes = landingRoute
    ? [...authRoute, landingRoute]
    : [...authRoute]

export const protectedRoutes: Routes = [
    ...dashboardsRoute,
    ...conceptsRoute,
    ...authDemoRoute,
    ...otherRoutes,
]
