import { useState, useEffect, useCallback } from "react"
import toast from "react-hot-toast"
import { obtenerResumenCajaAction, cerrarCajaAction } from "@/app/admin/actions"

export function useCierreCaja(onCajaCerrada: () => void) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [cerrando, setCerrando] = useState(false)
    const [resumen, setResumen] = useState<any>(null)

    const cargarResumen = useCallback(async () => {
        setLoading(true)
        const res = await obtenerResumenCajaAction()
        if (res.success) {
            setResumen(res.resumen)
        } else {
            toast.error(res.error)
            setOpen(false)
        }
        setLoading(false)
    }, [setOpen])

    useEffect(() => {
        if (open) {
            cargarResumen()
        }
    }, [open, cargarResumen])

    const handleCerrarCaja = async () => {
        const confirmar = window.confirm("¿Estás seguro que querés cerrar la caja del turno?")
        if (!confirmar) return

        setCerrando(true)
        const res = await cerrarCajaAction()
        setCerrando(false)

        if (res.success) {
            toast.success("Turno finalizado y caja cerrada.")
            setOpen(false)
            onCajaCerrada()
        } else {
            toast.error(res.error)
        }
    }

    return {
        open, setOpen, loading, cerrando, resumen, handleCerrarCaja
    }
}