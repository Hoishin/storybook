import type { Task } from '../task';
import { exec } from '../utils/exec';

export const smokeTest: Task = {
  description: 'Run the smoke tests of a sandbox',
  before: ['sandbox'],
  async ready() {
    return false;
  },
  async run({ sandboxDir }, { dryRun, debug }) {
    // eslint-disable-next-line no-console
    console.log(`smoke testing in ${sandboxDir}`);

    return exec(`yarn storybook --smoke-test`, { cwd: sandboxDir }, { dryRun, debug });
  },
};
