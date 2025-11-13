import fs from 'fs';
import { AxeResults, Result } from 'axe-core'; // (Optional - for TypeScript types)

export class CreateCsvReporter {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
    // Write CSV header
    fs.writeFileSync(this.filePath, 'id,impact,description,helpUrl,selector\n');
  }

  // Call this with the violations array
  async report(violations: Result[]) {
    for (const v of violations) {
      // Some violations affect multiple nodes; output each node
      for (const node of v.nodes) {
        const row = [
          v.id,
          v.impact,
          `"${v.description.replace(/"/g, '""')}"`,
          v.helpUrl,
          `"${node.target.join(', ')}"`
        ].join(',') + '\n';
        fs.appendFileSync(this.filePath, row);
      }
    }
  }
}
