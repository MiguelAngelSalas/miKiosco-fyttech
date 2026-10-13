import { Flex, Text, Button } from "@radix-ui/themes"
import { Wallet, RefreshCw } from "lucide-react"

export default function TurnoHeader({ onRefresh, loading }: { onRefresh: () => void, loading: boolean }) {
    return (
        <Flex justify="between" align="center" className="border-b border-gray-200 dark:border-gray-800 pb-4">
            <Flex align="center" gap="3">
                <Wallet size={28} className="text-[#33589c]" />
                <div>
                    <Text size="6" weight="bold" className="block text-gray-900 dark:text-white">Estado del Turno</Text>
                    <Text size="2" color="gray">Resumen de ventas y caja en tiempo real</Text>
                </div>
            </Flex>
            <Button variant="soft" color="gray" onClick={onRefresh} disabled={loading} className="cursor-pointer">
                <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
                Actualizar
            </Button>
        </Flex>
    )
}