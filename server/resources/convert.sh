cp -r markdown markdowntemp
find markdowntemp -type f -name "*.md" -exec markdown -f fencedcode -o {}.html {} \; 
find markdowntemp -type f -name "*.md" -exec rm {} \; 
find markdowntemp -type f -name "*.html" -exec rename .md.html .html {} \;
rsync -aP markdowntemp/ public
rm -r markdowntemp
rsync -aP ../../client/ public
