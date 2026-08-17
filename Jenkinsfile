pipeline {

    agent any

    tools {
        nodejs 'NodeJS-24'
    }

    options {
        timestamps()
        skipDefaultCheckout(true)
        disableConcurrentBuilds()
    }

    environment {
        LOCAL_BACKEND_IMAGE  = 'practica_2_maestria-backend'
        LOCAL_FRONTEND_IMAGE = 'practica_2_maestria-frontend'

        REMOTE_BACKEND_IMAGE  = 'practica_2_maestria-backend'
        REMOTE_FRONTEND_IMAGE = 'practica_2_maestria-frontend'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend - Install') {
            steps {
                dir('backend') {
                    sh 'npm ci'
                }
            }
        }

        stage('Backend - Prisma') {
            steps {
                dir('backend') {
                    sh 'npx prisma generate'
                }
            }
        }

        stage('Backend - Test') {
            steps {
                dir('backend') {
                    sh 'npm test'
                }
            }
        }

        stage('Frontend - Install') {
            steps {
                dir('frontend') {
                    sh 'npm ci'
                }
            }
        }

        stage('Frontend - Lint') {
            steps {
                dir('frontend') {
                    sh 'npm run lint'
                }
            }
        }

        stage('Frontend - Build') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }

        stage('Docker - Validate') {
            steps {
                sh 'docker compose config --quiet'
            }
        }

        stage('Docker - Build') {
            steps {
                sh 'docker compose build --no-cache'
            }
        }

        stage('Docker - Verify Images') {
            steps {
                sh '''
                    set -eu

                    echo "Verificando imágenes construidas..."

                    docker image inspect "${LOCAL_BACKEND_IMAGE}:latest" > /dev/null
                    docker image inspect "${LOCAL_FRONTEND_IMAGE}:latest" > /dev/null

                    echo "Imágenes verificadas correctamente."
                '''
            }
        }

        stage('Docker - Publish') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'practica-3',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    sh '''
                        set -eu

                        echo "========================================"
                        echo "PUBLICACIÓN EN DOCKER HUB"
                        echo "========================================"

                        export DOCKER_CONFIG="$(mktemp -d)"
                        trap 'rm -rf "$DOCKER_CONFIG"' EXIT

                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin

                        BACKEND_LATEST="${DOCKER_USER}/${REMOTE_BACKEND_IMAGE}:latest"
                        BACKEND_BUILD="${DOCKER_USER}/${REMOTE_BACKEND_IMAGE}:${BUILD_NUMBER}"

                        FRONTEND_LATEST="${DOCKER_USER}/${REMOTE_FRONTEND_IMAGE}:latest"
                        FRONTEND_BUILD="${DOCKER_USER}/${REMOTE_FRONTEND_IMAGE}:${BUILD_NUMBER}"

                        docker tag "${LOCAL_BACKEND_IMAGE}:latest" "$BACKEND_LATEST"
                        docker tag "${LOCAL_BACKEND_IMAGE}:latest" "$BACKEND_BUILD"

                        docker tag "${LOCAL_FRONTEND_IMAGE}:latest" "$FRONTEND_LATEST"
                        docker tag "${LOCAL_FRONTEND_IMAGE}:latest" "$FRONTEND_BUILD"

                        docker push "$BACKEND_LATEST"
                        docker push "$BACKEND_BUILD"

                        docker push "$FRONTEND_LATEST"
                        docker push "$FRONTEND_BUILD"

                        docker logout

                        echo "Imágenes publicadas correctamente en Docker Hub."
                    '''
                }
            }
        }

        stage('Local - Deploy Containers') {
            steps {
                sh '''
                    set -eu

                    echo "========================================"
                    echo "DESPLIEGUE LOCAL CON DOCKER COMPOSE"
                    echo "========================================"

                    # Forzar la eliminación de contenedores huérfanos o con nombres duplicados
                    docker rm -f postgres_db backend_container frontend_container || true

                    # Detener el stack de compose actual
                    docker compose down --remove-orphans || true

                    # Desplegar los servicios actualizados
                    docker compose up -d

                    echo "Contenedores desplegados localmente."
                '''
            }
        }
    }

    post {
        success {
            echo '========================================'
            echo 'PIPELINE SATISFACTORIO'
            echo '========================================'
            echo 'Backend probado correctamente'
            echo 'Frontend validado y construido'
            echo 'Imágenes Docker construidas'
            echo 'Imágenes publicadas en Docker Hub'
            echo 'Servicios desplegados localmente con Docker Compose'
        }

        failure {
            echo '========================================'
            echo 'PIPELINE FALLIDO'
            echo '========================================'
            echo 'Revisar la primera etapa fallida y su Console Output.'
        }

        always {
            sh 'docker logout >/dev/null 2>&1 || true'
        }
    }
}