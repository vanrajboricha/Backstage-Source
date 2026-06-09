We can create Backstage locally, then deploy to Kubernetes cluster. 
This is how Most Organizations follow. {Best Practice}

Developer Laptop
        |
        v
npx @backstage/create-app@latest
        |
        v
GitHub Repository
        |
        v
GitHub Actions
        |
        v
Docker Image
        |
        v
Docker Hub / ECR
        |
        v
Kubernetes

So this is the Source code of Backstage Remote Repository we use can use to Create Docker Image and same we can use to push in cluster. 

Docker File is present inside Backstage folder.
