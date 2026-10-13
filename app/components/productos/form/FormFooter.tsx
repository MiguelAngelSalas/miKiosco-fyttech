import { Button, Flex } from "@radix-ui/themes"
import { Save, PlusCircle, Loader2 } from "lucide-react"

export default function FormFooter({ onOpenCategoryModal, onClose, loading }: any) {
    return (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
            <Button type="button" variant="soft" size="2" onClick={onOpenCategoryModal} disabled={loading} className="cursor-pointer text-[#33589c] bg-[#33589c]/10 hover:bg-[#33589c]/20">
                <PlusCircle size={16} className="mr-1" /> Nueva Categoría
            </Button>
            
            <Flex gap="3">
                <Button type="button" variant="soft" color="gray" onClick={onClose} disabled={loading} className="cursor-pointer bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 shadow-sm">
                    Cancelar
                </Button>
                <Button type="submit" disabled={loading} className="cursor-pointer bg-[#33589c] text-white hover:bg-[#28467b] shadow-sm">
                    {loading ? (
                        <><Loader2 size={16} className="animate-spin mr-1" /> Guardando...</>
                    ) : (
                        <><Save size={16} className="mr-1" /> Guardar</>
                    )}
                </Button>
            </Flex>
        </div>
    )
}