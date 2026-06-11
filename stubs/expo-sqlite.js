// Web stub — expo-sqlite uses WebAssembly which Metro can't bundle statically.
// All database operations are no-ops on web.
module.exports = {
  openDatabaseAsync: async () => ({
    execAsync: async () => {},
    runAsync: async () => ({ lastInsertRowId: 0, changes: 0 }),
    getAllAsync: async () => [],
    getFirstAsync: async () => null,
  }),
  SQLiteDatabase: class {},
};
