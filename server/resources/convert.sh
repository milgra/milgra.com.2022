rm -r public
cp -r markdown public
find public -type f -name "*.md" -exec markdown -b "http://localhost:3000" -o {}.html {} \; 
find public -type f -name "*.md" -exec rm {} \; 
find public -type f -name "*.html" -exec rename .md.html .html {} \;
cp -r images public/images
