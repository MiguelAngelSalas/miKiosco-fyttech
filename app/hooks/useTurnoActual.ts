import { useState, useEffect, useCallback } from "react"
import toast from "react-hot-toast"
import { obtenerResumenCajaAction } from "@/app/admin/actions"

export function useTurnoActual() {
    const [resumen, setResumen] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const cargarDatos = useCallback(async () => {
        setLoading(true)
        const res = await obtenerResumenCajaAction()
        if (res.success) {
            setResumen(res.resumen)
        } else {
            toast.error(res.error || "No se pudo cargar el turno")
        }
        setLoading(false)
    }, [])

    useEffect(() => {
        cargarDatos()
    }, [cargarDatos])

    return { resumen, loading, cargarDatos }
}