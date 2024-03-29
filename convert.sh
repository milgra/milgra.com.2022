cp -r server/resources/markdown markdowntemp
find markdowntemp -type f -name "*.md" -exec markdown -f fencedcode -o {}.html {} \; 
find markdowntemp -type f -name "*.md" -exec rm {} \; 
find markdowntemp -type f -name "*.html" -exec rename .md.html .html {} \;
rm -r server/resources/public/contents
rsync -aP --exclude "*.md~" markdowntemp/ server/resources/public/contents
rm -r markdowntemp
rsync -aP client/ server/resources/public
