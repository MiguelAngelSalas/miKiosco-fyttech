"use client"
import { useCaja } from "@/app/hooks/useCaja" 
import { useBarcodeScanner } from "../hooks/useBarcodeScanner" 
import { usePosData } from "@/app/hooks/usePosData"
import { useCart } from "@/app/hooks/useCart"
import { usePosSearch } from "@/app/hooks/usePosSearch"

import PosHeader from "@/app/components/pos/PosHeader"
import PosSearch from "@/app/components/pos/PosSearch"
import PosCartTable from "@/app/components/pos/PosCartTable"
import PosSummary from "@/app/components/pos/PosSummary"
import BarcodeScanner from "./BarCodeScaner" 

export default function CheckoutMenu() {
    const { estadoCaja, marcarComoAbierta } = useCaja()

    const { userRole, productos, loadingData } = usePosData()

    const { 
        cart, handleAddCart, handleIncrement, handleDecrement, handleManualQuantity, 
        handleManualBlur, handleRemove, vaciarCarrito, subTotal, subTotalFormateado, 
        totalItems, itemsParaCheckout 
    } = useCart()

    const {
        searchTerm, selectedIndex, searchContainerRef, productosFiltrados,
        handleSearchChange, handleKeyDown, handleSelectProduct
    } = usePosSearch(productos, handleAddCart)

    const { 
        isScannerOpen, openScanner, closeScanner, handleBarcodeScanned 
    } = useBarcodeScanner(productos, handleAddCart)


    // ⏳ PANTALLA DE CARGA: Mientras le pregunta a Node.js el estado
    if (estadoCaja === 'verificando') {
        return (
            <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950 items-center justify-center">
                <div className="animate-spin w-12 h-12 border-4 border-[#589c33] border-t-transparent rounded-full shadow-lg" />
            </div>
        )
    }

    // 🛑 ¡ELIMINAMOS LA BARRERA! Ahora pasa de largo siempre.

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300 font-sans">
            
            {/* 👇 1. Le pasamos el estado y la función al Header */}
            <PosHeader 
                userRole={userRole} 
                estadoCaja={estadoCaja}
                marcarComoAbierta={marcarComoAbierta}
            />

            <PosSearch 
                searchTerm={searchTerm}
                handleSearchChange={handleSearchChange}
                handleKeyDown={handleKeyDown}
                loadingData={loadingData}
                searchContainerRef={searchContainerRef}
                productosFiltrados={productosFiltrados}
                selectedIndex={selectedIndex}
                handleSelectProduct={handleSelectProduct}
                onOpenScanner={openScanner}
            />

            <div className="flex flex-col lg:flex-row gap-6 grow items-start">
                <PosCartTable 
                    cart={cart}
                    loadingData={loadingData}
                    handleDecrement={handleDecrement}
                    handleManualQuantity={handleManualQuantity}
                    handleManualBlur={handleManualBlur}
                    handleIncrement={handleIncrement}
                    handleRemove={handleRemove}
                />

                {/* 👇 2. Le pasamos el estado a PosSummary para que bloquee el botón */}
                <PosSummary 
                    totalItems={totalItems}
                    subTotal={subTotal}
                    subTotalFormateado={subTotalFormateado}
                    itemsParaCheckout={itemsParaCheckout}
                    vaciarCarrito={vaciarCarrito}
                    estadoCaja={estadoCaja} 
                />
            </div>

            {isScannerOpen && (
                <BarcodeScanner 
                    onScanSuccess={handleBarcodeScanned}
                    onClose={closeScanner}
                />
            )}
        </div>
    )
}