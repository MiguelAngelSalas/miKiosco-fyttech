import { useState } from "react"
import toast from "react-hot-toast"
// Asegurate de que la ruta de tu action sea la correcta
import { addProductAction } from "../admin/actions" 

export interface Product {
    id_producto: string | number
    nombre: string
    id_categoria: string | number
    precio_venta: number
    costo: number
    stock: number
    codigo_barras?: string 
}

interface ActionResponse {
    error?: string;
    success?: boolean;
    id_producto?: string | number;
    productoNuevo?: {
        id_producto: string | number;
    };
}

export function useAddProduct(onClose: () => void, onSuccess: (newProduct: Product) => void) {
    // Estado del submit
    const [loading, setLoading] = useState(false)

    // Estados para la cámara y la API
    const [isScannerOpen, setIsScannerOpen] = useState(false)
    const [buscandoEnInternet, setBuscandoEnInternet] = useState(false)
    const [codigoBarras, setCodigoBarras] = useState("")
    const [nombre, setNombre] = useState("")

    const openScanner = () => setIsScannerOpen(true)
    const closeScanner = () => setIsScannerOpen(false)

    // Función que busca en Open Food Facts
    const buscarDatosDelProducto = async (codigoEan: string) => {
        setBuscandoEnInternet(true)
        try {
            const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${codigoEan}.json`)
            const data = await res.json()

            if (data.status === 1 && data.product.product_name) {
                setNombre(data.product.product_name)
                toast.success("¡Producto encontrado en la red!")
            } else {
                toast.error("No está en la base mundial. Escribí el nombre a mano.")
            }
        } catch (error) {
            toast.error("Error buscando el producto.")
        } finally {
            setBuscandoEnInternet(false)
        }
    }

    // Lo que pasa cuando la cámara escanea algo
    const handleBarcodeScanned = (codigoEscaneado: string) => {
        closeScanner()
        setCodigoBarras(codigoEscaneado) 
        buscarDatosDelProducto(codigoEscaneado)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.currentTarget
        const formData = new FormData(form)

        if (!formData.get("nombre") || !formData.get("codigoBarras") || formData.get("categoriaId") === "") {
            toast.error("Completá todos los campos obligatorios")
            return
        }

        setLoading(true)

        try {
            const respuesta = await addProductAction(formData) as ActionResponse

            if (respuesta?.error) {
                toast.error(respuesta.error)
                setLoading(false)
                return
            }

            toast.success("Producto creado en el servidor")
            
            const idReal = respuesta.productoNuevo?.id_producto || Date.now().toString()
            onSuccess({
                id_producto: idReal,
                nombre: formData.get("nombre") as string,
                codigo_barras: formData.get("codigoBarras") as string,
                precio_venta: Number(formData.get("precioVenta")),
                costo: Number(formData.get("precioCosto")),
                stock: Number(formData.get("stock")),
                id_categoria: formData.get("categoriaId") as string
            })
            
            // Limpiamos los estados de React y el form nativo
            setCodigoBarras("")
            setNombre("")
            form.reset()
            setLoading(false)
            onClose()

        } catch (err) {
            toast.error("Error inesperado al guardar el producto")
            setLoading(false)
        }
    }

    return {
        // Lo del form
        loading,
        handleSubmit,
        // Lo del autocompletado
        codigoBarras,
        setCodigoBarras,
        nombre,
        setNombre,
        // Lo del escáner
        isScannerOpen,
        openScanner,
        closeScanner,
        handleBarcodeScanned,
        buscandoEnInternet
    }
}