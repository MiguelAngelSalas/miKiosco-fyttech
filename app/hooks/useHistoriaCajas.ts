import { useState, useEffect, useCallback } from "react"
import toast from "react-hot-toast"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { 
    obtenerHistorialCajasAction, 
    obtenerResumenCajaEspecificaAction, 
    obtenerVentasPorCajaAction 
} from "@/app/admin/actions"

export function useHistorialCajas() {
    // Estados principales
    const [cajas, setCajas] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [cajaDescargando, setCajaDescargando] = useState<number | null>(null)
    
    // Estados del Modal
    const [ventas, setVentas] = useState<any[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [cajaSeleccionada, setCajaSeleccionada] = useState<number | null>(null)
    const [loadingVentas, setLoadingVentas] = useState(false)

    const cargarHistorial = useCallback(async () => {
        setLoading(true)
        const res = await obtenerHistorialCajasAction()
        if (res.success) {
            setCajas(res.cajas)
        } else {
            toast.error("Error al cargar historial")
        }
        setLoading(false)
    }, [])

    useEffect(() => {
        cargarHistorial()
    }, [cargarHistorial])

    const formatearFecha = (fecha: string) => {
        if (!fecha) return "---"
        const date = new Date(fecha)
        
        // Sin restar nada, dejamos que toscamente muestre lo que trae
        return date.toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short', hour12: false })
    }

    const descargarPDF = async (id_caja: number) => {
        setCajaDescargando(id_caja)
        const toastId = toast.loading("Generando PDF...")

        try {
            const res = await obtenerResumenCajaEspecificaAction(id_caja)
            if (!res.success) {
                toast.error(res.error, { id: toastId })
                return
            }

            const r = res.resumen;
            const doc = new jsPDF()
            
            doc.setFontSize(20)
            doc.text("Resumen de Caja - Punto de Venta", 14, 20)
            
            doc.setFontSize(11)
            doc.text(`ID de Caja: #${r.id_caja}`, 14, 30)
            doc.text(`Cajero/a: ${r.nombre_usuario || 'Usuario Desconocido'}`, 14, 37) 
            doc.text(`Estado: ${r.estado.toUpperCase()}`, 14, 44)
            doc.text(`Fecha de Cierre: ${formatearFecha(r.fecha_cierre)}`, 14, 51)

            autoTable(doc, {
                startY: 60, 
                head: [['Concepto', 'Monto']],
                body: [
                    ['Fondo Inicial (Cambio)', `$ ${parseFloat(r.monto_inicial).toFixed(2)}`],
                    ['Total Efectivo Físico', `$ ${r.total_efectivo.toFixed(2)}`],
                    ['EFECTIVO ESPERADO EN CAJÓN', `$ ${r.dinero_en_cajon.toFixed(2)}`],
                ],
                theme: 'grid',
                headStyles: { fillColor: [51, 88, 156] }
            })

            const desgloseDigital = Object.keys(r.desglose)
                .filter(metodo => metodo !== 'efectivo' && metodo !== 'Efectivo')
                .map(metodo => [metodo.toUpperCase(), `$ ${parseFloat(r.desglose[metodo]).toFixed(2)}`])

            autoTable(doc, {
                startY: (doc as any).lastAutoTable.finalY + 10,
                head: [['Método de Pago Digital', 'Total']],
                body: desgloseDigital.length > 0 ? desgloseDigital : [['Sin ventas digitales', '-']],
                theme: 'striped',
                headStyles: { fillColor: [100, 100, 100] }
            })

            const finalY = (doc as any).lastAutoTable.finalY + 15
            doc.setFontSize(14)
            doc.setTextColor(51, 88, 156)
            doc.text(`TOTAL FACTURADO DEL TURNO: $ ${r.total_ventas.toFixed(2)}`, 14, finalY)

            doc.save(`Resumen_Caja_${r.id_caja}.pdf`)
            toast.success("PDF Descargado", { id: toastId })
        } catch (error) {
            toast.error("Error al generar PDF", { id: toastId })
        } finally {
            setCajaDescargando(null)
        }
    }

    const verDetalleVentas = async (id_caja: number) => {
        setCajaSeleccionada(id_caja)
        setIsModalOpen(true)
        setLoadingVentas(true)

        const res = await obtenerVentasPorCajaAction(id_caja)
        if (res.success) {
            setVentas(res.ventas)
        } else {
            toast.error("Error al cargar las ventas")
        }
        setLoadingVentas(false)
    }

    return {
        cajas,
        loading,
        cajaDescargando,
        ventas,
        isModalOpen,
        setIsModalOpen,
        cajaSeleccionada,
        loadingVentas,
        formatearFecha,
        descargarPDF,
        verDetalleVentas
    }
}