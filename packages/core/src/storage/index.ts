import type { StorageAdapter } from "./types";
import { SqliteAdapter } from "./sqlite";
import { PostgresAdapter } from "./postgres";

export * from "./types";
export { SqliteAdapter } from "./sqlite";
export { PostgresAdapter } from "./postgres";

let _storage: StorageAdapter | null = null;
let _initialized = false;

export async function getStorage(): Promise<StorageAdapter> {
  if (!_storage) {
    const kind = process.env["AURII_STORAGE"] ?? "sqlite";
    _storage = kind === "postgres" ? new PostgresAdapter() : new SqliteAdapter();
  }
  if (!_initialized) {
    await _storage.init();
    _initialized = true;
  }
  return _storage;
}

export async function closeStorage(): Promise<void> {
  if (_storage) {
    await _storage.close();
    _storage = null;
    _initialized = false;
  }
}
