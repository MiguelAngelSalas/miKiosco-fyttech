import { Button, Text, TextField } from "@radix-ui/themes"
import { ScanLine, Search } from "lucide-react"

export default function BarcodeSection({
    codigoBarras, setCodigoBarras, loading, buscandoEnInternet, handleBarcodeScanned, openScanner
}: any) {
    return (
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
                type="button" size="3" variant="soft" 
                onClick={() => handleBarcodeScanned(codigoBarras)} 
                disabled={loading || buscandoEnInternet || !codigoBarras}
                className="cursor-pointer bg-green-500/10 text-green-600 hover:bg-green-500/20 px-3"
                style={{ height: '40px' }} title="Buscar en internet"
            >
                <Search size={20} />
            </Button>

            <Button 
                type="button" size="3" variant="soft" 
                onClick={openScanner}
                disabled={loading || buscandoEnInternet}
                className="cursor-pointer bg-[#33589c]/10 text-[#33589c] hover:bg-[#33589c]/20 px-3"
                style={{ height: '40px' }} title="Escanear producto"
            >
                <ScanLine size={20} />
            </Button>
        </div>
    )
}