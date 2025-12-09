import { Navigate, Outlet, useLocation } from 'react-router'
import appConfig from '@/configs/app.config'
import { publicRoutes } from '@/configs/routes.config'
import { useAuth } from '@/auth'

const { authenticatedEntryPath } = appConfig

const PublicRoute = () => {
    const { authenticated } = useAuth()

    const location = useLocation()
    const allowPublicAccessWhenAuthenticated = publicRoutes.some(
        (route) =>
            route.path === location.pathname && route.meta?.allowAuthenticated,
    )

    if (allowPublicAccessWhenAuthenticated) {
        return <Outlet />
    }

    return authenticated ? <Navigate to={authenticatedEntryPath} /> : <Outlet />
}

export default PublicRoute
