# CATAMEL Moonshot authentication demonstrator
This document will guide you through the steps you need to perform to complete the CATAMEL + Moonshot authentication demonstrator.

## Install docker and docker-compose
This demonstrator consists of building and running a Docker compose. Hence, the first requirement is having a working Docker and Docker compose installation.

## Clone the repository
For simplicity, we have created a fork of the catamel repository and created a branch called moonshot where the docker-compose.yml lives.

You will need to clone that repository:
```
git clone https://github.com/alejandro-perez/catamel.git
```

And switch to the `shib_aa` branch
```
git checkout shib_aa
```
We have made very few changes to allow Moonshot and SAML authentications with `catamel`. Namely we have:
* Added dependency to the new `loopback-passport-trusted-header` strategy (https://github.com/janetuk/loopback-passport-trusted-header).
* Defined a new sample `moonshot` provider configuration in `providers.json-sample`, using the aforementioned strategy.
* Defined a new sample `shibsp` provider configuration in `providers.json-sample`, using the aforementioned strategy.
* Defined a new sample `shibspsession` provider configuration in `providers.json-sample`, using the aforementioned strategy.

The rest of the changes are additions to allow the Docker-based demonstrator (i.e. the Dockerfile, a sample moonshot credential, and an apache configuration file to set up the Proxy and authentication module).

## Build and run the docker-compose environment
The `shib_aa` branch contains a `docker-compose.yml` that creates a all-in-one demonstrator environment, including `mongodb`, `Apache`, `moonshot`, `freeradius`, `shibboleth SP`, etc.

A precondition for building this environment is to create a user mapping dictionary for the "Fake DUO" service, that simulates the actual DUO service. For doing that rename the `fakeduo/users.py.sample` into `fakeduo/users.py` and edit the `USERS` dictionary appropriatedly.

To build the compose environment execute the following from the repository root.
```
docker-compose up --build
```

That will start all the background services (ie. mongodb, freeradius...) and the node.js application, keeping the latter on the foreground.

## Performing Moonshot authentications
Now, you are prepared to perform a moonshot-based authentication. For testing it, you need a moonshot client. The easiest way of having access to one is using the `catamel` service within the docker compose. For doing so, execute the following command.

```
docker-compose exec catamel curl --insecure --negotiate -u ":" https://catamelmoonshotdemo/auth/moonshot/callback
```

That will trigger the Moonshot TXT ID selector, since there is not any identity associated for the requested service yet. Use the `<Import>` button on the right side to import the `moonshot-cred.xml` file located on the `/workdir` folder. Then, choose one of the three available identities, and send it.

It will prompt you again, since you need to accept the IDP's server certificate. Select `<Confirm>`.

You will get something similar to this:
```
{"access_token":"3JXcRQw7Lptm5sAzN13av2HnWUgveXAkcOXhZt87VaHA45BJqHnMHBbAFfYjOAKK","userId":"5ca4b3a20f34be008f7a3fdb"}
```

To check that the obtained access token is indeed valid:
```
docker-compose exec catamel curl --insecure "https://localhost/api/v3/Users/userInfos?access_token=$TOKEN"
```
Where `$TOKEN` is the value of the `access_token` JSON field.

You'll get information about the user, similar to this:
```
{
  "accessToken": {
    "id": "iBEFj92tyrdyypeiUnLAhvs3QMW2vj7V1CqXDn290pnQHF7Pa3UEa1XHtFON73Tc",
    "ttl": 1209600,
    "created": "2019-05-10T13:29:10.476Z",
    "userId": "5cd57ca6a28fe8008ff2bf6d"
  },
  "authorizedRoles": {
    "$authenticated": true
  },
  "currentUser": "alice#test1.org",
  "currentGroups": []
}

```
Note that the `@` symbol has been replaced with `#`. This is because the loopback-passport module uses the username to build an email address in the form `username@loopback.moonshot.com`, and it crashes when username already contains a `@`.
## Performing SAML authentications
To perform SAML authentications you need to make sure that the computer contains an entry in the `etc/hosts` file for `catamelmoonshotdemo` and `satosaproxy` pointing to localhost:
```
127.0.0.1   catamelmoonshotdemo satosaproxy
```
This is required because that the URL registered in the SP's metadata and you need to trick your browser into going to localhost (where shibd is running) instead.

Open your browser and go to `https://catamelmoonshotdemo/auth/shibsp/callback`. It will take you to UmbrellaID's IDP. Use a valid identity.

Once authenticated, you should get a JSON response similar to the one for Moonshot above.

