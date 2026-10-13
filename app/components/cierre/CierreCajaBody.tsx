import { Flex, Text, Separator } from "@radix-ui/themes"
import { DollarSign, WalletCards } from "lucide-react"

export default function CierreCajaBody({ loading, resumen }: { loading: boolean, resumen: any }) {
    const nombresMetodos: Record<string, string> = {
        'cuentaDni': '🔵 Cuenta DNI',
        'qr/mercadoPago': '📱 Mercado Pago / QR',
        'transferencia': '🏦 Transferencias',
        'tarjeta': '💳 Tarjetas'
    }

    if (loading || !resumen) {
        return (
            <Flex justify="center" align="center" className="py-10">
                <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full" />
            </Flex>
        )
    }

    return (
        <Flex direction="column" gap="4">
            <Text size="3" color="gray" align="center" className="mb-2">
                Controlá que los montos coincidan con la plata física y las apps.
            </Text>

            <Flex justify="between" align="center">
                <Text size="3" weight="medium">Fondo inicial (Cambio)</Text>
                <Text size="3">${resumen.monto_inicial.toFixed(2)}</Text>
            </Flex>
            
            <Flex justify="between" align="center">
                <Text size="3" weight="medium">Ventas en Efectivo</Text>
                <Text size="3" color="green" weight="bold">+ ${resumen.total_efectivo.toFixed(2)}</Text>
            </Flex>

            <Separator size="4" />

            <Flex justify="between" align="center" className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-900/50">
                <Flex align="center" gap="2">
                    <DollarSign size={20} className="text-red-600 dark:text-red-400" />
                    <Text size="4" weight="bold" className="text-red-700 dark:text-red-300">
                        Efectivo en Cajón:
                    </Text>
                </Flex>
                <Text size="6" weight="bold" className="text-red-700 dark:text-red-300 tracking-tight">
                    ${resumen.dinero_en_cajon.toFixed(2)}
                </Text>
            </Flex>

            <Separator size="4" className="my-2" />

            <Flex align="center" gap="2" className="mb-1">
                <WalletCards size={18} className="text-blue-500" />
                <Text size="3" weight="bold">Arqueo Digital:</Text>
            </Flex>

            <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-800 flex flex-col gap-2">
                {Object.keys(resumen.desglose).map((metodo) => {
                    if (metodo === 'efectivo' || metodo === 'Efectivo') return null;
                    const monto = resumen.desglose[metodo];
                    return (
                        <Flex key={metodo} justify="between" align="center">
                            <Text size="2" color="gray" className="font-medium">
                                {nombresMetodos[metodo] || metodo}
                            </Text>
                            <Text size="3" weight="bold" className="text-gray-700 dark:text-gray-300">
                                ${parseFloat(monto).toFixed(2)}
                            </Text>
                        </Flex>
                    )
                })}

                {resumen.total_digital === 0 && (
                    <Text size="2" color="gray" align="center" className="italic">
                        No hay cobros digitales en este turno.
                    </Text>
                )}
            </div>

            <Flex justify="between" align="center" className="mt-2 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg shadow-inner">
                <Text size="3" weight="bold">Total Facturado:</Text>
                <Text size="5" weight="bold" className="text-[#33589c] dark:text-blue-400">
                    ${resumen.total_ventas.toFixed(2)}
                </Text>
            </Flex>
        </Flex>
    )
}