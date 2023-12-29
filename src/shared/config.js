import path from 'path';
import os from "os";
import fs from 'fs';


import 'dotenv/config'
import chalk from "chalk";
import * as k8s from "@kubernetes/client-node";
export const CONFIG_PATH = path.join(os.homedir(), '.kubernetesclientconfig.json');





let k8sCoreApi;
let k8sAppsApi;


export async function init(filename){


    const kc = new k8s.KubeConfig();
    kc.loadFromFile(filename);
    k8sCoreApi = kc.makeApiClient(k8s.CoreV1Api);
    k8sAppsApi = kc.makeApiClient(k8s.AppsV1Api);

}
export async function getK8sCoreApi(){

    if(null==k8sCoreApi){
        await init(getKubernetesConfigFile());
    }

    return k8sCoreApi;

}
export async function getK8sAppsApi(){

    if(null==k8sAppsApi){
        await init(getKubernetesConfigFile());
    }

    return k8sAppsApi;

}



export const getKubernetesConfigFile = () => {

    if (process.env.KUBERNETES_CONFIG_FILE) {
        return process.env.KUBERNETES_CONFIG_FILE;
    }

    return readFromConfigFile('KUBERNETES_CONFIG_FILE');
};



function readFromConfigFile(key){
        const credentials = readConfigFile();
        return credentials[key];
}

function readConfigFile(){
    try {
        const configFile = fs.readFileSync(CONFIG_PATH, 'utf8');
        const credentials = JSON.parse(configFile);
        return credentials;
    } catch (error) {
        return {};
    }
}

function saveConfig(credentials) {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(credentials));
    console.log(chalk.green('Credentials saved successfully.'));
}

export const saveGithubToken = ( githubToken) => {

    const existingData= readConfigFile();
    const configData = { ...existingData, GITHUB_TOKEN:githubToken };
    saveConfig(configData);
};
