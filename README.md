# Stealthy UI
Frontend service component of Stealthy application. UI server that serves
static pages for UI. Encapsulates user's service business logic of Stealthy application:
- provides UI for sign up and sign in process for users
- provides UI of uploading, downloading user's files and viewing details 
about uploaded files

### Technologies
Build with:
- Angular 17
- Nginx 1.25.3

Works on HTTP web protocol.

### Requirements
Installed Docker and Docker-compose plugin

### How to up and run
#### Configure application
1. Copy file: 'config.yaml.example' to 'src/app/assets/config.yaml'.
2. Make changes you need in configuration file.

#### Build docker images
Build docker images and start service
```bash
docker compose up
```

Stop and remove containers after application use
```bash
docker compose down
```
