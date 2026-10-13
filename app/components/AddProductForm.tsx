"use client"
import BarcodeScanner from "./BarCodeScaner" // Ajustá tus rutas
import BarcodeSection from "../components/productos/form/BarcodeSection"
import GeneralFields from "../components/productos/form/GeneralFields"
import FormFooter from "../components/productos/form/FormFooter"
import { Categoria } from "./EditProductModal"

interface AddProductFormProps {
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    onClose: () => void
    loading: boolean
    categorias: Categoria[]
    onOpenCategoryModal: () => void
    codigoBarras: string
    setCodigoBarras: (val: string) => void
    nombre: string
    setNombre: (val: string) => void
    isScannerOpen: boolean
    openScanner: () => void
    closeScanner: () => void
    handleBarcodeScanned: (code: string) => void
    buscandoEnInternet: boolean
}

export default function AddProductForm(props: AddProductFormProps) {
    return (
        <form onSubmit={props.handleSubmit} className="flex flex-col">
            <div className="p-6 flex flex-col gap-5 max-h-[65vh] overflow-y-auto">
                
                <BarcodeSection 
                    codigoBarras={props.codigoBarras}
                    setCodigoBarras={props.setCodigoBarras}
                    loading={props.loading}
                    buscandoEnInternet={props.buscandoEnInternet}
                    handleBarcodeScanned={props.handleBarcodeScanned}
                    openScanner={props.openScanner}
                />

                <GeneralFields 
                    nombre={props.nombre}
                    setNombre={props.setNombre}
                    loading={props.loading}
                    buscandoEnInternet={props.buscandoEnInternet}
                    categorias={props.categorias}
                />

            </div>
            
            <FormFooter 
                onOpenCategoryModal={props.onOpenCategoryModal}
                onClose={props.onClose}
                loading={props.loading}
            />

            {props.isScannerOpen && (
                <BarcodeScanner 
                    onScanSuccess={props.handleBarcodeScanned}
                    onClose={props.closeScanner}
                />
            )}
        </form>
    )
}