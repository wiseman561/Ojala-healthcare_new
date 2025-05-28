#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
KUBERNETES_DIR="${REPO_ROOT}/infra/kubernetes"
CLUSTER_NAME="ojala-cluster"
NAMESPACE="demo"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Deploying OjalaHealthcarePlatform to local Kubernetes cluster${NC}"

# Check if kind is installed
if ! command -v kind &> /dev/null; then
    echo "kind is not installed. Please install it first: https://kind.sigs.k8s.io/docs/user/quick-start/"
    exit 1
fi

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo "kubectl is not installed. Please install it first: https://kubernetes.io/docs/tasks/tools/"
    exit 1
fi

# Set Vault environment variables
export VAULT_ADDR="http://vault:8200"
export VAULT_TOKEN="root-token-for-dev"
echo -e "${GREEN}Set Vault environment variables:${NC}"
echo -e "VAULT_ADDR=${VAULT_ADDR}"
echo -e "VAULT_TOKEN=******** (masked for security)"

# Check if cluster exists
if ! kind get clusters | grep -q "^${CLUSTER_NAME}$"; then
    echo -e "${YELLOW}Creating kind cluster: ${CLUSTER_NAME}${NC}"
    kind create cluster --config="${KUBERNETES_DIR}/kind-config.yaml"
else
    echo -e "${GREEN}Using existing kind cluster: ${CLUSTER_NAME}${NC}"
fi

# Create namespace if it doesn't exist
if ! kubectl get namespace "${NAMESPACE}" &> /dev/null; then
    echo -e "${YELLOW}Creating namespace: ${NAMESPACE}${NC}"
    kubectl create namespace "${NAMESPACE}"
else
    echo -e "${GREEN}Using existing namespace: ${NAMESPACE}${NC}"
fi

# Apply Kubernetes manifests for original services
echo -e "${YELLOW}Applying Kubernetes manifests for core services${NC}"
kubectl apply -f "${KUBERNETES_DIR}/ojala-api-deployment.yaml"
kubectl apply -f "${KUBERNETES_DIR}/ojala-api-service.yaml"
kubectl apply -f "${KUBERNETES_DIR}/ojala-apigateway-deployment.yaml"
kubectl apply -f "${KUBERNETES_DIR}/ojala-apigateway-service.yaml"
kubectl apply -f "${KUBERNETES_DIR}/ojala-web-deployment.yaml"
kubectl apply -f "${KUBERNETES_DIR}/ojala-web-service.yaml"
kubectl apply -f "${KUBERNETES_DIR}/ojala-patientportal-deployment.yaml"
kubectl apply -f "${KUBERNETES_DIR}/ojala-patientportal-service.yaml"

# Apply Kubernetes manifests for new microservices
echo -e "${YELLOW}Applying Kubernetes manifests for new microservices${NC}"
kubectl apply -f "${KUBERNETES_DIR}/ojala-ai-engine-deployment.yaml"
kubectl apply -f "${KUBERNETES_DIR}/ojala-ai-engine-service.yaml"
kubectl apply -f "${KUBERNETES_DIR}/ojala-nurse-assistant-deployment.yaml"
kubectl apply -f "${KUBERNETES_DIR}/ojala-nurse-assistant-service.yaml"
kubectl apply -f "${KUBERNETES_DIR}/ojala-rn-dashboard-deployment.yaml"
kubectl apply -f "${KUBERNETES_DIR}/ojala-rn-dashboard-service.yaml"
kubectl apply -f "${KUBERNETES_DIR}/ojala-employer-dashboard-deployment.yaml"
kubectl apply -f "${KUBERNETES_DIR}/ojala-employer-dashboard-service.yaml"
kubectl apply -f "${KUBERNETES_DIR}/ojala-patient-app-deployment.yaml"
kubectl apply -f "${KUBERNETES_DIR}/ojala-patient-app-service.yaml"

# Update services to use NodePort for local access
echo -e "${YELLOW}Updating services to use NodePort for local access${NC}"
# Original services
kubectl patch svc ojala-api -n ${NAMESPACE} -p '{"spec": {"type": "NodePort", "ports": [{"port": 80, "targetPort": 5000, "nodePort": 30500}]}}'
kubectl patch svc ojala-apigateway -n ${NAMESPACE} -p '{"spec": {"type": "NodePort", "ports": [{"port": 80, "targetPort": 5001, "nodePort": 30501}]}}'
kubectl patch svc ojala-web -n ${NAMESPACE} -p '{"spec": {"type": "NodePort", "ports": [{"port": 80, "targetPort": 3000, "nodePort": 30300}]}}'
kubectl patch svc ojala-patientportal -n ${NAMESPACE} -p '{"spec": {"type": "NodePort", "ports": [{"port": 80, "targetPort": 3001, "nodePort": 30301}]}}'

# New microservices
kubectl patch svc ojala-ai-engine -n ${NAMESPACE} -p '{"spec": {"type": "NodePort", "ports": [{"port": 80, "targetPort": 5002, "nodePort": 30502}]}}'
kubectl patch svc ojala-nurse-assistant -n ${NAMESPACE} -p '{"spec": {"type": "NodePort", "ports": [{"port": 80, "targetPort": 5003, "nodePort": 30503}]}}'
kubectl patch svc ojala-rn-dashboard -n ${NAMESPACE} -p '{"spec": {"type": "NodePort", "ports": [{"port": 80, "targetPort": 3002, "nodePort": 30302}]}}'
kubectl patch svc ojala-employer-dashboard -n ${NAMESPACE} -p '{"spec": {"type": "NodePort", "ports": [{"port": 80, "targetPort": 3003, "nodePort": 30303}]}}'
kubectl patch svc ojala-patient-app -n ${NAMESPACE} -p '{"spec": {"type": "NodePort", "ports": [{"port": 80, "targetPort": 3004, "nodePort": 30304}]}}'

# Wait for deployments to be ready
echo -e "${YELLOW}Waiting for deployments to be ready...${NC}"
# Original services
kubectl wait --for=condition=available --timeout=300s deployment/ojala-api -n ${NAMESPACE}
kubectl wait --for=condition=available --timeout=300s deployment/ojala-apigateway -n ${NAMESPACE}
kubectl wait --for=condition=available --timeout=300s deployment/ojala-web -n ${NAMESPACE}
kubectl wait --for=condition=available --timeout=300s deployment/ojala-patientportal -n ${NAMESPACE}

# New microservices
kubectl wait --for=condition=available --timeout=300s deployment/ojala-ai-engine -n ${NAMESPACE}
kubectl wait --for=condition=available --timeout=300s deployment/ojala-nurse-assistant -n ${NAMESPACE}
kubectl wait --for=condition=available --timeout=300s deployment/ojala-rn-dashboard -n ${NAMESPACE}
kubectl wait --for=condition=available --timeout=300s deployment/ojala-employer-dashboard -n ${NAMESPACE}
kubectl wait --for=condition=available --timeout=300s deployment/ojala-patient-app -n ${NAMESPACE}

# Print pod status
echo -e "${YELLOW}Pod status:${NC}"
kubectl get pods -n ${NAMESPACE}

# Print service endpoints
echo -e "\n${GREEN}OjalaHealthcarePlatform is now available at:${NC}"
echo -e "${GREEN}API Gateway: http://localhost:30501${NC}"
echo -e "${GREEN}API healthcheck: http://localhost:30500/health${NC}"
echo -e "${GREEN}Provider portal: http://localhost:30300${NC}"
echo -e "${GREEN}Patient portal: http://localhost:30301${NC}"
echo -e "${GREEN}AI Engine: http://localhost:30502${NC}"
echo -e "${GREEN}Nurse Assistant: http://localhost:30503${NC}"
echo -e "${GREEN}RN Dashboard: http://localhost:30302${NC}"
echo -e "${GREEN}Employer Dashboard: http://localhost:30303${NC}"
echo -e "${GREEN}Patient App: http://localhost:30304${NC}"
