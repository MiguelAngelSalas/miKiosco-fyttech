import { useState, useEffect, useRef } from "react"
import { Product } from "./useCart"

export function usePosSearch(productos: Product[], onAddProduct: (producto: Product) => boolean) {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const searchContainerRef = useRef<HTMLDivElement>(null)

    const clearSearch = () => {
        setSearchTerm("")
        setSelectedIndex(-1)
    }

    // Efecto para cerrar el buscador al hacer clic afuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                clearSearch()
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSelectProduct = (producto: Product) => {
        const success = onAddProduct(producto)
        // Solo borra el buscador si se agregó bien al carrito
        if (success) {
            clearSearch()
        }
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
        setSelectedIndex(-1)
    }

    // El Mini Retraso (Autocompletar si tipean el ID exacto)
    useEffect(() => {
        const query = searchTerm.trim().toLowerCase()
        if (!query) return;

        const timeoutId = setTimeout(() => {
            // Buscamos si tipeó exactamente el ID (ej: "0015")
            const exactMatch = productos.find(item => {
                const codigoFormateado = String(item.id_producto).padStart(4, '0').toLowerCase()
                return codigoFormateado === query
            })

            if (exactMatch) handleSelectProduct(exactMatch)
        }, 350) 

        return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, productos])

    // Filtramos SOLO por nombre o por ID interno
    const productosFiltrados = searchTerm.trim() === "" ? [] : productos.filter(item => {
        const query = searchTerm.toLowerCase().trim()
        const nombre = (item.nombre || "").toLowerCase()
        const codigoFormateado = String(item.id_producto).padStart(4, '0').toLowerCase()
        const codigoCrudo = String(item.id_producto).toLowerCase()
        
        return nombre.includes(query) || 
               codigoFormateado.includes(query) || 
               codigoCrudo.includes(query)
    })

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Escape") {
            e.preventDefault()
            clearSearch()
            return
        }

        if (e.key === "ArrowDown") {
            if (productosFiltrados.length > 0) {
                e.preventDefault() 
                setSelectedIndex(prev => (prev < productosFiltrados.length - 1 ? prev + 1 : prev))
            }
        } else if (e.key === "ArrowUp") {
            if (productosFiltrados.length > 0) {
                e.preventDefault()
                setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0))
            }
        } else if (e.key === "Enter") {
            e.preventDefault()
            const query = searchTerm.trim().toLowerCase()
            if (!query) return;

            if (selectedIndex >= 0 && selectedIndex < productosFiltrados.length) {
                handleSelectProduct(productosFiltrados[selectedIndex])
                return
            }

            // Si apretó Enter tipeando el ID exacto
            const exactMatch = productos.find(item => {
                const codigoFormateado = String(item.id_producto).padStart(4, '0').toLowerCase()
                const codigoCrudo = String(item.id_producto).toLowerCase()
                return codigoFormateado === query || codigoCrudo === query
            })

            if (exactMatch) {
                handleSelectProduct(exactMatch)
                return
            }

            if (productosFiltrados.length === 1) {
                handleSelectProduct(productosFiltrados[0])
            }
        }
    }

    return {
        searchTerm, selectedIndex, searchContainerRef, productosFiltrados,
        handleSearchChange, handleKeyDown, handleSelectProduct
    }
}