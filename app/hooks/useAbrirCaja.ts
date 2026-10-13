import { useState } from "react"
import toast from "react-hot-toast"
import { abrirCajaAction } from "@/app/admin/actions"

export function useAbrirCaja(onCajaAbierta: () => void) {
    const [monto, setMonto] = useState("")
    const [loading, setLoading] = useState(false)

    const handleAbrirCaja = async () => {
        const montoNum = parseFloat(monto)
        if (isNaN(montoNum) || montoNum < 0) {
            toast.error("Ingresá un monto válido")
            return
        }

        setLoading(true)
        const res = await abrirCajaAction(montoNum)
        setLoading(false)

        if (res.success) {
            toast.success("¡Caja abierta! Ya podés cobrar.")
            onCajaAbierta() 
        } else {
            toast.error(res.error)
        }
    }

    return {
        monto,
        setMonto,
        loading,
        handleAbrirCaja
    }
}