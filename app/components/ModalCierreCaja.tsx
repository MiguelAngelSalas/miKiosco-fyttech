"use client"
import { Dialog, Button } from "@radix-ui/themes"
import { Lock } from "lucide-react"

// Importamos el Hook y los subcomponentes (Ajustá tus rutas)
import { useCierreCaja } from "@/app/hooks/useCierreCaja"
import CierreCajaHeader from "./cierre/CierreCajaHeader"
import CierreCajaBody from "./cierre/CierreCajaBody"
import CierreCajaFooter from "./cierre/CierreCajaFooter"

interface ModalCierreCajaProps {
    onCajaCerrada: () => void;
}

export default function ModalCierreCaja({ onCajaCerrada }: ModalCierreCajaProps) {
    const { open, setOpen, loading, cerrando, resumen, handleCerrarCaja } = useCierreCaja(onCajaCerrada)

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger>
                <Button color="red" variant="soft" className="cursor-pointer font-bold">
                    <Lock size={18} className="mr-2" /> Cerrar Caja
                </Button>
            </Dialog.Trigger>

            <Dialog.Content maxWidth="450px" className="!p-0 border border-gray-300 dark:border-gray-700 shadow-2xl rounded-2xl bg-white dark:bg-gray-900 overflow-hidden font-sans">
                
                <CierreCajaHeader />
                
                <div className="p-6">
                    <CierreCajaBody loading={loading} resumen={resumen} />
                </div>
                
                <CierreCajaFooter 
                    loading={loading} 
                    cerrando={cerrando} 
                    onConfirmar={handleCerrarCaja} 
                />
                
            </Dialog.Content>
        </Dialog.Root>
    )
}