import path from "path";

export function addExecuteRemoteScriptTask(playbook ,scriptPath, isSudo = false) {
    const scriptDir = path.dirname(scriptPath);
    const fileName = path.basename(scriptPath);
    console.log("scriptDir" + scriptDir);
    console.log("fileName" + fileName);



    playbook.addShellTask(
        `Execute the script ${path.basename(scriptPath)}` + (isSudo ? ' as sudo' : ''),
         "./" + fileName,
        {
            chdir: scriptDir,

        },isSudo);
    return playbook;


}
export function addExecuteRemoteScriptAtHomeTask(playbook ,scriptPath, isSudo = false) {
    const scriptDir = path.dirname(scriptPath);
    const fileName = path.basename(scriptPath);
    console.log("scriptDir" + scriptDir);
    console.log("fileName" + fileName);



    playbook.addShellTask(
        `Execute the script ${path.basename(scriptPath)}` + (isSudo ? ' as sudo' : ''),
         "./" + fileName,
        {
            chdir: '{{ ansible_env.HOME }}' + scriptDir,

        },isSudo);
    return playbook;


}