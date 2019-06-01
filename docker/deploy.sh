docker build . -t ligapay
docker tag ligapay:latest gcr.io/makeit-241622/ligapay
docker push gcr.io/makeit-241622/ligapay
kubectl set image deployment/ligapay-backend backend=gcr.io/makeit-241622/ligapay