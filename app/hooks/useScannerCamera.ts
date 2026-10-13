import { useState, useEffect, useRef } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { toast } from "react-hot-toast"

export function useScannerCamera(onScanSuccess: (decodedText: string) => void) {
    const [permisoDenegado, setPermisoDenegado] = useState(false)
    const scannerRef = useRef<Html5Qrcode | null>(null)

    useEffect(() => {
        // Inicializamos el motor puro
        const html5QrCode = new Html5Qrcode("reader")
        scannerRef.current = html5QrCode

        const iniciarCamara = async () => {
            try {
                await html5QrCode.start(
                    { facingMode: "environment" }, // Obliga a usar la cámara trasera del celu
                    {
                        fps: 10,
                        qrbox: { width: 250, height: 150 }, // Rectángulo para código de barras
                        aspectRatio: 1.0,
                    },
                    (decodedText) => {
                        // Cuando lee un código exitosamente
                        if (scannerRef.current && scannerRef.current.isScanning) {
                            scannerRef.current.stop().then(() => {
                                onScanSuccess(decodedText)
                            }).catch(console.error)
                        }
                    },
                    (errorMessage) => {
                        // Ignoramos los errores de frame a frame mientras busca
                    }
                )
            } catch (err) {
                toast.error("No se detectó cámara o faltan permisos") 
                setPermisoDenegado(true) 
            }
        }

        iniciarCamara()

        return () => {
            // Apagamos la cámara si el usuario cierra la ventanita
            if (scannerRef.current && scannerRef.current.isScanning) {
                scannerRef.current.stop().catch(console.error)
            }
        }
    }, [onScanSuccess])

    return { permisoDenegado }
}