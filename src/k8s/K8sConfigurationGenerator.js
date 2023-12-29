
import * as fs   from "fs";
import * as ejs from "ejs";
import { fileURLToPath } from 'url';
import path from "path";


import dotenv from 'dotenv';

import yaml from 'js-yaml';
import {Playbook} from "../ansible/Playbook.js";
import {addUploadToHomeFolderTask} from "../ansible/files/filePlaybookBuilder.js";
import {cleanAndCreateFolder, getDeliveryFolderName, getProjectRootFolder} from "../shared/files.js";
import {addSecretToDeployment, generateSecretFile} from "./k8SecretBuilder.js";
import {
    createDeploymentFolders, getDeliveryFile,
    getDeliveryFolderNameForAnsibleScripts,
    getDeliveryFolderNameForKubeSites, getRelativePath, saveKubeSitesYamlFile
} from "./files.js";
import {generateK8sAppManagementScripts} from "./K8sDeploymentScriptGenerator.js"; // Assuming you're using 'js-yaml' for YAML conversion

dotenv.config();

function getTemplateFile(filename) {
    return path.join(getProjectRootFolder(), 'templates', 'kubernetes/' + filename + '.ejs');
}

function applyTemplateFrom({filename, appName, domain, containerPort, nodePort, registryUrl, registryPullSecret}) {
    const templateFile = getTemplateFile(filename);
    // const deliveryFolder = getDeliveryFolderNameForKubeSites(appName);
    // const deployFile = path.join(deliveryFolder, filename);

    const template = fs.readFileSync(templateFile, 'utf8');
    const deployedRender = ejs.render(template, {
        appName,
        domain,
        containerPort,
        nodePort,
        registryUrl,
        registryPullSecret
    });
    return deployedRender;
}

function generateAppDeploymentFile({ appName, domain, containerPort, nodePort, registryUrl,registryPullSecret,secretData}) {

    let filename = 'app-deployment.yaml';
    const deployedRender = applyTemplateFrom({filename, appName, domain, containerPort, nodePort, registryUrl, registryPullSecret});

const {name,keys}= secretData
// console.log("secretData",secretData);
//     console.log("deployedRender",deployedRender);

 const finalDeployedRender=   addSecretToDeployment(deployedRender,{name,keys});
    const deployFile = saveKubeSitesYamlFile(appName, filename, finalDeployedRender);

    return deployFile;

}
function generateAppServiceFile({ appName, domain, containerPort, nodePort, registryUrl,registryPullSecret}) {
    let filename = `app-service.yaml`;

    return renderTemplateFrom({filename, appName, domain, containerPort, nodePort, registryUrl, registryPullSecret});
}
function generateStartDeployFile({ appName, domain, containerPort, nodePort, registryUrl,registryPullSecret}) {
    let filename = 'install.sh';

    return renderTemplateFrom({filename, appName, domain, containerPort, nodePort, registryUrl, registryPullSecret});
}
function generateStopDeployFile({ appName, domain, containerPort, nodePort, registryUrl,registryPullSecret}) {
    let filename = 'uninstall.sh';
    return renderTemplateFrom({filename, appName, domain, containerPort, nodePort, registryUrl, registryPullSecret});
}

// function getDeliveryFile(appName, filename) {
//     const deliveryFolder = getDeliveryFolderNameForKubeSites(appName);
//     const deployFile = path.join(deliveryFolder, filename);
//     return deployFile;
// }



function renderTemplateFrom({filename, appName, domain, containerPort, nodePort, registryUrl, registryPullSecret}) {

    const deployedRender = applyTemplateFrom({filename, appName, domain, containerPort, nodePort, registryUrl, registryPullSecret});
    const deployFile = saveKubeSitesYamlFile(appName, filename, deployedRender);
    return deployFile;
}

function generateUpdateDeployFile({ appName, domain, containerPort, nodePort, registryUrl,registryPullSecret}) {
    let filename = 'update-deployment.sh';
    return renderTemplateFrom({filename, appName, domain, containerPort, nodePort, registryUrl, registryPullSecret});
}


function generateRestartDeployFile({ appName, domain, containerPort, nodePort, registryUrl,registryPullSecret}) {
    let filename = 'restart-deployment.sh';
    return renderTemplateFrom({filename, appName, domain, containerPort, nodePort, registryUrl, registryPullSecret});
}



export async function generateKubernetesYAML({appName, domain, containerPort, nodePort, registryUrl,registryPullSecret,envFile,hostname,kubeconfig,nvmdir}) {
    createDeploymentFolders(appName);

    const  secretData= generateSecretFile({ envFile,appName,hostname});
    const  secretsFile=secretData.secretFilePath
   const appDeployFile= generateAppDeploymentFile({ appName, domain, containerPort, nodePort, registryUrl,registryPullSecret,secretData});
    const appServiceFile= generateAppServiceFile({ appName, domain, containerPort, nodePort, registryUrl,registryPullSecret});
    const startDeployFile= generateStartDeployFile({ appName, domain, containerPort, nodePort, registryUrl,registryPullSecret});
    const stopDeployFile= generateStopDeployFile({ appName, domain, containerPort, nodePort, registryUrl,registryPullSecret});
    const updateDeployFile= generateUpdateDeployFile({ appName, domain, containerPort, nodePort, registryUrl,registryPullSecret});
    const restartDeployFile= generateRestartDeployFile({ appName, domain, containerPort, nodePort, registryUrl,registryPullSecret});




  // We have all the files some where in the dist folder
    // Now we need to upload them to the remote server
    let res = await generateK8sAppManagementScripts(hostname,{appName, domain, containerPort, nodePort, registryUrl, registryPullSecret, envFile,kubeconfig,nvmdir });
    // And create Ansible Playbook to run them from local

    return {...res,appDeployFile,appServiceFile,startDeployFile,stopDeployFile,updateDeployFile,restartDeployFile,secretsFile};
}







