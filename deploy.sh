# get comments from server

rsync -avP root@116.203.87.141:/root/milgra.com/server/resources/public/comments server/resources/public/

# copy everything to server

rsync -avP --delete /home/milgra/Projects/milgra.com root@116.203.87.141:/root/
