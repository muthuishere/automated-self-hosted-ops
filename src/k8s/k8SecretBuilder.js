//TODO , generate Secret file and move to delivery folder
// {{appname.secret}}
import path from "path";
import {getDeliveryFolderNameForKubeSites} from "./files.js";
import yaml from 'js-yaml';
import {Playbook} from "../ansible/Playbook.js";
import fs    from "fs";
import dotenv from 'dotenv';

dotenv.config();
export function generateSecretFile({envFile, appName,hostname}) {



    let filename = 'secrets.yaml';
    //TODO , Work on creating secrets file

    const secretFilePath = path.join(getDeliveryFolderNameForKubeSites(appName), filename);
    const secretGroupName = `apps.${appName}`;


    const envConfig = dotenv.parse(fs.readFileSync(envFile));
    const secretData = Object.entries(envConfig).reduce((acc, [key, value]) => {
        acc[key] = Buffer.from(value).toString('base64');
        return acc;
    }, {});

    const k8sSecret = {
        apiVersion: 'v1',
        kind: 'Secret',
        metadata: {
            name: secretGroupName
        },
        type: 'Opaque',
        data: secretData
    };

    fs.writeFileSync(secretFilePath, yaml.dump(k8sSecret));

    console.log("secretFilePath",secretFilePath);
    const data = getSecretKeysAndName(yaml.dump(k8sSecret));
    return {secretFilePath,...data};

}

function getSecretKeysAndName(yamlStr) {
    // Parse the YAML string
    const doc = yaml.load(yamlStr);

    // Check if the document is a valid Secret and has data
    if (doc && doc.kind === 'Secret' && doc.metadata && doc.metadata.name && doc.data) {
        return {
            name: doc.metadata.name,
            keys: Object.keys(doc.data)
        };
    } else {
        throw new Error('Invalid Kubernetes Secret YAML');
    }
}

export function addSecretToDeployment(deploymentYamlStr, secret) {
    try {
        // Read and parse the deployment YAML file

        const deployment = yaml.load(deploymentYamlStr);

        // Ensure the deployment and its container spec exists
        if (!deployment || !deployment.spec || !deployment.spec.template || !deployment.spec.template.spec || !deployment.spec.template.spec.containers) {
            throw new Error('Invalid Kubernetes Deployment YAML');
        }

        // Loop through each container and add environment variables from the secret
        deployment.spec.template.spec.containers.forEach(container => {
            if (!container.env) {
                container.env = [];
            }
            secret.keys.forEach(key => {
                container.env.push({
                    name: key,
                    valueFrom: {
                        secretKeyRef: {
                            name: secret.name,
                            key
                        }
                    }
                });
            });
        });

        return yaml.dump(deployment);
    }catch (err) {
        console.error(err);
        return deploymentYamlStr;
    }
}
