import { Dialog, Flex, IconButton } from "@radix-ui/themes"
import { Lock, X } from "lucide-react"

export default function CierreCajaHeader() {
    return (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-red-50 dark:bg-red-950/20 flex justify-between items-center">
            <Flex align="center" gap="2">
                <Lock className="text-red-600 dark:text-red-500" size={22} />
                <Dialog.Title className="text-gray-900 dark:text-white font-bold m-0 text-lg">
                    Cierre de Turno
                </Dialog.Title>
            </Flex>
            <Dialog.Close>
                <IconButton variant="ghost" color="gray" className="cursor-pointer rounded-full">
                    <X size={20} />
                </IconButton>
            </Dialog.Close>
        </div>
    )
}