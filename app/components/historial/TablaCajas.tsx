import { Table, Badge, Button, Flex } from "@radix-ui/themes"
import { Calendar, Eye, Download } from "lucide-react"

export default function TablaCajas({ 
    cajas, 
    cajaDescargando, 
    formatearFecha, 
    verDetalleVentas, 
    descargarPDF 
}: any) {
    return (
        <Table.Root variant="surface">
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeaderCell>Nº Caja</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Estado</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Monto Inicial</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Cierre</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell justify="end">Acciones</Table.ColumnHeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {cajas.map((caja: any) => (
                    <Table.Row key={caja.id_caja} className="items-center">
                        <Table.RowHeaderCell className="font-bold text-gray-700">
                            #{caja.id_caja}
                        </Table.RowHeaderCell>
                        
                        <Table.Cell>
                            <Badge color={caja.estado === 'abierta' ? 'green' : 'gray'}>
                                {caja.estado.toUpperCase()}
                            </Badge>
                        </Table.Cell>

                        <Table.Cell className="font-bold">
                            ${parseFloat(caja.monto_inicial).toFixed(2)}
                        </Table.Cell>

                        <Table.Cell className="text-gray-500">
                            <Flex align="center" gap="1">
                                <Calendar size={14} /> 
                                {formatearFecha(caja.fecha_cierre)}
                            </Flex>
                        </Table.Cell>

                        <Table.Cell justify="end">
                            <Flex gap="2" justify="end">
                                <Button variant="surface" color="gray" className="cursor-pointer" onClick={() => verDetalleVentas(caja.id_caja)}>
                                    <Eye size={16} /> Ver
                                </Button>
                                <Button variant="soft" color="blue" className="cursor-pointer" disabled={cajaDescargando === caja.id_caja} onClick={() => descargarPDF(caja.id_caja)}>
                                    <Download size={16} className="mr-1" /> 
                                    {cajaDescargando === caja.id_caja ? 'Generando...' : 'PDF'}
                                </Button>
                            </Flex>
                        </Table.Cell>
                    </Table.Row>
                ))}
                
                {cajas.length === 0 && (
                    <Table.Row>
                        <Table.Cell colSpan={5} className="text-center py-6 text-gray-500">
                            No hay cajas registradas todavía.
                        </Table.Cell>
                    </Table.Row>
                )}
            </Table.Body>
        </Table.Root>
    )
}