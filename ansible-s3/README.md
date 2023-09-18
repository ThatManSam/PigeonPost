# Ansible running

There are 2 tags that can be used to deploy different services and shutdown them down.

## deploy
Run like:
```bash
ansible-playbook main.yml -t deploy
```
This tag will create:
- S3 bucket to store dataset
  - Uploads the filtered_cities.csv file to it
- 6 Lambda functions
  - packages their respective scripts and uploads them to each respective Lambda function
  
The tag will then start up an existing EC2 instance

## shutdown
Run like:
```bash
ansible-playbook main.yml -t shutdown
```

This tag will shut down the EC2 instances started using the *deploy* tag