import path from "path";
import {cleanAndCreateFolder, getDeliveryFolderName} from "../shared/files.js";

import dotenv from 'dotenv';
import fs from "fs";

import {promises as fsPromise} from 'fs';
import {runProcess} from "../shared/system_processor.js";

dotenv.config();

export function getDeliveryFile(appName, filename) {
    const deliveryFolder = getDeliveryFolderNameForKubeSites(appName);
    const deployFile = path.join(deliveryFolder, filename);
    return deployFile;
}
export function getDeliveryFolderNameForKubeSites(appName) {

    const deliveryFolder = path.join(getDeliveryFolderName(appName), "k8s");

    return deliveryFolder;
}
export function getDeliveryFolderNameForAnsibleScripts(appName) {
    const deliveryFolder = path.join(getDeliveryFolderName(appName),"ansible");


    return deliveryFolder;
}

export function createDeploymentFolders(appName) {
    cleanAndCreateFolder(getDeliveryFolderNameForKubeSites(appName));
    cleanAndCreateFolder(getDeliveryFolderNameForAnsibleScripts(appName));
}

export function getRelativePath(baseFolder, targetFolder) {
    return path.relative(baseFolder, targetFolder);
}
export function saveKubeSitesYamlFile(appName, filename, deployedRender) {
    const deliveryFolder = getDeliveryFolderNameForKubeSites(appName);
    const deployFile = path.join(deliveryFolder, filename);
    // const deployFile = getDeliveryFile(appName, filename);
    fs.writeFileSync(deployFile, deployedRender);
    return deployFile;
}
export function saveAnsibleYamlFile(appName, filename, deployedRender) {
    const deliveryFolder = getDeliveryFolderNameForAnsibleScripts(appName);
    const deployFile = path.join(deliveryFolder, filename);
    // const deployFile = getDeliveryFile(appName, filename);
    fs.writeFileSync(deployFile, deployedRender);
    return deployFile;
}

