pipeline {
    agent {
        dockerfile {
            filename 'Dockerfile'
            dir './ci_cd'
            args '-v /storage:/storage'
        }
    }
    environment {
        GITHUB_CREDENTIALS = credentials('github')
    }
    options {
        buildDiscarder logRotator(artifactDaysToKeepStr: '10', artifactNumToKeepStr: '', daysToKeepStr: '5', numToKeepStr: '3')
    }
    stages {
        stage('Dependencies') {
            steps {
                sh(script: "npm install", label: "Npm install")
            }
        }
        stage('Tests') {
            steps {
                sh(script: "./.devcontainer/tools/xvfb-init.sh start", label: "Launch Angular  - Karma Tests");
                sh(script: "npm run test", label: "Launch Angular  - Karma Tests");
                sh(script: "./.devcontainer/tools/xvfb-init.sh stop", label: "Launch Angular  - Karma Tests");   
            }
        }        
        stage('Build artifact') {
            steps{        
                sh(script: "npm run electron:windows", label: "Builder artifactory windows");

                dir("release") {
                    sh(script: "zip -qj workscreen_saver.zip *.exe", label: "Make a zip release");
                    sh(script: "zip -r workscreen_saver_unpacked.zip ./win-unpacked", label: "Make a zip unpackaged release");
                }
            }
        }
        stage('Upload Release'){
            when {
                branch 'master'
            }
            steps{        
                
                sh(script: "./ci_cd/release.sh", label: "Upload and make release");
            }
        }
    }
    post {
        success {
            archiveArtifacts artifacts: 'release/*.zip', fingerprint: true, onlyIfSuccessful: true
        }
    }
}
