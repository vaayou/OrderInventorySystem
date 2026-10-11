#!/bin/sh
set -e

# Import Aiven CA cert into JVM truststore if it exists.
# On Render: mount ca.pem as a Secret File at /etc/secrets/ca.pem
# Locally with Docker Compose: volume-mount ./ssl/ca.pem → /etc/secrets/ca.pem
CA_CERT="/etc/secrets/ca.pem"
JAVA_CACERTS="${JAVA_HOME}/lib/security/cacerts"

if [ -f "$CA_CERT" ]; then
    echo ">>> Importing Aiven CA cert into JVM truststore..."
    keytool -importcert \
        -noprompt \
        -alias aiven-ca \
        -file "$CA_CERT" \
        -keystore "$JAVA_CACERTS" \
        -storepass changeit 2>/dev/null || echo ">>> Cert already imported or import skipped."
    echo ">>> CA cert import done."
else
    echo ">>> WARNING: $CA_CERT not found — SSL cert verification may fail."
fi

exec java $JAVA_OPTS -jar /app/app.jar "$@"
