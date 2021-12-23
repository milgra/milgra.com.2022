cp -r markdown markdowntemp
find markdowntemp -type f -name "*.md" -exec markdown -o {}.html {} \; 
find markdowntemp -type f -name "*.md" -exec rm {} \; 
find markdowntemp -type f -name "*.html" -exec rename .md.html .html {} \;
rm -r public/apps
rm -r public/blog
rm -r public/tabs
rm -r public/work
cp -r markdowntemp/* public/
rm -r markdowntemp
cp -r ../../client/* public/
