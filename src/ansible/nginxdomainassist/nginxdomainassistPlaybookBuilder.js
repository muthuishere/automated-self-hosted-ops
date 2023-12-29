import {Playbook} from "../Playbook.js";


export function  createInstaller(ansibleHostname){


    const    ansiblePlaybook = new Playbook('Install Nginx Domain Assist', ansibleHostname);
    ansiblePlaybook.addExecuteCommandTask("npm install -g nginx-domain-assist")
    return ansiblePlaybook

}

export function  createUnInstaller(ansibleHostname){


    const    ansiblePlaybook = new Playbook('UnInstall Nginx Domain Assist', ansibleHostname);
    ansiblePlaybook.addExecuteCommandTask("npm uninstall -g nginx-domain-assist")
    return ansiblePlaybook

}


export function addEnsureSiteExistsTask(playbook, siteName){
    playbook.addShellTask(`verify ${siteName} exists in nginx`, `list-all-nginx-sites | grep -q "${siteName}" || { echo "Error: Site not found"; exit 1; }`);

}

export function addEnsureSiteDoesNotExistsTask(playbook,siteName){




    const task = {
        name: `verify ${siteName} does not exists in nginx`,
        become: true,
        'ansible.builtin.shell':  `list-all-nginx-sites | grep -q "${siteName}"`,
        register: 'shell_result',
        failed_when: 'shell_result.rc == 0'


    };

    playbook.addDirectTask(task);

   // playbook.addShellTask(`verify ${siteName} does not exists in nginx`, `list-all-nginx-sites | grep -q "${siteName}" && { echo "Error: Site found"; exit 1; }` );
}