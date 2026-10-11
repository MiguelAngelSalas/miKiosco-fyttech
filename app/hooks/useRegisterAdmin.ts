import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { registerAdminAction } from "../admin/actions" // El action SIN token

export function useRegisterAdmin() {
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setErrorMsg(null)
        setLoading(true)

        const form = e.currentTarget
        const formData = new FormData(form)

        try {
            const respuesta = await registerAdminAction(formData)

            if (respuesta?.error) {
                setErrorMsg(respuesta.error)
                toast.error(respuesta.error)
                setLoading(false)
                return
            }

            toast.success("¡Kiosco registrado exitosamente!")
            router.push("/login") // Lo mandamos a loguearse
            
        } catch (err: any) {
            const errorMessage = err?.message || "Ocurrió un error inesperado al registrar el negocio."
            setErrorMsg(errorMessage)
            toast.error(errorMessage)
            setLoading(false)
        }
    }

    return {
        errorMsg,
        loading,
        handleSubmit
    }
}