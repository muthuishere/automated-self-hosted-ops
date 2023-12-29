import {
    getDeliveryFolderNameForAnsibleScripts,
    getDeliveryFolderNameForKubeSites,
    getRelativePath,  saveAnsibleYamlFile,
    saveKubeSitesYamlFile
} from "./files.js";
import path from "path";
import {addSecretToDeployment, generateSecretFile} from "./k8SecretBuilder.js";
import {Playbook} from "../ansible/Playbook.js";
import {addUploadToHomeFolderTask} from "../ansible/files/filePlaybookBuilder.js";
import {generateAnsibleRunner} from "../ansible/shared/helper.js";
import {getProjectRootFolder} from "../shared/files.js";
import fs from "fs";
import * as ejs from "ejs";
import {makeScriptsExecutable} from "../shared/system_processor.js";


function createK8sAppInstallScript(hostname,{appName,kubeconfig,nvmdir}) {
    let filename = 'install_and_start_playbook.yaml';
    const deployedRender = applyTemplateFrom({filename, hostname, appName,kubeconfig,nvmdir});
    const installPlaybookFile  = saveAnsibleYamlFile(appName, filename, deployedRender)
    generateAnsibleRunner(installPlaybookFile)
    return installPlaybookFile;
}

function createK8sAppUninstallScript(hostname,{appName,kubeconfig,nvmdir}) {
    let filename = 'stop_and_uninstall_playbook.yaml';
    const deployedRender = applyTemplateFrom({filename, hostname, appName,kubeconfig,nvmdir});
    const uninstallPlaybookFile  = saveAnsibleYamlFile(appName, filename, deployedRender)
    generateAnsibleRunner(uninstallPlaybookFile)
    return uninstallPlaybookFile;
}

function createK8sAppUpdateScript(hostname,{appName,kubeconfig,nvmdir}) {
    let filename = 'update_playbook.yaml';
    const deployedRender = applyTemplateFrom({filename, hostname, appName,kubeconfig,nvmdir});
    const updatePlaybookFile  = saveAnsibleYamlFile(appName, filename, deployedRender)
    generateAnsibleRunner(updatePlaybookFile)
    return updatePlaybookFile;

}
function createK8sAppRestartScript(hostname,{appName,kubeconfig,nvmdir}) {
    let filename = 'restart_playbook.yaml';
    const deployedRender = applyTemplateFrom({filename, hostname, appName,kubeconfig,nvmdir});
    const updatePlaybookFile  = saveAnsibleYamlFile(appName, filename, deployedRender)
    generateAnsibleRunner(updatePlaybookFile)
    return updatePlaybookFile;

}
export async function generateK8sAppManagementScripts(hostname, {appName,kubeconfig,nvmdir }) {
//  tasks:
//     - name: Upload File to remote
//       ansible.builtin.copy:
//         src: >-
//           <%= appDeploymentFile %>
//         dest: '{{ ansible_env.HOME }}/kubesites/<%= appName %>/app-deployment.yaml'
//         mode: '0755'
//     - name: Execute the Update script
//       become: yes
//       ansible.builtin.shell: ./update.sh
//       args:
//         chdir: '{{ ansible_env.HOME }}/kubesites/<%= appName %>'
//       environment:
//         KUBECONFIG: <%= kubeconfig %>
//         NVM_DIR: <%= nvmdir %>
    const ansibleFolder = getDeliveryFolderNameForAnsibleScripts(appName);
await    makeScriptsExecutable(ansibleFolder);

    let installPlaybook = createK8sAppInstallScript(hostname,{appName,kubeconfig,nvmdir} );
    let uninstallPlaybook = createK8sAppUninstallScript(hostname,{appName,kubeconfig,nvmdir} );
    let updatePlaybook = createK8sAppUpdateScript(hostname,{appName,kubeconfig,nvmdir} );
    let restartPlaybook = createK8sAppRestartScript(hostname,{appName,kubeconfig,nvmdir} );
    return {installPlaybook,uninstallPlaybook,updatePlaybook,restartPlaybook};
}

function getTemplateFile(filename) {

    return path.join(getProjectRootFolder(), 'templates', 'kubernetes/ansible/' + filename );
}

function applyTemplateFrom({hostname,filename, appName,kubeconfig,nvmdir}) {

    const k8sfolderWithSlash  = getDeliveryFolderNameForKubeSites(appName) + "/";
    const appDeploymentFile  = getDeliveryFolderNameForKubeSites(appName) + "/app-deployment.yaml";

    const templateFile = getTemplateFile(filename);
///

    const template = fs.readFileSync(templateFile, 'utf8');
    const deployedRender = ejs.render(template, {
        appName,
        hostname,
        k8sfolderWithSlash,
        kubeconfig,nvmdir,
        appDeploymentFile

    });
    return deployedRender;
}