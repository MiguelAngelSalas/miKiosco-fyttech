import { Text, TextField } from "@radix-ui/themes"
import { Loader2 } from "lucide-react"

export default function GeneralFields({ 
    nombre, setNombre, loading, buscandoEnInternet, categorias 
}: any) {
    return (
        <>
            <div>
                <Text as="label" size="2" className="mb-1.5 block text-gray-700 dark:text-gray-300 font-semibold">Nombre del Producto *</Text>
                <TextField.Root 
                    name="nombre" required value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Alfajor Guaymallén" size="3" radius="large"
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
                    <TextField.Root name="precioCosto" type="number" required min="0" step="0.01" placeholder="0.00" size="3" radius="large" disabled={loading} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-sm focus-within:border-[#33589c]" />
                </div>
                <div>
                    <Text as="label" size="2" className="mb-1.5 block text-gray-700 dark:text-gray-300 font-semibold">Precio Venta ($) *</Text>
                    <TextField.Root name="precioVenta" type="number" required min="0" step="0.01" placeholder="0.00" size="3" radius="large" disabled={loading} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-sm focus-within:border-[#33589c]" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
                <div>
                    <Text as="label" size="2" className="mb-1.5 block text-gray-700 dark:text-gray-300 font-semibold">Stock Inicial *</Text>
                    <TextField.Root name="stock" type="number" required min="0" placeholder="0" size="3" radius="large" disabled={loading} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-sm focus-within:border-[#33589c]" />
                </div>
                <div>
                    <Text as="label" size="2" className="mb-1.5 block text-gray-700 dark:text-gray-300 font-semibold">Categoría *</Text>
                    <select name="categoriaId" required disabled={loading} className="w-full h-[40px] px-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm shadow-sm focus:outline-none focus:border-[#33589c] focus:ring-1 focus:ring-[#33589c] transition-all disabled:opacity-50">
                        <option value="">Seleccione...</option>
                        {categorias.map((cat: any) => (
                            <option key={cat.id_categoria} value={cat.id_categoria}>
                                {cat.nombre_categoria}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </>
    )
}