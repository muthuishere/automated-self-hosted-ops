
import path from "path";
import fs from "fs";
import * as ejs from "ejs";
import {getProjectRootFolder} from "../../shared/files.js";

function getAnsibleTemplateFile(filename){
    return  path.join(getProjectRootFolder(), 'templates', 'ansible' , filename);
}


export function generateAnsibleRunner(filepath){
    // get the parent folder of the file
    const parentFolder = path.dirname(filepath);
    // get only name of the file
    let filename = path.basename(filepath);

let     filenameWithoutExtension = filename.replace('.yaml', '.sh');

const    deploymentFilePath = path.join(parentFolder, filenameWithoutExtension);


    const template = fs.readFileSync(getAnsibleTemplateFile('ansiblerunner.sh'), 'utf8');
    const deployedRender = ejs.render(template, {
        filename
    });

    fs.writeFileSync(deploymentFilePath, deployedRender);

   return deploymentFilePath

}