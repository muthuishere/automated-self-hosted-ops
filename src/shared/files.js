import * as fs from "fs";
import path from "path";
import os from "os";
import {v4 as uuidv4} from "uuid";
import {fileURLToPath} from "url";

export async function  writeFile( path ,  content ) {


    return new Promise((resolve, reject) => {
        fs.writeFile(path, content, err => {
            if (err) {
                reject(err);
            }
            resolve();
            // file written successfully
        });
    })



}

export async function readFile(filename) {

    return new Promise((resolve, reject) => {
        fs.readFile( filename,"utf8", function(err, data) {

            if (err) {
                reject(err) ;
            }
            resolve(data);

        });
    });


}
export async function deleteFile(filename) {

    return new Promise((resolve, reject) => {


        try {

            if(fs.existsSync(filename) == false){
              throw new Error("File does not exist: " + filename);
            }


         fs.rmSync(filename, {
                force: true,
            });


            resolve();
        }catch (e) {
            console.log("Error deleting file: " + filename);
            console.error(e)
            reject(e);
        }



    });


}
export async function createFolder(path) {

    return new Promise((resolve, reject) => {

        if (fs.existsSync(path)){
            resolve();
        }

        fs.mkdir(path, { recursive: true }, (err) => {
            if (err) {
                reject(err) ;
            }
            resolve();
        });



    });


}


export async function createSymbolicLink(path,link) {

    return new Promise((resolve, reject) => {

        if (fs.existsSync(link)){
            resolve();
        }


        fs.symlink(link, path, "file", err => {
            if (err) {
                reject(err) ;
            }
            resolve();
        });

    });


}


export function getRandomTempFileName(extension){

    let    filePath = path.join(os.tmpdir(), `${uuidv4()}.${extension}`);
    return filePath;
}

export  function getRandomtempYamlFileName(){
    return getRandomTempFileName("yaml");
}
export  function getRandomtempJsonFileName(){
    return getRandomTempFileName("json");
}

export  function getRandomtempShFileName(){
    return getRandomTempFileName("sh");
}


export function getProjectRootFolder() {
   const __dirname = path.dirname(fileURLToPath(import.meta.url));
    return path.join(__dirname, "../../");
}
export function cleanAndCreateFolder(deliveryFolder) {
    if (fs.existsSync(deliveryFolder)) {
        fs.rmSync(deliveryFolder, {recursive: true})
    }
    fs.mkdirSync(deliveryFolder, {recursive: true})
}

export function getDeliveryFolderName(appName) {

    const deliveryFolder = path.join(getProjectRootFolder(), 'dist', appName);

    return deliveryFolder;
}