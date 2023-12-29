
import { expect } from 'chai';
import  * as portforwarder from './portforwarder.js';
import fs from "fs";
describe('PortForwarder Test', () => {
    const  hostname = process.env.ANSIBLE_HOST_NAME;
    it('should generate akubernetes admin dashboard files accordingly', async () => {

        //kubeconfig,remoteport,localport,user_at_host

        let kubeconfig = process.env.KUBECONFIG;
        let remoteport = 8443;
        let localport = 8443;
        let user_at_host = process.env.SSH_USER_AT_HOST
       const results= await portforwarder.generateKubernetesDashboardForward(hostname,{kubeconfig,remoteport,localport,user_at_host})

        console.log(results);
        expect(results).to.be.not.null;
        expect(results.startScripts).to.be.not.null;
        expect(results.stopScripts).to.be.not.null;
        expect(results.startScripts.scriptPath).to.be.not.null;

        expect(fs.existsSync(results.startScripts.scriptPath)).to.be.true;
        expect(fs.existsSync(results.startScripts.deploymentFilePath)).to.be.true;
        expect(fs.existsSync(results.stopScripts.scriptPath)).to.be.true;
        expect(fs.existsSync(results.stopScripts.deploymentFilePath)).to.be.true;


    });
});