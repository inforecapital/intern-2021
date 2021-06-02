# Docker Architecture

[Source](https://www.guru99.com/docker-tutorial.html#:~:text=%20Below%20is%20a%20step%20by%20step%20Docker,the%20Docker%20APT%20repository.%0AUse%20the%20below...%20More%20)

## Docker Engine

Docker is the client-server type of application which means we have clients who relay to the server. So the Docker daemon called: dockerd is the Docker engine which represents the server. The docker daemon and the clients can be run on the same or remote host, and they communicate through command line client binary, as well as a full RESTful API to interact with the daemon: dockerd.

## Docker Images

Docker images are the "source code" for our containers; we use them to build containers. They can have software pre-installed which speeds up deployment. They are portable, and we can use existing images or build our own.

## Docker Registries

Docker stores the images we build in registries. There are public and private registries. Docker company has public registry called Docker hub, where you can also store images privately. Docker hub has millions of images, which you can start using now.

## Docker Containers

Containers are the organizational units and one of the Docker basics concept. When we build an image and start running it; we are running in a container. The container analogy is used because of the portability of the software we have running in our container. We can move it, in other words, "ship" the software, modify, manage, create or get rid of it, destroy it, just as cargo ships can do with real containers.

In simple terms, an image is a template, and a container is a copy of that template. You can have multiple containers (copies) of the same image.

## Dockerfile

[source](https://takacsmark.com/dockerfile-tutorial-by-example-dockerfile-best-practices-2018/#minimize-the-number-of-steps-in-the-dockerfile)
We’ll cover the following basic instructions to get you started:

- FROM - every Dockerfile starts with FROM, with the introduction of multi-stage builds as of version 17.05, you can have more than one FROM instruction in one Dockerfile.
  · There is one instruction that you can put before FROM into your Dockerfile. This instruction is ARG. ARG is used to specify arguments for the docker build command with the --build-arg <varname>=<value> flag.
  You can have more than one FROM instructions in your Dockerfile. You will want to use this feature, for example, when you use one base image to build your app and another base image to run it.
- COPY vs ADD - these two are often confused, so I’ll explain the difference.
- ENV - well, setting environment variables is pretty important.
- RUN - let’s run commands.
  · You’ll use a lot of apt-get type of commands to add new packages to your image. It’s always advisable to put apt-get update and apt-get install commands on the same line. This is important because of layer caching. Having these on two separate lines would mean that if you add a new package to your install list, the layer with apt-get update will not be invalidated in the layer cache and you might end up in a mess.
  · RUN has two forms; RUN <command> (called shell form) and RUN ["executable", "param1", "param2"] called exec form. Please note that RUN <command> will invoke a shell automatically (/bin/sh -c by default), while the exec form will not invoke a command shell
  VOLUME - another source of confusion, what’s the difference between Dockerfile VOLUME and container volumes?
  USER - when root is too mainstream.
  WORKDIR - set the working directory.
  EXPOSE - get your ports right.
  ONBUILD - give more flexibility to your team and clients.

CMD vs ENTRYPOINT

![alt text](https://img.jbzj.com/file_images/article/201803/2018031211363722.png)

## curl

curl is a tool to transfer data from or to a server, using one of the supported protocols (HTTP, HTTPS, FTP, FTPS, GOPHER, DICT, TELNET, LDAP or FILE). The command is designed to work without user interaction.
[manual](https://www.mit.edu/afs.new/sipb/user/ssen/src/curl-7.11.1/docs/curl.html)
