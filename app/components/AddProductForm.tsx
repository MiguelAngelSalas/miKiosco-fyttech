import { Button, Flex, TextField, Text } from "@radix-ui/themes"
import { Save, PlusCircle, Loader2, ScanLine } from "lucide-react"
import { Categoria } from "./EditProductModal" // Ajustá esta ruta
import BarcodeScanner from "./BarCodeScaner" // Ajustá esta ruta si es distinta

interface AddProductFormProps {
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    onClose: () => void
    loading: boolean
    categorias: Categoria[]
    onOpenCategoryModal: () => void
    
    // 👇 Nuevas props que vienen de tu hook useAddProduct
    codigoBarras: string
    setCodigoBarras: (val: string) => void
    nombre: string
    setNombre: (val: string) => void
    isScannerOpen: boolean
    openScanner: () => void
    closeScanner: () => void
    handleBarcodeScanned: (code: string) => void
    buscandoEnInternet: boolean
}

export default function AddProductForm({ 
    handleSubmit, onClose, loading, categorias, onOpenCategoryModal,
    codigoBarras, setCodigoBarras, nombre, setNombre, isScannerOpen, 
    openScanner, closeScanner, handleBarcodeScanned, buscandoEnInternet
}: AddProductFormProps) {
    
    return (
        <form onSubmit={handleSubmit} className="flex flex-col">
            {/* --- CUERPO --- */}
            <div className="p-6 flex flex-col gap-5 max-h-[65vh] overflow-y-auto">
                
                {/* 👇 CÓDIGO DE BARRAS + BOTÓN ESCÁNER */}
                <div className="flex gap-2 items-end">
                    <div className="grow">
                        <Text as="label" size="2" className="mb-1.5 block text-gray-700 dark:text-gray-300 font-semibold">Código de Barras *</Text>
                        <TextField.Root 
                            name="codigoBarras" 
                            required 
                            value={codigoBarras}
                            onChange={(e) => setCodigoBarras(e.target.value)}
                            placeholder="Ej: 779123456789" 
                            size="3" 
                            radius="large"
                            disabled={loading || buscandoEnInternet} 
                            className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-sm focus-within:border-[#33589c]"
                        />
                    </div>
                    <Button 
                        type="button" 
                        size="3" 
                        variant="soft" 
                        onClick={openScanner}
                        disabled={loading || buscandoEnInternet}
                        className="cursor-pointer bg-[#33589c]/10 text-[#33589c] hover:bg-[#33589c]/20 px-3"
                        style={{ height: '40px' }} // Para que mida lo mismo que el TextField
                        title="Escanear producto"
                    >
                        <ScanLine size={20} />
                    </Button>
                </div>

                {/* 👇 NOMBRE (Ahora controlado y se desactiva si está buscando) */}
                <div>
                    <Text as="label" size="2" className="mb-1.5 block text-gray-700 dark:text-gray-300 font-semibold">Nombre del Producto *</Text>
                    <TextField.Root 
                        name="nombre" 
                        required 
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Ej: Alfajor Guaymallén" 
                        size="3" 
                        radius="large"
                        disabled={loading || buscandoEnInternet} 
                        className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-sm focus-within:border-[#33589c]"
                    >
                        {buscandoEnInternet && (
                            <TextField.Slot side="right">
                                <Loader2 size={16} className="animate-spin text-gray-400" />
                            </TextField.Slot>
                        )}
                    </TextField.Root>
                </div>
                
                <div className="grid grid-cols-2 gap-5">
                    <div>
                        <Text as="label" size="2" className="mb-1.5 block text-gray-700 dark:text-gray-300 font-semibold">Precio Costo ($) *</Text>
                        <TextField.Root 
                            name="precioCosto" 
                            type="number" 
                            required 
                            min="0" 
                            step="0.01" 
                            placeholder="0.00" 
                            size="3" 
                            radius="large"
                            disabled={loading} 
                            className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-sm focus-within:border-[#33589c]"
                        />
                    </div>
                    <div>
                        <Text as="label" size="2" className="mb-1.5 block text-gray-700 dark:text-gray-300 font-semibold">Precio Venta ($) *</Text>
                        <TextField.Root 
                            name="precioVenta" 
                            type="number" 
                            required 
                            min="0" 
                            step="0.01" 
                            placeholder="0.00" 
                            size="3" 
                            radius="large"
                            disabled={loading} 
                            className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-sm focus-within:border-[#33589c]"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                    <div>
                        <Text as="label" size="2" className="mb-1.5 block text-gray-700 dark:text-gray-300 font-semibold">Stock Inicial *</Text>
                        <TextField.Root 
                            name="stock" 
                            type="number" 
                            required 
                            min="0" 
                            placeholder="0" 
                            size="3" 
                            radius="large"
                            disabled={loading} 
                            className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-sm focus-within:border-[#33589c]"
                        />
                    </div>
                    <div>
                        <Text as="label" size="2" className="mb-1.5 block text-gray-700 dark:text-gray-300 font-semibold">Categoría *</Text>
                        <select 
                            name="categoriaId" 
                            required
                            disabled={loading}
                            className="w-full h-[40px] px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm shadow-sm focus:outline-none focus:border-[#33589c] focus:ring-1 focus:ring-[#33589c] transition-all disabled:opacity-50"
                        >
                            <option value="">Seleccione...</option>
                            {categorias.map((cat) => (
                                <option key={cat.id_categoria} value={cat.id_categoria}>
                                    {cat.nombre_categoria}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            
            {/* --- FOOTER --- */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
                <Button 
                    type="button" 
                    variant="soft" 
                    size="2" 
                    onClick={onOpenCategoryModal} 
                    disabled={loading}
                    className="cursor-pointer text-[#33589c] bg-[#33589c]/10 hover:bg-[#33589c]/20"
                >
                    <PlusCircle size={16} className="mr-1" /> Nueva Categoría
                </Button>
                
                <Flex gap="3">
                    <Button 
                        type="button" 
                        variant="soft" 
                        color="gray" 
                        onClick={onClose} 
                        disabled={loading} 
                        className="cursor-pointer bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 shadow-sm"
                    >
                        Cancelar
                    </Button>
                    <Button 
                        type="submit" 
                        disabled={loading} 
                        className="cursor-pointer bg-[#33589c] text-white hover:bg-[#28467b] shadow-sm"
                    >
                        {loading ? (
                            <><Loader2 size={16} className="animate-spin mr-1" /> Guardando...</>
                        ) : (
                            <><Save size={16} className="mr-1" /> Guardar</>
                        )}
                    </Button>
                </Flex>
            </div>

            {/* 👇 EL MODAL DE LA CÁMARA */}
            {isScannerOpen && (
                <BarcodeScanner 
                    onScanSuccess={handleBarcodeScanned}
                    onClose={closeScanner}
                />
            )}
        </form>
    )
}