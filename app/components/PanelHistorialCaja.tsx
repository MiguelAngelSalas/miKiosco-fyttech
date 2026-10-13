"use client"
import { Card, Flex, Heading } from "@radix-ui/themes"
import { FileText } from "lucide-react"

// Importamos la lógica (El Hook)
import { useHistorialCajas } from "../hooks/useHistoriaCajas" 

// Importamos los componentes visuales
import TablaCajas from "./historial/TablaCajas"
import ModalDetalleVentas from "./historial/ModalDetalleVentas"

export default function PanelHistorialCajas() {
    // Extraemos todo lo que necesitamos del Hook
    const {
        cajas, loading, cajaDescargando, ventas, isModalOpen, setIsModalOpen,
        cajaSeleccionada, loadingVentas, formatearFecha, descargarPDF, verDetalleVentas
    } = useHistorialCajas()

    if (loading) return <div className="p-10 text-center">Cargando cajas...</div>

    return (
        <Card className="p-6 max-w-5xl mx-auto mt-6 shadow-md border-gray-200">
            <Flex align="center" gap="3" mb="5">
                <FileText size={28} className="text-[#33589c]" />
                <Heading size="6">Historial de Cajas</Heading>
            </Flex>

            <TablaCajas 
                cajas={cajas} 
                cajaDescargando={cajaDescargando} 
                formatearFecha={formatearFecha} 
                verDetalleVentas={verDetalleVentas} 
                descargarPDF={descargarPDF} 
            />

            <ModalDetalleVentas 
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                cajaSeleccionada={cajaSeleccionada}
                loadingVentas={loadingVentas}
                ventas={ventas}
                formatearFecha={formatearFecha}
            />
        </Card>
    )
}