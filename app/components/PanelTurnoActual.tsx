"use client"
import { Flex } from "@radix-ui/themes"
import ModalCierreCaja from "./ModalCierreCaja"
import { useTurnoActual } from "@/app/hooks/useTurnoActual"

// Importamos los pedacitos (Ajustá las rutas según dónde los guardes)
import TurnoHeader from "../components/turnos/TurnoHeader"
import TarjetasPrincipales from "../components/turnos/TarjetasPrincipales"
import DesglosePagos from "../components/turnos/DesglosePagos"

export default function PanelTurnoActual() {
    const { resumen, loading, cargarDatos } = useTurnoActual()

    if (loading || !resumen) {
        return (
            <Flex justify="center" align="center" className="h-64">
                <div className="animate-spin w-10 h-10 border-4 border-[#33589c] border-t-transparent rounded-full" />
            </Flex>
        )
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-4 flex flex-col gap-6">
            <TurnoHeader onRefresh={cargarDatos} loading={loading} nombreUsuario={resumen.nombre_usuario} />
            
            <TarjetasPrincipales resumen={resumen} />
            
            <DesglosePagos desglose={resumen.desglose} />

            <Flex justify="end" className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                <ModalCierreCaja onCajaCerrada={() => window.location.reload()} />
            </Flex>
        </div>
    )
}