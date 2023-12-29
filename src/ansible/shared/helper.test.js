
import fs from 'fs';
import path from 'path';
import {getProjectRootFolder} from "../../shared/files.js";
describe('Sorting env vars', () => {

    it('should sort accordingly', async () => {

            // read from file

            const foldername = getProjectRootFolder() + path.sep + 'assets' + path.sep + 'envvars'

            await sortFilesInDirectory(foldername)
        }
    )
}
)

const sortLinesInText = (text) => {
    const lines = text.split('\n');
    lines.sort();
    return lines.join('\n');
};

const sortFile = async (filePath) => {
    const data = await fs.promises.readFile(filePath, 'utf8');
    const sortedData = sortLinesInText(data);
    await fs.promises.writeFile(filePath, sortedData, 'utf8');
};

const sortFilesInDirectory = async (directoryPath) => {
    const files = await fs.promises.readdir(directoryPath);
    const sortPromises = files.map((file) => sortFile(path.join(directoryPath, file)));
    await Promise.all(sortPromises);
};