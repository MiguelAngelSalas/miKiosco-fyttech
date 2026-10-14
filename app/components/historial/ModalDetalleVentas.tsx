import { Dialog, Flex, Text, Table, Badge, IconButton } from "@radix-ui/themes"
import { Receipt, X } from "lucide-react"

export default function ModalDetalleVentas({ 
    isModalOpen, 
    setIsModalOpen, 
    cajaSeleccionada, 
    loadingVentas, 
    ventas, 
    formatearFecha 
}: any) {
    return (
        <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
            <Dialog.Content maxWidth="700px" className="p-0 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/20 flex justify-between items-center">
                    <Flex align="center" gap="2">
                        <Receipt className="text-[#33589c]" size={22} />
                        <Dialog.Title className="text-gray-900 dark:text-white font-bold m-0 text-lg">
                            Detalle de Caja #{cajaSeleccionada}
                        </Dialog.Title>
                    </Flex>
                    <Dialog.Close>
                        <IconButton variant="ghost" color="gray" className="cursor-pointer rounded-full">
                            <X size={20} />
                        </IconButton>
                    </Dialog.Close>
                </div>

                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {loadingVentas ? (
                        <Flex justify="center" className="py-10">
                            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
                        </Flex>
                    ) : ventas.length === 0 ? (
                        <Text align="center" color="gray" className="block py-6">
                            No se registraron ventas en esta caja.
                        </Text>
                    ) : (
                        <Table.Root variant="surface">
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeaderCell>Nº Ticket</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Hora</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell>Cajero</Table.ColumnHeaderCell> 
                                    <Table.ColumnHeaderCell>Método</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell justify="end">Total</Table.ColumnHeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {ventas.map((venta: any) => (
                                    <Table.Row key={venta.id_pago}>
                                        <Table.RowHeaderCell>#{venta.id_pago}</Table.RowHeaderCell>
                                        <Table.Cell className="text-gray-500">{formatearFecha(venta.hora)}</Table.Cell>
                                        <Table.Cell className="font-medium capitalize text-gray-700">{venta.cajero || "---"}</Table.Cell>
                                        <Table.Cell>
                                            <Badge color={
                                                venta.tipo_medio.toLowerCase() === 'efectivo' ? 'green' : 
                                                venta.tipo_medio.toLowerCase().includes('dni') ? 'blue' : 'orange'
                                            }>
                                                {venta.tipo_medio.toUpperCase()}
                                            </Badge>
                                        </Table.Cell>
                                        <Table.Cell justify="end" className="font-bold">${parseFloat(venta.monto).toFixed(2)}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                    )}
                </div>
            </Dialog.Content>
        </Dialog.Root>
    )
}