"use client"
import { Button, TextField, Flex, Text } from "@radix-ui/themes"
import { useAbrirCaja } from "@/app/hooks/useAbrirCaja" // Ajustá tu ruta

interface AbrirCajaPanelProps {
    onCajaAbierta: () => void;
}

export default function AbrirCajaPanel({ onCajaAbierta }: AbrirCajaPanelProps) {
    const { monto, setMonto, loading, handleAbrirCaja } = useAbrirCaja(onCajaAbierta)

    return (
        <Flex direction="column" gap="4" className="w-full max-w-sm p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
            <div className="text-center mb-2">
                <Text size="6" weight="bold" className="text-gray-900 dark:text-white">Apertura de Caja</Text>
                <Text as="p" size="2" color="gray" className="mt-1">Ingresá el cambio inicial en efectivo para comenzar el turno.</Text>
            </div>
            
            <TextField.Root 
                size="3"
                placeholder="0.00" 
                type="number"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                className="text-lg"
            >
                <TextField.Slot>$</TextField.Slot>
            </TextField.Root>
            
            <Button size="3" onClick={handleAbrirCaja} disabled={loading} className="w-full bg-[#589c33] hover:bg-green-700 text-white cursor-pointer mt-2 transition-all">
                {loading ? "Abriendo..." : "Abrir Caja y Comenzar"}
            </Button>
        </Flex>
    )
}