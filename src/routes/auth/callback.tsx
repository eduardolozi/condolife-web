import { loginCallback } from '@/features/auth/services/AuthService'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'

export const Route = createFileRoute('/auth/callback')({
  component: RouteComponent,
})

function RouteComponent() {
    const navigate = useNavigate()
    const calledRef = useRef(false)

    useEffect(() => {
        if (calledRef.current) return
        calledRef.current = true
        const handleLogin = async () => {
            try {
                const userLoginCallback = await loginCallback()
                const redirectPath = (userLoginCallback.state as string) || "/"
                navigate({to: redirectPath})
            }
            catch(e) {
                alert(e)
                navigate({to: "/"})
            }
        }
        
        void handleLogin()
    }, [navigate])

    return null
}
