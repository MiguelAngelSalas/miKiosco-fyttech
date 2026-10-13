import { useState, useEffect } from "react"
import { verificarEstadoCajaAction } from "@/app/admin/actions"

export function useCaja() {
    // Manejamos 3 estados: verificando (cargando), abierta o cerrada
    const [estadoCaja, setEstadoCaja] = useState<'verificando' | 'abierta' | 'cerrada'>('verificando')

    useEffect(() => {
        async function checkEstado() {
            const res = await verificarEstadoCajaAction()
            if (res.success && res.abierta) {
                setEstadoCaja('abierta')
            } else {
                setEstadoCaja('cerrada')
            }
        }
        checkEstado()
    }, [])

    // Función para que el AbrirCajaPanel cambie el estado sin recargar la página
    const marcarComoAbierta = () => setEstadoCaja('abierta')

    return { estadoCaja, marcarComoAbierta }
}