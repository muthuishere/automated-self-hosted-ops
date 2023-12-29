import {runShellCommand} from "./PlaybookHelper.js";
import {expect} from "chai";
import {Playbook} from "./Playbook.js";

export async function assertCommandSucceeds(hostname, command) {


    let playbook = new Playbook('Operations on a remote machine', hostname);

    playbook.addShellTask('a sample test', command);

    await assertPlaybookSucceeds(playbook)

}

export async function assertCommandThrowsError(hostname, command) {


    let playbook = new Playbook('Operations on a remote machine', hostname);

    playbook.addShellTask('a sample test', command);

    await assertPlaybookThrowsError(playbook)


}

export async function assertPlaybookSucceeds(playbook) {

    const response  = await playbook.run()
    expect(response.results).not.to.be.null;
    expect(response.hasExitedNormally()).to.be.true;

}


export async function assertPlaybookThrowsError(playbook) {


    try {
        await playbook.run()
        fail("Should not reach here")
    }catch (e) {
        console.log(e.toString());

        expect(e.toString()).not.to.be.null;

    }
}