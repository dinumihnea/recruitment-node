import { writeFile } from 'fs';

/**
 * Generate seed files
 * the output seeds will be stored in ./dist/seeder/seeds/{modelName}.json
 *
 * Every seed file will have a `seederKey` used to prevent running seeders multiple times for the same DB
 *
 * @param modelName the DB name of the collection
 * @param models an array of items to be stored
 */
export async function createSeed<T>(
  modelName: string,
  models: Array<T>,
): Promise<void> {
  const seederKey = new Date().getTime().toString();
  const data = JSON.stringify({
    seederKey,
    [modelName]: models,
  });
  await new Promise<void>((resolve, reject) => {
    writeFile(
      `${process.cwd()}/dist/seeder/${modelName}.json`,
      data,
      'utf-8',
      (error) => {
        if (error) {
          return reject(error);
        }
        resolve();
      },
    );
  });
}
