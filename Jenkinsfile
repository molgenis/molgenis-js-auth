pipeline {
    agent {
        kubernetes {
            label 'node-erbium'
        }
    }
    environment {
        REPOSITORY = 'molgenis/molgenis-js-armadillo'
        REPOSITORY_AUTH = 'molgenis/armadillo-auth'
        LOCAL_REPOSITORY_AUTH = "${LOCAL_REGISTRY}/molgenis/armadillo-auth"
        TIMESTAMP = sh(returnStdout: true, script: "date -u +'%F_%H-%M-%S'").trim()
        CHART_VERSION = '0.8.1'
        DOCKER_CONFIG="/root/.docker"
    }
    stages {
        stage('Prepare') {
            steps {
                script {
                    env.GIT_COMMIT = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
                }
                container('vault') {
                    script {
                        env.GITHUB_TOKEN = sh(script: 'vault read -field=value secret/ops/token/github', returnStdout: true)
                        env.CODECOV_TOKEN = sh(script: 'vault read -field=molgenis-js-armadillo secret/ops/token/codecov', returnStdout: true)
                        env.NEXUS_AUTH = sh(script: 'vault read -field=base64 secret/ops/account/nexus', returnStdout: true)
                        env.DOCKERHUB_AUTH = sh(script: 'vault read -field=value secret/gcc/token/dockerhub', returnStdout: true)
                        env.SONAR_TOKEN = sh(script: 'vault read -field=value secret/ops/token/sonar', returnStdout: true)
                    }
                }
                sh "git remote set-url origin https://${GITHUB_TOKEN}@github.com/${REPOSITORY}.git"
                sh "git fetch --tags"
                container(name: 'kaniko', shell: '/busybox/sh') {
                    sh "#!/busybox/sh\nmkdir -p ${DOCKER_CONFIG}"
                    sh "#!/busybox/sh\necho '{\"auths\": {\"registry.molgenis.org\": {\"auth\": \"${NEXUS_AUTH}\"}}}' > ${DOCKER_CONFIG}/config.json"
                }
            }
        }
        stage('Install and test: [ pull request ]') {
            when {
                changeRequest()
            }
            steps {
                container('node') {
                    sh "git fetch --no-tags origin ${CHANGE_TARGET}:refs/remotes/origin/${CHANGE_TARGET}" // For lerna
                    sh "npm install"
                    sh "npx lerna bootstrap"
                    sh "npx lerna run unit"
                }
                container('sonar') {
                    // Fetch the target branch, sonar likes to take a look at it
                    sh "git fetch --no-tags origin ${CHANGE_TARGET}:refs/remotes/origin/${CHANGE_TARGET}"
                    sh "sonar-scanner -Dsonar.login=${env.SONAR_TOKEN} -Dsonar.github.oauth=${env.GITHUB_TOKEN} -Dsonar.pullrequest.base=${CHANGE_TARGET} -Dsonar.pullrequest.branch=${BRANCH_NAME} -Dsonar.pullrequest.key=${env.CHANGE_ID} -Dsonar.pullrequest.provider=GitHub -Dsonar.pullrequest.github.repository=molgenis/molgenis-js-armadillo"
                }
            }
            post {
                always {
                    container('node') {
                        sh "curl -s https://codecov.io/bash | bash -s - -c -F unit -K -C ${GIT_COMMIT}"
                    }
                }
            }
        }
        stage('Build container serving the artifacts [ PR ]') {
            when {
                changeRequest()
            }
            environment {
                TAG = "PR-${CHANGE_ID}"
            }
            steps {
                container('node') {
                    sh "npx lerna run build"
                }
                container (name: 'kaniko', shell: '/busybox/sh') {
                    sh "#!/busybox/sh\n/kaniko/executor --context ${WORKSPACE} --destination ${LOCAL_REPOSITORY_AUTH}:${TAG}"
                }
            }
        }
        stage('Install, test and build: [ main ]') {
            when {
                branch 'main'
            }
            steps {
                container('node') {
                    sh "npm install"
                    sh "npx lerna bootstrap"
                    sh "npx lerna run unit"
                    sh "npx lerna run build"
                }
                container('sonar') {
                    sh "sonar-scanner"
                }
            }
            post {
                always {
                    container('node') {
                        sh "curl -s https://codecov.io/bash | bash -s - -c -F unit -K -C ${GIT_COMMIT}"
                    }
                }
            }
        }
        stage('Build container serving the artifacts [ main ]') {
            when {
                branch 'main'
            }
            environment {
                TAG = "dev-${TIMESTAMP}"
            }
            steps {
                container('node') {
                    sh "npx lerna run build"
                }
                container (name: 'kaniko', shell: '/busybox/sh') {
                    sh "#!/busybox/sh\n/kaniko/executor --context ${WORKSPACE} --destination ${LOCAL_REPOSITORY_AUTH}:${TAG}"
                }
            }
        }
        stage('Release: [ main ]') {
            when {
                allOf {
                    branch 'main'
                    not {
                        changelog '.*\\[skip ci\\]$'
                    }
                }
            }
            environment {
                DOCKER_CONFIG='/root/.docker'
            }
            stages {
                stage('Build and publish: [main]') {
                    steps {
                        milestone 1
                        container('node') {
                            sh "set +x; npm set //registry.npmjs.org/:_authToken ${NPM_TOKEN}"
                            sh "npx lerna publish"
                        }
                    }
                }
                stage('Release docker image: [ main ]') {
                    steps {
                        container (name: 'kaniko', shell: '/busybox/sh') {
                            sh "#!/busybox/sh\necho '{\"auths\": {\"https://index.docker.io/v1/\": {\"auth\": \"${DOCKERHUB_AUTH}\"}}}' > ${DOCKER_CONFIG}/config.json"
                            sh "#!/busybox/sh\necho"
                            sh "#!/busybox/sh\n/kaniko/executor --context ${WORKSPACE} --destination ${REPOSITORY}:${TAG}"
                        }
                    }
                }
            }
        }
    }
}
