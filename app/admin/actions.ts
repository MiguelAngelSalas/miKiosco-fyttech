"use server"

import { redirect } from "next/navigation"
import {cookies} from "next/headers"

const API_URL = process.env.NEW_API_URL

export async function registerAdminAction(formData: FormData) {
    // 1. Capturamos todos los campos del nuevo formulario
    const nombre_local = formData.get("nombre_local")?.toString().trim()
    const nombre = formData.get("nombre")?.toString().trim()
    const apellido = formData.get("apellido")?.toString().trim()
    const email = formData.get("email")?.toString().trim()
    const telefono = formData.get("telefono")?.toString().trim()
    const password = formData.get("password")?.toString()
    const rol = formData.get("rol")?.toString() || "administrador"

    // 2. Validación básica
    if (!nombre_local || !nombre || !apellido || !email || !telefono || !password) {
        return { error: "Faltan completar campos obligatorios." }
    }

    const payload = {
        nombre_local,
        nombre,
        apellido,
        email,
        telefono,
        password,
        rol,
    }

    // Eliminamos la validación de cookies/token porque esto es un registro público (Sign Up)

    try {
        // Apuntamos al nuevo endpoint de Node.js
        const res = await fetch(`${API_URL}/api/usuarios/registro`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
                // Sin Authorization header acá
            },
            body: JSON.stringify(payload),
            cache: 'no-store' 
        })

        if (!res.ok) {
            const data = await res.json().catch(() => null)
            const errorMsg = data?.error || data?.message || `Error del servidor (${res.status})`
            return { error: errorMsg }
        }

        // Corregido el typo de "succes" a "success"
        return { success: true }
        
    } catch (err: any) {
        return {
            error: "No se pudo conectar con el servidor. Revisá que Node.js esté corriendo.",
        }
    }
}

export async function registerEmployeeAction(formData: FormData) {
    // 1. Capturamos los datos del modal (acordate que sumamos el apellido)
    const nombre = formData.get("nombre")?.toString().trim()
    const apellido = formData.get("apellido")?.toString().trim()
    const email = formData.get("email")?.toString().trim() // <-- ¡Agregado!
    const password = formData.get("password")?.toString()
    const rol = formData.get("rol")?.toString()

    if (!nombre || !apellido || !password || !rol || !email) {
        return { error: "Completá todos los campos obligatorios." }
    }

    

    // 3. RECUPERAMOS EL TOKEN (La diferencia clave con el registro del dueño)
    const cookieStore = await cookies()
    const token = cookieStore.get("kiosco_token")?.value

    if (!token) {
        return { error: "No estás autorizado o tu sesión expiró. Volvé a iniciar sesión." }
    }

    const payload = { nombre, apellido, email, password, rol }

    try {
        // 4. Apuntamos al endpoint PROTEGIDO de Node.js
        const res = await fetch(`${API_URL}/api/usuarios/empleado`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Enviamos el pase VIP
            },
            body: JSON.stringify(payload),
            cache: 'no-store'
        })

        // 5. Manejo de errores que devuelva Node.js
        if (!res.ok) {
            const data = await res.json().catch(() => null)
            const errorMsg = data?.error || data?.message || `Error del servidor (${res.status})`
            return { error: errorMsg }
        }

        return { success: true }
        
    } catch (err: any) {
        return {
            error: "No se pudo conectar con el servidor. Revisá que Node.js esté corriendo.",
        }
    }
}

export async function loginUserAction(email: string, password: string) {
    console.log("👉 URL que está leyendo Next.js:", process.env.API_URL);
    if (!email.trim() || !password) {
        return { error: "Por favor ingresá usuario y contraseña." }
    }

    try {
        // En Swagger suele ser /api/Auth/login
        const res = await fetch(`${API_URL}/api/Auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email.trim(),
                password,
            }),
        })

        const data = await res.json().catch(() => null)

        if (!res.ok) {
            const errorMsg = data?.message || data?.error || (typeof data === "string" ? data : `Error ${res.status}: Credenciales inválidas`)
            return { error: errorMsg }
        }

        // Mapeo flexible del rol (por si devuelve número 1/0 o texto "administrador"/"cajero")
        const rawRol = data?.rol ?? data?.role ?? data?.user?.rol
        let role = "cajero"

        if (rawRol === 1 || rawRol === "1" || String(rawRol).toLowerCase() === "administrador" || String(rawRol).toLowerCase() === "admin") {
            role = "administrador"
        }

        const token = data?.token || data?.jwt || null

        if(token){
            const cookieStore = await cookies()
            cookieStore.set("kiosco_token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite:"lax",
                path:"/",
                maxAge:60*60*24
            })

            cookieStore.set("kiosco_rol", role,{
                path:"/",
                maxAge: 60*60*24
            })
           
        }

        return {
            success: true,
            role,
            user: data?.user || { email: data?.email || email },
        }
    } catch (err: any) {
        return {
            error: "No se pudo conectar con el servidor. Si estuvo inactivo, puede tardar unos segundos en responder.",
        }
    }
}

export async function addProductAction(formData: FormData){
    // 1. Agarramos TODOS los datos que nos pide el Swagger de Agus
    const nombre = formData.get("nombre")?.toString().trim()
    const codigoBarras = formData.get("codigoBarras")?.toString().trim()
    const precioCosto = Number(formData.get("precioCosto"))
    const precioVenta = Number(formData.get("precioVenta"))
    const stock = Number(formData.get("stock"))
    const categoriaId = Number(formData.get("categoriaId"))

    if(!nombre || !precioCosto || !precioVenta || !codigoBarras || !categoriaId){
        return {error: "Todos los campos son obligatorios."}
    }

    // 2. BUSCAMOS EL TOKEN PARA QUE NO TIRE 401
    const cookieStore = await cookies()
    const token = cookieStore.get("kiosco_token")?.value

    if (!token) {
        return { error: "No estás autorizado. Tu sesión expiró." }
    }

    // 3. Armamos el JSON exactamente como le gusta a Agus
    const payload = {
        nombre: nombre,
        codigoBarras: codigoBarras,
        precioCosto: precioCosto,
        precioVenta: precioVenta,
        stock: stock,
        categoriaId: categoriaId
    }

    try{
        const res = await fetch(`${API_URL}/api/Productos`,{
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token.trim()}` // <-- LA LLAVE MAGICA
            }, 
            body: JSON.stringify(payload),
            cache: 'no-store' // <-- ANTI FANTASMAS DE NEXT.JS
        })

        const data = await res.json().catch(()=>null)

        if(!res.ok){
            return {error: data?.message || data?.error || `Error del servidor (${res.status})`}
        }

        return {success : true, productoNuevo: {...payload,
                id_producto: data?.id_producto || data?.id || data?.data?.id_producto}} // success corregido
    }catch(error){
        return {error: `No se pudo conectar al servidor`}
    }
}

export async function createCategoryAction(formData: FormData) {
    const nombre = formData.get("nombre")?.toString().trim()

    if (!nombre) {
        return { error: "El nombre de la categoría es obligatorio." }
    }

    const cookieStore = await cookies()
    const token = cookieStore.get("kiosco_token")?.value

    if (!token) {
        return { error: "No estás autorizado. Tu sesión expiró." }
    }

    try {
        // Asegurate de que esta ruta sea la correcta en tu Swagger (Suele ser /api/Categorias)
        const res = await fetch(`${API_URL}/api/Categorias`, { 
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token.trim()}`
            },
            body: JSON.stringify({ nombre }),
            cache: 'no-store'
        })

        if (!res.ok) {
            const errorData = await res.json().catch(() => null)
            return { error: errorData?.message || `Error del servidor (${res.status})` }
        }

        // Muchos backends devuelven el objeto recién creado (con su nuevo ID real). Lo intentamos capturar.
        const nuevaCategoria = await res.json().catch(() => null)

        return { success: true, data: nuevaCategoria }

    } catch (err: any) {
        return { error: "No se pudo conectar con el servidor." }
    }
}

export async function getProductsAction() {
    const cookieStore = await cookies()
    const token = cookieStore.get("kiosco_token")?.value

    if (!token) return { error: "No estás autorizado" }

    try {
        const res = await fetch(`${API_URL}/api/Productos`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            },
            cache: 'no-store'
        })
        if (!res.ok) return { error: "Error al traer productos" }
        const data = await res.json()
        console.log("¡ASÍ LLEGAN LOS DATOS DE NODE!", data)
        return { success: true, data }
    } catch (error) {
        return { error: "No se pudo conectar al servidor" }
    }
}

export async function getCategoriesAction() {
    const cookieStore = await cookies()
    const token = cookieStore.get("kiosco_token")?.value

    if (!token) return { error: "No estás autorizado" }

    try {
        const res = await fetch(`${API_URL}/api/Categorias`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            },
            cache: 'no-store'
        })
        if (!res.ok) return { error: "Error al traer categorías" }
        const data = await res.json()
        return { success: true, data }
    } catch (error) {
        return { error: "No se pudo conectar al servidor" }
    }
}

export async function updateProductAction(id: string | number, formData: FormData) {
    const nombre = formData.get("nombre")?.toString().trim()
    const codigoBarras = formData.get("codigoBarras")?.toString().trim()
    const precioCosto = Number(formData.get("precioCosto"))
    const precioVenta = Number(formData.get("precioVenta"))
    const stock = Number(formData.get("stock"))
    const categoriaId = Number(formData.get("categoriaId"))

    if (!nombre || !precioCosto || !precioVenta || !categoriaId) {
        return { error: "Faltan campos obligatorios." }
    }

    const cookieStore = await cookies()
    const token = cookieStore.get("kiosco_token")?.value

    if (!token) return { error: "No estás autorizado." }

    const payload = {
        id: Number(id), // Generalmente en C# el PUT pide el ID en el cuerpo o en la URL
        nombre,
        codigoBarras: codigoBarras || "", // Si no lo tenías, mandamos vacío o lo que venga
        precioCosto,
        precioVenta,
        stock,
        categoriaId
    }

    try {
        // Fijate en el Swagger si la ruta es /api/Productos o /api/Productos/{id}
        const res = await fetch(`${API_URL}/api/Productos/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token.trim()}`
            },
            body: JSON.stringify(payload),
            cache: 'no-store'
        })

        if (!res.ok) {
            const data = await res.json().catch(() => null)
            console.log("🚨 ERROR DESDE C# AL EDITAR:", JSON.stringify(data, null, 2))
            
            // Los backends de .NET suelen esconder los errores de validación adentro de un objeto "errors"
            let errorDetallado = ""
            if (data?.errors) {
                errorDetallado = JSON.stringify(data.errors)
            }
            return { error: data?.message || data?.error || `Error del servidor (${res.status})` }
        }

        return { success: true }
    } catch (error) {
        return { error: "No se pudo conectar al servidor para actualizar." }
    }
}

export async function deleteProductAction(id: string | number) {
    const cookieStore = await cookies()
    const token = cookieStore.get("kiosco_token")?.value

    if (!token) return { error: "No estás autorizado." }

    try {
        const res = await fetch(`${API_URL}/api/Productos/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token.trim()}`
            },
            cache: 'no-store'
        })

        if (!res.ok) {
            const data = await res.json().catch(() => null)
            return { error: data?.message || data?.error || `Error al eliminar (${res.status})` }
        }

        return { success: true }
    } catch (error) {
        return { error: "No se pudo conectar al servidor para eliminar." }
    }
}

export async function createSaleAction(cart: any[], total: number, tipo_medio: string) {
    try {
        // 1. El Server Action saca el token de la bóveda (las cookies)
        const cookieStore = await cookies()
        const token = cookieStore.get("kiosco_token")?.value

        if (!token) {
            return { success: false, error: "Tu sesión expiró. Volvé a iniciar sesión." }
        }

        // 2. Le pegamos a tu backend en Node.js
        const apiUrl = process.env.API_URL || "http://localhost:3001"
        
        const res = await fetch(`${apiUrl}/api/Pagos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // ¡Acá le mostramos el DNI al patovica!
            },
            body: JSON.stringify({ cart, total, tipo_medio })
        })

        const data = await res.json()

        if (!res.ok) {
            return { success: false, error: data.error || "Error al procesar el pago" }
        }

        return { success: true, data }

    } catch (error) {
        console.error("Error en el Server Action:", error)
        return { success: false, error: "No se pudo conectar con el backend." }
    }
}


