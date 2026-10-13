import { Heading, Card, Flex, Text, Button } from "@radix-ui/themes" // 👈 Agregamos Button de Radix
import { Receipt, Lock } from "lucide-react" // 👈 Agregamos el icono Lock (candado)
import ButtonCheckOut from "@/app/components/ButtonCheckOut"

interface PosSummaryProps {
    totalItems: number
    subTotal: number
    subTotalFormateado: string
    itemsParaCheckout: any[] 
    vaciarCarrito: () => void
    estadoCaja?: 'verificando' | 'abierta' | 'cerrada' // 👈 1. Agregamos el estado a las props
}

export default function PosSummary({ 
    totalItems, subTotal, subTotalFormateado, itemsParaCheckout, vaciarCarrito, estadoCaja 
}: PosSummaryProps) {
    return (
        <Card className="w-full lg:w-[380px] border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 rounded-2xl flex flex-col justify-between shadow-md sticky top-6">
            <Flex direction="column" gap="5">
                <Flex align="center" gap="2" className="border-b-2 border-gray-200 dark:border-gray-800 pb-4">
                    <Receipt size={22} className="text-[#33589c]" />
                    <Heading size="5" className="text-gray-900 dark:text-white font-extrabold">
                        Resumen
                    </Heading>
                </Flex>
                
                <div className="space-y-3">
                    <Flex justify="between" align="center">
                        <Text size="3" className="text-gray-600 dark:text-gray-400 font-medium">Cantidad de items</Text>
                        <Text size="3" className="text-gray-800 dark:text-gray-200 font-bold">
                            {totalItems} u.
                        </Text>
                    </Flex>
                    <Flex justify="between" align="center">
                        <Text size="3" className="text-gray-600 dark:text-gray-400 font-medium">Subtotal</Text>
                        <Text size="3" className="text-gray-800 dark:text-gray-200 font-bold">
                            ${subTotal.toFixed(2)}
                        </Text>
                    </Flex>
                </div>

                <div className="bg-gray-100 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-300 dark:border-gray-800 mt-2 shadow-inner">
                    <Flex justify="between" align="end">
                        <Text size="4" className="text-gray-700 dark:text-gray-300 font-extrabold">Total</Text>
                        <Text size="8" className="text-[#33589c] dark:text-[#589c33] font-black leading-none tracking-tight">
                            ${subTotal.toFixed(2)}
                        </Text>
                    </Flex>
                </div>
            </Flex>
            
            {/* 👇 2. ACÁ ESTÁ LA MAGIA DEL BOTÓN BLOQUEADO */}
            <div className="mt-6">
                {estadoCaja === 'cerrada' ? (
                    <Button 
                        size="4" 
                        disabled 
                        className="w-full bg-gray-400 dark:bg-gray-700 text-white font-bold cursor-not-allowed text-lg flex items-center justify-center"
                    >
                        <Lock size={18} className="mr-2" /> 
                        Abrí la caja para cobrar
                    </Button>
                ) : (
                    <ButtonCheckOut 
                        subTotal={subTotalFormateado} 
                        items={itemsParaCheckout} 
                        onClearCart={vaciarCarrito} 
                    />
                )}
            </div>
        </Card>
    )
}