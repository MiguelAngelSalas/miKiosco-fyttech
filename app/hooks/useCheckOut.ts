import { useState } from "react"
import toast from "react-hot-toast"
import { createSaleAction } from "@/app/admin/actions" // <-- Ajustá la ruta

interface CartItem {
    id_producto: string
    cantidad: number
    precio: number
}

export function useCheckout(onClearCart: () => void) {
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null)

    const handleCompleteSale = async (methodKey: string, items: CartItem[]) => {
        if (items.length === 0) {
            toast.error("El carrito está vacío")
            return
        }

        setLoading(true)
        setSelectedMethod(methodKey)

        try {
            const totalVenta = items.reduce((acc, item) => acc + (item.precio * item.cantidad), 0)            
            // Agarramos el token del navegador

            // Llamamos a la Action pasándole el token
            const response = await createSaleAction(items, totalVenta, methodKey)
            if (!response.success) {
                throw new Error(response.error)
            }

            toast.success("¡Venta registrada con éxito!")
            onClearCart()
            setIsCheckoutOpen(false)

        } catch (error: any) {
            console.error("❌ Error en checkout:", error)
            toast.error(error.message || "Hubo un problema al cobrar")
        } finally {
            setLoading(false)
            setSelectedMethod(null)
        }
    }

    return {
        isCheckoutOpen,
        setIsCheckoutOpen,
        loading,
        selectedMethod,
        handleCompleteSale
    }
}