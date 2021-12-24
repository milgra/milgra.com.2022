cp -r markdown markdowntemp
find markdowntemp -type f -name "*.md" -exec markdown -o {}.html {} \; 
find markdowntemp -type f -name "*.md" -exec rm {} \; 
find markdowntemp -type f -name "*.html" -exec rename .md.html .html {} \;
rsync -avP markdowntemp/ public
rm -r markdowntemp
rsync -avP ../../client/ public
