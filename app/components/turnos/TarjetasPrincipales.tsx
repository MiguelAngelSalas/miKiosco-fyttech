import { Flex, Text, Grid, Card } from "@radix-ui/themes"

export default function TarjetasPrincipales({ resumen }: { resumen: any }) {
    return (
        <Grid columns={{ initial: "1", sm: "2" }} gap="4">
            <Card className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 p-5 shadow-sm">
                <Flex direction="column" gap="1">
                    <Text size="3" weight="bold" className="text-green-700 dark:text-green-400 uppercase tracking-wider">
                        Efectivo en Cajón
                    </Text>
                    <Text size="8" weight="bold" className="text-green-800 dark:text-green-300">
                        ${resumen.dinero_en_cajon.toFixed(2)}
                    </Text>
                    <Text size="2" className="text-green-600 dark:text-green-500 mt-2">
                        Fondo inicial (${resumen.monto_inicial}) + Ventas en Efectivo (${resumen.desglose['efectivo'] || 0})
                    </Text>
                </Flex>
            </Card>

            <Card className="bg-[#33589c]/10 border-2 border-[#33589c]/20 p-5 shadow-sm">
                <Flex direction="column" gap="1">
                    <Text size="3" weight="bold" className="text-[#33589c] dark:text-blue-400 uppercase tracking-wider">
                        Total Facturado
                    </Text>
                    <Text size="8" weight="bold" className="text-[#33589c] dark:text-blue-300">
                        ${resumen.total_ventas.toFixed(2)}
                    </Text>
                    <Text size="2" className="text-[#33589c]/80 dark:text-blue-500 mt-2">
                        Sumatoria de absolutamente todos los medios de pago.
                    </Text>
                </Flex>
            </Card>
        </Grid>
    )
}