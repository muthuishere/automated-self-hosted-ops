import {Playbook} from "../Playbook.js";


export function  createInstaller(ansibleHostname,{dockerComposeFile, domainName}){


    const docker_compose_remote_path = '/tmp/dockercompose'

    const    ansiblePlaybook = new Playbook('Install a Domain Based on Docker Compose', ansibleHostname);
    ansiblePlaybook.addExecuteCommandTask("npm install -g nginx-domain-assist")
    ansiblePlaybook.addUploadFolderTask(dockerComposeFile, '/tmp/dockercompose')
    return ansiblePlaybook

}

export function  createUnInstaller(ansibleHostname){


    const    ansiblePlaybook = new Playbook('UnInstall Nginx Domain Assist', ansibleHostname);
    ansiblePlaybook.addExecuteCommandTask("npm uninstall -g nginx-domain-assist")
    return ansiblePlaybook

}