# API mmw-data

## Introduction

This API is designed to hold and parse any data applications will eventually need. At the moment, it's mainly centered around Lands feature. It also handles the authentication of a user, using the LDAP of innofactory (JWT token handling). 
The API provides all REST functions for a given controller (At the moment, Lands). 

## prerequisites

* [Nodejs LTS](https://nodejs.org/en/)
* Docker daemon UP /!\ (For script) or a MongoDB (Command-line)
* Read a bit about Loopback-next (or Loopback-4, it's the same), in order to have an idea of what each component does, and how the project is structured. 

## Project organization

* build folder : contains only scripts that are used for deployment, both dev and production. Should also contain any futur script used for metrics, or Quality of Life.
* data folder : contains all the data used at any time by the application, including raw ones that are treated and combined in the CombinedData script.
* lbcore : It's the Loopback application itself. For more detail, please refer to the Loopback documentation.
* postman : Postman configuration to test the API. Not up-to-date currently.

## Getting started

WARNING : If you are less the bash-guy type or not eased with, you should skip this part and go straight to the script part.

Moreover, you have to have a running MongoDB on the standard port before running these commands. You also have to fill the MongoDB at the first launch with all the data contained in FinalData.json in `/data`.

```bash
$ git clone https://git.innovation-factory.io/innovative-projects/mmw-api.git
$ cd mmw-api/lbcore
$ npm install

# Make sure Mongo is up & running
# By default, the API will try to contact the database admin:admin@127.0.0.1/mmwdb

$ npm start
```

## A pretty script

### PowerShell

A script has been developed for Windows developers.
See it, run it, enjoy it : [dev-env.ps1](build/scripts/dev-env.ps1)
Once the script is run once, you can kill it and just re-run the `npm start` command in the `lbcore` folder.

### Linux/Unix (not up-to-date)

[dev-env.sh](build/scripts/dev-env.sh)
After cloning the repository : `build/scripts/dev-env.sh` ; it is required to :
* Make sure that no mongo is currently running or exists
* Run a clean mongo instance
* Insert the JSON dump in it
* execute `npm install`

At this point, you can : `npm start`


## Datamodel choices of implementation

Documentation about the data model can be found in the following folder : [`/data`](data/Readme.md)

## Perform tests

From the root of `lbcore` folder, execute the `npm run lint:fix` command.
Then, tests are performed thanks to the  `npm run test` command.


## Useful links

* Jenkins : https://jenkins.innovation-factory.io/job/mmw-api/

## Hint and tips

* If you're facing test or build error with the npm command (or from the script, it's the same command wich is run), try the `npm run lint:fix` command. If it's still not working, try to update the project with `npm update --save`, and check if the problem is solve with `npm run build`.

# Git Workflow 

When a developer wants to implement a new feature, he has to : 
1. Create a new branch from the `develop` branch, named as `feature/<name of the new feature>`
 
For example, if your branch represents a feature that aims to improve code coverage :
```cmd
$ git checkout -b "feature/coverage" origin/develop
```
2. To save your work, you have to commit and then push it on your branch.
```cmd
$ git add <files>
$ git commit -m "<the changes i have done>"
$ git push origin/<my branch>
```

If the remote reference of your new branch doesn't exist, you can set the upstream
```cmd
$ git push -u origin <my_branch>
```

3. **Don't forget to regularly update your branch with `git pull`**
If you have any conflict, it's *your* job to deal with it locally before submitting a Merge Request.
```cmd
$ git pull origin develop
```

4. When you think the developement is over, you need to do a *Merge Mequest* with the `develop` branch. In order to do that, open GitLab, go to **Branches** tab and click the **Merge request** button on your branch line.

**Careful !** Make sure to be up to date with the `develop` branch BEFORE submitting a Merge Request. It's your job to keep things clean. If in doubt, RTFM and/or contact your fellow integrator(s) !

![](https://i.imgur.com/XyMmKvx.png)

It will open a new page where you should add a description of the new feature in order to be understand by the integrator(s). You ***need*** to make sure that the target branch is `develop`, and that the *remove source branch* is checked.

![](https://i.imgur.com/P8JWfyn.png)

The integrators will look at it and accept it (or not), so the new feature will be available for everyone.

The code submitted to be merged with `develop` must comply with the standards required by integrators, this allows them to set up a prettier and more effective continuous integration.
