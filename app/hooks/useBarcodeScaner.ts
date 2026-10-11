import { useState, useCallback } from "react"
import toast from "react-hot-toast"
import { Product } from "./useCart" // Ajustá la ruta si es necesario

export function useBarcodeScanner(productos: Product[], onAddProduct: (producto: Product) => boolean) {
    const [isScannerOpen, setIsScannerOpen] = useState(false)

    const openScanner = () => setIsScannerOpen(true)
    const closeScanner = () => setIsScannerOpen(false)

    // Usamos useCallback para que no se re-cree la función en cada render
    const handleBarcodeScanned = useCallback((codigoEscaneado: string) => {
        closeScanner() // Apagamos la cámara apenas lee algo
        
        // Buscamos el producto exacto por su código EAN
        const productoEncontrado = productos.find(p => p.codigo_barras === codigoEscaneado)

        if (productoEncontrado) {
            const success = onAddProduct(productoEncontrado)
            if (success) {
                toast.success(`Agregado: ${productoEncontrado.nombre}`)
            }
        } else {
            toast.error(`Producto no encontrado (Código: ${codigoEscaneado})`)
        }
    }, [productos, onAddProduct])

    return {
        isScannerOpen,
        openScanner,
        closeScanner,
        handleBarcodeScanned
    }
}