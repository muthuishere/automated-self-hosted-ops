import {Playbook} from "./Playbook.js";

export async function runShellCommand(hostname, command) {
    let playbook = new Playbook('Operations on a remote machine', hostname);

    playbook.addShellTask('a sample test', command);

   return playbook.run()

}