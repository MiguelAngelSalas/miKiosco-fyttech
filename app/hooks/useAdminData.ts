import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { getProductsAction, getCategoriesAction, deleteProductAction } from "../admin/actions" 

import { Product } from "./useAddProduct" 
import { Categoria } from "../components/EditProductModal" 

export interface RawBackendProduct {
    id_producto: number
    nombre: string
    codigo_barras: string
    precio_venta: string | number
    costo: string | number
    stock: number
    id_categoria: number
}
interface RawBackendCategoria{
    id_categoria: string | number;
    nombre_categoria: string;
}

export function useAdminData() {
    const router = useRouter()
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [loadingData, setLoadingData] = useState(true) 
    
    const [productos, setProductos] = useState<Product[]>([])
    const [categorias, setCategorias] = useState<Categoria[]>([])

    useEffect(() => {
        const storedRole = localStorage.getItem("rolUsuario")

        if (!storedRole || storedRole !== "administrador") {
            toast.error("Acceso denegado. Solo administradores.")
            router.push("/login") 
            return
        } 
        
        setIsAuthorized(true)

        const fetchRealData = async () => {
            setLoadingData(true)
            
            const [prodRes, catRes] = await Promise.all([
                getProductsAction(),
                getCategoriesAction()
            ])
            console.log("👉 Respuesta de categorías:", catRes);
            if (prodRes.success && prodRes.data) {
                const productosAdaptados: Product[] = prodRes.data.map((p: RawBackendProduct) => ({
                    id_producto: p.id_producto,
                    nombre: p.nombre,
                    codigo_barras: p.codigo_barras,
                    precio_venta: p.precio_venta,
                    costo: p.costo,
                    stock: p.stock,
                    id_categoria: p.id_categoria
                }))
                setProductos(productosAdaptados)
            } else {
                toast.error("No se pudieron cargar los productos")
            }

            if (catRes.success && catRes.data) {
                const categoriasAdaptadas: Categoria[] = catRes.data.map((c: RawBackendCategoria) => ({
                    id_categoria: c.id_categoria, 
                    nombre_categoria: c.nombre_categoria
                }))
                setCategorias(categoriasAdaptadas)
            }

            setLoadingData(false)
        }

        fetchRealData()
    }, [router])

    // Mudamos la lógica de borrar acá adentro, así el componente no se entera cómo funciona por detrás
    const handleDeleteProduct = async (id: string | number, nombre: string) => {
        if (window.confirm(`¿Estás seguro que querés borrar el producto "${nombre}"?`)) {
            const toastId = toast.loading("Eliminando producto...")

            try {
                const respuesta = await deleteProductAction(id)

                if (respuesta?.error) {
                    toast.error(respuesta.error, { id: toastId })
                    return
                }

                setProductos(prev => prev.filter(p => p.id_producto !== id))
                toast.success(`Producto "${nombre}" eliminado`, { id: toastId })

            } catch (err) {
                toast.error("Ocurrió un error al eliminar", { id: toastId })
            }
        }
    }

    return {
        isAuthorized,
        loadingData,
        productos,
        setProductos,
        categorias,
        setCategorias,
        handleDeleteProduct // Exponemos la función
    }
}