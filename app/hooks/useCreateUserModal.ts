import { useState } from "react"
import toast from "react-hot-toast"
import { registerEmployeeAction } from "../admin/actions" // El action CON token

export function useCreateUserModal(){
    const [open, setOpen] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [rolSeleccionado, setRolSeleccionado] = useState("cajero") // Cambiado de "0" a "cajero"

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setErrorMsg(null)
        setLoading(true)

        const form = e.currentTarget
        const formData = new FormData(form)

        try {
            // Acá llamamos al nuevo action de empleados
            const respuesta = await registerEmployeeAction(formData)

            if (respuesta?.error) {
                setErrorMsg(respuesta.error)
                toast.error(respuesta.error)
                setLoading(false)
                return
            }

            toast.success("Empleado creado exitosamente")
            form.reset()          
            setRolSeleccionado("cajero") 
            setLoading(false)     
            setOpen(false)        
            
        } catch (err: any) {
            const errorMessage = err?.message || "Ocurrió un error inesperado al registrar"
            setErrorMsg(errorMessage)
            toast.error(errorMessage)
            setLoading(false)
        }
    }

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen)
        if (!isOpen) {
            setErrorMsg(null)
            setLoading(false)
            setRolSeleccionado("cajero")
        }
    }

    return {
        open, errorMsg, loading, rolSeleccionado, setRolSeleccionado, handleSubmit, handleOpenChange
    }
}