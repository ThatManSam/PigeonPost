EC2
- Serving Frontend

API Gateway
- Serves API requests to lambdas

Lambdas
- get_messages
- get_message_locations
- receive_message
- calculate_location (triggerd from Location Queue)

SQS
- Location Queue (subscribes to Location request topic)

SNS
- Location request topic

ELS
- Application Load balancer
  - TLS for From end and scaling

S3
- Stores dataset for calculate_location lambda

Cognito
- Google auth accounts