
import { expect } from 'chai';
import * as fs from "fs";
import {getProjectRootFolder} from "../shared/files.js";
import {processAnsibleOutput} from "./PlaybookRunner.js";
describe('Playbook Runner Tests', () => {

    it('should run a playbook', () => {


        const filename= getProjectRootFolder()+'/assets/output.txt'
        console.log(filename)
        //read a file output.txt and split it into lines
        const outputLines = fs.readFileSync(filename).toString().split('\n');
        console.log(outputLines);
        const response = processAnsibleOutput(outputLines);
        console.log(response);


    });
});