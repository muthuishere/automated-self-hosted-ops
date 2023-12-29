import {cleanAndCreateFolder, getDeliveryFolderName, getProjectRootFolder} from "../shared/files.js";
import path from "path";

import fs from "fs";
import * as ejs from "ejs";
import {Optional} from "declarative-optional";
import {generateAnsibleRunner} from "../ansible/shared/helper.js";
import {getDeliveryFolderNameForAnsibleScripts} from "../k8s/files.js";
import {makeScriptsExecutable} from "../shared/system_processor.js";


function renderTemplateFrom({templateFilePath,deploymentFilePath,hostname,kubeconfig,pidfile,localport,remoteport,user_at_host}) {


    const template = fs.readFileSync(templateFilePath, 'utf8');
    const deployedRender = ejs.render(template, {
        hostname,
        kubeconfig,pidfile,localport,remoteport,user_at_host
    });

    fs.writeFileSync(deploymentFilePath, deployedRender);
    const scriptPath = renderShellScriptTemplateFrom({templateFilePath,deploymentFilePath,hostname,kubeconfig,pidfile,localport,remoteport,user_at_host});
    return {deploymentFilePath,scriptPath};
}

function renderShellScriptTemplateFrom({templateFilePath,deploymentFilePath,hostname,kubeconfig,pidfile,localport,remoteport,user_at_host}) {
//ansible-playbook <%= filename %>
// ssh -L <%= localport %>:localhost:<%= remoteport %> <%= user_at_host %> -N &
// echo $! > <%= pidfile %>
    let updatedDeploymentFilePath = deploymentFilePath.replace('.yaml', '.sh');
    let updatedTemplateFilePath = templateFilePath.replace('.yaml', '.sh');
    const     deploymentFolderPath = path.dirname(deploymentFilePath);
    let filename = path.basename(deploymentFilePath);

    const template = fs.readFileSync(updatedTemplateFilePath, 'utf8');
    const deployedRender = ejs.render(template, {
        hostname,
        filename,
        deploymentFolderPath,
        kubeconfig,pidfile,localport,remoteport,user_at_host
    });

    fs.writeFileSync(updatedDeploymentFilePath, deployedRender);

    return updatedDeploymentFilePath
}



function getK8sDashboardTemplateFile(filename){
   return  path.join(getProjectRootFolder(), 'templates', 'k8sdashboard' , filename);
}


export async function generateKubernetesDashboardForward(hostname,{kubeconfig,remoteport,localport,user_at_host}) {

    const appName = "kubernetes-dashboard-forwarder";
    const folder=   getDeliveryFolderName(appName);
    cleanAndCreateFolder(folder);
    const  getK8sDashboardOutputFile = (filename)=>{
        return   path.join(folder, filename);
    }

    let startForwardingFileName = 'start-forwarding.yaml';
    let stopForwardingFileName = 'stop-forwarding.yaml';
    let pidfile = appName + 'pidfile.txt';




  const startScripts =  renderTemplateFrom({kubeconfig,pidfile,localport,remoteport,user_at_host,templateFilePath:getK8sDashboardTemplateFile(startForwardingFileName),deploymentFilePath:getK8sDashboardOutputFile(startForwardingFileName),hostname})
const stopScripts =    renderTemplateFrom({kubeconfig,pidfile,localport,remoteport,user_at_host,templateFilePath:getK8sDashboardTemplateFile(stopForwardingFileName),deploymentFilePath:getK8sDashboardOutputFile(stopForwardingFileName),hostname})


    await    makeScriptsExecutable(folder);

    return {startScripts,stopScripts}
}