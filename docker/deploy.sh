BUILD_DATETIME=$(date '+%d-%m-%Y-%H-%M-%S')
echo TAG=$BUILD_DATETIME

docker build . -t ligapay:$BUILD_DATETIME && \
    docker tag ligapay:$BUILD_DATETIME gcr.io/makeit-241622/ligapay:$BUILD_DATETIME && \
    docker push gcr.io/makeit-241622/ligapay:$BUILD_DATETIME && \
    kubectl set image deployment/ligapay-backend backend=gcr.io/makeit-241622/ligapay:$BUILD_DATETIME