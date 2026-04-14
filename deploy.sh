#!/bin/bash
# Talovi deployment script
# Usage: ./deploy.sh
#
# Pushes to the bare repo on Chemicloud. The post-receive hook at
# /home/talovi/talovi-web.git/hooks/post-receive handles:
#   - checkout to /home/talovi/public_html
#   - composer install --no-dev --optimize-autoloader
#   - drush cr
set -e

echo "Deploying Talovi to talovi.dev..."
git push production main
echo "Done. Check server output above for Composer and Drush status."
