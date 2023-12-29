import {spawn} from 'child_process'
import commandExists from "command-exists";
import {fileURLToPath} from "url";
import Path from "path";
import logger from "./logger.js";
import {promises as fsPromise} from "fs";
import path from "path";


const isWin = process.platform === "win32";



export function runProcess(command, args) {
    return new Promise((resolve, reject) => {
        const process = spawn(command, args);

        let stdoutData = [];
        let stderrData = [];

        process.stdout.on('data', (data) => {
            stdoutData.push(...data.toString().split(/\r?\n/));
            // console.log(data.toString());
            logger.info(data.toString());
        });

        process.stderr.on('data', (data) => {
            stderrData.push(...data.toString().split(/\r?\n/));
            // console.error(data.toString());
            logger.error(data.toString());
        });

        process.on('close', (code) => {
            // Remove any empty lines that might have been added at the end
            stdoutData = stdoutData.filter(line => line);
            stderrData = stderrData.filter(line => line);

            resolve({
                stdout: stdoutData,
                stderr: stderrData,
                code: code
            });
        });

        process.on('error', (err) => {
            reject(err);
        });
    });
}


export function isSudo() {

    return isWin ? true : (process.getuid && process.getuid() === 0);
}


export async function  doesOsHasCommand(cmd){
    try {
        await commandExists(cmd)
        return true
    }catch (e) {
        return  false
    }


}

export function getHomeFolder(){
    const __filename = fileURLToPath(import.meta.url);
    const dirname = Path.dirname(__filename);
    const folder =     Path.resolve(dirname, '../../')
    return folder;
}

export async function makeScriptsExecutable(folderName) {
    try {
        // Read all files in the directory
        const files = await fsPromise.readdir(folderName);

        // Filter out only .sh files
        const shFiles = files.filter(file => path.extname(file) === '.sh');

        // Loop through the .sh files and change them to be executable
        for (const file of shFiles) {
            const filePath = path.join(folderName, file);
            // Use runProcess to run `chmod +x` on the file
            await runProcess('chmod', ['+x', filePath]);
            console.log(`${file} is now executable`);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}
