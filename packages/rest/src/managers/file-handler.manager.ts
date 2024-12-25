import { open, stat } from "node:fs/promises";
import { basename } from "node:path";
import { PremiumTier } from "@nyxjs/core";
import FormData from "form-data";
import { contentType } from "mime-types";
import type {
  FileEntity,
  FileInputEntity,
  RouteEntity,
} from "../types/index.js";

export class FileHandlerManager {
  static readonly FILE_LIMITS = {
    DEFAULT: 10 * 1024 * 1024, // 10MB
    TIER_1: 25 * 1024 * 1024, // 25MB
    TIER_2: 50 * 1024 * 1024, // 50MB
    TIER_3: 100 * 1024 * 1024, // 100MB
    MAX_FILES: 10,
  } as const;

  #maxFileSize: number;
  #isDestroyed = false;

  constructor(boostTier: PremiumTier = PremiumTier.None) {
    this.#maxFileSize = this.#getMaxFileSizeForTier(boostTier);
  }

  async handleFiles(options: RouteEntity): Promise<RouteEntity> {
    this.#validateManagerState();

    if (!options.files) {
      return options;
    }

    const files = Array.isArray(options.files)
      ? options.files
      : [options.files];

    await this.#validateFiles(files);
    const form = await this.#createFormDataWithFiles(files, options.body);

    return {
      ...options,
      body: form.getBuffer(),
      headers: {
        ...form.getHeaders(options.headers),
        "content-length": form.getLengthSync().toString(),
      },
    };
  }

  setBoostTier(tier: PremiumTier): void {
    this.#validateManagerState();
    this.#maxFileSize = this.#getMaxFileSizeForTier(tier);
  }

  destroy(): void {
    this.#isDestroyed = true;
  }

  #getMaxFileSizeForTier(tier: PremiumTier): number {
    const { DEFAULT, TIER_1, TIER_2, TIER_3 } = FileHandlerManager.FILE_LIMITS;

    switch (tier) {
      case PremiumTier.Tier1:
        return TIER_1;
      case PremiumTier.Tier2:
        return TIER_2;
      case PremiumTier.Tier3:
        return TIER_3;
      default:
        return DEFAULT;
    }
  }

  #validateManagerState(): void {
    if (this.#isDestroyed) {
      throw new Error("FileHandlerManager has been destroyed");
    }
  }

  async #validateFiles(files: Array<FileEntity | undefined>): Promise<void> {
    const validFiles = files.filter(
      (file): file is FileEntity => file !== undefined,
    );

    if (validFiles.length > FileHandlerManager.FILE_LIMITS.MAX_FILES) {
      throw new Error(
        `Maximum number of files (${FileHandlerManager.FILE_LIMITS.MAX_FILES}) exceeded`,
      );
    }

    let totalSize = 0;

    for (const file of validFiles) {
      const size = await this.#getFileSize(file);
      totalSize += size;

      if (size > this.#maxFileSize) {
        throw new Error(
          `File size ${size} bytes exceeds maximum size ${this.#maxFileSize} bytes`,
        );
      }
    }

    const maxTotalSize =
      this.#maxFileSize * FileHandlerManager.FILE_LIMITS.MAX_FILES;
    if (totalSize > maxTotalSize) {
      throw new Error(
        `Total file size ${totalSize} bytes exceeds maximum allowed ${maxTotalSize} bytes`,
      );
    }
  }

  async #createFormDataWithFiles(
    files: Array<FileEntity | undefined>,
    body?: unknown,
  ): Promise<FormData> {
    const form = new FormData();

    for (let i = 0; i < files.length; i++) {
      await this.#processFile(form, i, files.length, files[i]);
    }

    if (body !== undefined) {
      const payload = typeof body === "string" ? body : JSON.stringify(body);
      form.append("payload_json", payload);
    }

    return form;
  }

  async #processFile(
    form: FormData,
    index: number,
    totalFiles: number,
    file?: FileEntity,
  ): Promise<void> {
    if (!file) {
      return;
    }

    const fileData = await this.#getFileData(file);
    const fieldName = totalFiles === 1 ? "file" : `files[${index}]`;

    form.append(fieldName, fileData.buffer, {
      filename: fileData.filename,
      contentType: fileData.contentType,
      knownLength: fileData.buffer.length,
    });
  }

  #getFileData(file: FileEntity): Promise<FileInputEntity> {
    if (typeof file === "string") {
      return this.#handleFilePathInput(file);
    }

    if (file instanceof File) {
      return this.#handleFileInput(file);
    }

    throw new Error("Invalid file type");
  }

  async #handleFilePathInput(filePath: string): Promise<FileInputEntity> {
    try {
      const stats = await stat(filePath);

      if (!stats.isFile()) {
        throw new Error("Path does not point to a file");
      }

      if (stats.size > this.#maxFileSize) {
        throw new Error(
          `File too large: max size is ${this.#maxFileSize} bytes`,
        );
      }

      const handle = await open(filePath);
      try {
        const buffer = await handle.readFile();
        const filename = basename(filePath);

        return {
          buffer,
          filename,
          contentType: contentType(filename) || "application/octet-stream",
        };
      } finally {
        await handle.close();
      }
    } catch (error) {
      throw new Error(
        `Failed to read file ${filePath}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async #handleFileInput(file: File): Promise<FileInputEntity> {
    try {
      if (file.size > this.#maxFileSize) {
        throw new Error(
          `File too large: max size is ${this.#maxFileSize} bytes`,
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      return {
        buffer,
        filename: file.name,
        contentType:
          file.type || contentType(file.name) || "application/octet-stream",
      };
    } catch (error) {
      throw new Error(
        `Failed to process File object: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async #getFileSize(file: FileEntity): Promise<number> {
    if (typeof file === "string") {
      const stats = await stat(file);
      return stats.size;
    }

    if (file instanceof File) {
      return file.size;
    }

    throw new Error("Invalid file type");
  }
}