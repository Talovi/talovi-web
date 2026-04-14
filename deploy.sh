#!/bin/bash
# Talovi deployment script
# Usage: ./deploy.sh

echo "Deploying Talovi to talovi.dev..."
git push production main
echo "Running Composer on server..."
ssh talovi-chemicloud "cd public_html && composer install --no-dev --optimize-autoloader"
echo "Clearing Drupal cache..."
ssh talovi-chemicloud "cd public_html && vendor/bin/drush cr"
echo "Deployment complete."
