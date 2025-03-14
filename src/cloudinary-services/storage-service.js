import cloudinaryService from "./cloudinary-service.js";

/**
 * Servicio de almacenamiento simple que utiliza Cloudinary
 * Proporciona una API sencilla para operaciones de almacenamiento
 */
class StorageService {
  /**
   * Sube un archivo al almacenamiento
   * @param {string} path - Ruta donde se guardará el archivo (se usará como carpeta en Cloudinary)
   * @param {File} file - Archivo a subir
   * @param {Object} metadata - Metadatos opcionales del archivo
   * @returns {Promise<Object>} - Información del archivo subido
   */
  async uploadFile(path, file, metadata = {}) {
    try {
      // Extraer la carpeta del path
      const folder = path.split("/").filter(Boolean).join("/");

      // Subir el archivo a Cloudinary
      const result = await cloudinaryService.uploadFile(file, folder);

      // Devolver un objeto con formato similar al que devolvería Firebase Storage
      return {
        name: file.name,
        fullPath: `${folder}/${result.publicId.split("/").pop()}`,
        metadata: {
          ...metadata,
          size: result.size,
          contentType: file.type,
          timeCreated: new Date().toISOString(),
        },
        downloadURL: result.url,
        publicId: result.publicId,
      };
    } catch (error) {
      console.error("Error al subir archivo:", error);
      throw error;
    }
  }

  /**
   * Elimina un archivo del almacenamiento
   * @param {string} path - Ruta completa del archivo o publicId
   * @returns {Promise<void>}
   */
  async deleteFile(path) {
    try {
      // Si el path es una URL, extraer el publicId
      let publicId = path;
      if (path.startsWith("http")) {
        // Extraer el publicId de la URL de Cloudinary
        const urlParts = path.split("/");
        const uploadIndex = urlParts.findIndex((part) => part === "upload");
        if (uploadIndex !== -1 && uploadIndex < urlParts.length - 2) {
          // El formato típico es: .../upload/v1234567890/folder/filename.ext
          publicId = urlParts.slice(uploadIndex + 2).join("/");
          // Eliminar la extensión del archivo
          publicId = publicId.split(".")[0];
        }
      }

      // Eliminar el archivo de Cloudinary
      await cloudinaryService.deleteFile(publicId);
    } catch (error) {
      console.error("Error al eliminar archivo:", error);
      throw error;
    }
  }

  /**
   * Obtiene la URL de descarga de un archivo
   * @param {string} path - Ruta del archivo o publicId
   * @param {Object} options - Opciones de transformación
   * @returns {string} - URL de descarga
   */
  getDownloadURL(path, options = {}) {
    try {
      // Si el path ya es una URL, devolverla directamente
      if (path.startsWith("http")) {
        return path;
      }

      // Obtener la URL transformada de Cloudinary
      return cloudinaryService.getImageUrl(path, options);
    } catch (error) {
      console.error("Error al obtener URL de descarga:", error);
      throw error;
    }
  }

  /**
   * Obtiene una referencia a un archivo o carpeta
   * @param {string} path - Ruta del archivo o carpeta
   * @returns {Object} - Objeto con métodos para operar con la referencia
   */
  ref(path) {
    const self = this;

    return {
      // Propiedades
      fullPath: path,
      name: path.split("/").pop(),
      parent: {
        fullPath: path.split("/").slice(0, -1).join("/"),
      },

      // Métodos
      child: (childPath) => self.ref(`${path}/${childPath}`),
      delete: () => self.deleteFile(path),
      getDownloadURL: (options) => self.getDownloadURL(path, options),
      put: (file, metadata) => self.uploadFile(path, file, metadata),
      putString: async (dataString, format = "raw", metadata = {}) => {
        // Convertir string a File
        const blob =
          format === "data_url"
            ? await fetch(dataString).then((res) => res.blob())
            : new Blob([dataString], { type: "text/plain" });

        const file = new File([blob], "file.txt", { type: blob.type });
        return self.uploadFile(path, file, metadata);
      },
    };
  }
}

export default new StorageService();
