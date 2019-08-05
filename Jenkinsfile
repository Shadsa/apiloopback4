#!/usr/bin/env groovy
import groovy.json.JsonOutput
import java.text.SimpleDateFormat

stack_name = "mmw-data"
service_name = "api"
registry_url = "https://nexus.innovation-factory.io"

pipeline {

	agent any

    options {
	    disableConcurrentBuilds()
        lock("MapMyWorld API Jenkins Build")

    }

	environment {
        releaseVersion = ""
    }
    stages {
    	stage("Ckeckout") {
    		steps {
    			checkout scm
	    		script {
                    // sh("printenv")
                    switch(env.GIT_BRANCH) {
                        // if commit on develop
                        case "develop": releaseVersion = "latest-dev"; break;
                        
                        // if commit on master : new release
                        case "master": releaseVersion = "${env.TAG_NAME}"; break;

                        // else, just latest
                        default: releaseVersion = "latest";
                    }
                    echo "Current version : ${releaseVersion}"
	    		}
    		}
    	}

        stage("Docker build") {
            steps {
                script {
                    dockerImage = docker.build("${stack_name}/${service_name}", "./lbcore")
                }
            }
        }

        stage("Postman Report") {
            steps {
                script {
                    sh("./postman/newman.sh")
                }
                publishHTML (
                    target: [
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: "target",
                        reportFiles: "postman-report.html",
                        reportName: "Postman report"
                    ])
            }
        }

        // stage("Owasp build") {
        //     steps {
        //         script {
        //             sh("docker-compose -f docker-compose.owasp.yml down")
        //             sh("docker-compose -f docker-compose.owasp.yml build")
        //             sh("docker-compose -f docker-compose.owasp.yml pull")
        //             sh("docker-compose -f docker-compose.owasp.yml up --force-recreate")
        //             sh("docker-compose -f docker-compose.owasp.yml down")
        //         }
        //         publishHTML (target: [
        //             allowMissing: false,
        //             alwaysLinkToLastBuild: true,
        //             keepAll: true,
        //             reportDir: "target",
        //             reportFiles: "zapreport.html",
        //             reportName: "Owasp Zap report"
        //         ])
        //     }
        // }

        // stage("Doxygen generation") {
        //     steps {
        //         script {
        //             sh("docker run --rm -v ${env.WORKSPACE}:/app -v ${env.WORKSPACE}/target:/tmp/doxygen corentinaltepe/doxygen:latest doxygen lbcore/doxygenfile")
        //         }
        //         publishHTML (
        //             target: [
        //                 allowMissing: false,
        //                 alwaysLinkToLastBuild: true,
        //                 keepAll: true,
        //                 reportDir: "target/doxygen/html",
        //                 reportFiles: "index.html",
        //                 reportName: "Doxygen"
        //             ])
        //     }
        // }

        stage("SonarQube analysis") {
            environment {
                scannerHome = tool "SonarQubeScanner"
            }
            steps {
                withSonarQubeEnv("SonarQube") {
                    sh("${scannerHome}/bin/sonar-scanner -Dsonar.projectVersion=${releaseVersion}")
                }
                // timeout(time: 2, unit: "MINUTES") {
                //     waitForQualityGate abortPipeline: false
                // }
            }
        }

        stage("Publish to registry") {
            when {
                expression { 
                    return env.GIT_BRANCH == "master" || env.GIT_BRANCH == "develop";
                }
            }
        	steps {
        		script {
        			docker.withRegistry("${registry_url}", "NexusJenkins") {
                        dockerImage.push "${releaseVersion}"
                    }
        		}
        	}
        }
    }
}
