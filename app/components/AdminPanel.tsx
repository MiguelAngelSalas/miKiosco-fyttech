"use client"
import { useState } from "react"
import toast from "react-hot-toast"
import { Tabs } from "@radix-ui/themes" // 👈 1. Importamos Tabs
import { useAdminData } from "../hooks/useAdminData"

// Modales
import EditProductModal from "./EditProductModal" 
import AddProductModal from "@/app/components/AddProductModal"
import AddCategoryModal from "@/app/components/AddCategoryModal"

// Componentes Visuales del Admin
import AdminHeader from "@/app/components/admin/AdminHeader"
import AdminToolbar from "@/app/components/admin/AdminToolbar"
import AdminTable from "@/app/components/admin/AdminTable"

// 👇 2. Importamos nuestro panel de historial de cajas
import PanelHistorialCajas from "./PanelHistorialCaja" 

export default function AdminPanel() {
    const { 
        isAuthorized, loadingData, productos, setProductos, 
        categorias, setCategorias, handleDeleteProduct 
    } = useAdminData()
    
    const [searchTerm, setSearchTerm] = useState("")
    const [editingProduct, setEditingProduct] = useState<any | null>(null)
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isCategoryOpen, setIsCategoryOpen] = useState(false)

    const productosFiltrados = productos.filter((item) => {
        const query = searchTerm.toLowerCase().trim()
        if (!query) return true 
        
        const nombre = (item.nombre || "").toLowerCase()
        const codigo = String(item.id_producto || "").padStart(4, "0").toLowerCase()
        return nombre.includes(query) || codigo.includes(query)
    })

    if (!isAuthorized) return null

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300 font-sans">
            
            <AdminHeader />

            {/* 👇 3. ENVOLVEMOS EL CONTENIDO EN TABS (Pestañas) */}
            <Tabs.Root defaultValue="productos">
                <Tabs.List size="2" className="mb-6">
                    <Tabs.Trigger value="productos" className="cursor-pointer font-bold">
                        📦 Gestión de Productos
                    </Tabs.Trigger>
                    <Tabs.Trigger value="cajas" className="cursor-pointer font-bold">
                        💰 Historial de Cajas y PDFs
                    </Tabs.Trigger>
                </Tabs.List>

                {/* PESTAÑA 1: PRODUCTOS (Todo lo que ya tenías) */}
                <Tabs.Content value="productos" className="flex flex-col gap-6">
                    <AdminToolbar 
                        searchTerm={searchTerm} 
                        setSearchTerm={setSearchTerm} 
                        onOpenAddProduct={() => setIsAddOpen(true)} 
                    />

                    <AdminTable 
                        productosFiltrados={productosFiltrados}
                        loadingData={loadingData}
                        handleOpenEdit={(item) => setEditingProduct(item)}
                        handleDeleteProduct={handleDeleteProduct}
                    />
                </Tabs.Content>

                {/* PESTAÑA 2: CAJAS (El nuevo panel que armamos) */}
                <Tabs.Content value="cajas">
                    <PanelHistorialCajas />
                </Tabs.Content>
            </Tabs.Root>

            {/* --- ZONA DE MODALES --- */}
            <EditProductModal 
                product={editingProduct} 
                categoria={categorias}
                onClose={() => setEditingProduct(null)}
                onSuccess={(updated) => {
                    setProductos(prev => prev.map(p => p.id_producto === updated.id_producto ? updated : p))
                    setEditingProduct(null)
                    toast.success("Producto actualizado")
                }}
            />
            
            <AddProductModal 
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                categorias={categorias} 
                onSuccess={(newProduct) => {
                    setProductos(prev => [newProduct, ...prev])
                }}
                onOpenCategoryModal={() => setIsCategoryOpen(true)} 
            />

            <AddCategoryModal 
                isOpen={isCategoryOpen}
                onClose={() => setIsCategoryOpen(false)}
                onSuccess={(nuevaCategoria) => {
                    setCategorias(prev => [...prev, nuevaCategoria])
                    setIsCategoryOpen(false)
                }}
            />
        </div>
    )
}