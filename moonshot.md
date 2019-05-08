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

And move to the `moonshot_and_saml` branch
```
git checkout moonshot_and_saml
```
We have made very few changes to allow Moonshot and SAML authentications with `catamel`. Namely we have:
* Added dependency to the new `loopback-passport-trusted-header` strategy (https://github.com/janetuk/loopback-passport-trusted-header).
* Defined a new sample `moonshot` provider configuration in `providers.json-sample`, using the aforementioned strategy.
* Defined a new sample `shibsp` provider configuration in `providers.json-sample`, using the aforementioned strategy.

The rest of the changes are additions to allow the Docker-based demonstrator (i.e. the Dockerfile, a sample moonshot credential, and an apache configuration file to set up the Proxy and authentication module).

## Build and run the docker-compose environment
The `moonshot_and_saml` branch contains a `docker-compose.yml` that creates a all-in-one demonstrator environment, including `mongodb`, `Apache`, `moonshot`, `freeradius`, `shibboleth`, etc.

To build the compose environment execute the following from the repository root.
```
docker-compose up --build
```

That will start all the background services (ie. mongodb, freeradius...) and the node.js application, keeping the latter on the foreground.

## Performing Moonshot authentications
Now, you are prepared to perform a moonshot-based authentication. For testing it, you need a moonshot client. The easiest way of having access to one is using the `catamel` service within the docker compose. For doing so, execute the following command.

```
docker-compose exec catamel dbus-launch curl --negotiate -u ":" http://localhost/auth/moonshot/callback
```

That will trigger the Moonshot TXT ID selector, since there is not any identity associated for the requested service yet. Use the `<Import>` button on the right side to import the `moonshot-cred.xml` file located on the `/workdir` folder. Then, choose one of the three available identities, and send it.

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

## Performing SAML authentications
To perform SAML authentications you need to make sure that the computer where you will run the web browser contains an entry in the `etc/hosts` file for `idptestbed` pointing to localhost:
```
127.0.0.1   idptestbed
```
This is required because of the way the shibboleth services are built in the Compose environment. This would be different in a real deployment as actual DNS names would be used.

Open your browser and go to `https://idptestbed/auth/shibsp/callback`. Use `student1` or `staff1` as username, and `password` as password.

Once authenticated, you should get a JSON response similar to the one for Moonshot above.
