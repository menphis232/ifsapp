import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ArchivoService {
  private readonly uploadPath: string;

  constructor(private configService: ConfigService) {
    this.uploadPath = path.join(process.cwd(), 'uploads');
    this.ensureUploadDirectoryExists();
  }

  private ensureUploadDirectoryExists(): void {
    if (!fs.existsSync(this.uploadPath)) {
      fs.mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  async guardarArchivo(file: Express.Multer.File): Promise<string> {
    // Si el archivo ya fue guardado por multer, solo retornar la ruta
    if (file.path) {
      return `/uploads/${path.basename(file.path)}`;
    }
    
    // Si no, guardarlo manualmente
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(this.uploadPath, fileName);

    fs.writeFileSync(filePath, file.buffer);

    return `/uploads/${fileName}`;
  }

  async guardarImagen(file: Express.Multer.File): Promise<string> {
    // Validar que sea una imagen
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error('Tipo de archivo no permitido. Solo se permiten imágenes.');
    }

    return this.guardarArchivo(file);
  }

  eliminarArchivo(filePath: string): void {
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
}

