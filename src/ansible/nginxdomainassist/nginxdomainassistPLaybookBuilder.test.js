import {
    addEnsureSiteDoesNotExistsTask,
    addEnsureSiteExistsTask,
    createInstaller,
    createUnInstaller

} from "./nginxdomainassistPlaybookBuilder.js";
import {runPlayBook} from "../PlaybookRunner.js";
import {Playbook} from "../Playbook.js";
import {runShellCommand} from "../PlaybookHelper.js";
import {expect} from "chai";
import {
    assertCommandSucceeds,
    assertCommandThrowsError,
    assertPlaybookSucceeds
} from "../playbookassertions.test.js";


describe('Should create Installer for nginx domain Assist', () => {

    const hostname = process.env.ANSIBLE_HOST_NAME;
    it('Installing nginx-domain-assist should make system to respond successfully for list-all-nginx-sites', async () => {

        const playbook = createInstaller(hostname)
        await playbook.run()

        await assertCommandSucceeds(hostname, 'list-all-nginx-sites')
    });


    it('addSiteExists Task For Known Site Should Not Interrupt Playbook Flow', async () => {
        const siteName = process.env.VALID_SUB_DOMAIN
        let playbook = new Playbook('verifySiteExists Operations on a remote machine', hostname);
        addEnsureSiteExistsTask(playbook, siteName)
        playbook.addExecuteCommandTask("ls")
        const response = await playbook.run()

        expect(response.results).not.to.be.null;
        console.log(response.results)
        expect(response.results.length).to.be.equal(2);
        expect(response.hasExitedNormally()).to.be.true;

    });

    it('addSiteExists Task For UnKnown Site Should Interrupt Playbook Flow', async () => {
        const siteName = process.env.INVALID_SUB_DOMAIN
        let playbook = new Playbook('verifySiteExists Operations on a remote machine', hostname);
        addEnsureSiteExistsTask(playbook, siteName)
        playbook.addExecuteCommandTask("ls")
        try {
            await playbook.run()
            fail("Should not reach here")
        } catch (e) {
            console.log(e.toString());
            expect(e.toString()).not.to.be.null;

        }


    });


    it('addEnsureSiteDoesNotExistsTask  For UnKnown Site Should Not Interrupt Playbook Flow', async () => {
        const siteName = process.env.INVALID_SUB_DOMAIN
        let playbook = new Playbook('verifySiteExists Operations on a remote machine', hostname);
        addEnsureSiteDoesNotExistsTask(playbook, siteName)
        playbook.addExecuteCommandTask("ls")
        const response = await playbook.run()

        expect(response.results).not.to.be.null;
        console.log(response.results)
        expect(response.results.length).to.be.equal(2);
        expect(response.hasExitedNormally()).to.be.true;

    });

    it('addEnsureSiteDoesNotExistsTask  For Known Site Should Interrupt Playbook Flow', async () => {
        const siteName = process.env.VALID_SUB_DOMAIN
        let playbook = new Playbook('verifySiteExists Operations on a remote machine', hostname);
        addEnsureSiteDoesNotExistsTask(playbook, siteName)
        playbook.addExecuteCommandTask("ls")
        try {
            await playbook.run()
            fail("Should not reach here")
        } catch (e) {
            console.log(e.toString());
            expect(e.toString()).not.to.be.null;

        }

    });


    it('UnInstalling nginx-domain-assist should make system to throw error for list-all-nginx-sites', async () => {

        const playbook = createUnInstaller(hostname)
        await playbook.run()

        await assertCommandThrowsError(hostname, 'list-all-nginx-sites')

    });
});