import {Playbook} from "./Playbook.js";
import {runPlayBookFile} from "./PlaybookRunner.js";
import {getRandomtempYamlFileName} from "../shared/files.js";
import {expect} from "chai";
import {addExecuteRemoteScriptAtHomeTask, addExecuteRemoteScriptTask} from "./shell/scriptOps.js";
describe('Ansible Generator tests', function () {

    const hostname = process.env.ANSIBLE_HOST_NAME;
    it('Should able to execute List files in home directory', async function () {
        let playbook = new Playbook('Operations on a remote machine', hostname);

        playbook.addTask('List files in the home directory', 'ansible.builtin.shell', {cmd: 'ls ~/'});
        console.log(playbook);
        // Get the YAML string
// Get the YAML string
        let filename = playbook.exportYaml(getRandomtempYamlFileName());
        console.log(filename);
        const response = await runPlayBookFile(filename);

        console.log(response);

    });

    it('Should able to execute a remote command', async function () {
        let playbook = new Playbook('Operations on a remote machine', hostname);

        playbook.addExecuteCommandTask("npm install -g nginx-domain-assist")

        playbook.addShellTask('List All Nginx site', 'list-all-nginx-sites');


        const response = await playbook.run()

        console.log(response.results);
        expect(response.results).not.to.be.null;
        expect(response.hasAnyOutput()).to.be.true;
        //

    });
    it('Should able to execute a remote script execution', async function () {
        let playbook = new Playbook('Operations on a remote machine', hostname);


        playbook.addShellTask('List All Nginx site', 'list-all-nginx-sites');
        addExecuteRemoteScriptAtHomeTask(playbook, '/test/ar.sh', true);
        // playbook.exportYaml(getRandomtempYamlFileName());

        const response = await playbook.run()

        console.log(response.results);
        expect(response.results).not.to.be.null;
        expect(response.hasAnyOutput()).to.be.true;
        //

    });


    it('Should able to fail , when execute a remote command', async function () {
        let playbook = new Playbook('Operations on a remote machine', hostname);

        playbook.addShellTask('List All Nginx site', 'listl-nginx-sites');

        try {
         await playbook.run()
            fail("Should not reach here")
        }catch (e) {
            console.log(e.toString());
            console.log(e);
        }


        // console.log(response.result);
        // expect(response.result).not.to.be.null;
        // expect(response.hasAnyError()).to.be.true;
        // //

    });

});


