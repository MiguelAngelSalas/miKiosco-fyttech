import { Dialog, Button } from "@radix-ui/themes"

export default function CierreCajaFooter({ loading, cerrando, onConfirmar }: { loading: boolean, cerrando: boolean, onConfirmar: () => void }) {
    return (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3">
            <Dialog.Close>
                <Button variant="soft" color="gray" className="cursor-pointer bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                    Cancelar
                </Button>
            </Dialog.Close>
            <Button 
                color="red" 
                disabled={loading || cerrando}
                onClick={onConfirmar}
                className="cursor-pointer bg-red-600 hover:bg-red-700 text-white transition-all shadow-md"
            >
                {cerrando ? "Cerrando..." : "Confirmar Cierre"}
            </Button>
        </div>
    )
}