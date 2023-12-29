import {Playbook} from "./Playbook.js";
import yaml from "mocha/mocha.js";

export function loadFromYaml(yamlString) {
    const playbookData = yaml.load(yamlString);

    if (!Array.isArray(playbookData) || playbookData.length === 0) {
        throw new Error("Invalid YAML data: should be an array with at least one element.");
    }

    const firstPlaybook = playbookData[0];

    if (!firstPlaybook.name || !firstPlaybook.hosts) {
        throw new Error("Invalid playbook structure: missing 'name' or 'hosts'.");
    }

    const generator = new Playbook(firstPlaybook.name, firstPlaybook.hosts);

    if (firstPlaybook.vars) {
        Object.entries(firstPlaybook.vars).forEach(([key, value]) => {
            generator.addVariable(key, value);
        });
    }

    if (firstPlaybook.tasks) {
        firstPlaybook.tasks.forEach(task => {
            generator.addDirectTask(task);
        });
    }

    return generator;
}