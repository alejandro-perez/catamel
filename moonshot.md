# CATAMEL Moonshot authentication demonstrator
This document will guide you through the steps you need to perform to complete the CATAMEL + Moonshot authentication demonstrator.

## Install docker
This demonstrator consists on building and running a Docker image. Hence, the first requirement is having a working Docker installation.

## Clone the repository
For simplicity, we have created a fork of the catamel repository and created a branch called moonshot where the Dockerfile lives.

You will need to clone that repository:
```
git clone https://github.com/alejandro-perez/catamel.git
```

And move to the `moonshot` branch
```
git checkout moonshot
```
We have made very few changes to allow Moonshot authentications with `catamel`. Namely we have:
* Added dependency to the new `loopback-passport-trusted-header` strategy (https://github.com/janetuk/loopback-passport-trusted-header).
* Defined a new sample `moonshot` provider configuration in `providers.json-sample`, using the aforementioned strategy.

The rest of the changes are additions to allow the Docker-based demonstrator (i.e. the Dockerfile, a sample moonshot credential, and an apache configuration file to set up the Proxy and authentication module).

## Build the docker image
The `moonshot` branch contains a Dockerfile that creates a all-in-one Docker image, including `mongodb`, `Apache`, `moonshot`, `freeradius`, etc.

To build the image execute the following from the repository root.
```
docker build . -t catamel-moonshot-demo
```

## Run the docker image
Once the docker image has been built, you can run it as many times as you want. Every run will start from scratch (ie. empty database, etc).

To run the docker image execute the following command:
```
docker run -ti --rm --name catamel-moonshot-demo catamel-moonshot-demo
```

That will start all the background services (ie. mongodb, freeradius...) and the node.js application, keeping the latter on the foreground.

## Performing Moonshot authentications
Now, you are prepared to perform a moonshot-based authentication. For testing it, you need to enter into the container.
For doing so, execute the following command. The `dbus-launch bash` ensures there will be a DBUS environment for the Moonshot Text UI to work.

```
docker exec -ti catamel-moonshot-demo dbus-launch bash
```

Once inside the container, we are ready to execute our first Moonshot-based authentication and bootstrap an access token:
```
curl --negotiate -u ":" http://localhost/auth/moonshot/callback
```
That will trigger the Moonshot TXT ID selector, since there is not any identity associated for the requested service yet. Use the `<Import>` button on the right side to import the `moonshot-cred.xml` file located on the same folder. Then, choose one of the three available identities, and send it.

It will prompt you again, since you need to accept the IDP's server certificate. Select `<Confirm>`.

You will get something similar to this:
```
{"access_token":"3JXcRQw7Lptm5sAzN13av2HnWUgveXAkcOXhZt87VaHA45BJqHnMHBbAFfYjOAKK","userId":"5ca4b3a20f34be008f7a3fdb"}
```

To check that the obtained access token is indeed valid:
```
curl "http://localhost/api/v3/Users/userInfos?access_token=$TOKEN"
```
Where `$TOKEN` is the value of the `access_token` JSON field.


