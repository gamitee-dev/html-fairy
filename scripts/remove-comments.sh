cd dist
for file_name in `find . -name "*.js" -type f`; do
  sed -i "" "/^\/.*$/d" $file_name
done