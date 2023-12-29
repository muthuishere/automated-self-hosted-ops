import {assert, expect} from "chai";


import {
    generateKubernetesYAML,

} from "./K8sConfigurationGenerator.js";
import path from "path";
import { fileURLToPath } from 'url';
import fs from "fs";
import {getProjectRootFolder} from "../shared/files.js";
import {getDeliveryFolderNameForAnsibleScripts, getDeliveryFolderNameForKubeSites} from "./files.js";

describe('Kubeconfig generator tests', function () {

    const hostname  = process.env.ANSIBLE_HOST_NAME;


    it('generateKubernetesYAML files', async function () {


        const testAppName = 'testapp';
        const testDomain = process.env.TEST_DOMAIN; // testapp.domain.com
        const testContainerPort = 2100;
        const testNodePort = 31000;
        const testRegistryUrl = process.env.CUSTOM_REGISTRY_IMAGE; // registry.some.com/testapp:latest
        const registryPullSecret=process.env.CUSTOM_REGISTRY_SECRET;
        const        envFile = getProjectRootFolder() + '/assets/.envprod';
        const kubeconfig = process.env.KUBECONFIG;
        const nvmdir = process.env.NVMDIR;



        // Path to the expected output file
        const installPlaybookFile = path.join(getDeliveryFolderNameForAnsibleScripts(testAppName), 'install_and_start_playbook.yaml');
        const appDeploymentFIle = path.join(getDeliveryFolderNameForKubeSites(testAppName), 'app-deployment.yaml');


      const {installPlaybook} =   await generateKubernetesYAML({ kubeconfig,nvmdir,hostname,envFile,appName: testAppName, domain: testDomain, containerPort: testContainerPort, nodePort: testNodePort, registryUrl: testRegistryUrl,registryPullSecret });

        expect(fs.existsSync(installPlaybook)).to.be.true;
        expect(fs.existsSync(appDeploymentFIle)).to.be.true;

    });

});