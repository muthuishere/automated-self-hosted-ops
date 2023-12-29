export class PlaybookResult {
    constructor(results) {

        this.results = results;
        console.log(results)
    }

    getResults() {
        return this.results;
    }
    taskOutputIncludes(taskName, expectedString) {
        const task = this.results.find(t => t.name === taskName);
        return task ? task.stdout.includes(expectedString) : false;
    }
    outputIncludes(expectedString) {
        const result = this.results.find(task => task.stdout.includes(expectedString));
        return result
    }
    hasAnyOutput() {

        const result = this.results.find(task => task.stderr && task.stdout.stderr().length > 0);

        return !(!!result)
    }
    hasExitedNormally() {

        const result = this.results.every(task => task.status === 'Success');

        return result
    }
    hasAnyError() {
        const result = this.results.find(task => task.stderr && task.stdout.stderr().length > 0);
        return result
    }
}