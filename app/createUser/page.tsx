"use client"

import { Heading, Card, Button, Flex, Text, TextField, Callout, Grid } from "@radix-ui/themes"
import { InfoCircledIcon } from "@radix-ui/react-icons"
import Link from "next/link"
import { LinkButton } from "@/app/components/ui/LinkButton"
import { useRegisterAdmin } from "../hooks/useRegisterAdmin"

export default function CreateUserPage() {
    const {
        errorMsg,
        loading,
        // rolSeleccionado, // Ya no hace falta en la UI, forzamos "administrador"
        // setRolSeleccionado,
        handleSubmit
    } = useRegisterAdmin()

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-300">
            
            <LinkButton 
                href="/landingPage" 
                size="6" 
                weight="bold" 
                colorTheme="blue"
                className="mb-6"
            >
                MiKiosco
            </LinkButton>

            {/* Ensanchamos un poco la Card (max-w-xl) para que entren bien las columnas */}
            <Card className="w-full max-w-xl border-2 border-[#33589c] bg-white dark:bg-gray-800 p-8 shadow-xl rounded-lg">
                <Heading size="6" className="text-[#33589c] dark:text-white mb-6 text-center">
                    Registrar Kiosco y Administrador
                </Heading>

                {errorMsg && (
                    <Callout.Root color="crimson" size="1" mb="4">
                        <Callout.Icon>
                            <InfoCircledIcon />
                        </Callout.Icon>
                        <Callout.Text>{errorMsg}</Callout.Text>
                    </Callout.Root>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    
                    {/* Datos del Negocio */}
                    <div>
                        <Text as="label" size="2" weight="medium" className="text-gray-700 dark:text-gray-300 mb-1 block">
                            Nombre del Kiosco / Local
                        </Text>
                        <TextField.Root 
                            name="nombre_local" 
                            required 
                            placeholder="Ej: Kiosco El Sol" 
                            size="3" 
                            disabled={loading}
                        />
                    </div>

                    {/* Datos del Admin en 2 columnas */}
                    <Grid columns={{ initial: "1", sm: "2" }} gap="4">
                        <div>
                            <Text as="label" size="2" weight="medium" className="text-gray-700 dark:text-gray-300 mb-1 block">
                                Tu Nombre
                            </Text>
                            <TextField.Root 
                                name="nombre" 
                                required 
                                placeholder="Ej: Miguel" 
                                size="3" 
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <Text as="label" size="2" weight="medium" className="text-gray-700 dark:text-gray-300 mb-1 block">
                                Tu Apellido
                            </Text>
                            <TextField.Root 
                                name="apellido" 
                                required 
                                placeholder="Ej: Pérez" 
                                size="3" 
                                disabled={loading}
                            />
                        </div>
                    </Grid>

                    {/* Contacto en 2 columnas */}
                    <Grid columns={{ initial: "1", sm: "2" }} gap="4">
                        <div>
                            <Text as="label" size="2" weight="medium" className="text-gray-700 dark:text-gray-300 mb-1 block">
                                Email
                            </Text>
                            <TextField.Root 
                                name="email" 
                                type="email"
                                required 
                                placeholder="correo@ejemplo.com" 
                                size="3" 
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <Text as="label" size="2" weight="medium" className="text-gray-700 dark:text-gray-300 mb-1 block">
                                Teléfono
                            </Text>
                            <TextField.Root 
                                name="telefono" 
                                type="tel"
                                required 
                                placeholder="Ej: 11 2345-6789" 
                                size="3" 
                                disabled={loading}
                            />
                        </div>
                    </Grid>

                    <div>
                        <Text as="label" size="2" weight="medium" className="text-gray-700 dark:text-gray-300 mb-1 block">
                            Contraseña
                        </Text>
                        <TextField.Root 
                            name="password" 
                            type="password" 
                            required 
                            placeholder="••••••••" 
                            size="3" 
                            disabled={loading}
                        />
                    </div>

                    {/* Input oculto para forzar el rol sin molestar al usuario */}
                    <input type="hidden" name="rol" value="administrador" />

                    <Button 
                        type="submit"
                        size="3"
                        disabled={loading}
                        className="cursor-pointer bg-[#33589c] text-white hover:bg-[#255286] mt-4 w-full transition-colors font-bold"
                    >
                        {loading ? "Creando cuenta..." : "Registrar MiKiosco"}
                    </Button>
                </form>

                <Flex justify="center" mt="5">
                    <Link href="/login" className="text-sm text-[#33589c] dark:text-blue-400 hover:underline font-medium">
                        ¿Ya tenés cuenta? Iniciar sesión
                    </Link>
                </Flex>
            </Card>
        </div>
    )
}