import dashboardsRoute from './dashboardsRoute'
import conceptsRoute from './conceptsRoute'
import authRoute from './authRoute'
import authDemoRoute from './authDemoRoute'
import othersRoute from './othersRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes: Routes = [
    ...dashboardsRoute,
    ...conceptsRoute,
    ...authDemoRoute,
    ...othersRoute,
]
