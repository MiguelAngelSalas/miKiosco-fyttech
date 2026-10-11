"use client"
import { useBarcodeScanner } from "../hooks/useBarcodeScaner" 
import { usePosData } from "@/app/hooks/usePosData"
import { useCart } from "@/app/hooks/useCart"
import { usePosSearch } from "@/app/hooks/usePosSearch"

// Importamos nuestras piezas visuales
import PosHeader from "@/app/components/pos/PosHeader"
import PosSearch from "@/app/components/pos/PosSearch"
import PosCartTable from "@/app/components/pos/PosCartTable"
import PosSummary from "@/app/components/pos/PosSummary"
// Ajustá esta ruta dependiendo de dónde guardaste el componente de la cámara:
import BarcodeScanner from "./BarCodeScaner" 

export default function CheckoutMenu() {
    // 1. Datos
    const { userRole, productos, loadingData } = usePosData()

    // 2. Carrito
    const { 
        cart, handleAddCart, handleIncrement, handleDecrement, handleManualQuantity, 
        handleManualBlur, handleRemove, vaciarCarrito, subTotal, subTotalFormateado, 
        totalItems, itemsParaCheckout 
    } = useCart()

    // 3. Buscador Manual (Nombre o ID)
    const {
        searchTerm, selectedIndex, searchContainerRef, productosFiltrados,
        handleSearchChange, handleKeyDown, handleSelectProduct
    } = usePosSearch(productos, handleAddCart)

    // 4. Escáner de Código de Barras (El nuevo hook)
    const { 
        isScannerOpen, openScanner, closeScanner, handleBarcodeScanned 
    } = useBarcodeScanner(productos, handleAddCart)

    return (
        <div className="flex flex-col gap-6 p-6 min-h-screen bg-gray-100 dark:bg-gray-950 transition-colors duration-300 font-sans">
            
            {/* 1. EL ENCABEZADO */}
            <PosHeader userRole={userRole} />

            {/* 2. EL BUSCADOR Y LÁSER */}
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
                {/* 3. LA TABLA DEL CARRITO */}
                <PosCartTable 
                    cart={cart}
                    loadingData={loadingData}
                    handleDecrement={handleDecrement}
                    handleManualQuantity={handleManualQuantity}
                    handleManualBlur={handleManualBlur}
                    handleIncrement={handleIncrement}
                    handleRemove={handleRemove}
                />

                {/* 4. EL RESUMEN Y BOTÓN DE COBRO */}
                <PosSummary 
                    totalItems={totalItems}
                    subTotal={subTotal}
                    subTotalFormateado={subTotalFormateado}
                    itemsParaCheckout={itemsParaCheckout}
                    vaciarCarrito={vaciarCarrito}
                />
            </div>

            {/* 5. EL MODAL DE LA CÁMARA */}
            {isScannerOpen && (
                <BarcodeScanner 
                    onScanSuccess={handleBarcodeScanned}
                    onClose={closeScanner}
                />
            )}
        </div>
    )
}