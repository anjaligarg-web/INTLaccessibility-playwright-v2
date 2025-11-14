import XLSX from 'xlsx';

/**
 * Reads URLs from an Excel file given the column name.
 * @param filePath - The path to the Excel file.
 * @param columnName - The column name containing URLs.
 * @returns array of URLs
 */
export function readUrlsFromExcel(filePath: string, columnName: string): string[] {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet);
  return data.map((row: any) => row[columnName]).filter((u: string) => !!u);
}