#!/bin/bash

# Configuration
PROJECT_ID="eventify-460809"
SERVICE_NAME="api-gateway"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

# Generate Cloud Run service.yaml from .env file
cat > service.yaml << EOF
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: ${SERVICE_NAME}
  annotations:
    run.googleapis.com/ingress: all
spec:
  template:
    metadata:
      annotations:
        run.googleapis.com/execution-environment: gen2
    spec:
      containerConcurrency: 80
      timeoutSeconds: 300
      containers:
      - image: ${IMAGE_NAME}:latest
        ports:
        - name: http1
          containerPort: 8080
        env:
        - name: NODE_ENV
          value: "production"
EOF

# Read .env file and append environment variables
if [ -f .env ]; then
    while IFS='=' read -r key value; do
        # Skip empty lines and comments
        if [[ ! -z "$key" && ! "$key" =~ ^[[:space:]]*# ]]; then
            # Remove any trailing whitespace and quotes
            key=$(echo "$key" | xargs)
            value=$(echo "$value" | xargs | sed 's/^"\(.*\)"$/\1/')
            
            echo "        - name: $key" >> service.yaml
            echo "          value: \"$value\"" >> service.yaml
        fi
    done < .env
fi

# Add resource limits
cat >> service.yaml << 'EOF'
        resources:
          limits:
            cpu: "1000m"
            memory: "512Mi"
EOF

echo "Generated service.yaml with environment variables from .env file" 