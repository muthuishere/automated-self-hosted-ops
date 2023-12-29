
import * as fs   from "fs";
import * as ejs from "ejs";
import { fileURLToPath } from 'url';
import path from "path";



function renderTemplateFrom({filename, appName, domain, containerPort, nodePort, registryUrl, registryPullSecret}) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    const templateFile = path.join(__dirname, '../templates/' + filename + '.ejs');
    const deployFile = path.join(__dirname, '../dist', appName, filename);
    const template = fs.readFileSync(templateFile, 'utf8');
    const deployedRender = ejs.render(template, {
        appName,
        domain,
        containerPort,
        nodePort,
        registryUrl,
        registryPullSecret
    });

    fs.writeFileSync(deployFile, deployedRender);
    return deployedRender;
}

export function generateDockerComposeConfig({ name, domain, remotehost, serverFolder, dockercomposefile}) {

    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const deliveryFolder = path.join(__dirname,'../dist', name );
    if(fs.existsSync(deliveryFolder)){
        fs.rmdirSync(deliveryFolder, { recursive: true })
    }
    fs.mkdirSync(deliveryFolder, { recursive: true })
    let filename = 'app-deployment.yaml';

     renderTemplateFrom({filename, appName, domain, containerPort, nodePort, registryUrl, registryPullSecret});


   }
