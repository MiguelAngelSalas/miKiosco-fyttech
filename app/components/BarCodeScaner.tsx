"use client"
import { useEffect, useState } from "react"
import { Html5QrcodeScanner } from "html5-qrcode"

interface BarcodeScannerProps {
    onScanSuccess: (decodedText: string) => void
    onClose: () => void
}

export default function BarcodeScanner({ onScanSuccess, onClose }: BarcodeScannerProps) {
    const [scanError, setScanError] = useState<string | null>(null)

    useEffect(() => {
        // Configuramos el escáner para que use la cámara trasera por defecto
        const scanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 150 } }, // Un rectángulo apaisado ideal para códigos de barra
            false
        )

        scanner.render(
            (decodedText) => {
                // ¡Éxito! Encontró un código
                scanner.clear() // Apagamos la cámara
                onScanSuccess(decodedText) // Le mandamos el número a tu POS
            },
            (error) => {
                // Es normal que tire errores mientras enfoca, los ignoramos o guardamos para debug
                // setScanError(error?.message) 
            }
        )

        // Limpieza: si el usuario cierra el modal, apagamos la cámara
        return () => {
            scanner.clear().catch(error => console.error("Error al limpiar el escáner", error))
        }
    }, [onScanSuccess])

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="bg-white p-4 rounded-lg shadow-xl w-[90%] max-w-md relative">
                <button 
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-bold"
                >
                    X Cerrar
                </button>
                <h3 className="text-lg font-bold mb-2 text-center text-gray-800">Escaneá el código</h3>
                
                {/* Acá adentro la librería inyecta el video de la cámara */}
                <div id="reader" className="w-full"></div>
                
                {scanError && <p className="text-xs text-red-500 text-center mt-2">Enfocando...</p>}
            </div>
        </div>
    )
}