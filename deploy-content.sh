# get comments from server

rsync -avP root@116.203.87.141:/root/milgra.com/server/resources/public/comments server/resources/public/

# copy contents to server

rsync -avP /home/milgra/Projects/milgra.com/server/resources/public root@116.203.87.141:/root/milgra.com/server/resources
