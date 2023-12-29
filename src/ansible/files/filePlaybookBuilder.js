import path from "path";
export function addUploadToHomeFolderTask(playbook,localPath, remotePath) {
    let homeRelativeRemotePath = "{{ ansible_env.HOME }}/" + remotePath;

    playbook.addTask('Remove remote directory if exists', 'ansible.builtin.file', {
        path: homeRelativeRemotePath,
        state: 'absent'
    });
    playbook.addTask('Create remote directory', 'ansible.builtin.file', {
        path: homeRelativeRemotePath,
        state: 'directory',
        mode: '0755'
    });


    playbook.addTask('Upload Folder to remote', 'ansible.builtin.copy', {
        src: localPath,
        dest: homeRelativeRemotePath,
        mode: '0755'
    });

    let task = {
        name: 'Find all .sh files in the uploaded directory',
        become: true,
        'ansible.builtin.find':  {
            paths: homeRelativeRemotePath,
            patterns: "*.sh",

        },
        register: 'sh_files'

    };

    playbook.addDirectTask(task);

    // playbook.addTask('Find all .sh files in the uploaded directory', 'ansible.builtin.find', {
    //     paths: homeRelativeRemotePath,
    //     patterns: "*.sh",
    //     register: 'sh_files'
    // });


    task = {
        name: 'Make all .sh files executable',
        become: true,
        'ansible.builtin.file':  {
            path: "{{ item.path }}",
            mode: 'u+x',

        },
        loop: "{{ sh_files.files }}",

    };

    playbook.addDirectTask(task);

    // playbook.addTask('Make all .sh files executable', 'ansible.builtin.file', {
    //     path: "{{ item.path }}",
    //     mode: 'u+x',
    //     loop: "{{ sh_files.files }}",
    //     become: 'yes'
    // });
}