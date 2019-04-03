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
There are very few changes required to `catamel` for allowing Moonshot authentication to work:
* An added dependency to the new `loopback-passport-trusted-header` strategy (https://github.com/janetuk/loopback-passport-trusted-header).
* A new sample provider configuration in `providers.json-sample`, showing how the new module is used.

The rest of the changes are additions to allow the Docker-based demonstrator (i.e. the Dockerfile, a sample moonshot credential, and an apache configuration file to set up the Proxy and authentication module).

## Build the docker image
The `moonshot` branch contains an update Dockerfile that creates a all-in-one Docker image, including `mongodb`, `Apache`, `moonshot`, `freeradius`, etc.

To build the image execute the following from the repository root.
```
docker build . -t catamel-moonshot-demo
```

## Run the docker image
Once the docker image has been built, you can run it as many times you want. Every run will start from scratch (ie. empty database, etc).

To run the docker image execute the following command:
```
docker run -ti --rm --name catamel-moonshot-demo catamel-moonshot-demo
```

That will start all the background services (ie. mongodb, freeradius...) and the node.js application, keeping the latter on foreground.

## Performing Moonshot authentications
Now, you are prepared to perform a moonshot-based authentication. Note that the rest of providers will work as usual.
To enter into the container, execute the following. The `dbus-launch` ensures there will be a DBUS environment for the Moonshot Text UI to work.

```
docker exec -ti catamel-moonshot-demo dbus-launch bash
```

Once within the container, we are ready to execute our first authentication:
```
curl --negotiate -u ":" http://localhost/auth/moonshot/callback
```
That will trigger the Moonshot TXT ID selector, as there is no identity associated for the requested service. Use the `<Import>` button on the right side to import the `moonshot-cred.xml` file on the same folder. Then, choose one of the three available identities, and send it.

It will prompt you again about accepting the IDP's server certificate. Select `<Confirm>`.

You will get something similar to this:
```
{"access_token":"3JXcRQw7Lptm5sAzN13av2HnWUgveXAkcOXhZt87VaHA45BJqHnMHBbAFfYjOAKK","userId":"5ca4b3a20f34be008f7a3fdb"}
```

To check that the obtained access token is indeed valid:
```
curl "http://localhost/api/v3/Users/userInfos?access_token=$TOKEN"
```
Where `$TOKEN` is the value of the `access_token` JSON field.


