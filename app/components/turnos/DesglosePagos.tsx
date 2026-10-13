import { Flex, Text, Grid, Card } from "@radix-ui/themes"
import { Banknote, Wallet, CreditCard, Smartphone, QrCode } from "lucide-react"

export default function DesglosePagos({ desglose }: { desglose: any }) {
    const iconosMetodos: Record<string, any> = {
        efectivo: { icon: <Banknote size={20} />, label: "Efectivo", color: "green" },
        cuentaDni: { icon: <Wallet size={20} />, label: "Cuenta DNI", color: "blue" },
        "qr/mercadoPago": { icon: <QrCode size={20} />, label: "QR / MercadoPago", color: "sky" },
        transferencia: { icon: <Smartphone size={20} />, label: "Transferencia", color: "indigo" },
        tarjeta: { icon: <CreditCard size={20} />, label: "Tarjeta", color: "orange" }
    }

    return (
        <div>
            <Text size="4" weight="bold" className="mb-4 block">Detalle por Método de Pago</Text>
            <Grid columns={{ initial: "1", sm: "2", md: "3" }} gap="3">
                {Object.keys(iconosMetodos).map((metodo) => {
                    const totalMetodo = desglose[metodo] || 0;
                    const conf = iconosMetodos[metodo];

                    return (
                        <Card key={metodo} className="p-4 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                            <Flex align="center" justify="between" mb="2">
                                <Flex align="center" gap="2" className={`text-${conf.color}-600 dark:text-${conf.color}-400`}>
                                    {conf.icon}
                                    <Text weight="bold" size="3">{conf.label}</Text>
                                </Flex>
                            </Flex>
                            <Text size="6" weight="bold" className="text-gray-800 dark:text-gray-200">
                                ${parseFloat(totalMetodo).toFixed(2)}
                            </Text>
                        </Card>
                    )
                })}
            </Grid>
        </div>
    )
}