import { Flex, Text, Button } from "@radix-ui/themes"
import { Wallet, RefreshCw, User } from "lucide-react"

interface TurnoHeaderProps {
    onRefresh: () => void
    loading: boolean
    nombreUsuario?: string // 👈 Nuevo campo opcional
}

export default function TurnoHeader({ onRefresh, loading, nombreUsuario }: TurnoHeaderProps) {
    return (
        <Flex justify="between" align="center" className="border-b border-gray-200 dark:border-gray-800 pb-4">
            <Flex align="center" gap="3">
                <Wallet size={28} className="text-[#33589c]" />
                <div>
                    <Text size="6" weight="bold" className="block text-gray-900 dark:text-white">Estado del Turno</Text>
                    
                    {/* 👇 Mostramos el nombre del cajero/dueño del turno si existe */}
                    <Flex align="center" gap="1.5" className="mt-0.5">
                        <User size={14} className="text-gray-400" />
                        <Text size="2" color="gray" className="capitalize">
                            Turno abierto por: <span className="font-semibold text-gray-700 dark:text-gray-300">{nombreUsuario || "---"}</span>
                        </Text>
                    </Flex>
                </div>
            </Flex>
            
            <Button variant="soft" color="gray" onClick={onRefresh} disabled={loading} className="cursor-pointer">
                <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                Actualizar
            </Button>
        </Flex>
    )
}