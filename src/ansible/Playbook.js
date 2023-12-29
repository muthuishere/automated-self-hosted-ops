import * as yaml from 'js-yaml';
import * as path     from "path";
import * as fs       from "fs";
import os from "os";
import { v4 as uuidv4 } from 'uuid';
import {runPlayBook} from "./PlaybookRunner.js";
export class Playbook {


    constructor(name, hosts) {
        this.yamlFile = '';
        this.playbookDefinition = [{
            name: name,
            hosts: hosts,
            gather_facts:'yes',
            vars: {},
            tasks: []
        }];
    }

    addVariable(varName, value) {
        this.playbookDefinition[0].vars[varName] = value;
    }



    addTask(name, module, options) {
        this.playbookDefinition[0].tasks.push({
            name: name,
            [module]: options
        });
    }
    addDirectTask(task) {
        this.playbookDefinition[0].tasks.push(task);
    }

    addShellTask(name, command, args = {},isSudo = false) {
        const task = {
            name: name,
            become: isSudo,
            'ansible.builtin.shell':  command,
            args: args
        };

        this.addDirectTask(task);
    }

    addUploadFolderTask(localPath, remotePath) {
        this.addTask('Remove remote directory if exists', 'ansible.builtin.file', {
            path: remotePath,
            state: 'absent'
        });

        this.addTask('Upload Folder to remote', 'ansible.builtin.copy', {
            src: localPath,
            dest: remotePath,
            mode: '0755'
        });

        this.addTask('Find all .sh files in the assets directory', 'ansible.builtin.find', {
            paths: remotePath,
            patterns: "*.sh",
            register: 'sh_files'
        });

        this.addTask('Make all .sh files executable', 'ansible.builtin.file', {
            path: "{{ item.path }}",
            mode: 'u+x',
            loop: "{{ sh_files.files }}",
            become: 'yes'
        });
    }

    // addExecuteCommandTask(scriptText, isSudo = false) {
    //     // Create a temporary file for the script
    //     const tempScriptPath = path.join(os.tmpdir(), `${uuidv4()}.sh`);
    //     fs.writeFileSync(tempScriptPath, scriptText, 'utf8');
    //
    //     // Use executeLocalScript to execute the script
    //     this.addExecuteLocalScriptTask(tempScriptPath, isSudo);
    //
    //
    // }
    addExecuteCommandTask(scriptText, isSudo = false) {

        this.addShellTask(
            `Execute the command ${scriptText}` + (isSudo ? ' as sudo' : ''),
            scriptText,
            {},isSudo);



    }
    addExecuteLocalScriptTask(localScriptPath, isSudo = false) {
        const remoteScriptName = path.basename(localScriptPath);
        const remoteScriptPath = `{{ ansible_env.HOME }}/${remoteScriptName}`;

        // Remove the script if it already exists on the remote machine
        this.addTask(`Remove existing script ${remoteScriptName} if it exists`, 'ansible.builtin.file', {
            path: remoteScriptPath,
            state: 'absent'
        });

        // Upload the script to the remote machine
        this.addTask(`Upload script ${remoteScriptName}`, 'ansible.builtin.copy', {
            src: localScriptPath,
            dest: remoteScriptPath,
            mode: '0777'
        });

        this.addShellTask(
            `Execute the script ${remoteScriptName}` + (isSudo ? ' as sudo' : ''),
            "./" + remoteScriptName,
            {
                chdir: "{{ ansible_env.HOME }}"

            },isSudo);



        // Delete the script after execution
        this.addTask(`Delete script ${remoteScriptName} after execution`, 'ansible.builtin.file', {
            path: remoteScriptPath,
            state: 'absent'
        });
    }
    addCreateFolderTask(folderPath, mode = '0755') {
        this.addTask(`Create folder ${folderPath}`, 'ansible.builtin.file', {
            path: folderPath,
            state: 'directory',
            mode: mode
        });
    }

    addRemoveFolderTask(folderPath) {
        this.addTask(`Remove folder ${folderPath}`, 'ansible.builtin.file', {
            path: folderPath,
            state: 'absent'
        });
    }

    removeFile(filePath) {
        this.addTask(`Remove file ${filePath}`, 'ansible.builtin.file', {
            path: filePath,
            state: 'absent'
        });
    }

    createFile(filePath, mode = '0644', content = '') {
        this.addTask(`Create file ${filePath}`, 'ansible.builtin.copy', {
            dest: filePath,
            content: content,
            mode: mode
        });
    }

    getYAML() {
        return yaml.dump(this.playbookDefinition);
    }
    exportYaml(filePath) {
        const yamlStr = this.getYAML();
        console.log(yamlStr);
        fs.writeFileSync(filePath, yamlStr, 'utf8');
        this.yamlFile = filePath;
        return path.resolve(filePath);
    }
    /*
    * Run the playbook
    * params:
    * @returns {Promise<PlaybookResult>}
     */
    run(){
        return runPlayBook(this)
    }
}


