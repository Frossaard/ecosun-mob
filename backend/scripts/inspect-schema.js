require('dotenv').config();

const fs = require('fs/promises');
const path = require('path');

const { getPool } = require('../src/config/database');

const queries = {
  tables: `SELECT TABLE_SCHEMA AS schemaName, TABLE_NAME AS tableName, TABLE_TYPE AS tableType
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_TYPE = 'BASE TABLE'
    ORDER BY TABLE_SCHEMA, TABLE_NAME;`,
  columns: `SELECT TABLE_SCHEMA AS schemaName, TABLE_NAME AS tableName, COLUMN_NAME AS columnName,
      ORDINAL_POSITION AS ordinalPosition, DATA_TYPE AS dataType,
      CHARACTER_MAXIMUM_LENGTH AS maxLength, NUMERIC_PRECISION AS numericPrecision,
      NUMERIC_SCALE AS numericScale, IS_NULLABLE AS isNullable, COLUMN_DEFAULT AS columnDefault
    FROM INFORMATION_SCHEMA.COLUMNS
    ORDER BY TABLE_SCHEMA, TABLE_NAME, ORDINAL_POSITION;`,
  constraints: `SELECT tc.CONSTRAINT_SCHEMA AS constraintSchema, tc.CONSTRAINT_NAME AS constraintName,
      tc.CONSTRAINT_TYPE AS constraintType, tc.TABLE_SCHEMA AS tableSchema, tc.TABLE_NAME AS tableName,
      kcu.COLUMN_NAME AS columnName, kcu.ORDINAL_POSITION AS ordinalPosition
    FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
    LEFT JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE kcu
      ON tc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME AND tc.CONSTRAINT_SCHEMA = kcu.CONSTRAINT_SCHEMA
    ORDER BY tc.TABLE_SCHEMA, tc.TABLE_NAME, tc.CONSTRAINT_NAME, kcu.ORDINAL_POSITION;`,
  foreignKeys: `SELECT fk.name AS foreignKeyName, sch.name AS schemaName, parentTab.name AS tableName,
      parentCol.name AS columnName, refSch.name AS referencedSchema, refTab.name AS referencedTable,
      refCol.name AS referencedColumn, fk.delete_referential_action_desc AS onDelete,
      fk.update_referential_action_desc AS onUpdate
    FROM sys.foreign_keys fk
    INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
    INNER JOIN sys.tables parentTab ON fkc.parent_object_id = parentTab.object_id
    INNER JOIN sys.schemas sch ON parentTab.schema_id = sch.schema_id
    INNER JOIN sys.columns parentCol ON fkc.parent_object_id = parentCol.object_id AND fkc.parent_column_id = parentCol.column_id
    INNER JOIN sys.tables refTab ON fkc.referenced_object_id = refTab.object_id
    INNER JOIN sys.schemas refSch ON refTab.schema_id = refSch.schema_id
    INNER JOIN sys.columns refCol ON fkc.referenced_object_id = refCol.object_id AND fkc.referenced_column_id = refCol.column_id
    ORDER BY sch.name, parentTab.name, fk.name, fkc.constraint_column_id;`,
  indexes: `SELECT sch.name AS schemaName, tab.name AS tableName, ind.name AS indexName,
      ind.type_desc AS indexType, ind.is_unique AS isUnique, ind.is_primary_key AS isPrimaryKey,
      col.name AS columnName, ic.key_ordinal AS keyOrdinal
    FROM sys.indexes ind
    INNER JOIN sys.tables tab ON ind.object_id = tab.object_id
    INNER JOIN sys.schemas sch ON tab.schema_id = sch.schema_id
    INNER JOIN sys.index_columns ic ON ind.object_id = ic.object_id AND ind.index_id = ic.index_id
    INNER JOIN sys.columns col ON ic.object_id = col.object_id AND ic.column_id = col.column_id
    WHERE ind.name IS NOT NULL
    ORDER BY sch.name, tab.name, ind.name, ic.key_ordinal;`,
};

async function inspectSchema() {
  const pool = await getPool();
  const report = {};

  for (const [section, query] of Object.entries(queries)) {
    report[section] = (await pool.request().query(query)).recordset;
  }

  const destination = path.resolve(__dirname, '..', 'schema-report.json');
  await fs.writeFile(destination, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(`Schema report written to ${destination}`);
}

inspectSchema().catch(() => {
  console.error('Schema inspection failed. Check the backend .env without exposing its values.');
  process.exitCode = 1;
});
