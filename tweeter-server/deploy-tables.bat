@echo off
echo Deploying DynamoDB tables...
aws cloudformation deploy --template-file dynamodb-tables.yaml --stack-name tweeter-dynamodb-tables --region us-west-2
echo Tables deployed successfully!