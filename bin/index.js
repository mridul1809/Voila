#! /usr/bin/env node

const inquirer = require('inquirer');
const values = require('../lib/values');
const fs = require('fs');
const { exec } = require('child_process');

const questions = [
    { type: 'input', name: 'title', message: 'Choose project title' },
    { type: 'input', name: 'description', message: 'Enter project discription' },
    { type: 'list', name: 'css', message: 'Choose css', choices: values.css },
    { type: 'input', name: 'entry', message: 'Entry point', default: 'index.html' },
    { type: 'input', name: 'author', message: 'Author', default: '' },
    { type: 'input', name: 'License', message: 'License', default: 'ISC' },
    { type: 'confirm', name: 'git', message: 'Do you want it to be a git repo?', default: true },
    { type: 'checkbox', name: 'gitignore', message: 'Which files you want to be ignored by git', choices: values.gitignore }
];

const questions2 = [
    { type: 'confirm', name: 'final', message: 'Is this Okay?', default: true },
];

inquirer
    .prompt(questions)
    .then(async function (answers) {
        inquirer
	    .prompt(questions2)
	    .then(async function (answers2) {
            if (answers2.final === true) {
                var curr_dir = process.cwd();
                var dir = `${curr_dir}/${answers.title}`;
                /* Creating a directory */
                try {
                    fs.mkdirSync(dir);
                    console.log(`Created folder ${answers.title}. You can do cd ${answers.title} to view the files created.`)
                } catch (err) {
                    if (err.code !== 'EEXIST') throw err
                }
                /* Initialize a empty git repo */
                if (answers.git === true) {
                    await exec(`cd ${dir} && git init`, (err, stdout, stderr) => {
                        if (err) {
                          console.log('Could not create a empty git repo.')
                          return;
                        }
                        console.log(stdout);
                    });
                }
                /* Make empty css and js folders */
                try {
                    fs.mkdirSync(`${dir}/js`);
                    fs.mkdirSync(`${dir}/css`);
                } catch (err) {
                    if (err.code !== 'EEXIST') throw err
                }
                /* Make entry point file */
                fs.open(`${dir}/answers.entry`,'w', function(err, file) {
                    if (err) {
                        console.log('Error creating entry point');
                    } else {
                        console.log('File created successfully');
                    }
                });
            }
        })
        .catch((error) => {
            console.log(error);
        })
    })


