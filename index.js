// requiring inquirer, fs, generateMarkdown, and api
const inquirer          = require("inquirer");
const fs                = require("fs");
const generateMarkdown  = require("./utils/generateMarkdown");
const api               = require("./utils/api");

// licenses
const apache = "Licensed under the [Apache License](https://spdx.org/licenses/Apache-2.0.html).";
const gnu    = "Licensed under the [GNU GPLv3 License](https://spdx.org/licenses/GPL-3.0-or-later.html).";
const mit    = "Licensed under the [MIT License](https://spdx.org/licenses/MIT.html).";
const isc    = "Licensed under the [ISC License](https://spdx.org/licenses/ISC.html).";

// contributors
const yesContributors = "If you would like to contribute to this project, please follow the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/0/code_of_conduct/) guidelines."
const noContributors  = "This project is currently not accepting any contributions."


// github question for inquirer to ask
const gitHubQuestion = [
    {
        type: "input",
        name: "username",
        message: "What is your GitHub username?"
    }
];


// project questions for inquirer to ask
const questions = [
    {
        type: "input",
        name: "title",
        message: "What is the name of your project?"
    },
    {
        type: "input",
        name: "description",
        message:  "Please provide a brief description of your project."
    },
    {
        type: "input",
        name: "installation",
        message:  "What do you need to install in order for your application to work?"
    },
    {
        type: "input",
        name: "usage",
        message:  "How do you use your application?"
    },
    {
        type: "input",
        name: "tests",
        message:  "How would you run tests on this project?"
    },
    {
        type: "list",
        name: "license",
        message: "What type of license would you like?",
        choices: [
            "Apache License 2.0",
            "GNU GPLv3",
            "MIT",
            "ISC",
            "None"
        ]
    },
    {
        type: "list",
        name: "contributors",
        message: "Would you like other developers to contribute to your project?",
        choices: [
            "Yes",
            "No"
        ]
    }
];


// async function to combine all data from the inquirer prompts
async function combinedData() {
    try {

        // ask user for their github username
        await inquirer.prompt(gitHubQuestion).then(function(response){
            return username = response.username;
        });

        // use username from above to make an axios call to get user's image and email
        await api.getUser(username);

        // ask user about their project
        await inquirer.prompt(questions).then(function(response){
            return responses = response;
        });

        // add username, gitHubImage, and gitHubEmail as objects into the responses object
        responses.username = username;
        responses.image = gitHubImage;
        responses.email = gitHubEmail;

        // check for which license the user picked
        if(responses.license === "Apache License 2.0"){
            responses.license = apache;
        } else if(responses.license === "GNU GPLv3"){
            responses.license = gnu;
        } else if(responses.license === "MIT"){
            responses.license = mit;
        } else if(responses.license === "ISC"){
            responses.license = isc;
        } else {
            responses.license = "This project is currently not licensed."
        }

        // check to see if user wants contributors
        if(responses.contributors === "Yes"){
            responses.contributors = yesContributors;
        } else {
            responses.contributors = noContributors;
        }

        // write data to readme using generateMarkdown
        writeToFile("readmeGenerated.md", generateMarkdown(responses));

    } catch (err){
        console.log(err);
    }
}

// call combinedData function when you run node index.js
combinedData();


// =================== PROVIDED FUNCTIONS ======================

function writeToFile(fileName, data) {
    fs.writeFile(fileName, data, function(err){
        if(err){
            console.log(err);
        }
            console.log("Data entered!");
    });
}