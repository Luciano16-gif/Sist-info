import { Cloudinary } from "@cloudinary/url-gen";
import cloudinaryConfig from "../../cloudinary-config";
import SHA1 from 'crypto-js/sha1';
import encHex from 'crypto-js/enc-hex';

// Inicializar instancia de Cloudinary
const cld = new Cloudinary({
  cloud: {
    cloudName: cloudinaryConfig.cloudName,
  },
  url: {
    secure: cloudinaryConfig.secure,
  },
});

/**
 * Servicio para manejar operaciones con Cloudinary
 */
class CloudinaryService {
  /**
   * Sube un archivo a Cloudinary
   * @param {File} file - El archivo a subir
   * @param {string} folder - Carpeta opcional en Cloudinary
   * @returns {Promise<Object>} - Resultado de la subida con public_id, secure_url, etc.
   */
  async uploadFile(file, folder = "app_uploads") {
    // Crear un timestamp para la firma
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    // Preparar los parámetros para la firma
    const params = {
      timestamp: timestamp,
      folder: folder
    };
    
    // Generar la firma
    const signature = this.generateSignature(params);
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", cloudinaryConfig.apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", folder);

    try {
      console.log("Enviando a Cloudinary:", {
        cloudName: cloudinaryConfig.cloudName,
        apiKey: cloudinaryConfig.apiKey,
        timestamp,
        folder
      });
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error de Cloudinary:", errorData);
        throw new Error(`Error en la subida: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Respuesta de Cloudinary:", result);
      
      return {
        publicId: result.public_id,
        url: result.secure_url,
        format: result.format,
        width: result.width,
        height: result.height,
        size: result.bytes,
        resourceType: result.resource_type,
      };
    } catch (error) {
      console.error("Error al subir a Cloudinary:", error);
      throw error;
    }
  }

  /**
   * Elimina un archivo de Cloudinary
   * @param {string} publicId - El ID público del archivo a eliminar
   * @returns {Promise<boolean>} - true si se eliminó correctamente
   */
  async deleteFile(publicId) {
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    // Crear firma para autenticación
    const signature = this.generateSignature({
      public_id: publicId,
      timestamp: timestamp
    });

    const formData = new FormData();
    formData.append("public_id", publicId);
    formData.append("api_key", cloudinaryConfig.apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/destroy`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Error en la eliminación: ${response.statusText}`);
      }

      const result = await response.json();
      return result.result === "ok";
    } catch (error) {
      console.error("Error al eliminar de Cloudinary:", error);
      throw error;
    }
  }

  /**
   * Genera una firma para operaciones que requieren autenticación
   * @param {Object} params - Parámetros a incluir en la firma
   * @returns {string} - Firma generada
   */
  generateSignature(params) {
    const apiSecret = cloudinaryConfig.apiSecret;
    if (!apiSecret) {
      throw new Error("API Secret no configurado");
    }
    
    // Ordenar parámetros alfabéticamente
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join("&");
    
    // Generar firma usando SHA-1 con crypto-js
    return SHA1(sortedParams + apiSecret).toString(encHex);
  }

  /**
   * Obtiene una URL transformada para una imagen
   * @param {string} publicId - El ID público de la imagen
   * @param {Object} transformaciones - Opciones de transformación
   * @returns {string} - URL de imagen transformada
   */
  getImageUrl(publicId, transformaciones = {}) {
    const { width, height, crop, format, quality } = transformaciones;
    
    let transformationString = "";
    
    if (width) transformationString += `w_${width},`;
    if (height) transformationString += `h_${height},`;
    if (crop) transformationString += `c_${crop},`;
    if (format) transformationString += `f_${format},`;
    if (quality) transformationString += `q_${quality},`;
    
    // Eliminar la coma final si existe
    if (transformationString.endsWith(",")) {
      transformationString = transformationString.slice(0, -1);
    }
    
    // Construir URL
    return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/${
      transformationString ? transformationString + "/" : ""
    }${publicId}`;
  }
}

export default new CloudinaryService();