import { Heading, Button, Flex, Text, Dialog } from "@radix-ui/themes" 
import { Store, UserCircle, Settings, LogOut, ClipboardList, Lock, Unlock } from "lucide-react" // 👈 Sumamos Lock y Unlock
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

// Importamos los paneles (ajustá las rutas si están en otra carpeta)
import PanelTurnoActual from "../PanelTurnoActual" 
import AbrirCajaPanel from "../AbrirCajaPanel" // 👈 Importamos el panel de abrir caja

// 👇 1. Agregamos las nuevas props
interface PosHeaderProps {
    userRole: string;
    estadoCaja?: 'verificando' | 'abierta' | 'cerrada'; 
    marcarComoAbierta?: () => void; 
}

export default function PosHeader({ userRole, estadoCaja = 'abierta', marcarComoAbierta }: PosHeaderProps) {
    const router = useRouter()

    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b-2 border-gray-300 dark:border-gray-800">
            {/* LADO IZQUIERDO: Título y Logo */}
            <Flex align="center" gap="3">
                <div className="bg-[#33589c] p-2.5 rounded-xl text-white shadow-md">
                    <Store size={24} />
                </div>
                <div>
                    <Heading as="h1" size="6" className="text-gray-900 dark:text-white font-bold tracking-tight">
                        Punto de Venta
                    </Heading>
                    <Text size="2" className="text-gray-600 dark:text-gray-400 font-medium">Mostrador activo</Text>
                </div>
            </Flex>
            
            {/* LADO DERECHO: Botones en tu orden exacto */}
            <Flex align="center" gap="4" wrap="wrap">
                
                {/* 1. TURNO ACTUAL (Modal Dinámico) */}
                <Dialog.Root>
                    <Dialog.Trigger>
                        <Button 
                            size="3" 
                            variant="solid" 
                            className="bg-[#33589c] hover:bg-[#254275] text-white cursor-pointer shadow-sm transition-all duration-200"
                        >
                            <ClipboardList size={18} className="mr-1" /> Turnos
                        </Button>
                    </Dialog.Trigger>
                    
                    {/* 👇 2. El modal cambia de tamaño y contenido según si la caja está abierta o cerrada */}
                    <Dialog.Content 
                        maxWidth={estadoCaja === 'abierta' ? "900px" : "400px"} 
                        className={`p-0 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 ${estadoCaja === 'cerrada' ? 'flex items-center justify-center p-6' : ''}`}
                    >
                        {estadoCaja === 'abierta' ? (
                            <PanelTurnoActual />
                        ) : (
                            <AbrirCajaPanel onCajaAbierta={marcarComoAbierta!} />
                        )}
                    </Dialog.Content>
                </Dialog.Root>

                {/* 2. ROL DE USUARIO */}
                <Flex align="center" gap="2" className="bg-white dark:bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-800 shadow-sm">
                    <UserCircle size={18} className="text-gray-500" />
                    <Text className="text-gray-700 dark:text-gray-300 font-bold text-sm">
                        <span className="capitalize">{userRole || "Usuario"}</span>
                    </Text>
                </Flex>

                {/* 👇 3. ESTADO DE CAJA (Verde si está abierta, Rojo si está cerrada) */}
                {estadoCaja === 'abierta' ? (
                    <div className="px-3 py-1.5 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-lg text-sm font-bold border border-green-300 dark:border-green-800/50 flex items-center gap-1 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Caja Habilitada
                    </div>
                ) : (
                    <div className="px-3 py-1.5 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-lg text-sm font-bold border border-red-300 dark:border-red-800/50 flex items-center gap-1 shadow-sm">
                        <Lock size={16} />
                        Caja Cerrada
                    </div>
                )}
                
                {/* 4. BOTÓN PANEL DE ADMINISTRACIÓN */}
                {userRole === "administrador" && (
                    <Button 
                        size="3"
                        variant="surface"
                        className="cursor-pointer transition-all duration-200 text-[#33589c] bg-white border border-gray-300 hover:bg-gray-50 shadow-sm dark:bg-transparent dark:border-transparent dark:hover:bg-[#33589c]/10"
                        onClick={() => router.push("/AdminPage")}
                    >
                        <Settings size={18} className="mr-1" /> Panel Admin
                    </Button>
                )}
                
                {/* 5. BOTÓN SALIR */}
                <Button 
                    size="3"
                    variant="soft"
                    color="red"
                    className="cursor-pointer transition-all duration-200 hover:bg-red-200 bg-red-100 text-red-700 shadow-sm border border-red-200 dark:border-transparent dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                    onClick={() => {
                        localStorage.removeItem("rolUsuario")
                        localStorage.removeItem("token")
                        toast.success("Sesión cerrada")
                        router.push("/login")
                    }}
                >
                    <LogOut size={18} className="mr-1" /> Salir
                </Button>
            </Flex>
        </div>
    )
}