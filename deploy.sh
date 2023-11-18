set -e

npm run build

cd dist 

echo > .nojekyll

git init
git checkout -B main
git add -A
git commit -m "Updated"

cd -