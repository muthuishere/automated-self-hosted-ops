Welcome to Automated-self-hosted-ops (In Development)
This is a Node.js based tool aimed at simplifying the complexities involved in setting up and maintaining self-hosted environments. 


if you are looking for a tool to help you manage your self-hosted environment, you are in the right place., Make sure you have Ansible installed on your system and configured for the domain., Your domain is on Ubuntu

The plan is to build a local environment to manage the entire remote environment with Kubernetes and all other cool stuff through a web ui.

### Completed

- [x] 1. Create a domain with Kubernetes  and NGINX
     A command which will take input as the docker file image , env file , port , domain name and create a domain with nginx and redirect to kubernetes and creates the following
        - [x] 1.1. Create a domain  NGINX 
        - [x] 1.2. forward the domain to kubernetes
        - [x] 1.3. Deploy the docker image to kubernetes
        - [x] 1.4. Create a SSL certificate for the domain
        - [x] 1.5. Create set of scripts to manage the domain (start, stop, restart, remove) 

- [x] 2. Redirect Kubernetes Admin Dashboard to local



### Roadmap
- Install Software to remote with domain
- Manage Kubernetes from local
- Add Logging to all Kubernetes PODS
- Add Monitoring to all Kubernetes PODS
- Install Software in Remote with Docker Compose





