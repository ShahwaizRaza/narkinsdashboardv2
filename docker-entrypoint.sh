#!/bin/sh
set -e

# Username/password come from environment variables set in Coolify.
# Fallback defaults are used only if the variables are not set (change these
# defaults, or better, always set AUTH_USERNAME/AUTH_PASSWORD in Coolify).
AUTH_USERNAME="${AUTH_USERNAME:-admin}"
AUTH_PASSWORD="${AUTH_PASSWORD:-changeme}"

echo "Setting up site password protection for user: $AUTH_USERNAME"

# Generate /etc/nginx/.htpasswd using openssl (works without apache2-utils)
printf "%s:%s\n" "$AUTH_USERNAME" "$(openssl passwd -apr1 "$AUTH_PASSWORD")" > /etc/nginx/.htpasswd

exec nginx -g "daemon off;"
